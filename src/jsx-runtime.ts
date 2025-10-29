import { Fragment } from "./fragment.js";
import type { JSXElement, ElementType, Key, JSXNode } from "./types.js";

function jsx(
  type: ElementType,
  config: Record<string, any> | null
): JSXElement {
  const { key, ...props } = config || {};

  return {
    type,
    props,
    key: (key ?? null) as Key,
  };
}

const jsxs = jsx;

declare global {
  namespace JSX {
    type Element = JSXElement | Promise<JSXElement>;

    interface IntrinsicElements {
      [elemName: string]: any;
    }

    interface ElementClass {
      render(): JSXNode;
    }

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }
}

export { jsx, jsxs, Fragment };

export type {
  JSXElement,
  JSXNode,
  ElementType,
  ElementProps,
  ComponentFunction,
  HTMLAttributes,
  CSSProperties,
} from "./types.js";
