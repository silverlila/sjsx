import { createServer } from "http";
import { createRequestListener } from "@remix-run/node-fetch-server";
import { renderToStream } from "../../renderer.js";
import { watch } from "fs";
import { resolve, relative } from "path";
import { jsx } from "../../jsx-runtime.js";

interface ServeOptions {
  port: string;
  watch: boolean;
}

export async function serve(filePath: string, options: ServeOptions) {
  const absolutePath = resolve(process.cwd(), filePath);
  const relativePath = relative(process.cwd(), absolutePath);

  console.log("");
  console.log("🚀 SJSX Development Server");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📄 File: ${relativePath}`);
  console.log(`🔗 Local: http://localhost:${options.port}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");

  // Component holder
  let Component: any = null;
  let loadError: Error | null = null;

  // Load the component
  async function loadComponent() {
    try {
      // Register tsx loader for TypeScript support
      // This allows Node to import .tsx/.ts files
      if (absolutePath.match(/\.(tsx?|jsx)$/)) {
        try {
          const { register } = await import("node:module");
          const { pathToFileURL } = await import("node:url");
          register("tsx/esm", pathToFileURL("./"));
        } catch {}
      }

      const moduleUrl = `${absolutePath}?t=${Date.now()}`;
      const module = await import(moduleUrl);

      Component = module.default || module;

      if (typeof Component !== "function") {
        throw new Error(
          "File must export a default function component.\n" +
            `Example:\n` +
            `  export default function App() {\n` +
            `    return <h1>Hello World</h1>;\n` +
            `  }`
        );
      }

      loadError = null;
      console.log("✓ Component loaded successfully");
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      loadError = error;
      console.error("✗ Error loading component:");
      console.error(error.message);
      console.error("");

      Component = () =>
        jsx("div", {
          style: {
            fontFamily: "system-ui, sans-serif",
            padding: "20px",
            border: "2px solid #ef4444",
            borderRadius: "8px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
          },
          children: [
            jsx("h2", {
              style: { margin: "0 0 10px 0" },
              children: "Component Error",
            }),
            jsx("pre", {
              style: {
                whiteSpace: "pre-wrap",
                fontSize: "14px",
                margin: 0,
              },
              children: error.message,
            }),
          ],
        });
    }
  }

  await loadComponent();

  if (options.watch) {
    watch(absolutePath, async (_event, filename) => {
      console.log(`🔄 ${filename} changed, reloading...`);
      await loadComponent();
    });
  }

  const fetchHandler = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      try {
        const stream = renderToStream(
          jsx("html", {
            lang: "en",
            children: [
              jsx("head", {
                children: [
                  jsx("meta", { charset: "UTF-8" }),
                  jsx("meta", {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0",
                  }),
                  jsx("title", { children: "SJSX App" }),
                ],
              }),
              jsx("body", {
                style: { margin: 0, padding: 0 },
                children: jsx(Component, {}),
              }),
            ],
          })
        );

        return new Response(stream, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Transfer-Encoding": "chunked",
          },
        });
      } catch (error) {
        console.error("Error rendering:", error);
        return new Response(
          `<!DOCTYPE html><html><body><h1>Server Error</h1><pre>${
            error instanceof Error ? error.message : String(error)
          }</pre></body></html>`,
          {
            status: 500,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }
        );
      }
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    });
  };

  const server = createServer(createRequestListener(fetchHandler));

  server.on("error", (error: any) => {
    if (error.code === "EADDRINUSE") {
      console.error(`✗ Port ${options.port} is already in use`);
      console.error(`  Try a different port with: --port 3001`);
      process.exit(1);
    } else {
      console.error("✗ Server error:", error);
      process.exit(1);
    }
  });

  server.listen(parseInt(options.port));
}
