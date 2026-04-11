# International Payment Implementation (Midtrans Hybrid)

## Overview
Hybrid payment: iPaymu untuk buyer domestik, Midtrans Snap untuk buyer internasional (kartu Visa/Mastercard global).  
Semua transaksi tetap dalam IDR — buyer internasional dikenakan konversi oleh bank penerbit kartu mereka.

## Keputusan Arsitektur
| Topik | Keputusan |
|---|---|
| Currency | IDR only. Kurs USD/EUR hanya display hint di UI |
| Fee gateway | Buyer-borne. iPaymu: Rp 4.000 flat. Midtrans intl: 3% + Rp 2.000 |
| Trigger | User pilih manual (Lokal vs Internasional). Auto pre-select dari profil (hint saja) |
| Wallet intl | Tidak — direct payment saja via Midtrans |
| Auction intl | Ya — post-bid payment via Midtrans Snap |
| Bundle checkout intl | Tidak dalam scope ini (future phase) |

---

## Checklist Implementasi

### Backend (`bettazon-id-be`)

- [x] **BE-1** `src/constants/feeConstants.js` — Tambah konstanta Midtrans fee + update `calcGatewayFee(amount, gateway)`
- [x] **BE-2** `src/models/Order.js` — Tambah `payment.gateway` field (`ipaymu` | `midtrans`) + `payment.midtransToken`
- [x] **BE-3** `src/services/midtransService.js` — Tambah `createInternationalTransaction(order, user)` (restrict ke `credit_card` only)
- [x] **BE-4** `src/controllers/paymentController.js` — Tambah `createInternationalPayment()` + `handleMidtransNotification()`
- [x] **BE-5** `src/routes/paymentRoutes.js` — Tambah route `POST /create-intl` + `POST /notify-midtrans`

### Flutter (`bettazon-id-app`)

- [x] **FL-1** `lib/data/api/payment/payment_api.dart` — Tambah `createInternationalPayment(orderId, token)`
- [x] **FL-2** `lib/provider/payment_provider.dart` — Tambah `createInternationalPaymentForOrder()` + `startInternationalCheckout()`
- [x] **FL-3** `lib/pages/checkout/checkout_page.dart` — Payment method selector (Lokal vs Internasional) + fee update dinamis
- [x] **FL-4** `lib/pages/order/order_detail_page.dart` — Payment retry support international option
- [x] **FL-5** `lib/pages/order/order_page.dart` — Payment retry support international option

---

## Alur Teknis

### Single-seller checkout — Internasional
```
User pilih "Internasional" → Checkout
  → POST /orders/buy         (order dibuat, gateway belum ditentukan)
  → POST /payments/create-intl  (midtransService.createInternationalTransaction)
  → Response: { snapToken, redirectUrl }
  → Flutter buka WebView (Midtrans Snap URL)
  → User bayar dengan Visa/Mastercard
  → Midtrans POST /payments/notify-midtrans (webhook)
  → Order settled, escrow deposit created, notify seller
```

### Post-order / auction win — Internasional
```
Order detail page → Tap "Bayar Internasional"
  → POST /payments/create-intl
  → WebView Midtrans Snap
  → Webhook → settled
```

---

## API Routes Baru
| Method | Path | Desc |
|---|---|---|
| POST | `/api/payments/create-intl` | Buat Midtrans Snap untuk order single |
| POST | `/api/payments/notify-midtrans` | Webhook dari Midtrans |

---

## Fee Calculation
```
iPaymu (domestik):
  gatewayFee = Rp 4.000 flat

Midtrans (internasional):
  gatewayFee = (productPrice + platformFee + shippingCost) × 3% + Rp 2.000
```

---

## Env Variables Midtrans (sudah ada di .env)
```
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SERVER_KEY=...
MIDTRANS_CLIENT_KEY=...
```

---

## Out of Scope (Future)
- Bundle checkout internasional (multi-seller single Midtrans transaction)
- Currency display USD/EUR real-time (exchange rate API)
- Wallet top-up via kartu internasional (pakai existing Midtrans topup flow)
