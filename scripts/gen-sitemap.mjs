// 构建前生成 public/sitemap.xml（静态导出模式下 metadata 路由不可用）
// 域名通过 NEXT_PUBLIC_SITE_URL 环境变量配置，默认本地地址
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const pages = ['', '/services', '/booking', '/assessment', '/portfolio', '/about'];
const locales = ['zh', 'en'];
const today = new Date().toISOString().slice(0, 10);

const urls = pages
  .flatMap((p) =>
    locales.map(
      (l) => `  <url>
    <loc>${baseUrl}/${l}${p}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
${locales.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${baseUrl}/${alt}${p}/"/>`).join('\n')}
  </url>`
    )
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sitemap.xml');
writeFileSync(out, xml, 'utf8');
console.log(`sitemap.xml generated for ${baseUrl} (${pages.length * locales.length} urls)`);
