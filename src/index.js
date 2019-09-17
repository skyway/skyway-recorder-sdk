import Signaling from "./signaling";
import Client from "./client";

export async function createRecorder(apiKey, credential) {
  const preSignaling = new Signaling("http://localhost:8080", {});

  const {
    fqdn,
    sessionToken,
    routerRtpCapabilities,
    transportInfo
  } = await preSignaling.initialize(apiKey, credential);

  // create new one w/ FQDN and additional header
  const signaling = new Signaling(fqdn, { "X-Session-Token": sessionToken });

  const client = new Client(signaling);
  await client._setup({ routerRtpCapabilities, transportInfo });

  return client;
}
