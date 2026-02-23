import Link from 'next/link';

/**
 * 404 Not Found Page
 * 
 * Displayed when a post or page is not found.
 * - Friendly "Page not found" message
 * - Link back to blog homepage
 * - Matches design style of other pages
 * - Simple and user-friendly
 * 
 * Validates Requirements 4.5
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
