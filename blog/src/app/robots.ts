import { MetadataRoute } from 'next';

/**
 * Generates robots.txt for search engines
 * Allows all user agents to crawl the site and references sitemap.xml
 * 
 * Validates: Requirements 8.5
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.sankumsek.bio';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
