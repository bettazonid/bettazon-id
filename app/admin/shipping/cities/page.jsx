'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminFetch } from '@/lib/adminApi';

const LIMIT = 50;

export default function AdminShippingCitiesPage() {
  const [cities, setCities] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [warming, setWarming] = useState(false);
  const [warmMsg, setWarmMsg] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [rateLimit, setRateLimit] = useState(null); // { blocked, ttlSeconds }

  const load = useCallback(async (p = 1, q = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (q.trim()) params.set('search', q.trim());
      const data = await adminFetch(`/api/shipping/admin/cities?${params}`);
      setCities(data.data ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
      setPage(p);
      setRateLimit(data.rateLimit ?? null);
    } catch (e) {
      alert('Gagal memuat data kota: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1, search); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1, search);
  };

  const handleWarm = async (force = false) => {
    const msg = force
      ? 'Force warm: semua kota akan di-resolve ulang dari RajaOngkir API meskipun sudah ada di cache. Ini menghabiskan kuota ~80 hit. Lanjutkan?'
      : 'Warm-up kota: hanya kota yang belum ada di MongoDB yang akan di-resolve (konsumsi 1 hit per kota baru). Lanjutkan?';
    if (!confirm(msg)) return;
    setWarming(true);
    setWarmMsg(null);
    try {
      await adminFetch('/api/shipping/admin/warm-cities', {
        method: 'POST',
        body: JSON.stringify({ force }),
      });
      setWarmMsg('✅ Warm-up dimulai di background. Tunggu ~10 detik lalu refresh halaman ini untuk melihat hasilnya.');
      setTimeout(() => load(page, search), 12000);
    } catch (e) {
      setWarmMsg('❌ Gagal: ' + (e.message || e));
    } finally {
      setWarming(false);
    }
  };

  // ── Manual upsert form ──────────────────────────────────────
  const [upsertName, setUpsertName] = useState('');
  const [upsertId, setUpsertId] = useState('');
  const [upsertMsg, setUpsertMsg] = useState(null);
  const [upsertLoading, setUpsertLoading] = useState(false);

  const handleUpsert = async (e) => {
    e.preventDefault();
    if (!upsertName.trim() || !upsertId.trim()) return;
    setUpsertLoading(true);
    setUpsertMsg(null);
    try {
      const data = await adminFetch('/api/shipping/admin/cities', {
        method: 'POST',
        body: JSON.stringify({ name: upsertName.trim(), subdistrictId: upsertId.trim() }),
      });
      const norm = data.data?.norm ?? '';
      setUpsertMsg(`✅ Tersimpan → norm: "${norm}", subdistrictId: ${upsertId.trim()}`);
      setUpsertName('');
      setUpsertId('');
      load(page, search);
    } catch (e) {
      setUpsertMsg('❌ Gagal: ' + (e.message || e));
    } finally {
      setUpsertLoading(false);
    }
  };

  const handleDelete = async (city) => {
    if (!confirm(`Hapus cache untuk "${city.norm}" (ID: ${city.subdistrictId})? Kota ini akan di-resolve ulang dari API saat dibutuhkan.`)) return;
    setDeleting(city._id);
    try {
      await adminFetch(`/api/shipping/admin/cities/${city._id}`, { method: 'DELETE' });
      load(page, search);
    } catch (e) {
      alert('Gagal hapus: ' + (e.message || e));
    } finally {
      setDeleting(null);
    }
  };

  const scoreColor = (score) => {
    if (score >= 100) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold">Cache Kota (MongoDB L3)</h1>
          <p className="text-sm text-gray-500 mt-1">
            Mapping nama kota → subdistrict ID RajaOngkir yang tersimpan permanen di MongoDB.
            Kota di sini <strong>tidak</strong> akan pernah hit API lagi.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleWarm(false)}
            disabled={warming}
            className="px-3 py-2 bg-[#008080] text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50"
            title="Tambahkan ~80 kota umum yang belum ada (hemat kuota)"
          >
            {warming ? '⏳ Proses...' : '🔥 Warm-up Kota'}
          </button>
          <button
            onClick={() => handleWarm(true)}
            disabled={warming}
            className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50"
            title="Paksa resolve ulang semua ~80 kota dari API (habiskan ~80 kuota)"
          >
            {warming ? '⏳...' : '⚡ Force Re-warm'}
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-5">
        <p className="font-semibold mb-1">💡 Cara kerja cache 4 lapis</p>
        <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
          <li><strong>L1 in-process Map</strong> — tercepat, hilang saat restart server</li>
          <li><strong>L2 Redis</strong> (<code>ro:cityid:</code>) — cepat, hilang saat Redis flush/restart</li>
          <li><strong>L3 MongoDB</strong> (halaman ini) — permanen, tidak hilang meskipun Redis restart</li>
          <li><strong>L4 RajaOngkir API</strong> — hanya dipanggil jika kota benar-benar baru (belum pernah ada)</li>
        </ol>
        <p className="mt-2 text-xs text-blue-600">
          Klik <strong>Warm-up Kota</strong> sekali setelah deploy baru untuk mengisi L3 dengan ~80 kota umum Indonesia.
          Setelah itu, cek ongkir tidak akan pernah lagi menghabiskan kuota RajaOngkir untuk resolusi kota.
        </p>
      </div>
      {/* 429 Rate limit banner */}
      {rateLimit?.blocked && (
        <div className="mb-4 p-4 bg-red-50 border border-red-300 rounded-xl text-sm">
          <p className="font-semibold text-red-700 mb-1">⛔ Kuota RajaOngkir Habis Hari Ini</p>
          <p className="text-red-600">
            API RajaOngkir mengembalikan <code className="bg-red-100 px-1 rounded">429 Daily limit exceeded</code>.
            Semua resolusi kota baru di-blokir otomatis hingga kuota reset tengah malam WIB
            {rateLimit.ttlSeconds > 0 && (
              <> (~{Math.round(rateLimit.ttlSeconds / 60)} menit lagi)</>
            )}.
          </p>
          <p className="text-red-500 text-xs mt-2">
            Kota yang sudah ter-cache di MongoDB tetap berfungsi normal.
            Warm-up untuk sisa kota yang belum ter-cache dapat dilanjutkan besok.
          </p>
        </div>
      )}
      {warmMsg && (
        <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-800">
          {warmMsg}
          <button onClick={() => setWarmMsg(null)} className="ml-2 text-gray-400 hover:text-gray-600 text-xs">✕</button>
        </div>
      )}

      {/* Manual upsert form */}
      <div className="mb-5 p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
        <p className="text-sm font-semibold text-yellow-800 mb-2">
          🛠️ Tambah Kota Manual{' '}
          <span className="font-normal text-yellow-600">(gunakan saat kuota habis & ada kota yang belum ter-cache)</span>
        </p>
        <p className="text-xs text-yellow-700 mb-3">
          Temukan <code>subdistrictId</code> dari{' '}
          <a href="https://rajaongkir.komerce.id/" target="_blank" rel="noopener noreferrer"
             className="underline">dashboard RajaOngkir</a>{' '}
          atau dari log server saat kota berhasil di-resolve sebelumnya.
          Normalisasi nama dilakukan otomatis oleh server (strip "Kota", "Kabupaten", dll).
        </p>
        <form onSubmit={handleUpsert} className="flex flex-wrap gap-2 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-yellow-700 font-medium">Nama Kota (raw, misal "Kota Administrasi Jakarta Selatan")</label>
            <input
              type="text"
              value={upsertName}
              onChange={(e) => setUpsertName(e.target.value)}
              placeholder="Kota Administrasi Jakarta Selatan"
              className="border rounded-lg px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-yellow-700 font-medium">Subdistrict ID (angka)</label>
            <input
              type="text"
              value={upsertId}
              onChange={(e) => setUpsertId(e.target.value)}
              placeholder="mis. 22"
              className="border rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              pattern="\d+"
              required
            />
          </div>
          <button
            type="submit"
            disabled={upsertLoading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 disabled:opacity-50 self-end"
          >
            {upsertLoading ? '⏳...' : '💾 Simpan ke Cache'}
          </button>
        </form>
        {upsertMsg && (
          <div className={`mt-2 text-xs px-3 py-2 rounded-lg ${upsertMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {upsertMsg}
            <button onClick={() => setUpsertMsg(null)} className="ml-2 text-gray-400 hover:text-gray-600">✕</button>
          </div>
        )}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama kota (mis. surabaya)..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800"
        >
          Cari
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); load(1, ''); }}
            className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            Reset
          </button>
        )}
      </form>

      <p className="text-xs text-gray-400 mb-3">{total} kota tersimpan{search ? ` (filter: "${search}")` : ''}</p>

      {loading ? (
        <p className="text-gray-400 text-sm py-10 text-center">Memuat...</p>
      ) : cities.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl text-gray-400">
          <p className="text-4xl mb-3">🏙️</p>
          <p className="font-medium">Belum ada data kota</p>
          <p className="text-sm mt-1">Klik tombol <strong>Warm-up Kota</strong> untuk mengisi cache dengan kota-kota umum Indonesia.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Nama (norm)</th>
                  <th className="px-4 py-3 text-left">Label RajaOngkir</th>
                  <th className="px-4 py-3 text-center">Subdistrict ID</th>
                  <th className="px-4 py-3 text-center">Score</th>
                  <th className="px-4 py-3 text-center">Disimpan</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y bg-white">
                {cities.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{c.norm}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.label || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-3 text-center font-mono text-xs">{c.subdistrictId}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scoreColor(c.score ?? 0)}`}>
                        {c.score ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(c)}
                        disabled={deleting === c._id}
                        className="text-red-400 hover:text-red-600 text-xs disabled:opacity-50"
                        title="Hapus dari cache (akan di-resolve ulang dari API saat dibutuhkan)"
                      >
                        {deleting === c._id ? '...' : 'Hapus'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => load(page - 1, search)}
                disabled={page === 1}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-500">
                {page} / {pages}
              </span>
              <button
                onClick={() => load(page + 1, search)}
                disabled={page === pages}
                className="px-3 py-1.5 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
