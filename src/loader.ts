import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transform } from "esbuild";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function resolve(
  id: string,
  context: { parentURL?: string },
  nextResolve: (specifier: string, context: any) => Promise<any>
) {
  if (id === "sjsx/jsx-runtime") {
    const jsExt = path.resolve(__dirname, "jsx-runtime.js");
    const tsExt = path.resolve(__dirname, "jsx-runtime.ts");

    const jsxRuntimePath = await readFile(jsExt)
      .then(() => jsExt)
      .catch(() => tsExt);
    const jsxRuntimeUrl = pathToFileURL(jsxRuntimePath);

    return {
      url: jsxRuntimeUrl.href,
      shortCircuit: true,
    };
  }

  return nextResolve(id, context);
}

export async function load(
  url: string,
  context: any,
  nextLoad: (url: string, context: any) => Promise<any>
) {
  if (url.endsWith(".jsx") || url.endsWith(".tsx") || url.endsWith(".ts")) {
    const filename = fileURLToPath(url);
    const source = await readFile(filename, "utf8");

    let loader: "jsx" | "tsx" | "ts" = "ts";
    if (url.endsWith(".tsx")) loader = "tsx";
    else if (url.endsWith(".jsx")) loader = "jsx";

    const { code } = await transform(source, {
      loader,
      jsx: "automatic",
      jsxImportSource: "sjsx",
      format: "esm",
      sourcemap: "inline",
      sourcefile: filename,
    });

    return {
      format: "module",
      source: code,
      shortCircuit: true,
    };
  }

  return nextLoad(url, context);
}
