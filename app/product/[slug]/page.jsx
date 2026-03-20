import AppLanding from '@/components/AppLanding';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `Produk Ikan Hias – Bettazon.id`,
    description: `Lihat produk ikan hias di Bettazon.id – marketplace ikan hias #1 Indonesia.`,
    metadataBase: new URL('https://bettazon.id'),
    openGraph: {
      title: `Produk Ikan Hias – Bettazon.id`,
      description: `Lihat detail produk, pasang ke keranjang, dan beli ikan hias terpercaya.`,
      url: `https://bettazon.id/product/${slug}`,
      siteName: 'Bettazon.id',
      locale: 'id_ID',
      type: 'website',
    },
  };
}

export default async function ProductLandingPage({ params }) {
  const { slug } = await params;
  return <AppLanding type="product" id={slug} />;
}
