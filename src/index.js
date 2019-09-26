import { Device } from "mediasoup-client";
import Signaling from "./signaling";
import Client from "./client";

export async function createRecorder(apiKey, credential) {
  const device = new Device();

  // TODO: fix url
  const preSignaling = new Signaling("http://localhost:8080/v1", {});

  const {
    fqdn,
    sessionToken,
    routerRtpCapabilities,
    transportInfo
  } = await preSignaling.initialize({ apiKey, credential });

  await device.load({ routerRtpCapabilities });

  if (!device.canProduce("audio")) throw new Error("TODO");

  // create new one w/ FQDN and additional header
  const signaling = new Signaling(`${fqdn}/v1`, {
    "X-Session-Token": sessionToken,
    "X-Api-Key": apiKey
  });

  const client = new Client({ device, signaling });
  await client._setupTransport({ transportInfo });

  return client;
}
