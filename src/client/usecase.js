const { Device } = require("mediasoup-client");

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
  } = await signaler.fetchJSON("POST", "/initialize", authParams || {});

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
  await device.load({ routerRtpCapabilities });

  if (!device.canProduce("audio"))
    throw new Error("Your device does not support to send audio!");

  return device;
};

exports.createTransportAndBindEvents = ({
  device,
  transportInfo,
  signaler,
  onAbort
}) => {
  const transport = device.createSendTransport(transportInfo);

  transport.once("connect", async ({ dtlsParameters }, callback, errback) => {
    try {
      await signaler.fetchJSON("POST", "/transport/connect", {
        dtlsParameters
      });
      callback();
    } catch (err) {
      errback(err);
      // TODO: throw
    }
  });

  transport.once(
    "produce",
    async ({ kind, rtpParameters }, callback, errback) => {
      try {
        // server side producerId
        const { id } = await signaler.fetchJSON("POST", "/transport/produce", {
          kind,
          rtpParameters
        });
        callback({ id });
      } catch (err) {
        errback(err);
        // TODO: throw
      }
    }
  );

  transport.on("connectionstatechange", async state => {
    if (state === "disconnected") {
      onAbort("Disconnected from server.");
    }
  });

  return transport;
};

exports.createProducerAndBindEvents = async ({ transport, track, onAbort }) => {
  const producer = await transport.produce({ track });

  producer.once("transportclose", () => {
    onAbort("Transport closed.");
  });
  producer.once("trackended", () => {
    onAbort("Recording track ended.");
  });

  return producer;
};

exports.closeTransport = ({ producer, transport }) => {
  producer.close();
  transport.close();
};

exports.startRecording = async ({ signaler, producerId, pingInterval }) => {
  const { id } = await signaler.fetchJSON("POST", "/record/start", {
    producerId
  });

  const stopPingTimer = signaler.startPing("GET", "/record/ping", pingInterval);

  return { id, stopPingTimer };
};

exports.stopRecording = async ({ signaler, stopPingTimer }) => {
  stopPingTimer();
  await signaler.fetchJSON("POST", "/record/stop", {});
};
