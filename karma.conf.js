const { plugins } = require("./rollup.config");
module.exports = config =>
  config.set({
    logLevel: config.LOG_WARN,
    singleRun: true,
    reporters: ["mocha"],
    // browsers: ["Chrome", "Firefox", "Safari"],
    browsers: ["Chrome"],
    frameworks: ["jasmine"],
    files: [
      // need to load here because ES module does not exists!
      "./node_modules/fetch-mock/dist/es5/client-bundle.js",
      { pattern: "__tests__/**/*.test.js", watched: false }
    ],
    preprocessors: {
      "./__tests__/**/*.test.js": ["rollup"]
    },
    rollupPreprocessor: {
      plugins,
      output: {
        format: "iife",
        sourcemap: "inline"
      }
    }
  });
