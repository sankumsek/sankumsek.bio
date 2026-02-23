'use client';

import React from 'react';
import PostCard from './PostCard';
import type { Post } from '@/types';

interface PostListProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

/**
 * PostList component displays a paginated list of blog posts
 * - Displays 10 posts per page
 * - Shows pagination controls when there are multiple pages
 * - Handles empty state when no posts exist
 * - Posts are expected to be pre-sorted by publishedAt desc
 * 
 * Validates Requirements 5.1, 5.3, 5.5
 */
export default function PostList({ posts, currentPage, totalPages }: PostListProps) {
  // Handle empty state
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No blog posts available yet.</p>
      </div>
    );
  }

  // Generate page numbers for pagination
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page with neighbors, and last page
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (start > 2) pages.push(-1); // Ellipsis marker
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) pages.push(-1); // Ellipsis marker
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full">
      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center space-x-2" aria-label="Pagination">
          {/* Previous Button */}
          <a
            href={currentPage > 1 ? `?page=${currentPage - 1}` : '#'}
            className={`px-4 py-2 rounded-md ${
              currentPage > 1
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors`}
            aria-disabled={currentPage <= 1}
            onClick={(e) => currentPage <= 1 && e.preventDefault()}
          >
            Previous
          </a>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === -1) {
                // Ellipsis
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-gray-500"
                  >
                    ...
                  </span>
                );
              }

              return (
                <a
                  key={pageNum}
                  href={`?page=${pageNum}`}
                  className={`px-4 py-2 rounded-md ${
                    pageNum === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                  {pageNum}
                </a>
              );
            })}
          </div>

          {/* Next Button */}
          <a
            href={currentPage < totalPages ? `?page=${currentPage + 1}` : '#'}
            className={`px-4 py-2 rounded-md ${
              currentPage < totalPages
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } transition-colors`}
            aria-disabled={currentPage >= totalPages}
            onClick={(e) => currentPage >= totalPages && e.preventDefault()}
          >
            Next
          </a>
        </nav>
      )}
    </div>
  );
}
