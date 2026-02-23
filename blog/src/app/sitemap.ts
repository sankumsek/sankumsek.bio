import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity.client';
import { Post } from '@/types';

/**
 * Generates sitemap.xml for search engines
 * Includes blog homepage and all published posts
 * 
 * Validates: Requirements 8.2
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.sankumsek.bio';

  // Fetch all published posts for sitemap
  const sitemapQuery = `
    *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      slug,
      publishedAt,
      _updatedAt
    }
  `;

  const posts = await client.fetch<Array<{
    slug: { current: string };
    publishedAt: string;
    _updatedAt: string;
  }>>(sitemapQuery);

  // Generate sitemap entries for all posts
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug.current}`,
    lastModified: new Date(post._updatedAt || post.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Include homepage
  const homepageEntry: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  return [...homepageEntry, ...postEntries];
}
