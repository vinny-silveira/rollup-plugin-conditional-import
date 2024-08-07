[npm]: https://img.shields.io/npm/v/rollup-plugin-conditional-import
[npm-url]: https://www.npmjs.com/package/rollup-plugin-conditional-import
[size]: https://packagephobia.now.sh/badge?p=rollup-plugin-conditional-import
[size-url]: https://packagephobia.now.sh/result?p=rollup-plugin-conditional-import

[![npm][npm]][npm-url]
[![size][size]][size-url]
[![libera manifesto](https://img.shields.io/badge/libera-manifesto-lightgrey.svg)](https://liberamanifesto.com)

# rollup-plugin-conditional-import

🍣 A Rollup plugin that allows you to conditionally import modules (CJS) based on environment variables or other conditions. This can be useful for including different code in production and development builds, reducing the bundle size.

## How it works?

This plugin works by analyzing the AST of the input files and removing the `import` statements that are not necessary based on the conditions you set. This way, you can include different modules in the output based on the environment variables or other conditions you set.

The motivation behind this plugin is a problem with `react` and `jsx-runtime`, where the code generated is:

```js

function requireReactJsxRuntime_production_min() {
  // Bunch of code
}

function requireReactJsxRuntime_development() {
  // Bunch of code
}

if ("production" === 'production') {
    jsxRuntime.exports = requireReactJsxRuntime_production_min();
} else {
    jsxRuntime.exports = requireReactJsxRuntime_development();
}
var jsxRuntimeExports = jsxRuntime.exports;
```

The mission is to remove the `requireReactJsxRuntime_development` function and the `if` statement, and only include the `requireReactJsxRuntime_production_min` function in the output or vice versa according to the environment variable.

With the `rollup-plugin-conditional-import` plugin, you can achieve this, generating a smaller bundle:

```js
var reactJsxRuntime_production_min = {};

var f$1 = // Only necessary code for production

function q(c, a, g) {
  // Necessary code only for production
}

reactJsxRuntime_production_min.Fragment = l$2;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;

var jsxRuntime = reactJsxRuntime_production_min;
```
And the same for the development environment.

## Requirements

This plugin requires Rollup v3.0.0+ or v4.0.0+.

## Install

Using npm:

```bash
npm i -D rollup-plugin-conditional-import
```

Or using pnpm:

```bash
pnpm i -D rollup-plugin-conditional-import
```

## Usage

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
import conditionalImport from 'rollup-plugin-conditional-import';

export default {
  input: 'src/index.js',
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [conditionalImport()]
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api).

### Example

Consider the following code:

```js
// index.js
if (process.env.NODE_ENV === 'production') {
  require('./prodModule.js');
} else {
  require('./devModule.js');
}
```

With the configuration above, Rollup will bundle both `prodModule.js` and `devModule.js` into the output. However, if you use the plugin and set `NODE_ENV` to `development`, only `devModule.js` will be included in the output, this way reducing the bundle size:

```js
// bundle.js
require('./devModule.js');
```

Or, if `NODE_ENV` is set to `production`:

```js
// bundle.js
require('./prodModule.js');
```

And the commonjs plugin will take care of the rest, compiling only the necessary code, and not both modules (development and production).

## Options

### `env`

Type: `string`<br>
Default: `process.env.NODE_ENV`

By default, the plugin will use the `NODE_ENV` environment variable to determine the environment. You can override this by setting the `env` option to a different environment variable.

### `exclude`

Type: `string | string[]`<br>
Default: `["**/*.!(js|jsx)"]`

A [picomatch pattern](https://github.com/micromatch/picomatch), or array of patterns, which specifies the files in the build the plugin should _ignore_. By default, all files that are not JavaScript/JSX files are ignored. See also the `include` option.

### `include`

Type: `string | string[]`<br>
Default: `null`

A [picomatch pattern](https://github.com/micromatch/picomatch), or array of patterns, which specifies the files in the build the plugin should operate on.

## Meta

[LICENSE (MIT)](/LICENSE)
