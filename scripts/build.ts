import { $ } from "bun";
import esbuild, { type BuildOptions } from "esbuild";
import {
  dependencies,
  devDependencies,
  peerDependencies,
} from "../package.json";

await $`rm -rf ./dist`.nothrow().quiet();

const baseOpts: BuildOptions = {
  entryPoints: ["./src/index.ts"],
  platform: "node",
  bundle: true,
  outdir: "dist",
  external: [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
    ...Object.keys(peerDependencies),
  ],
  // minify: true,
};

esbuild
  .build({
    ...baseOpts,
    format: "cjs",
    outExtension: { ".js": ".cjs" },
  })
  .then(() => {
    console.log("CJS Build success");
  });

esbuild
  .build({
    ...baseOpts,
    format: "esm",
    outExtension: { ".js": ".mjs" },
  })
  .then(() => {
    console.log("ESM Build success");
  });
