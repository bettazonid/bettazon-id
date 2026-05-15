'use client';
import { useState, useEffect, useCallback } from 'react';
import { adminFetch } from '@/lib/adminApi';

const TRANSPORT_MODES = ['darat', 'udara', 'laut'];
const EMPTY_FORM = { fromProvince: '', toProvince: '', transportMode: 'udara', requiresKarantina: true, karantinaFee: 0, notes: '' };

export default function AdminQuarantineRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/api/shipping/admin/quarantine-rules');
      setRules(data.data ?? []);
    } catch (e) {
      alert('Gagal memuat aturan: ' + (e.message || e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRules(); }, [loadRules]);

  const handleSubmit = async () => {
    if (!form.fromProvince || !form.toProvince || !form.transportMode) {
      alert('Provinsi asal, tujuan, dan moda wajib diisi');
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await adminFetch(`/api/shipping/admin/quarantine-rules/${editId}`, {
          method: 'PATCH',
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch('/api/shipping/admin/quarantine-rules', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      loadRules();
    } catch (e) {
      alert('Gagal menyimpan: ' + (e.message || e));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rule) => {
    setEditId(rule._id);
    setForm({
      fromProvince: rule.fromProvince,
      toProvince: rule.toProvince,
      transportMode: rule.transportMode,
      requiresKarantina: rule.requiresKarantina,
      karantinaFee: rule.karantinaFee ?? 0,
      notes: rule.notes ?? '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus aturan ini?')) return;
    try {
      await adminFetch(`/api/shipping/admin/quarantine-rules/${id}`, { method: 'DELETE' });
      loadRules();
    } catch (e) {
      alert('Gagal hapus: ' + (e.message || e));
    }
  };

  const toggleActive = async (rule) => {
    try {
      await adminFetch(`/api/shipping/admin/quarantine-rules/${rule._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !rule.isActive }),
      });
      loadRules();
    } catch (e) {
      alert('Gagal update: ' + (e.message || e));
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">Aturan Karantina Pengiriman</h1>
      <p className="text-sm text-gray-500 mb-6">
        Tentukan apakah dokumen karantina diperlukan untuk rute dan moda pengiriman tertentu.
        Gunakan <code className="bg-gray-100 px-1 rounded">*</code> sebagai wildcard (berlaku untuk semua provinsi).
        Aturan lebih spesifik (nama provinsi lengkap) mengalahkan wildcard.
      </p>

      {/* Form */}
      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
        <h2 className="font-semibold mb-3">{editId ? 'Edit Aturan' : 'Tambah Aturan Baru'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Provinsi Asal</label>
            <input
              placeholder="mis. Jawa Barat atau *"
              value={form.fromProvince}
              onChange={(e) => setForm((p) => ({ ...p, fromProvince: e.target.value }))}
              className="border rounded px-2 py-1.5 text-sm w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Provinsi Tujuan</label>
            <input
              placeholder="mis. Papua atau *"
              value={form.toProvince}
              onChange={(e) => setForm((p) => ({ ...p, toProvince: e.target.value }))}
              className="border rounded px-2 py-1.5 text-sm w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Moda Transport</label>
            <select
              value={form.transportMode}
              onChange={(e) => setForm((p) => ({ ...p, transportMode: e.target.value }))}
              className="border rounded px-2 py-1.5 text-sm w-full"
            >
              {TRANSPORT_MODES.map((m) => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 col-span-2 md:col-span-1">
            <label className="text-xs text-gray-500 block mb-1">Wajib Karantina?</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={form.requiresKarantina === true}
                  onChange={() => setForm((p) => ({ ...p, requiresKarantina: true }))}
                />
                Ya
              </label>
              <label className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="radio"
                  checked={form.requiresKarantina === false}
                  onChange={() => setForm((p) => ({ ...p, requiresKarantina: false }))}
                />
                Tidak
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Biaya Karantina (Rp)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={form.karantinaFee}
              onChange={(e) => setForm((p) => ({ ...p, karantinaFee: Number(e.target.value) }))}
              className="border rounded px-2 py-1.5 text-sm w-full"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="text-xs text-gray-500 block mb-1">Catatan (opsional)</label>
            <input
              placeholder="Info tambahan untuk seller/buyer"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="border rounded px-2 py-1.5 text-sm w-full"
            />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-1.5 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : editId ? 'Update' : 'Tambah Aturan'}
          </button>
          {editId && (
            <button
              onClick={() => { setForm(EMPTY_FORM); setEditId(null); }}
              className="px-4 py-1.5 border rounded text-sm hover:bg-gray-50"
            >
              Batal
            </button>
          )}
        </div>
      </div>

      {/* Rules table */}
      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Asal</th>
                <th className="px-4 py-3 text-left">Tujuan</th>
                <th className="px-4 py-3 text-left">Moda</th>
                <th className="px-4 py-3 text-left">Karantina</th>
                <th className="px-4 py-3 text-left">Biaya Karantina</th>
                <th className="px-4 py-3 text-left">Catatan</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-400 py-6">
                    Belum ada aturan. Default berlaku: udara = wajib karantina, darat = tidak wajib.
                  </td>
                </tr>
              )}
              {rules.map((r) => (
                <tr key={r._id} className={r.isActive ? '' : 'opacity-50'}>
                  <td className="px-4 py-3 font-mono text-xs">{r.fromProvince}</td>
                  <td className="px-4 py-3 font-mono text-xs">{r.toProvince}</td>
                  <td className="px-4 py-3 capitalize">{r.transportMode}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.requiresKarantina ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                      {r.requiresKarantina ? 'Wajib' : 'Tidak wajib'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium">{r.karantinaFee > 0 ? `Rp ${r.karantinaFee.toLocaleString('id-ID')}` : '-'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{r.notes || '-'}</td>
                  <td className="px-4 py-3">
                    <div
                      onClick={() => toggleActive(r)}
                      className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${r.isActive ? 'bg-teal-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${r.isActive ? 'translate-x-4' : ''}`} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => handleEdit(r)} className="text-teal-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(r._id)} className="text-red-400 hover:text-red-600 text-xs">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
