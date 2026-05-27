'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('t');

  const [state, setState] = useState('loading'); // loading | valid | invalid | error
  const [data, setData] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!token) {
      setState('invalid');
      setReason('Token tidak ditemukan di URL');
      return;
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function verify() {
    setState('loading');
    try {
      const res = await fetch(`/api/shipment-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const json = await res.json();

      if (res.ok && json.data?.valid) {
        setState('valid');
        setData(json.data);
      } else {
        setState('invalid');
        const msg = json.message;
        setReason(
          typeof msg === 'object'
            ? msg.id || msg.en || 'Token tidak valid'
            : msg || 'Token tidak valid'
        );
      }
    } catch {
      setState('error');
      setReason('Gagal terhubung ke server');
    }
  }

  async function handleMarkUsed() {
    if (!token) return;
    const branch = prompt('Masukkan kode cabang JNE:') || '';
    const officer = prompt('Nama petugas:') || '';
    try {
      const res = await fetch(`/api/shipment-use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, branchUsed: branch, verifiedBy: officer }),
      });
      const json = await res.json();
      if (res.ok) {
        setState('used');
      } else {
        const msg = json.message;
        alert(typeof msg === 'object' ? msg.id || msg.en : msg);
      }
    } catch {
      alert('Gagal menandai shipment. Cek koneksi internet.');
    }
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm">Memverifikasi shipment...</p>
        </div>
      </div>
    );
  }

  if (state === 'valid' && data) {
    const expiry = data.expiresAt ? new Date(data.expiresAt).toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }) : '-';

    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
          {/* Header */}
          <div className="bg-teal-600 px-6 py-5 text-white text-center">
            <div className="text-4xl mb-2">✅</div>
            <h1 className="text-xl font-bold tracking-wide">VALID SHIPMENT</h1>
            <p className="text-teal-100 text-sm mt-1">Bettazon × JNE Authorization</p>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <Row label="Order" value={data.orderNumber || '-'} bold />
            <Row label="Seller" value={data.sellerName || '-'} />
            <Row label="Status" value="SIAP KIRIM" valueClass="text-green-600 font-semibold" />
            <Row label="Berlaku hingga" value={expiry} />
            {data.shipmentData?.shippingService && (
              <Row label="Layanan" value={data.shipmentData.shippingService} />
            )}
            {data.shipmentData?.receiverName && (
              <Row label="Penerima" value={data.shipmentData.receiverName} />
            )}
          </div>

          {/* Action */}
          <div className="px-6 pb-6">
            <button
              onClick={handleMarkUsed}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-teal-700 active:scale-95 transition-all"
            >
              ✓ Tandai Sudah Digunakan
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Tekan tombol di atas setelah paket diterima dan diproses
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'used') {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
          <div className="bg-blue-600 px-6 py-5 text-white text-center">
            <div className="text-4xl mb-2">📦</div>
            <h1 className="text-xl font-bold">SHIPMENT DIPROSES</h1>
            <p className="text-blue-100 text-sm mt-1">Berhasil ditandai sebagai digunakan</p>
          </div>
          <div className="px-6 py-6 text-center text-gray-600 text-sm">
            Paket telah diterima dan siap untuk diproses pengiriman.
          </div>
        </div>
      </div>
    );
  }

  // invalid / error — tiap kasus punya tampilan sendiri
  const rawReason = (reason || '').toLowerCase();
  const isExpired   = rawReason.includes('kadaluarsa') || rawReason.includes('expired');
  const isUsed      = rawReason.includes('sudah digunakan') || rawReason.includes('already used') || rawReason.includes('label already used');
  const isCancelled = rawReason.includes('dibatalkan') || rawReason.includes('cancelled') || rawReason.includes('revoked');
  const isConnErr   = state === 'error';

  // ── Sudah digunakan ───────────────────────────────────────────────────────
  if (isUsed) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
          <div className="bg-sky-500 px-6 py-6 text-white text-center">
            <div className="text-5xl mb-3">📬</div>
            <h1 className="text-xl font-bold">Label Sudah Dipakai</h1>
            <p className="text-sky-100 text-sm mt-1">Bettazon × JNE Authorization</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <p className="text-gray-700 text-sm text-center leading-relaxed">
              Label pengiriman ini <span className="font-semibold text-sky-600">sudah di-scan</span> dan digunakan sebelumnya.
              Masing-masing label hanya berlaku untuk <span className="font-semibold">satu kali pickup</span>.
            </p>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-xs text-sky-700 space-y-1.5">
              <p>📱 Seller sudah menerima notifikasi pengambilan paket.</p>
              <p>📦 Pastikan paket sudah tercatat di sistem JNE.</p>
              <p>❓ Ada pertanyaan? Hubungi Bettazon melalui aplikasi.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Kadaluarsa ────────────────────────────────────────────────────────────
  if (isExpired) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
          <div className="bg-amber-500 px-6 py-6 text-white text-center">
            <div className="text-5xl mb-3">⏰</div>
            <h1 className="text-xl font-bold">Label Kadaluarsa</h1>
            <p className="text-amber-100 text-sm mt-1">Bettazon × JNE Authorization</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <p className="text-gray-700 text-sm text-center leading-relaxed">
              Masa berlaku label ini sudah <span className="font-semibold text-amber-600">habis</span>.
              Label pengiriman JNE hanya valid selama <span className="font-semibold">24 jam</span> sejak digenerate.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 space-y-1.5">
              <p>📱 Minta seller untuk generate ulang label di aplikasi Bettazon.</p>
              <p>⏱️ Pastikan pickup dilakukan sebelum label kadaluarsa.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Dibatalkan ────────────────────────────────────────────────────────────
  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
          <div className="bg-gray-500 px-6 py-6 text-white text-center">
            <div className="text-5xl mb-3">🚫</div>
            <h1 className="text-xl font-bold">Label Dibatalkan</h1>
            <p className="text-gray-200 text-sm mt-1">Bettazon × JNE Authorization</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <p className="text-gray-700 text-sm text-center leading-relaxed">
              Label ini telah <span className="font-semibold text-gray-600">dicabut atau dibatalkan</span> oleh admin Bettazon.
              Paket tidak dapat diproses dengan label ini.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 space-y-1.5">
              <p>📞 Hubungi Bettazon untuk informasi lebih lanjut.</p>
              <p>📦 Jangan proses paket dengan label ini.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Koneksi / token tidak valid ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
        <div className="bg-red-500 px-6 py-6 text-white text-center">
          <div className="text-5xl mb-3">{isConnErr ? '📡' : '⚠️'}</div>
          <h1 className="text-xl font-bold">{isConnErr ? 'Gagal Terhubung' : 'Label Tidak Dikenal'}</h1>
          <p className="text-red-100 text-sm mt-1">Bettazon × JNE Authorization</p>
        </div>
        <div className="px-6 py-5 space-y-3">
          <p className="text-gray-700 text-sm text-center leading-relaxed">
            {isConnErr
              ? 'Tidak dapat terhubung ke server Bettazon. Pastikan koneksi internet aktif lalu coba lagi.'
              : 'QR code ini tidak terdaftar atau formatnya tidak sesuai. Jangan proses paket dengan label ini.'}
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-xs text-red-700 space-y-1.5">
            {isConnErr ? (
              <>
                <p>🌐 Periksa koneksi internet perangkat Anda.</p>
                <p>🔄 Coba scan ulang beberapa saat lagi.</p>
              </>
            ) : (
              <>
                <p>🔍 Pastikan kamera scan QR dengan jelas dan penuh.</p>
                <p>📞 Hubungi Bettazon jika QR berasal dari seller resmi.</p>
              </>
            )}
          </div>
          {isConnErr && (
            <button
              onClick={verify}
              className="w-full mt-1 bg-red-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-red-600 active:scale-95 transition-all"
            >
              🔄 Coba Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, valueClass }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-gray-400 text-xs uppercase tracking-wide shrink-0">{label}</span>
      <span className={`text-right text-sm ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${valueClass || ''}`}>
        {value}
      </span>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
