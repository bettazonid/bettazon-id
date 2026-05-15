'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminFetch } from '@/lib/adminApi';

const EMPTY_COURIER = { name: '', code: '', description: '', logoUrl: '', isActive: true };

export default function AdminShippingCouriersPage() {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [newService, setNewService] = useState({});
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourier, setNewCourier] = useState(EMPTY_COURIER);
  const [createError, setCreateError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  const syncCouriers = async (forceRefresh = false) => {
    const msg = forceRefresh
      ? 'Force refresh sync akan mengabaikan cache Redis dan langsung hit RajaOngkir API (gunakan quota harian). Lanjutkan?'
      : 'Sync kurir dari RajaOngkir? Data yang sudah di-cache (7 hari) tidak akan hit API ulang. Kurir baru akan nonaktif dan perlu diaktifkan manual.';
    if (!confirm(msg)) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const data = await adminFetch('/api/shipping/admin/couriers/sync', {
        method: 'POST',
        body: JSON.stringify({ forceRefresh }),
        headers: { 'Content-Type': 'application/json' },
      });
      setSyncResult(data);
      loadCouriers();
    } catch (e) {
      alert('Gagal sync kurir: ' + (e.message || e));
    } finally {
      setSyncing(false);
    }
  };

  const loadCouriers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/api/shipping/admin/couriers');
      setCouriers(data.data ?? []);
    } catch (e) {
      alert('Gagal memuat kurir: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCouriers(); }, [loadCouriers]);

  const toggleCourier = async (id) => {
    try {
      await adminFetch(`/api/shipping/admin/couriers/${id}/toggle`, { method: 'PATCH' });
      loadCouriers();
    } catch (e) {
      alert('Gagal toggle kurir: ' + (e.message || e));
    }
  };

  const deleteCourier = async (id, name) => {
    if (!confirm(`Hapus kurir "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await adminFetch(`/api/shipping/admin/couriers/${id}`, { method: 'DELETE' });
      loadCouriers();
    } catch (e) {
      alert('Gagal hapus kurir: ' + (e.message || e));
    }
  };

  const toggleService = async (courierId, serviceId, currentActive) => {
    try {
      await adminFetch(`/api/shipping/admin/couriers/${courierId}/services/${serviceId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentActive }),
      });
      loadCouriers();
    } catch (e) {
      alert('Gagal toggle layanan: ' + (e.message || e));
    }
  };

  const deleteService = async (courierId, serviceId) => {
    if (!confirm('Hapus layanan ini?')) return;
    try {
      await adminFetch(`/api/shipping/admin/couriers/${courierId}/services/${serviceId}`, { method: 'DELETE' });
      loadCouriers();
    } catch (e) {
      alert('Gagal hapus layanan: ' + (e.message || e));
    }
  };

  const addService = async (courierId) => {
    const s = newService[courierId] ?? {};
    if (!s.serviceCode || !s.serviceName) {
      alert('Kode dan nama layanan wajib diisi');
      return;
    }
    setSaving(true);
    try {
      await adminFetch(`/api/shipping/admin/couriers/${courierId}/services`, {
        method: 'POST',
        body: JSON.stringify({
          serviceCode: s.serviceCode,
          serviceName: s.serviceName,
          isLiveFishApproved: s.isLiveFishApproved ?? false,
          maxDuration_hours: s.maxDuration_hours ? Number(s.maxDuration_hours) : undefined,
        }),
      });
      setNewService((prev) => ({ ...prev, [courierId]: {} }));
      loadCouriers();
    } catch (e) {
      alert('Gagal tambah layanan: ' + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  const createCourier = async () => {
    if (!newCourier.name.trim() || !newCourier.code.trim()) {
      setCreateError('Nama dan kode kurir wajib diisi.');
      return;
    }
    setSaving(true);
    setCreateError('');
    try {
      await adminFetch('/api/shipping/admin/couriers', {
        method: 'POST',
        body: JSON.stringify({
          name: newCourier.name.trim(),
          code: newCourier.code.trim().toUpperCase(),
          description: newCourier.description.trim() || undefined,
          logoUrl: newCourier.logoUrl.trim() || undefined,
          isActive: newCourier.isActive,
        }),
      });
      setNewCourier(EMPTY_COURIER);
      setShowCreateForm(false);
      loadCouriers();
    } catch (e) {
      setCreateError(e.message || 'Gagal membuat kurir');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manajemen Kurir Pengiriman</h1>
        <div className="flex gap-2">
          <button
            onClick={() => syncCouriers(false)}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
            title="Sync dari cache Redis (hemat kuota RajaOngkir)"
          >
            {syncing ? '⏳ Sync...' : '🔄 Sync (cached)'}
          </button>
          <button
            onClick={() => syncCouriers(true)}
            disabled={syncing}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1"
            title="Force refresh: bypass cache, langsung hit RajaOngkir API (gunakan kuota harian)"
          >
            {syncing ? '⏳...' : '⚡ Force Refresh'}
          </button>
          <button
            onClick={() => { setShowCreateForm(!showCreateForm); setCreateError(''); }}
            className="px-4 py-2 bg-[#008080] text-white rounded-lg text-sm hover:bg-teal-700"
          >
            {showCreateForm ? 'Batal' : '+ Tambah Kurir'}
          </button>
        </div>
      </div>

      {/* Sync result banner */}
      {syncResult && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
          <p className="font-semibold text-blue-800 mb-1">✅ {syncResult.message?.id}</p>
          <div className="flex gap-4 text-blue-700">
            <span>✔ Berhasil: {syncResult.data?.synced?.length ?? 0}</span>
            <span>✗ Gagal: {syncResult.data?.failed?.length ?? 0}</span>
          </div>
          {syncResult.data?.failed?.length > 0 && (
            <p className="text-red-500 mt-1 text-xs">
              Kurir gagal: {syncResult.data.failed.map(f => f.code).join(', ')}
            </p>
          )}
          <p className="text-xs text-blue-500 mt-1">Kurir baru ditambahkan dalam kondisi nonaktif. Aktifkan layanan yang ingin dimunculkan di checkout.</p>
          <button onClick={() => setSyncResult(null)} className="text-xs text-gray-400 mt-1 hover:text-gray-600">Tutup</button>
        </div>
      )}

      {/* Form tambah kurir baru */}
      {showCreateForm && (
        <div className="bg-white border border-teal-200 rounded-xl p-5 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Kurir Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Nama Kurir <span className="text-red-500">*</span></label>
              <input
                placeholder="mis. JNE"
                value={newCourier.name}
                onChange={(e) => setNewCourier((p) => ({ ...p, name: e.target.value }))}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Kode Unik <span className="text-red-500">*</span></label>
              <input
                placeholder="mis. JNE (huruf besar, unik)"
                value={newCourier.code}
                onChange={(e) => setNewCourier((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">Deskripsi</label>
              <input
                placeholder="mis. Pengiriman ekspres terpercaya"
                value={newCourier.description}
                onChange={(e) => setNewCourier((p) => ({ ...p, description: e.target.value }))}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 block mb-1">URL Logo (opsional)</label>
              <input
                placeholder="https://..."
                value={newCourier.logoUrl}
                onChange={(e) => setNewCourier((p) => ({ ...p, logoUrl: e.target.value }))}
                className="border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="courierActive"
                checked={newCourier.isActive}
                onChange={(e) => setNewCourier((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 accent-teal-600"
              />
              <label htmlFor="courierActive" className="text-sm text-gray-700">Aktif saat dibuat</label>
            </div>
          </div>
          {createError && <p className="text-red-500 text-xs mt-2">{createError}</p>}
          <div className="mt-4 flex gap-2">
            <button
              onClick={createCourier}
              disabled={saving}
              className="px-5 py-2 bg-[#008080] text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Kurir'}
            </button>
            <button
              onClick={() => { setShowCreateForm(false); setNewCourier(EMPTY_COURIER); setCreateError(''); }}
              className="px-5 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : couriers.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl text-gray-400">
          <p className="text-4xl mb-3">🚚</p>
          <p className="font-medium">Belum ada data kurir</p>
          <p className="text-sm mt-1">Klik tombol &ldquo;+ Tambah Kurir&rdquo; untuk menambahkan kurir pertama.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {couriers.map((c) => (
            <div key={c._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              {/* Courier header */}
              <div className="flex items-center gap-3 p-4">
                {c.logo?.url && (
                  <img src={c.logo.url} alt={c.name} className="w-10 h-10 object-contain rounded" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-400 uppercase">{c.code}</p>
                    {c.courier?.rajaongkirCode && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                        RO: {c.courier.rajaongkirCode}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {(c.services ?? []).filter(s => s.isActive).length}/{(c.services ?? []).length} layanan aktif
                    </span>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm text-gray-600">{c.isActive ? 'Aktif' : 'Nonaktif'}</span>
                  <div
                    onClick={() => toggleCourier(c._id)}
                    className={`w-11 h-6 rounded-full relative transition-colors ${c.isActive ? 'bg-teal-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${c.isActive ? 'translate-x-5' : ''}`} />
                  </div>
                </label>
                <button
                  onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                  className="text-sm text-teal-600 hover:underline ml-2"
                >
                  {expandedId === c._id ? 'Tutup' : 'Kelola Layanan'}
                </button>
                <button
                  onClick={() => deleteCourier(c._id, c.name)}
                  className="text-red-400 hover:text-red-600 text-xs ml-1"
                  title="Hapus kurir"
                >
                  ✕
                </button>
              </div>

              {/* Service levels */}
              {expandedId === c._id && (
                <div className="border-t px-4 pb-4 bg-gray-50">
                  <p className="text-sm font-medium text-gray-600 mt-3 mb-2">Layanan Tersedia</p>
                  {c.services?.length === 0 && (
                    <p className="text-xs text-gray-400 mb-2">Belum ada layanan. Tambahkan di bawah.</p>
                  )}
                  <div className="space-y-2 mb-4">
                    {(c.services ?? []).map((svc) => (
                      <div key={svc._id} className="flex items-center gap-3 bg-white rounded border px-3 py-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{svc.serviceName}</p>
                          <p className="text-xs text-gray-400 uppercase">{svc.serviceCode}{svc.isLiveFishApproved ? ' · 🐟 Live Fish' : ''}</p>
                        </div>
                        <div
                          onClick={() => toggleService(c._id, svc._id, svc.isActive)}
                          className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${svc.isActive ? 'bg-teal-600' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${svc.isActive ? 'translate-x-4' : ''}`} />
                        </div>
                        <button
                          onClick={() => deleteService(c._id, svc._id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add service form */}
                  <p className="text-sm font-medium text-gray-600 mb-2">Tambah Layanan</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Kode (mis. YES)"
                      value={newService[c._id]?.serviceCode ?? ''}
                      onChange={(e) => setNewService((p) => ({ ...p, [c._id]: { ...p[c._id], serviceCode: e.target.value } }))}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      placeholder="Nama (mis. Yakin Esok Sampai)"
                      value={newService[c._id]?.serviceName ?? ''}
                      onChange={(e) => setNewService((p) => ({ ...p, [c._id]: { ...p[c._id], serviceName: e.target.value } }))}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Maks. durasi (jam)"
                      value={newService[c._id]?.maxDuration_hours ?? ''}
                      onChange={(e) => setNewService((p) => ({ ...p, [c._id]: { ...p[c._id], maxDuration_hours: e.target.value } }))}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newService[c._id]?.isLiveFishApproved ?? false}
                        onChange={(e) => setNewService((p) => ({ ...p, [c._id]: { ...p[c._id], isLiveFishApproved: e.target.checked } }))}
                      />
                      Live Fish Approved
                    </label>
                  </div>
                  <button
                    onClick={() => addService(c._id)}
                    disabled={saving}
                    className="mt-2 px-4 py-1.5 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Tambah'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
