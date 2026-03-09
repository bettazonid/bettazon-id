# Auth Module — Development Plan & Progress

> Dokumen ini dibuat: 1 Maret 2026  
> Tujuan: track semua pengembangan modul Auth (Registrasi, Login, Reset Password) agar tidak ada fitur yang terlewat.

---

## Ringkasan Status

| Fase | Deskripsi | Status |
|------|-----------|--------|
| **A** | Registrasi via Email & No HP + OTP SMS | 🔴 done |
| **B** | Login via No HP | 🔴 done |
| **C** | Login via Google / Facebook (OAuth) | 🔴 Belum |
| **D** | Reset Password via OTP (Email + HP) | 🔴 Belum |
| **X** | Bug Fixes & Polishing (ongoing) | 🟡 Jalan |

---

## A — Registrasi via Email & No HP + OTP SMS

### Target UX
1. User buka halaman Register
2. Isi: **Nama**, **Email (opsional)** atau **No HP (wajib)**, **Password**, **Confirm Password**
3. Tap "Daftar" → jika pakai HP: masuk halaman **Verifikasi OTP**
4. Masukkan 6 digit OTP yang dikirim via SMS
5. Berhasil → langsung login & masuk ke Home

### Backend (sudah ada ✅)
- `POST /api/auth/register` — support `phone` wajib, `email` opsional
- `POST /api/auth/generate-phone-otp` — kirim OTP ke HP
- `POST /api/auth/verify-otp` — verifikasi OTP HP
- `POST /api/auth/resend-otp` — resend OTP
- `authService.generateAndSendOTP()` — SMS via `notificationService.sendSMS()`

### Flutter (belum ❌)

| # | Item | File | Status |
|---|------|------|--------|
| A1 | Method `AuthAPI.register(name, email?, phone, password, role)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| A2 | Method `AuthAPI.sendPhoneOtp(userId, phone, purpose)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| A3 | Method `AuthAPI.verifyPhoneOtp(userId, otp, purpose)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| A4 | Method `AuthAPI.resendOtp(phone, purpose)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| A5 | `AuthProvider.register()` | `lib/provider/auth_provider.dart` | ❌ |
| A6 | `AuthProvider.sendOtp()` + `verifyOtp()` | `lib/provider/auth_provider.dart` | ❌ |
| A7 | Form registrasi: tambah field **No HP**, wire tombol ke `AuthProvider.register()` | `lib/pages/auth_register/register_page.dart` | ❌ |
| A8 | Halaman baru: **OtpVerificationPage** (6 digit, countdown 60s, tombol resend) | `lib/pages/auth_otp/otp_verification_page.dart` | ❌ |
| A9 | Daftar route `OtpVerificationPage` di router | `lib/router.dart` | ❌ |
| A10 | Daftar & injeksi (tidak perlu karena pakai `AuthProvider` yang sudah ada) | `lib/injection.dart` | — |

---

## B — Login via No HP

### Target UX
1. Di halaman Login: **toggle** "Email / No HP"
2. Jika pilih No HP: field email diganti field HP
3. Tap "Login" → kirim `phone` + `password` ke BE

### Backend (sudah ada ✅)
- `POST /api/auth/login` — sudah support field `phone` selain `email`

### Flutter (belum ❌)

| # | Item | File | Status |
|---|------|------|--------|
| B1 | `AuthAPI.login()` kirim `phone` field saat mode HP | `lib/data/api/auth/auth_api.dart` | ❌ (sekarang hanya `email`) |
| B2 | Toggle mode Email/HP di UI | `lib/pages/auth_login/login_page.dart` | ❌ |
| B3 | Keyboard type `phone` + validasi no HP | `lib/pages/auth_login/login_page.dart` | ❌ |

---

## C — Login via Google / Facebook (OAuth)

### Target UX
- Tap ikon Google/Facebook → OAuth flow → auto login/register → masuk Home

### Backend (belum ❌)
- Tidak ada route OAuth (`/auth/google`, `/auth/facebook`)
- Tidak ada `authService.loginWithGoogle()` / `loginWithFacebook()`

| # | Item | File | Status |
|---|------|------|--------|
| C1 | Tambah `POST /api/auth/google` (verifikasi Google ID token, buat/cari user) | `src/routes/authRoutes.js` + `src/controllers/authController.js` | ❌ |
| C2 | `authService.loginWithGoogle(idToken)` | `src/services/authService.js` | ❌ |
| C3 | Tambah `POST /api/auth/facebook` | BE | ❌ |
| C4 | `authService.loginWithFacebook(accessToken)` | BE | ❌ |
| C5 | Package `google_sign_in` di Flutter | `pubspec.yaml` | ❌ |
| C6 | Package `flutter_facebook_auth` di Flutter | `pubspec.yaml` | ❌ |
| C7 | `AuthAPI.loginWithGoogle(idToken)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| C8 | `AuthAPI.loginWithFacebook(accessToken)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| C9 | Wire tombol Google di login/register page | `login_page.dart` + `register_page.dart` | ❌ |
| C10 | Wire tombol Facebook di login/register page | `login_page.dart` + `register_page.dart` | ❌ |
| C11 | Setup Google OAuth credentials (Firebase / Google Cloud Console) | Config eksternal | ❌ |
| C12 | Setup Facebook App ID + OAuth (Meta Developer Portal) | Config eksternal | ❌ |

---

## D — Reset Password via OTP

### Target UX
1. Di halaman "Lupa Password": input **Email atau No HP**
2. Tap "Kirim Kode" → OTP dikirim via SMS (jika HP) atau Email (jika email)
3. Masuk halaman **OTP Input** (pakai ulang `OtpVerificationPage`)
4. Masukkan OTP → masuk halaman **Set Password Baru**
5. Input password baru + konfirmasi → berhasil → redirect ke Login

### Backend

| # | Item | File | Status |
|---|------|------|--------|
| D1 | `POST /api/auth/forgot-password` — support identifier (email atau phone) | `authRoutes.js` | ✅ Ada |
| D2 | Kirim OTP via SMS jika phone-only user | `authService.forgotPassword()` line 863 | ✅ Ada |
| D3 | `POST /api/auth/reset-password-otp` — reset via OTP | `authRoutes.js` | ✅ Ada |
| **D4** | **Kirim OTP via Email** (sekarang email user dapat link, bukan OTP) | `authService.js` line 895 | ❌ Perlu diubah |

> **D4 detail**: Saat user input email di forgot password, BE saat ini mengirim link reset (token). Perlu diubah agar kirim **OTP 6 digit via email** supaya konsisten dengan flow OTP.

### Flutter (belum ❌)

| # | Item | File | Status |
|---|------|------|--------|
| D5 | `AuthAPI.forgotPassword(identifier)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| D6 | `AuthAPI.resetPasswordWithOtp(phone/email, otp, newPassword)` | `lib/data/api/auth/auth_api.dart` | ❌ |
| D7 | `AuthProvider.forgotPassword()` + `resetPasswordWithOtp()` | `lib/provider/auth_provider.dart` | ❌ |
| D8 | Wire `ForgotPasswordPage`: toggle email/HP, call `AuthProvider.forgotPassword()` | `lib/pages/auth_forgot_password/forgot_password_page.dart` | ❌ (tombol kosong) |
| D9 | Pakai ulang `OtpVerificationPage` untuk reset password (kirim purpose: `password_reset`) | `lib/pages/auth_otp/otp_verification_page.dart` | ❌ (page belum ada) |
| D10 | Halaman baru: **ResetPasswordPage** (input password baru + konfirmasi) | `lib/pages/auth_reset_password/reset_password_page.dart` | ❌ |
| D11 | Daftar route di router | `lib/router.dart` | ❌ |

---

## X — Bug Fixes & Polishing (Ongoing)

| # | Item | Status | Tanggal |
|---|------|--------|---------|
| X1 | Explore page — icon profile tidak bisa diklik | ✅ Fixed | 1 Mar 2026 |
| X2 | Logout — `_user = User()` (non-null) seharusnya `null` | ✅ Fixed | 1 Mar 2026 |
| X3 | `checkPermission` middleware — tidak ada role `buyer`/`seller` → 403 di semua endpoint protected | ✅ Fixed | 1 Mar 2026 |
| X4 | `getIndividualOrders` query `{ seller }` saja → buyer tidak lihat pesanan | ✅ Fixed | 1 Mar 2026 |
| X5 | `getIndividualOrders` populate `assignedCollector` → StrictPopulateError | ✅ Fixed | 1 Mar 2026 |
| X6 | `buyProduct` response `product.imageUrl` → undefined (harusnya `images[0].url`) | ✅ Fixed | 1 Mar 2026 |
| X7 | `OrderModel.fromJson` tidak parse `images[0].url` dari list endpoint | ✅ Fixed | 1 Mar 2026 |
| X8 | `paymentController` populate `collector` → StrictPopulateError | ✅ Fixed | 1 Mar 2026 |
| X9 | Order status check `pending_payment` harusnya `pending` | ✅ Fixed | 1 Mar 2026 |
| X10 | `Order.create` tanpa `pickupLocation.coordinates` → validasi gagal | ✅ Fixed | 1 Mar 2026 |

---

## Timeline Rekomendasi

```
Maret 2026
─────────────────────────────────────────────────────────────
Week 1 (1-7 Mar)
  [A] Registrasi HP + OTP
      A1–A6  : auth_api.dart + auth_provider.dart
      A7     : register_page.dart update
      A8–A9  : OtpVerificationPage + router

  [B] Login HP
      B1–B3  : login_page.dart toggle + auth_api update

  [D] Reset Password OTP
      D4     : BE — email forgot password → OTP (bukan link)
      D5–D8  : forgot_password_page.dart + auth_api + provider
      D9–D11 : ResetPasswordPage + router

Week 2 (8-14 Mar)
  [C] Social Login
      C1–C4  : BE routes + service (Google dulu, Facebook opsional)
      C5–C6  : Flutter packages setup
      C7–C10 : auth_api + login/register page wiring
      C11    : Firebase/Google credentials setup
```

---

## Catatan Teknis

### OtpVerificationPage — Rencana API Params
```dart
class OtpVerificationArgs {
  final String identifier; // phone atau email
  final String purpose;    // 'phone_verification' | 'password_reset'
  final String? userId;    // dibutuhkan untuk phone_verification
  final String? name;      // untuk ditampilkan di UI
}
```

### Flow OTP Reset Password (Email)
Setelah D4 diimplementasi, flow email menjadi:
```
forgotPassword(email)
  → generate 6-digit OTP
  → simpan ke Redis: password_reset_otp:{email}
  → kirim via Resend email
  → return { maskedEmail }

resetPasswordWithOTP(email, otp, newPassword)
  → cek OTP dari Redis
  → update password
  → hapus OTP dari Redis
```

### Endpoint Mapping Flutter → BE

| Flutter method | Endpoint BE |
|---|---|
| `AuthAPI.register()` | `POST /api/auth/register` |
| `AuthAPI.sendPhoneOtp()` | `POST /api/auth/generate-phone-otp` |
| `AuthAPI.verifyPhoneOtp()` | `POST /api/auth/verify-otp` |
| `AuthAPI.resendOtp()` | `POST /api/auth/resend-otp` |
| `AuthAPI.login(email/phone)` | `POST /api/auth/login` |
| `AuthAPI.forgotPassword()` | `POST /api/auth/forgot-password` |
| `AuthAPI.resetPasswordWithOtp()` | `POST /api/auth/reset-password-otp` |
| `AuthAPI.loginWithGoogle()` | `POST /api/auth/google` *(belum ada)* |
| `AuthAPI.loginWithFacebook()` | `POST /api/auth/facebook` *(belum ada)* |
