const { Device } = require("mediasoup-client");
const Signaling = require("./signaling");
const Client = require("./client");
const Rest = require("./util/rest");
const { recordingServerHost } = require("./util/constants");

exports.createRecorder = async (apiKey, credential = null) => {
  // TODO: validate apiKey

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
  } = await preSignaling.initialize({ credential });

  const device = new Device();
  await device.load({ routerRtpCapabilities });

  // create new one w/ FQDN and additional header
  const signaling = new Signaling(
    new Rest(`${fqdn}/v1`, {
      "X-Session-Token": sessionToken,
      "X-Api-Key": apiKey
    })
  );

  const client = new Client({ device, signaling, transportInfo });
  return client;
};
