# Sankumsek Blog

A Next.js 15 blog application powered by Sanity CMS, deployed at blog.sankumsek.bio.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account and project

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Sanity credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Dataset name (usually "production")
- `SANITY_API_TOKEN`: API token for authenticated requests

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to view the blog.

### Build

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **CMS**: Sanity.io
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Features

- Server-side rendering with ISR (60s revalidation)
- Responsive design
- SEO optimized with metadata and sitemap
- Rich text content with Portable Text
- Image optimization with Next.js Image
- Syntax highlighting for code blocks

## Project Structure

```
blog/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # React components
│   ├── lib/          # Sanity client and utilities
│   └── types/        # TypeScript type definitions
├── sanity/           # Sanity schema definitions
└── public/           # Static assets
```

## License

Private
