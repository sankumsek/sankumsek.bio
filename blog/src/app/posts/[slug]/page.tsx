import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity.client';
import { postBySlugQuery } from '@/lib/sanity.queries';
import { urlFor } from '@/lib/sanity.image';
import PortableText from '@/components/PortableText';
import type { Post } from '@/types';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for post pages
 * 
 * Creates SEO-optimized metadata including:
 * - Title and description meta tags
 * - Open Graph tags for social sharing
 * - Twitter Card tags
 * - Canonical URL
 * 
 * Validates Requirements 8.1, 8.4
 */
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch post data for metadata
    const post = await client.fetch<Post | null>(postBySlugQuery, { slug });

    // Return default metadata if post not found
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post could not be found.',
      };
    }

    // Use SEO fields if available, otherwise fall back to post data
    const metaTitle = post.seo?.metaTitle || post.title;
    const metaDescription = post.seo?.metaDescription || post.excerpt || `Read ${post.title} by ${post.author.name}`;
    
    // Generate canonical URL
    const canonicalUrl = `https://blog.sankumsek.bio/posts/${slug}`;
    
    // Generate Open Graph image URL
    const ogImage = post.mainImage 
      ? urlFor(post.mainImage).width(1200).height(630).url()
      : 'https://blog.sankumsek.bio/og-default.png'; // Fallback image

    return {
      title: metaTitle,
      description: metaDescription,
      
      // Canonical URL
      alternates: {
        canonical: canonicalUrl,
      },
      
      // Open Graph tags
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url: canonicalUrl,
        siteName: 'Sankumsek Blog',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.mainImage?.alt || post.title,
          },
        ],
        locale: 'en_US',
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
        ...(post.categories && post.categories.length > 0 && {
          tags: post.categories.map(cat => cat.title),
        }),
      },
      
      // Twitter Card tags
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [ogImage],
        creator: '@sankumsek', // Update with actual Twitter handle if available
      },
      
      // Additional metadata
      authors: [{ name: post.author.name }],
      keywords: post.categories?.map(cat => cat.title).join(', '),
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    
    // Return default metadata on error
    return {
      title: 'Blog Post',
      description: 'Read the latest blog post on Sankumsek Blog.',
    };
  }
}

/**
 * Individual Blog Post Page
 * 
 * Displays full blog post content with dynamic routing.
 * Uses ISR with 60-second revalidation and static generation for all published posts.
 * 
 * Validates Requirements 4.1, 6.1, 6.2, 10.1, 10.2
 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  try {
    // Fetch post by slug
    const post = await client.fetch<Post | null>(postBySlugQuery, { slug });

    // Return 404 if post not found
    if (!post) {
      notFound();
    }

    // Format publish date
    const publishDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Generate JSON-LD structured data for BlogPosting
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt || post.title,
      image: post.mainImage 
        ? urlFor(post.mainImage).width(1200).height(630).url()
        : undefined,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt, // Use publishedAt as dateModified if no separate field exists
      author: {
        '@type': 'Person',
        name: post.author.name,
        ...(post.author.image && {
          image: urlFor(post.author.image).width(80).height(80).url(),
        }),
      },
      publisher: {
        '@type': 'Organization',
        name: 'Sankumsek Blog',
        logo: {
          '@type': 'ImageObject',
          url: 'https://blog.sankumsek.bio/logo.png', // Update with actual logo URL
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://blog.sankumsek.bio/posts/${slug}`,
      },
      ...(post.categories && post.categories.length > 0 && {
        keywords: post.categories.map(cat => cat.title).join(', '),
      }),
    };

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <article className="min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Post Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              {/* Author */}
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span className="font-medium">{post.author.name}</span>
              </div>

              {/* Publish Date */}
              <time dateTime={post.publishedAt} className="text-sm">
                {publishDate}
              </time>

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category.slug.current}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {category.title}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Image */}
            {post.mainImage && (
              <figure className="mb-8">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(630).url()}
                  alt={post.mainImage.alt || post.title}
                  width={1200}
                  height={630}
                  className="rounded-lg w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
                {post.mainImage.alt && (
                  <figcaption className="text-center text-sm text-gray-600 mt-2">
                    {post.mainImage.alt}
                  </figcaption>
                )}
              </figure>
            )}
          </header>

          {/* Post Body */}
          <div className="prose prose-lg max-w-none">
            <PortableText content={post.body} />
          </div>

          {/* Author Bio */}
          {post.author.bio && post.author.bio.length > 0 && (
            <aside className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-start gap-4">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    About {post.author.name}
                  </h3>
                  <div className="text-gray-600">
                    <PortableText content={post.author.bio} />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </article>
      </>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    
    // Return 404 for any errors (including network issues)
    notFound();
  }
}

/**
 * Generate static params for all published posts
 * Enables static generation at build time
 */
export async function generateStaticParams() {
  try {
    // Fetch all published posts
    const posts = await client.fetch<Post[]>(
      `*[_type == "post" && !(_id in path("drafts.**"))] { slug }`
    );

    // Return array of slug params
    return posts.map((post) => ({
      slug: post.slug.current,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Enable ISR with 60-second revalidation
export const revalidate = 60;
