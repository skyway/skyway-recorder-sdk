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
      plugins: [
        require("rollup-plugin-json")(),
        require("rollup-plugin-node-builtins")(),
        require("rollup-plugin-node-resolve")({ browser: true }),
        require("rollup-plugin-commonjs")()
      ],
      output: {
        format: "iife",
        sourcemap: "inline"
      }
    }
  });
