export const ATTRIBUTES_MAP: Record<string, string> = {
  className: "class",
  htmlFor: "for",
  crossOrigin: "crossorigin",
  acceptCharset: "accept-charset",
};

export const BOOLEAN_ATTRIBUTES = new Set([
  "disabled",
  "checked",
  "selected",
  "readonly",
  "required",
  "autofocus",
  "autoplay",
  "controls",
  "loop",
  "muted",
  "multiple",
  "open",
]);

export const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
