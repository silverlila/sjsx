import { SUSPENSE_SYMBOL } from "./jsx-runtime";
import { ElementType } from "./types";

export function html(source: string | ReadableStream<string>) {
  return new Response(source, {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

export function isFragment(type: ElementType): boolean {
  return typeof type === "function" && type?.name === "Fragment";
}

export function isSuspense(type: ElementType): boolean {
  return type === SUSPENSE_SYMBOL;
}
