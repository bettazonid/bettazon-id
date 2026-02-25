# 🛠️ Tech Stack — Bettazon.id

## Backend (`bettazon-id-be`)

| Technology | Version | Purpose | Source |
|---|---|---|---|
| Node.js | 20.x | Runtime (ESM only) | Base |
| Express.js | ^4.18 | HTTP framework | Base |
| MongoDB + Mongoose | ^8.0 | Primary database | Base |
| Redis | ^4.6 | Cache, token blacklist, rate limiting | Base |
| Socket.IO | ^4.7 | Real-time chat + auction events | Base |
| **LiveKit Server SDK** | **^2.15** | **Live stream token gen + room management** | **NEW** |
| Midtrans Snap | ^1.4 | Payment gateway (IDR escrow) | Base |
| Digital Ocean Spaces | AWS SDK v3 | Image/file storage (S3-compatible) | Base |
| Firebase Admin | ^13.5 | FCM push notifications | Base |
| Resend | ^6.1 | Transactional email | Base |
| Custom OTP Service | — | SMS OTP via Android device gateway | Base |
| Digiflazz | — | Digital rewards (pulsa/data top-up) | Base |
| Winston | ^3.11 | Structured logging | Base |
| node-cron | ^4.2 | Scheduled jobs | Base |
| PM2 | — | Process manager (ecosystem.config.cjs) | Base |

## Flutter App (`bettazon-id-app`)

| Technology | Version | Purpose | Source |
|---|---|---|---|
| Flutter | ≥3.4.3 | Mobile framework (iOS + Android) | Existing |
| provider | ^6.0 | State management (ChangeNotifier) | Existing |
| go_router | ^10.0 | Navigation & routing | Existing |
| http | ^0.13 | HTTP client | Existing |
| get_it | ^7.2 | Dependency injection | Existing |
| firebase_messaging | ^15 | FCM push notifications | Existing |
| flutter_local_notifications | ^15 | Local notification display | Existing |
| video_player | ^2.9 | Video playback | Existing |
| sqflite | ^2.2 | Local SQLite storage | Existing |
| **livekit_client** | **^2.6** | **Live streaming SDK (self-hosted LiveKit)** | **NEW** |
| socket_io_client | TBD | Auction real-time events | **NEW** |

## Infrastructure

| Service | Spec | Purpose |
|---|---|---|
| VPS (App Server) | 2–4 vCPU / 4 GB RAM | Backend API + MongoDB + Redis |
| **VPS (LiveKit Server)** | **4–8 vCPU / 8–16 GB RAM** | **Self-hosted LiveKit (streaming SFU)** |
| Digital Ocean Spaces | S3-compatible object storage | Images, recordings |
| GitHub Actions | CI/CD | Auto-deploy on push to main |

## Why LiveKit (Self-Hosted) over Agora

| | LiveKit Self-Hosted | Agora |
|---|---|---|
| Cost at scale | Fixed VPS cost | Per-minute charges ($) |
| Flutter SDK | ✅ Official, verified (`livekit_client`) | ✅ Official |
| Node.js SDK | ✅ ESM native (`livekit-server-sdk`) | ✅ |
| Docker setup | ✅ One-command generator | N/A (cloud) |
| Recording | ✅ Egress → DO Spaces (S3) | ✅ Cloud |
| 100 viewers spec | 4 vCPU / 8 GB | Managed cloud |
| Data sovereignty | ✅ Full control | Agora servers |
| Latency | ~100–200ms (regional) | ~100ms (global CDN) |

**Decision: LiveKit** — self-hosted aligns with cost control strategy, full data sovereignty, and integrates with existing DO Spaces setup.

## Why Provider over BLoC

The existing `bettazon-id-app` (from teman) uses `provider`. Rebuilding with BLoC would mean rewriting all existing pages. We continue with `provider` for consistency and developer velocity. BLoC can be evaluated for v2.
