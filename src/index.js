import Signaling from "./signaling";
import Recorder from "./recorder";

export async function createRecorder(apiKey, credential) {
  const preSignaling = new Signaling("http://localhost:8080");

  const {
    fqdn,
    sessionToken,
    routerCapabilities,
    transportInfo
  } = await preSignaling.initialize({
    apiKey,
    credential
  });

  const signaling = new Signaling(fqdn, { "X-Session-Token": sessionToken });
  const recorder = new Recorder(signaling);
  await recorder.setup(routerCapabilities, transportInfo);

  return recorder;
}
