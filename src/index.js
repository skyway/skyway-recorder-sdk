const { Device } = require("mediasoup-client");
const Signaling = require("./signaling");
const Client = require("./client");
const Rest = require("./util/rest");
const { recordingServerHost } = require("./util/constants");

// copied from signaling server code
const apiKeyRegExp = /^[a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12}$/;
const timestampRegExp = /^\d{13}$/;

const options = {
  auth: null,
  iceServers: [],
  iceTransportPolicy: "all"
};

exports.createRecorder = async (
  apiKey,
  { auth, iceServers, iceTransportPolicy } = options
) => {
  if (!apiKeyRegExp.test(apiKey))
    throw new Error("TODO: invalid apikey format!");

  if (auth) {
    if (!timestampRegExp.test(auth.timestamp))
      throw new Error("auth.timestamp must be a 13 digits unix tiemstamp!");
    if (!(auth.credential && typeof auth.credential === "string"))
      throw new Error("auth.credential must be a hash string!");
  }

  const preSignaling = new Signaling(
    new Rest(recordingServerHost, {
      "X-Api-Key": apiKey
    })
  );

  const {
    fqdn,
    sessionToken,
    routerRtpCapabilities,
    transportInfo
  } = await preSignaling.initialize(auth);

  // if specified override
  if (iceServers.length !== 0) transportInfo.iceServers = iceServers;
  // if force TURN
  if (iceTransportPolicy === "relay")
    transportInfo.iceTransportPolicy = "relay";

  const device = new Device();
  await device.load({ routerRtpCapabilities });

  // create new one w/ FQDN and additional header
  const signaling = new Signaling(
    new Rest(`${fqdn}`, {
      "X-Session-Token": sessionToken,
      "X-Api-Key": apiKey
    })
  );

  const client = new Client({ device, signaling, transportInfo });
  return client;
};
