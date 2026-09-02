import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/zh/admin', '/en/admin', '/zh/login', '/en/login'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
