import http from "node:http";
import { renderToStream } from "./src/renderer";
import { createRequestListener } from "@remix-run/node-fetch-server";

const Home = () => <h1>Home</h1>;
const About = () => <h1>About</h1>;

function html(source: string | ReadableStream<string>) {
  return new Response(source, {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}

const server = http.createServer(
  createRequestListener(async (request) => {
    const url = new URL(request.url, "http://localhost");

    if (url.pathname === "/") {
      return html(renderToStream(<Home />));
    } else if (url.pathname === "/about") {
      return html(renderToStream(<About />));
    }

    return new Response("Not Found", { status: 404 });
  })
);

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());

server.listen(8080);
console.log("Server running on http://localhost:8080");
console.log("Using streaming SSR with Web Streams API! 🚀");
