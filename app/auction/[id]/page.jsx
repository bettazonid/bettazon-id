import AppLanding from '@/components/AppLanding';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Lelang Ikan Hias – Bettazon.id`,
    description: `Ikuti lelang ikan hias di Bettazon.id. Pasang penawaran dan menangkan ikan hias impianmu!`,
    metadataBase: new URL('https://bettazon.id'),
    openGraph: {
      title: `Lelang Ikan Hias – Bettazon.id`,
      description: `Lelang real-time dengan countdown timer. Pasang penawaran sekarang!`,
      url: `https://bettazon.id/auction/${id}`,
      siteName: 'Bettazon.id',
      locale: 'id_ID',
      type: 'website',
    },
  };
}

export default async function AuctionLandingPage({ params }) {
  const { id } = await params;
  return <AppLanding type="auction" id={id} />;
}
