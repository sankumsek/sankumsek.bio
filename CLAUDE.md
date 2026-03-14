# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal website with a terminal-style interface based on LiveTerm, with an integrated Sanity-powered blog.

## Development Commands

```bash
# Main site (port 3000)
yarn install
yarn dev
yarn build
yarn lint

# Blog (port 3001)
cd blog
npm install
npm run dev
npm run build

# Sanity Studio
cd studio
npm install
npm run dev
```

Note: Main site and blog run on different ports (3000 and 3001) so they can run simultaneously.

## Architecture

**Monorepo Structure:**
- `/` - Main terminal-style website (Next.js + TypeScript)
- `/blog` - Blog frontend (Next.js App Router + Sanity)
- `/studio` - Sanity Studio for content management

**Main Site:**
- Configuration lives in `config.json` - most customization happens here (name, social links, colors, themes)
- Terminal commands are defined in `src/utils/bin/`:
  - `commands.ts` - Static commands (help, about, resume, social links, etc.)
  - `api_commands.ts` - Commands requiring API calls (projects, weather, quote)
  - `sumfetch.ts` - ASCII art summary display
- `themes.json` contains pre-configured color themes

**Blog:**
- Uses Sanity CMS with ISR (60-second revalidation)
- Sanity schemas in `/studio/schemas/` define content types (post, author, category)
- Environment variables required: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`

## Deployment

Both apps deploy to Vercel as separate projects from the same repository:
- Main site: deployed from root directory to `sankumsek.bio`
- Blog: deployed from `/blog` directory to `blog.sankumsek.bio`

See `DEPLOYMENT.md` for detailed deployment instructions.

## Adding Terminal Commands

Export async functions from `src/utils/bin/commands.ts` or `api_commands.ts`. Commands automatically appear in the help menu and support tab completion.
