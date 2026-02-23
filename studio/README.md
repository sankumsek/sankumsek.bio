# Sanity Studio for Sanjeev Sekar's Blog

This is the content management interface for the blog at blog.sankumsek.bio.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

The studio will be available at http://localhost:3333

### Deploy to Sanity's Hosted Studio

```bash
npm run deploy
```

This will deploy the studio to: https://r2xbrplm.sanity.studio

You can also deploy to a custom domain by configuring it in the Sanity dashboard.

## Content Types

- **Posts**: Blog posts with rich text content, images, and code blocks
- **Authors**: Author profiles with bio and avatar
- **Categories**: Post categories for organization

## Configuration

The studio is configured to connect to:
- Project ID: r2xbrplm
- Dataset: production

These settings are in `sanity.config.ts`.
