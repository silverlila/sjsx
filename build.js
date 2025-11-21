import { build } from "esbuild";

await build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  outfile: "dist/sjsx.js",
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: ["esbuild", "./loader.js", "./jsx-runtime.js"],
});

await build({
  entryPoints: ["src/jsx-runtime.ts"],
  bundle: true,
  platform: "neutral",
  format: "esm",
  target: "es2020",
  outfile: "dist/jsx-runtime.js",
});

await build({
  entryPoints: ["src/loader.ts"],
  bundle: false,
  platform: "node",
  format: "esm",
  target: "node18",
  outfile: "dist/loader.js",
});

console.log("✅ Build complete. Files written to dist/");
