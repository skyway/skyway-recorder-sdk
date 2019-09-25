import Signaling from "./signaling";
import Client from "./client";

export async function createRecorder(apiKey, credential) {
  // TODO: fix url
  const preSignaling = new Signaling("http://localhost:8080/v1", {});

  const {
    fqdn,
    sessionToken,
    routerRtpCapabilities,
    transportInfo
  } = await preSignaling.initialize({ apiKey, credential });

  // create new one w/ FQDN and additional header
  const signaling = new Signaling(`${fqdn}/v1`, {
    "X-Session-Token": sessionToken,
    "X-Api-Key": apiKey
  });

  const client = new Client(signaling);
  await client._setup({ routerRtpCapabilities, transportInfo });

  return client;
}
