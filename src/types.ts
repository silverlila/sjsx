export interface JSXElement {
  type: ElementType;
  props: ElementProps;
  key: Key;
}

export type ElementType = string | ComponentFunction | Symbol;

export type ComponentFunction<P = any> = (
  props: P
) => JSXNode | Promise<JSXNode>;

export interface ElementProps {
  children?: JSXNode;
  key?: Key;
  [key: string]: any;
}

export type Key = string | number | null;

export type JSXNode =
  | JSXElement
  | Promise<JSXElement>
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | JSXNode[];

export interface HTMLAttributes {
  // Common
  id?: string;
  className?: string;
  style?: string | CSSProperties;
  title?: string;

  // Forms
  name?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  checked?: boolean;

  // Links
  href?: string;
  target?: string;
  rel?: string;

  // Images
  src?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;

  // Events (not yet implemented)
  onClick?: (event: any) => void;
  onChange?: (event: any) => void;

  // Aria
  role?: string;
  [key: `aria-${string}`]: any;

  // Data attributes
  [key: `data-${string}`]: any;
}

export interface CSSProperties {
  // Layout
  display?: string;
  position?: string;
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;

  // Box Model
  width?: string | number;
  height?: string | number;
  margin?: string | number;
  padding?: string | number;

  // Flexbox
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?: string;
  alignItems?: string;
  gap?: string | number;

  // Typography
  color?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  textAlign?: string;

  // Background
  background?: string;
  backgroundColor?: string;

  // Border
  border?: string;
  borderRadius?: string | number;

  // Transform
  transform?: string;

  // Other
  opacity?: number;
  cursor?: string;

  // Allow any CSS property
  [key: string]: any;
}

export interface FragmentProps {
  children?: JSXNode;
}

export interface SuspenseProps {
  fallback?: JSXNode;
  children: JSXNode;
}

export interface RenderOptions {
  onError?: (error: Error, info: ErrorInfo) => void;
}

export interface ErrorInfo {
  componentName?: string;
  componentStack?: string;
}

export interface SuspenseBoundary {
  id: string;
  fallback: JSXNode;
  children: JSXNode;
  promise: Promise<JSXNode>;
}

export interface StreamContext {
  boundaryCounter: number;
  pendingBoundaries: SuspenseBoundary[];
}

export interface IntrinsicElements {
  // Document
  html: HTMLAttributes;
  head: HTMLAttributes;
  body: HTMLAttributes;
  title: HTMLAttributes;
  meta: HTMLAttributes;
  link: HTMLAttributes;

  // Content
  div: HTMLAttributes;
  span: HTMLAttributes;
  p: HTMLAttributes;
  a: HTMLAttributes;

  // Headings
  h1: HTMLAttributes;
  h2: HTMLAttributes;
  h3: HTMLAttributes;
  h4: HTMLAttributes;
  h5: HTMLAttributes;
  h6: HTMLAttributes;

  // Lists
  ul: HTMLAttributes;
  ol: HTMLAttributes;
  li: HTMLAttributes;

  // Forms
  form: HTMLAttributes;
  input: HTMLAttributes;
  button: HTMLAttributes;
  label: HTMLAttributes;
  textarea: HTMLAttributes;
  select: HTMLAttributes;
  option: HTMLAttributes;

  // Media
  img: HTMLAttributes;
  video: HTMLAttributes;
  audio: HTMLAttributes;

  // Table
  table: HTMLAttributes;
  thead: HTMLAttributes;
  tbody: HTMLAttributes;
  tr: HTMLAttributes;
  td: HTMLAttributes;
  th: HTMLAttributes;

  // Semantic
  header: HTMLAttributes;
  footer: HTMLAttributes;
  nav: HTMLAttributes;
  main: HTMLAttributes;
  section: HTMLAttributes;
  article: HTMLAttributes;
  aside: HTMLAttributes;

  // Other
  script: HTMLAttributes;
  style: HTMLAttributes;
  br: HTMLAttributes;
  hr: HTMLAttributes;

  // Allow any element
  [tagName: string]: HTMLAttributes;
}
