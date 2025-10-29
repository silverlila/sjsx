#!/usr/bin/env node

import("../src/cli/index.js").catch((error: Error) => {
  console.error("Failed to start SJSX CLI:", error.message);
  process.exit(1);
});
