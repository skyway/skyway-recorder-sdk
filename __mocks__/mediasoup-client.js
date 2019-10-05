const mediasoupClient = jest.genMockFromModule("mediasoup-client");

mediasoupClient.Device.prototype.load = async ({ routerRtpCapabilities }) => {
  if (!routerRtpCapabilities) throw new Error("routerRtpCapabilities missing!");
};

module.exports = mediasoupClient;
