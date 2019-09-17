module.exports = {
  input: "src/index.js",
  output: {
    file: "dist/skyway-recorder.js",
    format: "umd",
    name: "SkyWayRecorder"
  },
  plugins: [
    require("rollup-plugin-json")(),
    require("rollup-plugin-node-builtins")(),
    require("rollup-plugin-node-resolve")({ browser: true }),
    require("rollup-plugin-commonjs")()
  ]
};
