const config = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    libraryTarget: "umd",
    library: "SkyWayRecorder",
    path: `${__dirname}/dist`,
    filename: "skyway-js-recorder.js"
  },
  devtool: "none"
};

// for `npm run build`, exports both `.js`, `.min.js` and ignore source-map/eval
if (process.env.NODE_ENV === "production") {
  const minConf = JSON.parse(JSON.stringify(config));
  minConf.mode = "production";
  minConf.output.filename = "skyway-js-recorder.min.js";
  module.exports = [config, minConf];
}
// for `npm run dev` do not build `.min.js`
else {
  module.exports = config;
}
