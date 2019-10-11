exports.initialize_200 = {
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
  sessionToken: "20cd437f-b219-4bac-ae19-db84e68807b4",
  transportInfo: {
    id: "993e4adc-d5a0-4f1c-a54f-c756d69098a5",
    iceParameters: {
      iceLite: true,
      password: "jy0tz53ingl08cvhw3takicn89upd90u",
      usernameFragment: "idjwe06lubwrffqw"
    },
    iceCandidates: [
      {
        foundation: "udpcandidate",
        ip: "127.0.0.1",
        port: 3005,
        priority: 1076302079,
        protocol: "udp",
        type: "host"
      }
    ],
    dtlsParameters: {
      fingerprints: [
        {
          algorithm: "sha-1",
          value: "A1:C6:B1:22:49:94:CB:3A:87:9B:14:B3:93:75:89:D0:5C:59:96:AA"
        },
        {
          algorithm: "sha-224",
          value:
            "D9:80:D9:67:03:2D:B1:F5:B7:C9:6B:40:C1:63:00:27:71:95:59:39:A5:81:B3:C4:16:EB:7F:04"
        },
        {
          algorithm: "sha-256",
          value:
            "09:42:23:53:49:46:02:28:56:B2:DB:D1:44:6D:68:1E:E6:4D:B0:EB:79:53:92:67:49:20:A5:40:52:95:E8:04"
        },
        {
          algorithm: "sha-384",
          value:
            "D8:ED:6E:4E:34:43:59:6F:77:55:B4:B3:4E:90:60:8D:D2:8D:CF:28:C4:D5:29:37:30:83:56:1C:AE:A0:BD:C5:B6:C4:FA:50:32:E0:BA:FE:C7:0D:66:12:91:04:32:7B"
        },
        {
          algorithm: "sha-512",
          value:
            "01:43:84:13:DF:F1:94:93:CB:AA:0E:3F:8F:15:FB:60:BC:BB:EE:10:CD:D6:18:6E:17:97:CC:EF:CE:CA:3E:83:73:0A:56:4C:3B:26:CE:E7:5B:0D:52:EB:E2:CD:91:98:29:26:8D:7E:38:5B:2D:99:1E:3E:2B:E1:2B:82:68:47"
        }
      ],
      role: "auto"
    },
    iceServers: [
      { urls: "stun:stun.webrtc.ecl.ntt.com:3478" },
      {
        urls: "turn:turn.webrtc.ecl.ntt.com:443?transport=udp",
        username: "1570782312:5bea388b-3f95-4e1e-acb5-a34efdd0c480$",
        credential: "dhXxe8seVit6wblNAwPDSDhvqLM="
      },
      {
        urls: "turn:turn.webrtc.ecl.ntt.com:443?transport=tcp",
        username: "1570782312:5bea388b-3f95-4e1e-acb5-a34efdd0c480$",
        credential: "dhXxe8seVit6wblNAwPDSDhvqLM="
      },
      {
        urls: "turns:turn.webrtc.ecl.ntt.com:443?transport=tcp",
        username: "1570782312:5bea388b-3f95-4e1e-acb5-a34efdd0c480$",
        credential: "dhXxe8seVit6wblNAwPDSDhvqLM="
      }
    ]
  }
};

exports.start_200 = {
  id: "5bea388b-3f95-4e1e-acb5-a34efdd0c480"
};
