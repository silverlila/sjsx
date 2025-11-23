import type {
  JSXElement,
  ElementType,
  Key,
  JSXNode,
  FragmentProps,
} from "./types.js";

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

function Fragment({ children }: FragmentProps): JSXNode {
  return children;
}

export { jsx, jsxs, Fragment };

//@ts-ignore
globalThis.jsx = jsx;
//@ts-ignore
globalThis.Fragment = Fragment;
