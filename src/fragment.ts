import { ElementType, FragmentProps, JSXNode } from "./types.js";

export function Fragment({ children }: FragmentProps): JSXNode {
  return children;
}

export function isFragment(type: ElementType): boolean {
  return typeof type === "function" && type?.name === "Fragment";
}
