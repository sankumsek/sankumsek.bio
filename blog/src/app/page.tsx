import { client } from '@/lib/sanity.client';
import { postsQuery, postCountQuery } from '@/lib/sanity.queries';
import PostList from '@/components/PostList';
import type { Post } from '@/types';

const POSTS_PER_PAGE = 10;

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

/**
 * Blog Homepage
 * 
 * Fetches and displays a paginated list of blog posts from Sanity CMS.
 * Uses ISR with 60-second revalidation for optimal performance.
 * 
 * Validates Requirements 5.1, 5.2, 5.3, 5.5, 10.2
 */
export default async function HomePage({ searchParams }: HomePageProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  
  // Parse page number from query params, default to 1
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  
  // Calculate pagination range
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  try {
    // Fetch posts and total count in parallel
    const [posts, totalCount] = await Promise.all([
      client.fetch<Post[]>(postsQuery, { start, end }),
      client.fetch<number>(postCountQuery),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

    return (
      <main className="min-h-screen p-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
          <p className="text-gray-600">
            {totalCount === 0
              ? 'No posts yet'
              : `${totalCount} ${totalCount === 1 ? 'post' : 'posts'}`}
          </p>
        </div>

        <PostList posts={posts} currentPage={currentPage} totalPages={totalPages} />
      </main>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    return (
      <main className="min-h-screen p-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 text-lg">
            Unable to load blog posts. Please try again later.
          </p>
        </div>
      </main>
    );
  }
}

// Enable ISR with 60-second revalidation
export const revalidate = 60;
