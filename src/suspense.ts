import { JSXElement, SuspenseProps } from "./types";

export const SUSPENSE_SYMBOL = Symbol("suspense");

export function Suspense(props: SuspenseProps): JSXElement {
  return {
    type: SUSPENSE_SYMBOL,
    props,
    key: null,
  };
}
