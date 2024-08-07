if (process.env.NODE_ENV === "production") {
  module.exports = require("./dev-prod-deps/prod-module");
} else {
  module.exports = require("./dev-prod-deps/dev-module");
}
