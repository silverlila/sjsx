#!/usr/bin/env node

import { Command } from "commander";
import { serve } from "./commands/serve.js";

const program = new Command();

program
  .name("sjsx")
  .description("SJSX Framework CLI - Stream JSX for rapid prototyping")
  .version("1.0.0");

program
  .command("serve <file>")
  .description("Start a development server")
  .option("-p, --port <port>", "Port to run server on", "3000")
  .option("--no-watch", "Disable hot reload")
  .action(serve);

program.parse();
