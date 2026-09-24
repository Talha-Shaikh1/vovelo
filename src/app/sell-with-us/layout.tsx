import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell with Us — Apply as a Certified Luxury Merchant | Volvelo',
  description:
    'Partner with Volvelo. Direct 85% maker net payouts, zero listing fees, and instant access to discerning European buyers across 27 nations.',
  alternates: {
    canonical: 'https://volvelo.com/sell-with-us',
  },
  openGraph: {
    title: 'Sell with Us — Join the Volvelo European Maker Network',
    description: 'Direct 85% maker payouts, zero monthly software fees, and shared European search authority.',
    url: 'https://volvelo.com/sell-with-us',
  },
};

export default function SellWithUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
