# 📡 Live Streaming Spec — Bettazon.id

## Technology: Self-Hosted LiveKit

- **LiveKit Server**: Docker self-hosted, dedicated VPS (4–8 vCPU / 8–16 GB RAM)
- **Flutter SDK**: `livekit_client: ^2.6.3` (official, verified)
- **Node.js SDK**: `livekit-server-sdk: ^2.15.0` (ESM native)
- **Recording**: LiveKit Egress → Digital Ocean Spaces (S3-compatible)

---

## Infrastructure Setup

```yaml
# docker-compose.livekit.yml (dedicated VPS: live.bettazon.id)
services:
  livekit:
    image: livekit/livekit-server
    network_mode: host           # required for WebRTC UDP performance
    command: --config /config/livekit.yaml
    volumes:
      - ./config:/config

  egress:                        # recording worker
    image: livekit/egress
    cap_add: [SYS_ADMIN]         # required by egress
    environment:
      EGRESS_CONFIG_FILE: /config/egress.yaml
    volumes:
      - ./config:/config

  caddy:                         # SSL termination
    image: caddy
    network_mode: host
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile

  redis:                         # required by LiveKit
    image: redis:alpine
    network_mode: host
```

**Required open ports:**
- `80`, `443` — HTTP/HTTPS
- `7881/TCP` — LiveKit WebSocket signaling
- `3478/UDP` — TURN server
- `50000–60000/UDP` — WebRTC media (RTP)

**Env vars** (in `bettazon-id-be/.env`):
```env
LIVEKIT_URL=wss://live.bettazon.id
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

---

## Backend Service: `liveStreamService.js`

```javascript
import { AccessToken, RoomServiceClient, EgressClient } from 'livekit-server-sdk';

class LiveStreamService {
  // Generate host token (seller - can publish)
  generateHostToken(sellerId, roomName) {
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: sellerId,
      ttl: '4h',
    });
    token.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
    return token.toJwt();
  }

  // Generate viewer token (buyer - watch only)
  generateViewerToken(userId, roomName) {
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: userId,
      ttl: '4h',
    });
    token.addGrant({ roomJoin: true, room: roomName, canPublish: false, canSubscribe: true });
    return token.toJwt();
  }

  // Start a live session
  async startLive(sellerId, { title, description, products }) {
    const roomName = `live_${sellerId}_${Date.now()}`;
    const roomClient = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    await roomClient.createRoom({ name: roomName, emptyTimeout: 300 });
    const liveStream = await LiveStream.create({ seller: sellerId, channel: roomName, title, description, products });
    const hostToken = this.generateHostToken(sellerId, roomName);
    return { liveStream, hostToken, roomName };
  }

  // End a live session
  async endLive(streamId, sellerId) {
    const stream = await LiveStream.findById(streamId);
    const roomClient = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    await roomClient.deleteRoom(stream.channel);
    stream.status = 'ended';
    stream.endedAt = new Date();
    await stream.save();
  }

  // Start recording (egress to DO Spaces)
  async startRecording(streamId) {
    const stream = await LiveStream.findById(streamId);
    const egressClient = new EgressClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    const egress = await egressClient.startRoomCompositeEgress(stream.channel, {
      file: {
        filepath: `recordings/${streamId}.mp4`,
        s3: {
          accessKey: DO_SPACES_KEY,
          secret: DO_SPACES_SECRET,
          bucket: DO_SPACES_BUCKET,
          endpoint: 'https://sgp1.digitaloceanspaces.com',
        }
      }
    });
    return egress;
  }
}
```

---

## MongoDB Schema: `LiveStream.js`

```javascript
{
  seller: { type: ObjectId, ref: 'User', required: true },
  channel: { type: String, required: true, unique: true }, // LiveKit room name

  title: { type: String, required: true, maxlength: 100 },
  description: String,
  thumbnail: { url: String, publicId: String },
  tags: [String],

  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended', 'cancelled'],
    default: 'scheduled'
  },

  viewerCount: { type: Number, default: 0 },
  peakViewers: { type: Number, default: 0 },
  totalViewers: { type: Number, default: 0 },  // unique viewers

  // Products promoted in this live
  featuredProducts: [{ type: ObjectId, ref: 'Product' }],

  // Auctions run during this live
  auctions: [{ type: ObjectId, ref: 'Auction' }],

  scheduledAt: Date,
  startedAt: Date,
  endedAt: Date,
  duration_seconds: Number,

  recordingUrl: String,  // DO Spaces URL after egress
  recordingStatus: {
    type: String,
    enum: ['none', 'recording', 'processing', 'ready', 'failed'],
    default: 'none'
  },
}
```

---

## API Endpoints

```
POST   /live/start              Seller starts live → returns LiveKit host token + room
GET    /live                    List active/upcoming lives (discovery page)
GET    /live/:id                Live detail + viewer count
GET    /live/:id/token          Get viewer token for a live room
POST   /live/:id/end            Seller ends live
POST   /live/:id/record         Start recording (egress)
GET    /live/:id/replay         Get recording URL
```

---

## Socket.IO Live Events

### Backend extends `src/config/websocket.js`:

```javascript
// Rooms: 'live_room_{streamId}' for each active stream

// Client → Server
socket.on('live:join',  ({ streamId }) => {})  // join room, increment viewer count
socket.on('live:leave', ({ streamId }) => {})  // leave room, decrement viewer count
socket.on('live:chat',  ({ streamId, message }) => {})  // send live chat (ephemeral)

// Server → Client (broadcast to room)
socket.to(room).emit('live:chat',         { userId, userName, message, timestamp })
socket.to(room).emit('live:viewer_count', { count })
socket.to(room).emit('live:start',        { streamId, sellerName, title })
socket.to(room).emit('live:end',          { streamId })

// NOTE: Auction events during live use the SAME Socket.IO server
// (auction_room_{auctionId} is a separate room joined when auction starts in live)
```

---

## Flutter Integration

### Viewer (Buyer Watch Live)
```dart
// lib/pages/live/live_room_page.dart
final room = Room();
final listener = room.createListener();

// Connect to LiveKit room
await room.connect(
  livekitUrl,       // wss://live.bettazon.id
  viewerToken,      // from GET /live/:id/token
  roomOptions: const RoomOptions(
    adaptiveStream: true,     // bandwidth adaptation
    dynacast: true,           // simulcast
  ),
);
```

### Host (Seller Go Live)
```dart
// lib/pages/live/host_live_page.dart
await room.connect(
  livekitUrl,
  hostToken,        // from POST /live/start
  roomOptions: const RoomOptions(
    adaptiveStream: true,
    dynacast: true,
    defaultCameraCaptureOptions: const CameraCaptureOptions(
      cameraPosition: CameraPosition.front,
      params: VideoParametersPresets.h720_169,
    ),
  ),
);

// Enable camera + mic
await room.localParticipant?.setMicrophoneEnabled(true);
await room.localParticipant?.setCameraEnabled(true);
```

---

## Live Chat Architecture

Live chat messages are **ephemeral** — NOT saved to MongoDB (unlike product/order chat).

- Transport: Socket.IO `live:chat` event in `live_room_{streamId}`
- Max message length: 200 chars
- Rate limit: 1 message per second per user
- Moderation: seller can mute/remove user from room via `live:mute` event

This keeps the MongoDB clean and avoids storing millions of fleeting messages.
