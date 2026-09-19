import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CookieConsent } from '@/components/storefront/CookieConsent';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0F5132',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Volvelo — Luxury Timepieces, Footwear, Atelier Apparel & Fine Jewellery | Europe',
    template: '%s | Volvelo',
  },
  description:
    'Discover handcrafted Swiss automatic chronographs, Blake-stitched Italian leather footwear, Milanese mulberry silk apparel, and 18K solid gold fine jewellery directly from verified European ateliers. Carbon-neutral express delivery.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com'),
  applicationName: 'Volvelo',
  authors: [{ name: 'Volvelo Design Studio', url: 'https://volvelo.com' }],
  generator: 'Next.js',
  keywords: [
    'luxury watches europe',
    'swiss automatic chronographs',
    'italian leather shoes',
    'tuscan loafers',
    '18k solid gold jewellery',
    'mulberry silk dresses',
    'cashmere knitwear',
    'european atelier marketplace',
    'volvelo',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Volvelo',
  publisher: 'Volvelo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [{ url: '/icon.png' }],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Volvelo — European Luxury Timepieces, Footwear, Silk Apparel & Fine Jewellery',
    description: 'Direct fulfillment from certified European ateliers. 30-day trial & carbon-neutral delivery.',
    siteName: 'Volvelo',
    locale: 'en_EU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volvelo — European Luxury Timepieces, Footwear, Silk Apparel & Fine Jewellery',
    description: 'Direct fulfillment from certified European ateliers. 30-day trial & carbon-neutral delivery.',
    creator: '@volvelo',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';

  const globalJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Volvelo',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description:
          'European luxury multi-tenant marketplace connecting discerning buyers with verified Swiss horologists, Tuscan cordwainers, Milanese tailors, and Parisian high jewellers.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer concierge',
          email: 'concierge@volvelo.com',
          availableLanguage: ['English', 'German', 'French', 'Italian'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Volvelo',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/shop?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased overflow-x-hidden`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#111111] overflow-x-hidden">
        <ClerkProvider>
          {children}
          <CartDrawer />
          <CookieConsent />
        </ClerkProvider>
      </body>
    </html>
  );
}
