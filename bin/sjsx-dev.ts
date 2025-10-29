#!/usr/bin/env node

// DEV VERSION: Use tsx to run TypeScript directly
import("../src/cli/index.ts").catch((error: Error) => {
  console.error("Failed to start SJSX CLI:", error.message);
  process.exit(1);
});
