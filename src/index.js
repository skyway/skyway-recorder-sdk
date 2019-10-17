const Client = require("./client");
const Signaler = require("./signaler");

// TODO: fix
const recordingServerHost = "http://localhost:8080";

// copied from signaling server code
const apiKeyRegExp = /^[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}$/;
const timestampRegExp = /^\d{13}$/;

exports.createRecorder = (apiKey, options = {}) => {
  if (!apiKeyRegExp.test(apiKey))
    throw new TypeError("API KEY is missing or invalid format!");

  // default options
  const auth = options.auth || null;
  const iceServers = options.iceServers || null;
  const iceTransportPolicy = options.iceTransportPolicy || "all";

  // validate options if not default
  if (auth !== null) {
    if (!timestampRegExp.test(auth.timestamp))
      throw new TypeError("auth.timestamp must be a 13 digits unix tiemstamp!");
    if (!(auth.credential && typeof auth.credential === "string"))
      throw new TypeError("auth.credential must be a hash string!");
  }

  if (iceServers !== null) {
    if (!Array.isArray(iceServers))
      throw new TypeError("iceServers must be an array!");
  }
  if (iceTransportPolicy !== "all") {
    if (iceTransportPolicy !== "relay")
      throw new TypeError("iceTransportPolicy must be `relay` or `all`!");
  }

  const signaler = new Signaler()
    .setUrl(recordingServerHost)
    .addHeader("X-Api-Key", apiKey);

  return new Client(signaler, { auth, iceServers, iceTransportPolicy });
};

exports.errors = require("./errors");
