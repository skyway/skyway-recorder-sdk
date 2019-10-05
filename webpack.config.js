const config = {
  mode: "development",
  entry: { "skyway-recorder": "./src/index.js" },
  output: {
    libraryTarget: "umd",
    library: "SkyWayRecorder",
    path: `${__dirname}/dist`,
    filename: "skyway-recorder.js"
  },
  devtool: "none"
};

// for `npm run build`, exports both `.js`, `.min.js` and ignore source-map/eval
if (process.env.NODE_ENV === "production") {
  const minConf = JSON.parse(JSON.stringify(config));
  minConf.mode = "production";
  minConf.output.filename = "skyway-recorder.min.js";
  module.exports = [config, minConf];
}
// for `npm run dev` do not build `.min.js`
else {
  module.exports = config;
}
