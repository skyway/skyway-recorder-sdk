import { Device } from "mediasoup-client";
import Signaling from "./signaling";
import Client from "./client";
import Rest from "./rest";

// TODO: fix url
const recordingServerHost = "http://localhost:8080/v1";

export async function createRecorder(apiKey, credential = null) {
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

  if (!device.canProduce("audio")) throw new Error("TODO");

  // create new one w/ FQDN and additional header
  const signaling = new Signaling(
    new Rest(`${fqdn}/v1`, {
      "X-Session-Token": sessionToken,
      "X-Api-Key": apiKey
    })
  );

  const client = new Client({ device, signaling });
  await client._setupTransport({ transportInfo });

  return client;
}
