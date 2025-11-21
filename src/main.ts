import path from "node:path";
import { register } from "node:module";
import { createServer } from "./server.js";
import { parseArgs } from "./parse-args.js";
register(path.join(import.meta.dirname, "loader.js"), import.meta.url);

const args = parseArgs();

createServer({
  entry: args._[0] || "app.jsx",
  port: Number(args.port || args.p || 3000),
  host: args.host || "localhost",
});

process.on("SIGINT", () => {
  console.log("\n👋 Goodbye!");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Goodbye!");
  process.exit(0);
});
