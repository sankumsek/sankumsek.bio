# Implementation Plan: Blog Integration

## Overview

This plan implements a Sanity-powered blog for sankumsek.bio with dual access: a terminal command in the existing TUI and a standalone Next.js application at blog.sankumsek.bio. The implementation follows a monorepo structure with independent deployment for each application.

## Tasks

- [x] 1. Set up blog application structure and dependencies
  - Create `/blog` directory with Next.js App Router structure
  - Initialize package.json with dependencies: next, react, @sanity/client, @sanity/image-url, @portabletext/react, tailwindcss
  - Configure TypeScript with tsconfig.json
  - Set up Tailwind CSS with tailwind.config.js
  - Create next.config.js with image domain configuration for Sanity CDN
  - _Requirements: 2.3, 2.4_

- [ ] 2. Configure Sanity CMS schemas and client
  - [ ] 2.1 Create Sanity schema definitions
    - Implement post schema in `blog/sanity/schema/post.ts` with all fields (title, slug, excerpt, author, mainImage, categories, publishedAt, body, seo)
    - Implement author schema in `blog/sanity/schema/author.ts`
    - Implement category schema in `blog/sanity/schema/category.ts`
    - Create schema index in `blog/sanity/schema/index.ts`
    - _Requirements: 3.2, 3.4, 3.5_

  - [ ]* 2.2 Write property test for Sanity schema validation
    - **Property 2: Post Rendering Completeness**
    - **Validates: Requirements 4.1**

  - [ ] 2.3 Set up Sanity client configuration
    - Create Sanity client in `blog/src/lib/sanity.client.ts` with environment variables
    - Implement GROQ queries in `blog/src/lib/sanity.queries.ts` (postsQuery, postBySlugQuery, postCountQuery)
    - Create image URL builder in `blog/src/lib/sanity.image.ts`
    - _Requirements: 3.1, 3.3_

  - [ ] 2.4 Create TypeScript type definitions
    - Define interfaces in `blog/src/types/index.ts` (Post, Author, Category, SanityImage, SEO, PortableTextBlock)
    - _Requirements: 3.2_

- [ ] 3. Implement terminal blog command
  - [ ] 3.1 Add blog command to terminal
    - Implement blog command function in `src/utils/bin/commands.ts` that opens blog.sankumsek.bio in new tab
    - Register blog command in `src/utils/bin/index.ts`
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 3.2 Write property test for blog command
    - **Property 1: Blog Command Argument Invariance**
    - **Validates: Requirements 1.5**

  - [ ]* 3.3 Write unit tests for blog command
    - Test command execution with no arguments
    - Test command execution with arguments (should ignore)
    - Test command appears in help output
    - _Requirements: 1.1, 1.4, 1.5_

- [ ] 4. Create blog UI components
  - [ ] 4.1 Implement PortableText renderer component
    - Create `blog/src/components/PortableText.tsx` with custom serializers for blocks, images, and code
    - Implement syntax highlighting for code blocks using Prism.js
    - Add content sanitization to prevent XSS
    - _Requirements: 4.2, 4.3, 9.1, 9.2, 9.3, 9.4_

  - [ ]* 4.2 Write property tests for PortableText component
    - **Property 3: Portable Text to HTML Conversion**
    - **Property 4: Code Block Preservation**
    - **Property 5: Image Rendering Attributes**
    - **Property 12: Content Sanitization**
    - **Validates: Requirements 4.2, 4.3, 4.4, 9.1, 9.2, 9.3, 9.4_

  - [ ]* 4.3 Write unit tests for PortableText edge cases
    - Test empty content array
    - Test malformed blocks
    - Test missing image alt text
    - _Requirements: 9.3_

  - [ ] 4.4 Implement PostCard component
    - Create `blog/src/components/PostCard.tsx` to display post preview with title, excerpt, date, author, featured image
    - Implement excerpt truncation to 150 characters
    - Add Next.js Image component for featured images with lazy loading
    - _Requirements: 5.2, 4.4_

  - [ ]* 4.5 Write unit tests for PostCard component
    - Test rendering with all fields present
    - Test rendering with missing optional fields (excerpt, mainImage)
    - Test excerpt truncation
    - _Requirements: 5.2_

  - [ ] 4.6 Implement PostList component
    - Create `blog/src/components/PostList.tsx` with pagination support (10 posts per page)
    - Implement chronological sorting (newest first)
    - Add pagination controls
    - _Requirements: 5.1, 5.3, 5.5_

  - [ ]* 4.7 Write property tests for PostList component
    - **Property 6: Post List Chronological Ordering**
    - **Property 7: Post List Completeness**
    - **Property 8: Pagination Threshold**
    - **Validates: Requirements 5.1, 5.3, 5.5**

  - [ ]* 4.8 Write unit tests for PostList edge cases
    - Test empty post array
    - Test single post
    - Test exactly 10 posts (no pagination)
    - Test 11 posts (pagination appears)
    - _Requirements: 5.1, 5.5_

  - [ ] 4.9 Implement Header component
    - Create `blog/src/components/Header.tsx` with blog title and navigation links
    - Add link back to main terminal site (sankumsek.bio)
    - Implement responsive mobile menu
    - _Requirements: 6.3, 6.4, 7.5_

  - [ ] 4.10 Implement Footer component
    - Create `blog/src/components/Footer.tsx` with links and copyright
    - Add social media links
    - _Requirements: 6.4_

- [ ] 5. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement blog pages and routing
  - [ ] 6.1 Create blog homepage
    - Implement `blog/src/app/page.tsx` to fetch and display post list
    - Use PostList component with pagination
    - Implement ISR with 60-second revalidation
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 10.2_

  - [ ] 6.2 Create root layout
    - Implement `blog/src/app/layout.tsx` with Header, Footer, and global styles
    - Configure metadata for SEO
    - Add responsive viewport configuration
    - _Requirements: 7.1, 7.2, 7.4_

  - [ ] 6.3 Create individual post page
    - Implement `blog/src/app/posts/[slug]/page.tsx` with dynamic routing
    - Fetch post data using Sanity client
    - Render post content using PortableText component
    - Implement ISR with 60-second revalidation
    - Generate static params for all published posts
    - _Requirements: 4.1, 6.1, 6.2, 10.1, 10.2_

  - [ ]* 6.4 Write property test for post URL generation
    - **Property 9: Post URL Generation**
    - **Validates: Requirements 6.2**

  - [ ] 6.5 Create 404 page
    - Implement `blog/src/app/not-found.tsx` with link back to homepage
    - _Requirements: 4.5_

  - [ ]* 6.6 Write unit tests for 404 handling
    - Test non-existent post slug returns 404
    - Test invalid slug format returns 404
    - _Requirements: 4.5_

- [ ] 7. Implement SEO and metadata
  - [ ] 7.1 Add metadata generation for post pages
    - Implement generateMetadata function in post page with title, description, Open Graph tags
    - Add canonical URL generation
    - Include Twitter Card tags
    - _Requirements: 8.1, 8.4_

  - [ ]* 7.2 Write property test for SEO metadata
    - **Property 10: SEO Metadata Completeness**
    - **Validates: Requirements 8.1, 8.3, 8.4**

  - [ ] 7.3 Create sitemap generation
    - Implement `blog/src/app/sitemap.ts` to generate sitemap.xml with all published posts
    - _Requirements: 8.2_

  - [ ]* 7.4 Write property test for sitemap completeness
    - **Property 11: Sitemap Completeness**
    - **Validates: Requirements 8.2**

  - [ ] 7.5 Create robots.txt
    - Implement `blog/src/app/robots.ts` to allow search engine indexing
    - _Requirements: 8.5_

  - [ ] 7.6 Add JSON-LD structured data
    - Implement structured data for blog posts in post page layout
    - Include BlogPosting schema with author, datePublished, headline
    - _Requirements: 8.3_

- [ ] 8. Implement performance optimizations
  - [ ] 8.1 Configure image optimization
    - Set up Next.js Image component with Sanity CDN domains in next.config.js
    - Implement responsive image sizing
    - Add blur placeholder for images
    - _Requirements: 4.4, 10.3_

  - [ ] 8.2 Set up caching strategy
    - Configure ISR revalidation periods (60 seconds)
    - Implement Sanity CDN usage for production
    - Add cache headers for static assets
    - _Requirements: 10.2, 10.5_

  - [ ] 8.3 Optimize bundle size
    - Configure code splitting in next.config.js
    - Implement dynamic imports for heavy components
    - _Requirements: 10.4_

- [ ] 9. Implement responsive design
  - [ ] 9.1 Add responsive styles to all components
    - Implement mobile-first CSS with Tailwind breakpoints
    - Test layouts at 320px, 768px, 1024px, 1440px, 2560px
    - Ensure proper line length and typography scaling
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 9.2 Write unit tests for responsive behavior
    - Test mobile menu toggle
    - Test image responsive sizing
    - _Requirements: 7.5_

- [ ] 10. Configure deployment
  - [ ] 10.1 Create Vercel configuration
    - Create `vercel.json` with multi-app configuration for main site and blog subdomain
    - Configure build settings for blog directory
    - Set up environment variables for Sanity credentials
    - _Requirements: 2.1, 2.2, 2.4_

  - [ ] 10.2 Set up environment variables
    - Document required environment variables in README
    - Create `.env.example` file with variable names
    - _Requirements: 3.1_

  - [ ] 10.3 Configure subdomain routing
    - Set up blog.sankumsek.bio subdomain in Vercel
    - Test subdomain accessibility
    - _Requirements: 2.1, 2.5_

- [ ] 11. Write additional property-based tests
  - [ ]* 11.1 Write property test for Portable Text round-trip
    - **Property 13: Portable Text Round-Trip**
    - **Validates: Requirements 9.5**

  - [ ]* 11.2 Configure fast-check for all property tests
    - Set minimum 100 iterations per test
    - Add feature tags: "Feature: blog-integration, Property {N}"
    - _Requirements: All_

- [ ] 12. Final checkpoint and integration
  - [ ] 12.1 Verify all components are wired together
    - Test terminal command opens blog subdomain
    - Test blog homepage displays posts
    - Test clicking post navigates to post page
    - Test navigation between pages
    - _Requirements: 1.1, 5.4, 6.5_

  - [ ] 12.2 Run full test suite
    - Execute all unit tests
    - Execute all property tests
    - Verify test coverage meets goals
    - _Requirements: All_

  - [ ] 12.3 Performance validation
    - Run Lighthouse audit on blog pages
    - Verify performance score above 90
    - Test load time under 3 seconds
    - _Requirements: 2.5, 10.4_

  - [ ] 12.4 Final checkpoint - Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- The blog application is a separate Next.js app in the `/blog` directory
- Both applications share the same repository but deploy independently
- ISR revalidation is set to 60 seconds to balance freshness and performance
- All components use TypeScript for type safety
- Tailwind CSS is used for styling with mobile-first responsive design
