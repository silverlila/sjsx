import type { SuspenseProps, ElementType, JSXElement } from "./types.js";

export const SUSPENSE_SYMBOL = Symbol("suspense");

export function Suspense(props: SuspenseProps): JSXElement {
  return {
    type: SUSPENSE_SYMBOL,
    props,
    key: null,
  };
}

export function isSuspense(type: ElementType): boolean {
  return type === SUSPENSE_SYMBOL;
}
