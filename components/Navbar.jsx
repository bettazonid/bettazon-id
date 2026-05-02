'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#unduh', label: 'Unduh App' },
  { href: '/seller', label: 'Jadi Seller', isRouterLink: true },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/assets/images/logo.png"
              alt="Bettazon.id"
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(({ href, label, isRouterLink }) =>
              isRouterLink ? (
                <Link
                  key={label}
                  href={href}
                  className={`transition-colors font-medium text-sm ${
                    label === 'Jadi Seller'
                      ? 'text-[#008080] hover:text-[#006666] font-semibold'
                      : 'text-gray-600 hover:text-[#FE735C]'
                  }`}
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="text-gray-600 hover:text-[#FE735C] transition-colors font-medium text-sm"
                >
                  {label}
                </a>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <a
            href="#unduh"
            className="hidden md:inline-flex items-center gap-2 bg-[#FE735C] hover:bg-[#e5634d] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all hover:shadow-lg hover:shadow-[#FE735C]/25"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.29.16.64.19.96.09l11.84-6.52-2.59-2.59-10.21 9.02zM.19 1.73C.07 2.01 0 2.33 0 2.68v18.64c0 .35.07.67.19.95l.1.09 10.45-10.45v-.25L.29 1.64l-.1.09zM19.37 10.43l-2.89-1.59-2.91 2.91 2.91 2.91 2.9-1.6c.83-.46.83-1.21-.01-1.63zM4.14.24L16 6.76l-2.59 2.59L3.18.24A.87.87 0 014.14.24z" />
            </svg>
            Download Gratis
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ href, label, isRouterLink }) =>
              isRouterLink ? (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-xl font-medium transition-colors ${
                    label === 'Jadi Seller'
                      ? 'text-[#008080] hover:text-[#006666] hover:bg-teal-50 font-semibold'
                      : 'text-gray-700 hover:text-[#FE735C] hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-gray-700 hover:text-[#FE735C] hover:bg-gray-50 rounded-xl font-medium transition-colors"
                >
                  {label}
                </a>
              )
            )}
            <div className="pt-2">
              <a
                href="#unduh"
                onClick={() => setIsOpen(false)}
                className="block bg-[#FE735C] hover:bg-[#e5634d] text-white px-5 py-3 rounded-xl font-bold text-center transition-colors"
              >
                Download Gratis
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
