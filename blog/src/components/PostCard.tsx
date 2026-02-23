import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

/**
 * PostCard component displays a preview card for a blog post
 * Shows featured image, title, excerpt, date, author, and categories
 */
export default function PostCard({ post }: PostCardProps) {
  // Truncate excerpt to 150 characters
  const truncateExcerpt = (text: string | undefined, maxLength: number = 150): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  // Format date to human-readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const postUrl = `/posts/${post.slug.current}`;
  const truncatedExcerpt = truncateExcerpt(post.excerpt);
  const formattedDate = formatDate(post.publishedAt);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={postUrl} className="block">
        {/* Featured Image */}
        {post.mainImage && (
          <div className="relative w-full h-48 bg-gray-200">
            <Image
              src={urlFor(post.mainImage).width(800).height(400).url()}
              alt={post.mainImage.alt || post.title}
              fill
              className="object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((category) => (
                <span
                  key={category.slug.current}
                  className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {truncatedExcerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">
              {truncatedExcerpt}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-500">
            {/* Author */}
            <div className="flex items-center">
              {post.author.image && (
                <div className="relative w-8 h-8 mr-2">
                  <Image
                    src={urlFor(post.author.image).width(32).height(32).url()}
                    alt={post.author.name}
                    fill
                    className="rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <span className="font-medium text-gray-700">{post.author.name}</span>
            </div>

            {/* Date */}
            <span className="mx-2">•</span>
            <time dateTime={post.publishedAt}>{formattedDate}</time>
          </div>
        </div>
      </Link>
    </article>
  );
}
