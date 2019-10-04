import { Device } from "mediasoup-client";
import Signaling from "./signaling";
import Client from "./client";
import Rest from "./rest";
import { recordingServerHost } from "./constants";

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

  // create new one w/ FQDN and additional header
  const signaling = new Signaling(
    new Rest(`${fqdn}/v1`, {
      "X-Session-Token": sessionToken,
      "X-Api-Key": apiKey
    })
  );

  const client = new Client({ device, signaling, transportInfo });
  return client;
}
