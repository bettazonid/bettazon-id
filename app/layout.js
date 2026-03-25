import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bettazon.id – Marketplace Ikan Hias Indonesia',
  description:
    'Platform jual beli ikan hias terlengkap di Indonesia. Temukan ikan hias impian kamu, ikuti lelang live, dan nikmati pengiriman aman ke seluruh Indonesia.',
  keywords:
    'ikan hias, jual ikan hias, beli ikan hias, marketplace ikan hias, lelang ikan hias, live streaming ikan hias, betta fish',
  metadataBase: new URL('https://bettazon.id'),
  openGraph: {
    title: 'Bettazon.id – Marketplace Ikan Hias Indonesia',
    description:
      'Platform jual beli ikan hias terlengkap di Indonesia. Live streaming, lelang real-time, pengiriman aman.',
    url: 'https://bettazon.id',
    siteName: 'Bettazon.id',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  )
}
