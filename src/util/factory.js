const { Device } = require("mediasoup-client");

exports.createDevice = async ({ routerRtpCapabilities }) => {
  const device = new Device();
  await device.load({ routerRtpCapabilities });

  return device;
};

exports.createTransport = ({
  device,
  transportInfo,
  iceServers,
  iceTransportPolicy
}) => {
  // if passed, override even if it is empty
  if (iceServers) {
    transportInfo.iceServers = iceServers;
  }
  // will be passed `relay` or default `all`
  transportInfo.iceTransportPolicy = iceTransportPolicy;

  const transport = device.createSendTransport(transportInfo);
  return transport;
};

exports.createProducer = async ({ transport, track }) => {
  const producer = await transport.produce({ track });
  return producer;
};
