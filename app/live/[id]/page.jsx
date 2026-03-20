import AppLanding from '@/components/AppLanding';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Live Streaming Ikan Hias – Bettazon.id`,
    description: `Saksikan live streaming ikan hias dan ikuti lelang live di Bettazon.id.`,
    metadataBase: new URL('https://bettazon.id'),
    openGraph: {
      title: `Live Streaming Ikan Hias – Bettazon.id`,
      description: `Lihat langsung ikan hias secara real-time dan ikuti lelang live yang seru!`,
      url: `https://bettazon.id/live/${id}`,
      siteName: 'Bettazon.id',
      locale: 'id_ID',
      type: 'website',
    },
  };
}

export default async function LiveLandingPage({ params }) {
  const { id } = await params;
  return <AppLanding type="live" id={id} />;
}
