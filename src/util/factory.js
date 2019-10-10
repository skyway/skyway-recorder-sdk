const { Device } = require("mediasoup-client");

exports.createDevice = async ({ routerRtpCapabilities }) => {
  const device = new Device();
  await device.load({ routerRtpCapabilities });

  if (!device.canProduce("audio"))
    throw new Error("Your device does not support to send audio!");

  return device;
};

exports.createTransport = ({ device, transportInfo }) => {
  const transport = device.createSendTransport(transportInfo);
  return transport;
};

exports.createProducer = async ({ transport, track }) => {
  const producer = await transport.produce({ track });
  return producer;
};
