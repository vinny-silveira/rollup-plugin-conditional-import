import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { rollup } from "rollup";
import conditionalImports from "../src/index";

describe("conditionalImports plugin", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("should not transform non-JS files", async () => {
    process.env.NODE_ENV = "production";

    const bundle = await rollup({
      input: "tests/mocks/invalid-extension/input.css",
      plugins: [conditionalImports()],
    });

    const { output } = await bundle.generate({ format: "es" });
    const result = output[0].code;

    expect(result).toBe("\n"); // Assuming the input.css is empty or has no JS code
  });

  it("should handle files without conditional imports", async () => {
    process.env.NODE_ENV = "production";

    const bundle = await rollup({
      input: "tests/mocks/no-conditional/input.js",
      plugins: [conditionalImports()],
    });

    const { output } = await bundle.generate({ format: "es" });
    const result = output[0].code;

    expect(result).toContain('console.log("No conditional import");\n');
  });

  it("should replace code for production environment", async () => {
    process.env.NODE_ENV = "production";

    const bundle = await rollup({
      input: "tests/mocks/conditional/input.js",
      plugins: [conditionalImports()],
    });

    const { output } = await bundle.generate({ format: "es" });
    const result = output[0].code;

    expect(result).not.toInclude("dev-module");
    expect(result).toContain(
      'module.exports = require("./dev-prod-deps/prod-module");\n',
    );
  });

  it("should replace code for development environment", async () => {
    process.env.NODE_ENV = "development";

    const bundle = await rollup({
      input: "tests/mocks/conditional/input.js",
      plugins: [conditionalImports()],
    });
    const { output } = await bundle.generate({ format: "es" });
    const result = output[0].code;

    expect(result).toContain(
      'module.exports = require("./dev-prod-deps/dev-module");\n',
    );
    expect(result).not.toInclude("prod-module");
  });
});
