import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

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
        allow: ['/', '/shop', '/product/', '/category/', '/brand/'],
        disallow: ['/admin/', '/portal/', '/api/', '/checkout', '/cart'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
