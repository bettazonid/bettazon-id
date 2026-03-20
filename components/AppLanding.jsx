'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=id.bettazon.app';
const APP_STORE_URL = 'https://apps.apple.com/app/bettazon/id0000000000'; // TODO: ganti dengan ID App Store sebenarnya

const typeConfig = {
  product: {
    icon: '🐠',
    label: 'Produk Ikan Hias',
    desc: 'Lihat detail produk, harga, dan informasi penjual di aplikasi Bettazon.',
  },
  auction: {
    icon: '🔨',
    label: 'Lelang Ikan Hias',
    desc: 'Ikuti lelang, pasang penawaran, dan menangkan ikan hias impian kamu.',
  },
  live: {
    icon: '📡',
    label: 'Live Streaming',
    desc: 'Saksikan ikan hias secara langsung dan ikuti lelang live di Bettazon.',
  },
};

export default function AppLanding({ type, id }) {
  const [status, setStatus] = useState('redirecting'); // 'redirecting' | 'download'
  const config = typeConfig[type] ?? typeConfig.product;

  useEffect(() => {
    // Try opening the app via custom URL scheme
    const schemeUrl = `bettazon://${type}/${id}`;
    window.location.href = schemeUrl;

    // If still on this page after 2.5s, the app is probably not installed
    const timer = setTimeout(() => setStatus('download'), 2500);
    return () => clearTimeout(timer);
  }, [type, id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white rounded-2xl shadow-md px-6 py-3 mb-4">
          <span className="text-3xl">{config.icon}</span>
          <span className="text-2xl font-bold text-[#FE735C]">Bettazon</span>
          <span className="text-2xl font-bold text-[#008080]">.id</span>
        </div>
        <p className="text-gray-500 text-sm">Marketplace Ikan Hias #1 Indonesia</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
        {status === 'redirecting' ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-[#FE735C]/30 border-t-[#FE735C] rounded-full animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Membuka Bettazon...
            </h2>
            <p className="text-gray-500 text-sm">
              Mengarahkan ke aplikasi Bettazon.
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">{config.icon}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {config.label}
            </h2>
            <p className="text-gray-500 text-sm mb-6">{config.desc}</p>

            {/* Open in app button (if app somehow installed but scheme didn't trigger) */}
            <a
              href={`bettazon://${type}/${id}`}
              className="block w-full bg-[#008080] hover:bg-[#006666] text-white font-semibold py-3 rounded-xl mb-3 transition-colors"
            >
              🔗 Buka di Aplikasi
            </a>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">belum punya aplikasi?</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Play Store */}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl mb-3 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
              </svg>
              Download di Play Store
            </a>

            {/* App Store */}
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full border-2 border-gray-200 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download di App Store
            </a>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Bettazon.id · Marketplace Ikan Hias Indonesia
      </p>
    </div>
  );
}
