import {
  ATTRIBUTES_MAP,
  BOOLEAN_ATTRIBUTES,
  VOID_ELEMENTS,
} from "./constants.js";
import type { JSXNode } from "./types.js";
import type { StreamContext } from "./types.js";
import { isFragment, isSuspense } from "./utils.js";

function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

function escapeAttributeValue(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

const camelToKebab = (str: string): string => {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
};

function processCss(value: any) {
  return Object.entries(value)
    .map(([styleProp, styleValue]) => {
      const cssProp = camelToKebab(styleProp);
      return `${cssProp}: ${styleValue}`;
    })
    .join("; ");
}

function containsAsync(element: JSXNode): boolean {
  if (element instanceof Promise) return true;
  if (Array.isArray(element)) {
    return element.some((child) => containsAsync(child));
  }
  if (
    typeof element === "string" ||
    typeof element === "number" ||
    typeof element === "bigint" ||
    typeof element === "boolean" ||
    !element
  ) {
    return false;
  }

  const { type, props } = element;

  if (typeof type === "function" && type.constructor.name === "AsyncFunction") {
    return true;
  }

  return props?.children ? containsAsync(props.children) : false;
}

async function* generateHTML(
  element: JSXNode,
  context?: StreamContext
): AsyncGenerator<string, void, unknown> {
  if (typeof element === "string") {
    yield escapeHtml(element);
    return;
  }

  if (typeof element === "number" || typeof element === "bigint") {
    yield escapeHtml(String(element));
    return;
  }

  if (!element || typeof element === "boolean") {
    return;
  }

  if (Array.isArray(element)) {
    for (const child of element) {
      yield* generateHTML(child, context);
    }
    return;
  }

  if (element instanceof Promise) {
    throw new Error(
      "Unexpected Promise in render tree. Components should return resolved JSX, not Promises directly."
    );
  }

  const { type, props } = element;

  if (isSuspense(type)) {
    const { fallback, children } = props;
    const hasAsync = containsAsync(children);

    if (!hasAsync) {
      yield* generateHTML(children, context);
      return;
    }

    if (context) {
      const boundaryId = context.boundaryCounter++;
      const id = `B${boundaryId}`;

      yield `<div id="${id}">`;
      yield* generateHTML(fallback, context);
      yield `</div>`;

      const childrenPromise = (async () => {
        let html = "";
        for await (const chunk of generateHTML(children, context)) {
          html += chunk;
        }
        return html;
      })();

      context.pendingBoundaries.push({
        id,
        fallback,
        children,
        promise: childrenPromise,
      });
    } else {
      yield* generateHTML(children, context);
    }
    return;
  }

  if (isFragment(type)) {
    yield* generateHTML(props?.children, context);
    return;
  }

  if (typeof type === "function") {
    try {
      const result = type(props || {});
      const resolvedResult = result instanceof Promise ? await result : result;
      yield* generateHTML(resolvedResult, context);
    } catch (error) {
      const componentName =
        typeof type === "symbol" ? String(type) : type.name || "component";
      console.error(`Error rendering component ${componentName}:`, error);
      yield `<!-- Error rendering component ${componentName}: ${
        error instanceof Error ? escapeHtml(error.message) : "Unknown error"
      } -->`;
      yield `<div style="border: 2px solid red; padding: 10px; background: #fee;">`;
      yield `<strong>Component Error</strong>: Failed to render ${escapeHtml(
        componentName
      )}`;
      yield `</div>`;
    }
    return;
  }

  const { children, ...attrs } = props || {};

  const attrString = Object.entries(attrs)
    .map(([key, value]) => {
      const attrName = ATTRIBUTES_MAP[key] || key;

      if (attrName === "style" && typeof value === "object" && value !== null) {
        return `${attrName}="${escapeAttributeValue(processCss(value))}"`;
      }

      if (BOOLEAN_ATTRIBUTES.has(attrName)) {
        return value === true ? attrName : null;
      }

      return `${attrName}="${escapeAttributeValue(String(value))}"`;
    })
    .filter((attr) => attr !== null)
    .join(" ");

  const attrPart = attrString ? ` ${attrString}` : "";
  const isVoidElement = VOID_ELEMENTS.has(type as string);

  if (isVoidElement) {
    yield `<${type}${attrPart}/>`;
    return;
  }

  yield `<${type}${attrPart}>`;
  yield* generateHTML(children, context);
  yield `</${type}>`;
}

export function renderToStream(element: JSXNode): ReadableStream<string> {
  const context: StreamContext = {
    boundaryCounter: 0,
    pendingBoundaries: [],
  };

  const generator = generateHTML(element, context);

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of generator) {
        controller.enqueue(chunk);
      }

      for (const boundary of context.pendingBoundaries) {
        try {
          const content = await boundary.promise;

          controller.enqueue(
            `<template hidden id="S${boundary.id}">${content}</template>`
          );

          controller.enqueue(
            `<script>` +
              `(function(){` +
              `var b=document.getElementById("${boundary.id}");` +
              `var s=document.getElementById("S${boundary.id}");` +
              `if(b&&s){` +
              `var nodes=Array.from(s.content.childNodes);` +
              `b.replaceWith.apply(b,nodes);` +
              `}` +
              `})();` +
              `</script>`
          );
        } catch (error) {
          console.error(
            `Error resolving Suspense boundary ${boundary.id}:`,
            error
          );
          controller.enqueue(
            `<script>console.error("Failed to load content for boundary ${boundary.id}");</script>`
          );
        }
      }

      controller.close();
    },
  });
}

export async function renderToString(element: JSXNode): Promise<string> {
  let html = "";
  for await (const chunk of generateHTML(element)) {
    html += chunk;
  }
  return html;
}
