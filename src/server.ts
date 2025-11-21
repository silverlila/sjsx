import http from "node:http";
import path from "node:path";
import { renderToStream } from "./renderer";
import { pathToFileURL } from "node:url";
import { createRequestListener } from "@remix-run/node-fetch-server";
import { html } from "./utils";

export function createServer(options: {
  entry: string;
  port?: number;
  host?: string;
}) {
  const { entry, port = 3000, host = "localhost" } = options;
  const absoluteEntry = path.resolve(process.cwd(), entry);

  const server = http.createServer(
    createRequestListener(async () => {
      try {
        const moduleurl = pathToFileURL(absoluteEntry);
        const mod = await import(moduleurl.href);
        const component = mod.default;

        return html(renderToStream(component()));
      } catch (err: any) {
        return new Response(err.message, { status: 500 });
      }
    })
  );

  server.listen(port, host, () => {
    console.log(`sjsx running at http://${host}:${port}`);
  });
}
