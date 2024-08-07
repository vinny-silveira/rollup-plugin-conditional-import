import { createFilter } from "@rollup/pluginutils";
import type { Plugin } from "rollup";

type PluginOptions = {
  /**
   * The files to include.
   */
  include?: string | string[];
  /**
   * The files to exclude.
   */
  exclude?: string | string[];
  /**
   * The environment to use.
   * @default process.env.NODE_ENV
   */
  env?: string;
};

const defaultExclude = ["**/*.!(js|jsx)"];
const processEnvRegex =
  /if\s*\(\s*process\.env\.NODE_ENV\s*===\s*['"]production['"]\s*\)\s*{([\s\S]*?)}\s*else\s*{([\s\S]*?)}/g;

/**
 * A Rollup plugin that conditionally imports code based on the environment.
 *
 * @param options - The plugin options.
 * @returns The Rollup plugin.
 */
const conditionalImports = (options: PluginOptions = {}): Plugin => {
  const environment = options?.env || process.env.NODE_ENV;
  const exclude = options.exclude
    ? [...defaultExclude, ...options.exclude]
    : defaultExclude;

  const filter = createFilter(options.include, exclude);

  return {
    name: "rollup-plugin-conditional-import",
    transform(code, id) {
      if (!filter(id)) return;
      if (!processEnvRegex.test(code)) return { code, map: null };

      return {
        code: code
          .replace(processEnvRegex, (match, prodCode, devCode) => {
            return environment === "production" ? prodCode : devCode;
          })
          .trim(),
        map: null,
      };
    },
  };
};

export default conditionalImports;
