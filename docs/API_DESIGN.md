# 🔌 API Design — Bettazon.id

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.bettazon.id/api`

## Conventions
- All responses: `{ status, statusCode, message: { id, en }, data }`
- Auth: `Authorization: Bearer <jwt>` header
- Pagination: `?page=1&limit=20` with response `{ data, pagination: { total, page, limit, totalPages } }`
- Errors: `throw new AppError("errors.not_found", 404)` — i18n dot-path or plain English string

---

## Auth Routes (`/api/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register (buyer default) |
| POST | `/auth/login` | — | Login |
| POST | `/auth/logout` | ✅ | Logout + blacklist token |
| POST | `/auth/refresh` | — | Refresh access token |
| POST | `/auth/verify-phone` | — | OTP phone verify |
| POST | `/auth/verify-email` | — | Email verify |
| POST | `/auth/forgot-password` | — | Send reset OTP |
| POST | `/auth/reset-password` | — | Reset with OTP |
| GET  | `/auth/profile` | ✅ | Get own profile |

## User Routes (`/api/users`)
| Method | Path | Auth | Description |
|---|---|---|---|
| PUT | `/users/profile` | ✅ | Update profile |
| PUT | `/users/change-password` | ✅ | Change password |
| GET | `/users/addresses` | ✅ | List addresses |
| POST | `/users/addresses` | ✅ | Add address |
| PUT | `/users/addresses/:id` | ✅ | Update address |
| DELETE | `/users/addresses/:id` | ✅ | Delete address |
| POST | `/users/upgrade-to-seller` | ✅ | Apply to become seller |
| PUT | `/users/store-setup` | ✅ (seller) | Setup store profile |

## Product Routes (`/api/products`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products` | optional | List products (filter: category, species, size, price, location, gender) |
| GET | `/products/:id` | optional | Product detail |
| POST | `/products` | ✅ seller | Create product listing |
| PUT | `/products/:id` | ✅ seller | Update product |
| DELETE | `/products/:id` | ✅ seller | Delete / archive |
| GET | `/products/my` | ✅ seller | My product listings |
| GET | `/products/search` | optional | Full-text search |

## Auction Routes (`/api/auctions`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/auctions` | optional | List active/upcoming auctions |
| GET | `/auctions/:id` | optional | Auction detail + bid history |
| POST | `/auctions` | ✅ seller | Create auction |
| PUT | `/auctions/:id` | ✅ seller | Update (before start) |
| DELETE | `/auctions/:id` | ✅ seller/admin | Cancel |
| POST | `/auctions/:id/bid` | ✅ buyer | Place bid |
| POST | `/auctions/:id/buy-now` | ✅ buyer | Buy now |

## Live Streaming Routes (`/api/live`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/live` | optional | List active/upcoming lives |
| GET | `/live/:id` | optional | Live detail |
| POST | `/live/start` | ✅ seller | Start live → returns host token |
| GET | `/live/:id/token` | ✅ | Get viewer token |
| POST | `/live/:id/end` | ✅ seller | End live |
| POST | `/live/:id/record` | ✅ seller | Start recording |
| GET | `/live/:id/replay` | optional | Replay URL |

## Cart Routes (`/api/cart`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/cart` | ✅ | Get my cart |
| POST | `/cart/add` | ✅ | Add item to cart |
| PUT | `/cart/:itemId` | ✅ | Update item quantity |
| DELETE | `/cart/:itemId` | ✅ | Remove item |
| DELETE | `/cart` | ✅ | Clear cart |

## Order Routes (`/api/orders`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/orders/checkout` | ✅ buyer | Checkout from cart / auction win |
| GET | `/orders` | ✅ | List my orders |
| GET | `/orders/:id` | ✅ | Order detail |
| POST | `/orders/:id/cancel` | ✅ buyer | Cancel order |
| POST | `/orders/:id/confirm-ship` | ✅ seller | Confirm shipped + upload resi |
| POST | `/orders/:id/confirm-receive` | ✅ buyer | Confirm received → escrow release |
| POST | `/orders/:id/dispute-doa` | ✅ buyer | Open DOA dispute |

## Shipping Routes (`/api/shipping`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/shipping/domestic` | optional | List domestic courier partners |
| GET | `/shipping/international` | optional | List transshipper partners |
| GET | `/shipping/international/:id` | optional | Transshipper detail |
| POST | `/shipping/calculate` | optional | Estimate shipping cost |
| GET | `/shipping/countries` | optional | Supported international countries |

## Store Routes (`/api/stores`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/stores/:sellerId` | optional | Seller store profile + products |
| GET | `/stores/:sellerId/reviews` | optional | Store reviews |

## Payment Routes (`/api/payments`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/webhook` | — | Midtrans webhook (secured by signature) |

## Wallet Routes (`/api/wallet`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/wallet` | ✅ | Get wallet balance |
| GET | `/wallet/transactions` | ✅ | Transaction history |
| POST | `/wallet/topup` | ✅ | Top up wallet |
| POST | `/wallet/withdraw` | ✅ seller | Withdrawal request |
