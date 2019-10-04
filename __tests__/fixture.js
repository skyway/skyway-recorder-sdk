export const initializeResponse = {
  fqdn: "http://localhost:8080",
  routerRtpCapabilities: {
    codecs: [
      {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2,
        preferredPayloadType: 100,
        parameters: {},
        rtcpFeedback: []
      }
    ],
    headerExtensions: [
      {
        kind: "audio",
        uri: "urn:ietf:params:rtp-hdrext:sdes:mid",
        preferredId: 1,
        preferredEncrypt: false,
        direction: "recvonly"
      },
      {
        kind: "audio",
        uri: "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time",
        preferredId: 4,
        preferredEncrypt: false,
        direction: "sendrecv"
      },
      {
        kind: "audio",
        uri:
          "http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01",
        preferredId: 5,
        preferredEncrypt: false,
        direction: "inactive"
      },
      {
        kind: "audio",
        uri: "urn:ietf:params:rtp-hdrext:ssrc-audio-level",
        preferredId: 10,
        preferredEncrypt: false,
        direction: "sendrecv"
      }
    ],
    fecMechanisms: []
  },
  sessionToken: "54081349-67ae-4b4a-ba4b-1779781cda91",
  transportInfo: {
    id: "e294feed-0c0a-464d-91b6-528595a426b2",
    iceParameters: {
      iceLite: true,
      password: "5ztzan8pg4wzlwv5a4is3cti1lpka10e",
      usernameFragment: "8awqhubcb3rqcrmw"
    },
    iceCandidates: [
      {
        foundation: "udpcandidate",
        ip: "127.0.0.1",
        port: 3009,
        priority: 1076302079,
        protocol: "udp",
        type: "host"
      }
    ],
    dtlsParameters: {
      fingerprints: [
        {
          algorithm: "sha-512",
          value:
            "62:C5:B5:60:0C:AE:DB:BD:38:5D:3A:C9:11:96:CA:A7:7D:C2:D2:21:31:C9:DC:FC:30:9F:46:A3:5E:66:98:50:E7:3B:C4:7F:4E:6C:BD:7F:5A:57:6B:F5:4B:52:E8:40:13:2F:18:0C:4A:56:59:B5:B2:5C:DE:70:44:A2:74:F7"
        }
      ],
      role: "auto"
    }
  }
};
