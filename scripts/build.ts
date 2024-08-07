import { $ } from "bun";
import {
  dependencies,
  devDependencies,
  peerDependencies,
} from "../package.json";

await $`rm -rf ./dist`.nothrow().quiet();

const result = await Bun.build({
  target: "node",
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  minify: true,
  external: [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
    ...Object.keys(peerDependencies),
  ],
});

if (result.success) {
  console.log("Build success");
} else {
  console.error("Build failed");
}
