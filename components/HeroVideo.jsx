'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const IS_CLOSED_TESTING = false
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=id.bettazon.app'

const videos = [
  { src: '/assets/video/koi.mp4', label: 'Koi', tagline: 'Koi Premium' },
  { src: '/assets/video/arwana.mp4', label: 'Arwana', tagline: 'Arwana Super Red' },
  { src: '/assets/video/betta.mp4', label: 'Betta', tagline: 'Cupang Halfmoon' },
  { src: '/assets/video/guppy.mp4', label: 'Guppy', tagline: 'Guppy Fancy' },
  { src: '/assets/video/golden-fish.mp4', label: 'Golden Fish', tagline: 'Mas Koki' },
]

export default function HeroVideo() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = (idx) => {
    if (idx === currentIdx) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrentIdx(idx)
      setTransitioning(false)
    }, 400)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % videos.length)
        setTransitioning(false)
      }, 400)
    }, 9000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-950 pt-16">

      {/* ── MOBILE: blurred fill + centered small video ── */}
      {/* Blur layer as background fill */}
      <div className="sm:hidden absolute inset-0">
        <video
          key={videos[currentIdx].src + '_bg'}
          src={videos[currentIdx].src}
          autoPlay muted loop playsInline aria-hidden
          className="w-full h-full object-cover scale-125 blur-3xl opacity-40"
        />
      </div>
      {/* Centered video tile */}
      <video
        key={videos[currentIdx].src + '_mobile'}
        src={videos[currentIdx].src}
        autoPlay muted loop playsInline
        className={`sm:hidden absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%]  shadow-2xl shadow-black/50 transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* ── DESKTOP: full cover background ── */}
      <video
        key={videos[currentIdx].src}
        src={videos[currentIdx].src}
        autoPlay muted loop playsInline
        className={`hidden sm:block absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* ── Cinematic overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-gray-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-transparent to-gray-950/50" />

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl xl:max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white/90 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FE735C] animate-pulse inline-block" />
            Marketplace Ikan Hias #1 di Indonesia
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.0] mb-6 tracking-tight">
            Jual &amp; Beli
            <br />
            <span className="bg-gradient-to-r from-[#FE735C] via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Ikan Hias
            </span>
            <br />
            <span className="text-teal-400">Kapan Saja,</span>
            <br />
            Dimana Saja
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 max-w-lg">
            Temukan ribuan jenis ikan hias dari penjual terpercaya — atau{' '}
            <strong className="text-white">buka tokomu sendiri</strong> dan jangkau
            pembeli di seluruh Indonesia. Lelang live, streaming langsung, pengiriman aman.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-14">
            <a
              href={IS_CLOSED_TESTING ? '#unduh' : PLAY_STORE_URL}
              target={IS_CLOSED_TESTING ? undefined : '_blank'}
              rel={IS_CLOSED_TESTING ? undefined : 'noopener noreferrer'}
              className="inline-flex items-center gap-3 bg-[#FE735C] hover:bg-[#100300] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-[#FE735C]/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
              </svg>
              {IS_CLOSED_TESTING ? '🚧 Segera Hadir' : 'Download di Play Store'}
            </a>
            <Link
              href="/seller"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/25 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Mulai Berjualan
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-3">
            {[
              { number: '0%', label: 'Fee Founding Seller', href: '/seller' },
              { number: 'Gratis', label: 'Daftar & Jualan', href: '/seller' },
              { number: 'Escrow', label: 'Setiap Transaksi' },
              { number: 'Live', label: 'Streaming & Lelang' },
            ].map(({ number, label, href }) => {
              const inner = (
                <>
                  <div className="text-xl font-black text-white">{number}</div>
                  <div className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{label}</div>
                </>
              )
              return href ? (
                <Link
                  key={label}
                  href={href}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/15 rounded-xl px-5 py-3 text-center transition-all hover:-translate-y-0.5 hover:border-white/30"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={label}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-5 py-3 text-center"
                >
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom bar: dots + fish label + scroll ── */}
      <div className="absolute bottom-6 inset-x-0 z-10 flex items-center justify-between px-6 sm:px-10">

        {/* Scroll hint */}
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 9l-7 7-7-7" />
          </svg>
          <span className="hidden sm:inline">Scroll</span>
        </div>

        {/* Dot switcher */}
        <div className="flex items-center gap-2">
          {videos.map((v, i) => (
            <button
              key={v.src}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIdx
                  ? 'w-6 h-2 bg-[#FE735C]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Tampilkan ${v.label}`}
            />
          ))}
        </div>

        {/* Current fish label */}
        <div className="bg-black/40 backdrop-blur-md border border-white/15 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full">
          🐟 {videos[currentIdx].tagline}
        </div>
      </div>
    </section>
  )
}
