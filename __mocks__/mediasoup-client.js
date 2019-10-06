const mediasoupClient = jest.genMockFromModule("mediasoup-client");

mediasoupClient.Device.prototype.load.mockImplementation(
  async ({ routerRtpCapabilities }) => {
    if (!routerRtpCapabilities)
      throw new TypeError("missing routerRtpCapabilities");
  }
);

module.exports = mediasoupClient;
