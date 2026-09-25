import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CookieConsent } from '@/components/storefront/CookieConsent';
import { ToastContainer } from '@/components/storefront/ToastContainer';
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
    default: 'Vovelo — Haute Couture Luxury Archive, Handbags, Footwear & Designer Collections',
    template: '%s | Vovelo',
  },
  description:
    'Explore curated 1:1 master quality designer handbags, Swiss automatic timepieces, handcrafted leather footwear, luxury sunglasses, and ready-to-wear archive. 7-day return guarantee & express delivery.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://vovelo.vercel.app'),
  applicationName: 'Vovelo',
  authors: [{ name: 'Vovelo Luxury Archive', url: 'https://vovelo.vercel.app' }],
  generator: 'Next.js',
  keywords: [
    '1:1 master quality luxury goods',
    'designer handbags archive',
    'swiss automatic watches',
    'luxury leather footwear sneakers',
    'designer sunglasses polarized',
    'italian leather belts wallets',
    'couture coats outerwear',
    'luxury designer collection',
    'high grade designer archive',
    'vovelo luxury',
    'express delivery 7 day returns',
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Vovelo',
  publisher: 'Vovelo',
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
    title: 'Vovelo — Haute Couture Luxury Archive, Handbags, Footwear & Designer Collections',
    description: 'Curated 1:1 master quality designer goods, Swiss automatic timepieces, leather footwear & accessories with 7-day returns.',
    siteName: 'Vovelo',
    url: 'https://vovelo.vercel.app',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Vovelo — Haute Couture Luxury Archive & Designer Collections',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vovelo — Haute Couture Luxury Archive & Designer Collections',
    description: 'Curated 1:1 master quality designer goods, timepieces, leather footwear & accessories with 7-day returns.',
    creator: '@vovelo',
    images: ['/twitter-image'],
  },
  verification: {
    google: 'mN0lZbTY9Qx2u-5eUla56TYzoqn6kQNwazO9sFDIMjM',
  },
};

import { getSiteSettings } from '@/lib/data-service';
import { AnalyticsScripts } from '@/components/storefront/AnalyticsScripts';
import { getBaseUrl, extractVerificationCode } from '@/lib/utils';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = getBaseUrl();
  const settings = await getSiteSettings();

  const googleVerify = extractVerificationCode(settings.googleSiteVerification);
  const bingVerify = extractVerificationCode(settings.bingSiteVerification);
  const pinterestVerify = extractVerificationCode(settings.pinterestVerification);

  const globalJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: settings.storeName || 'Vovelo',
        url: baseUrl,
        logo: settings.logoUrl || `${baseUrl}/logo.png`,
        description:
          settings.defaultMetaDescription ||
          'Haute couture luxury archive offering curated 1:1 master quality designer handbags, automatic chronographs, leather footwear, and accessories with express delivery and 7-day returns.',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer concierge',
          email: settings.contactEmail || 'concierge@vovelo.com',
          availableLanguage: ['English', 'German', 'French', 'Italian', 'Spanish'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: settings.storeName || 'Vovelo',
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
        {/* Verification Meta Tags */}
        <meta
          name="google-site-verification"
          content={googleVerify || 'mN0lZbTY9Qx2u-5eUla56TYzoqn6kQNwazO9sFDIMjM'}
        />
        {bingVerify && (
          <meta name="msvalidate.01" content={bingVerify} />
        )}
        {pinterestVerify && (
          <meta name="p:domain_verify" content={pinterestVerify} />
        )}
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
          <ToastContainer />
          <AnalyticsScripts settings={settings} />
        </ClerkProvider>
      </body>
    </html>
  );
}
