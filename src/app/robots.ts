import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://volvelo.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/portal/',
          '/api/',
          '/checkout',
          '/cart',
          '/order-confirmation/',
          '/sign-in',
          '/sign-up',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Applebot-Extended', 'Google-Extended'],
        allow: ['/', '/shop', '/product/', '/category/', '/brand/', '/blog/'],
        disallow: ['/admin/', '/portal/', '/api/', '/checkout', '/cart'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
