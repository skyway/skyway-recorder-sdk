const debug = require("debug")("skyway-recorder:client:usecase");
const { Device } = require("mediasoup-client");
const { NotSupportedError } = require("../errors");

exports.initializeSession = async ({
  signaler,
  authParams,
  iceServers,
  iceTransportPolicy
}) => {
  const {
    fqdn,
    sessionToken,
    routerRtpCapabilities,
    transportInfo
  } = await signaler.request("POST", "/initialize", authParams || {});

  // update
  signaler.setUrl(fqdn).addHeader("X-Session-Token", sessionToken);

  // if passed, override even if it is empty
  if (iceServers) {
    transportInfo.iceServers = iceServers;
  }
  // will be passed `relay` or default `all`
  transportInfo.iceTransportPolicy = iceTransportPolicy;

  return { routerRtpCapabilities, transportInfo };
};

exports.createDevice = async ({ routerRtpCapabilities }) => {
  const device = new Device();

  const isLoaded = await device
    .load({ routerRtpCapabilities })
    .then(() => true)
    .catch(() => false);
  debug("device loaded");

  if (!(isLoaded && device.canProduce("audio")))
    throw new NotSupportedError(
      "Your device does not have capabilities to send audio!"
    );

  return device;
};

exports.createTransportAndBindEvents = ({
  device,
  transportInfo,
  signaler,
  onAbort
}) => {
  const transport = device.createSendTransport(transportInfo);

  transport.once("connect", async (params, callback, errback) => {
    debug("transport@connect");

    try {
      await signaler.request("POST", "/transport/connect", params);
      callback();
    } catch (err) {
      errback(err);
    }
  });

  transport.once("produce", async (params, callback, errback) => {
    debug("transport@produce");

    try {
      // server side producerId
      const { id } = await signaler.request(
        "POST",
        "/transport/produce",
        params
      );
      callback({ id });
    } catch (err) {
      errback(err);
    }
  });

  transport.on("connectionstconnectatechange", async state => {
    debug("transport@cSC", state);

    if (state === "disconnected") {
      onAbort("Disconnected from server.");
    }
  });

  return transport;
};

exports.createProducerAndBindEvents = async ({ transport, track, onAbort }) => {
  const producer = await transport.produce({ track });

  producer.once("transportclose", () => {
    debug("producer@transportclose");
    onAbort("Transport closed.");
  });
  producer.once("trackended", () => {
    debug("producer@trackended");
    onAbort("Recording track ended.");
  });

  return producer;
};

exports.closeTransport = ({ producer, transport }) => {
  producer.close();
  transport.close();
};

exports.startRecording = async ({ signaler, producerId, pingInterval }) => {
  const { id } = await signaler.request("POST", "/record/start", {
    producerId
  });

  const stopPingTimer = signaler.startPing("GET", "/record/ping", pingInterval);

  return { id, stopPingTimer };
};

exports.stopRecording = async ({ signaler, stopPingTimer }) => {
  stopPingTimer();
  await signaler.request("POST", "/record/stop", {});
};
