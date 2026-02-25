# Bettazon.id – Project Documentation Repo

## What This Repo Is
This is the **documentation and planning repo** for the Bettazon.id project.
It contains no runnable code. All architecture decisions, specs, schemas, and feature plans live here.

## Other Repos
| Repo | Description | Language |
|---|---|---|
| `bettazon-id-be` | Backend REST API | Node.js 20, Express, MongoDB |
| `bettazon-id-app` | Mobile app | Flutter (Provider, go_router) |

## Docs Index
| File | Purpose |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, service boundaries |
| [docs/TECH_STACK.md](docs/TECH_STACK.md) | All technology choices with rationale |
| [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | MongoDB models, reuse status from setorin |
| [docs/API_DESIGN.md](docs/API_DESIGN.md) | REST endpoint conventions, all route groups |
| [docs/FEATURES.md](docs/FEATURES.md) | Feature checklist by phase |
| [docs/AUCTION_SPEC.md](docs/AUCTION_SPEC.md) | Page auction + live auction state machines |
| [docs/LIVE_STREAMING_SPEC.md](docs/LIVE_STREAMING_SPEC.md) | LiveKit setup, token gen, socket events |
| [docs/SHIPPING_SPEC.md](docs/SHIPPING_SPEC.md) | Domestic couriers + international transshipper flow |
| [docs/FISH_CATEGORIES.md](docs/FISH_CATEGORIES.md) | Fish category taxonomy |
| [docs/TIMELINE.md](docs/TIMELINE.md) | Development phases and milestones |

## Project Context
Bettazon.id is an ornamental fish (ikan hias) marketplace for Indonesia. The backend was cloned from `setorin-id-be` (waste management platform) and is being adapted.

Key differentiators:
- **Live streaming with live auction** (LiveKit, self-hosted)
- **Page auction** (timed, with auto-extend)
- **International shipping** via transshipper partners in Jakarta
- Two user roles: `buyer` and `seller` (no RT/RW/collector from setorin)

When writing docs or making architecture decisions, refer to these source-of-truth files rather than inferring from code.
