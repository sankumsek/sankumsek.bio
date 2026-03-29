# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal website with a terminal-style interface based on [LiveTerm](https://github.com/Cveinnt/LiveTerm), with an integrated Sanity-powered blog. The owner is Sanjeev Sekar, an Engineering Manager at AWS Labs focused on Growth & AI.

## Repository Structure

```
/                   - Main terminal-style website (Next.js + TypeScript, port 3000)
/blog               - Blog frontend (Next.js App Router + Sanity, port 3001)
/studio             - Sanity Studio for content management
```

## Development Commands

```bash
# Main site (port 3000) — uses yarn
yarn install
yarn dev
yarn build
yarn lint

# Blog (port 3001) — uses npm
cd blog
npm install
npm run dev
npm run build
npm run type-check   # TypeScript type checking

# Sanity Studio — uses npm
cd studio
npm install
npm run dev          # starts Sanity Studio dev server
npm run build
npm run deploy       # deploy Sanity Studio to sanity.io
```

> Note: Main site uses **yarn**; blog and studio use **npm**. Do not mix package managers.
> Main site and blog run on different ports so they can run simultaneously.

## Main Site Architecture

### Key Files

- `config.json` — Primary customization file: name, email, social links, resume URL, donate URLs, colors
- `themes.json` — 8 pre-configured color themes (default/Nord, gruvbox, dracula, Monokai, Mocha, Solarized, Paraiso)
- `src/utils/bin/` — Terminal command definitions
- `src/pages/index.tsx` — Main terminal UI and command dispatch
- `src/pages/_app.tsx` — App wrapper with theme/color management
- `src/utils/api.ts` — External API client functions (GitHub, weather, quotes)

### Terminal Commands (`src/utils/bin/`)

Commands are exported async functions; they auto-appear in the help menu and support tab completion.

**`commands.ts`** — Static commands (no external API calls):
- `help` — Lists all available commands
- `about` — Bio / profile summary
- `banner` — ASCII art welcome banner shown on load
- `sumfetch` — ASCII art summary with contact info (see `sumfetch.ts`)
- `resume` — Opens resume PDF (URL from `config.json`)
- `blog` — Opens `blog.sankumsek.bio`
- `repo` — Opens GitHub repository
- `email` — Opens mailto link
- `github`, `linkedin` — Opens social profiles
- `google`, `duckduckgo`, `bing`, `reddit` — Search engine wrappers
- `donate` — Shows GiveWell donation link
- `echo`, `whoami`, `ls`, `cd`, `date` — Linux-style terminal commands
- `vi`, `vim`, `nvim`, `emacs` — Humorous text-editor chain
- `sudo` — Rickroll easter egg

**`api_commands.ts`** — Commands requiring external API calls:
- `projects` — Lists GitHub repos via GitHub API
- `quote` — Random quote from quotable.io
- `readme` — Fetches GitHub README from `config.readmeUrl`
- `weather [city]` — Weather via wttr.in

**`sumfetch.ts`** — ASCII art summary display. Renders different ASCII art based on `config.ascii` value (`'cveinnt'` vs default LiveTerm art). Displays ABOUT, CONTACT, and DONATE sections from `config.json`.

**`index.ts`** — Re-exports all commands; this is what the terminal imports.

### Adding a New Terminal Command

1. Add an exported async function to `src/utils/bin/commands.ts` (static) or `api_commands.ts` (needs API):
   ```typescript
   export const mycommand = async (args: string[]): Promise<string> => {
     return 'output string (supports HTML for links)';
   };
   ```
2. The command automatically appears in `help` output and tab completion — no registration needed.

### Config Reference (`config.json`)

```json
{
  "readmeUrl": "...",         // GitHub raw README URL for 'readme' command
  "title": "...",             // Browser tab title
  "name": "...",              // Display name
  "ascii": "...",             // ASCII art variant ('cveinnt' or anything else)
  "social": { "github": "...", "linkedin": "..." },
  "email": "...",
  "ps1_hostname": "...",      // Terminal prompt hostname
  "ps1_username": "...",      // Terminal prompt username (shown by 'whoami')
  "repo": "...",              // GitHub repo URL
  "resume_url": "...",        // Resume PDF URL
  "donate_urls": { "givewell": "..." },
  "colors": { "light": {...}, "dark": {...} }  // Custom color overrides
}
```

### Themes (`themes.json`)

Each theme has `light` and `dark` variants with keys: `background`, `foreground`, `yellow`, `green`, `gray`, `blue`, `red`.

### API Utilities (`src/utils/api.ts`)

- `getProjects()` — `GET https://api.github.com/users/{github}/repos`
- `getReadme()` — `GET config.readmeUrl`
- `getWeather(city)` — `GET https://wttr.in/{city}?ATm`
- `getQuote()` — `GET https://api.quotable.io/random`

## Blog Architecture (`/blog`)

**Stack:** Next.js 15 App Router, TypeScript (strict), Tailwind CSS, Sanity CMS, `@portabletext/react`, Prism.js for code highlighting.

**Key files:**
- `src/app/` — Next.js App Router pages
  - `page.tsx` — Blog index (post listing)
  - `posts/[slug]/` — Individual post pages
  - `layout.tsx` — Root layout
  - `sitemap.ts`, `robots.ts` — SEO
- `src/lib/sanity.client.ts` — Sanity client setup
- `src/lib/sanity.queries.ts` — GROQ queries for fetching posts/authors/categories
- `src/lib/sanity.image.ts` — Sanity image URL builder
- `src/types/index.ts` — Shared TypeScript types

**ISR:** Pages revalidate every 60 seconds. Images served from `cdn.sanity.io` (configured in `next.config.js`).

**Environment variables required** (see `blog/.env.example`):
```
NEXT_PUBLIC_SANITY_PROJECT_ID=r2xbrplm
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token from sanity.io/manage>
NEXT_PUBLIC_SITE_URL=https://blog.sankumsek.bio
```

## Sanity Studio (`/studio`)

**Config:** `studio/sanity.config.ts` — project ID `r2xbrplm`, dataset `production`.

**Plugins:** `structureTool`, `visionTool`, `codeInput` (`@sanity/code-input`).

**Schemas** (`studio/schemas/`):

| Schema | Key Fields |
|--------|-----------|
| `post` | title, slug, excerpt, author (ref), mainImage, categories (refs), publishedAt, body (portable text + images + code), seo |
| `author` | name, slug, image, bio (portable text) |
| `category` | title, slug, description |

Body field supports blocks, images, and code snippets (via `@sanity/code-input`). Post title is capped at 100 chars; excerpt at 200 chars.

## Deployment

Both apps deploy independently on Vercel from the same Git repository:

| App | Vercel Root Directory | Domain |
|-----|-----------------------|--------|
| Main site | `/` | `sankumsek.bio` |
| Blog | `/blog` | `blog.sankumsek.bio` |

Deployments trigger automatically on push to `master`. See `DEPLOYMENT.md` for full setup instructions including environment variables and DNS configuration.

## Code Style & Conventions

- **TypeScript:** Main site uses `strict: false`; blog uses `strict: true`.
- **Linting:** ESLint with `next/core-web-vitals`. `no-console` is an error.
- **Formatting:** Prettier (configured in `.prettierrc.json`). Prettier violations are warnings.
- **Pre-commit hooks:** Husky is configured (`prepare` script runs `husky install`).
- **HTML in command output:** Commands can return HTML strings with `<a>`, `<u>` tags for links. Use Tailwind color classes `text-light-blue dark:text-dark-blue underline` for styled links.
- **Package managers:** Root = yarn, blog/studio = npm. Do not mix.

## Blog Writing Style

- **Tone & Voice:** "Conversational, witty, yet professional. Use simple language that sounds like a 6th grader could read it.
- **Content Rules:** 1500-2000 words, use H2 and H3, max 3 to 5 sentence paragraphs.
- **Banned Words/Symbol:s** No em-dashes
- **Inspiration**: Use the following writers and their respective websites for inspiration when your writing:
  - Steve Yegge: https://steve-yegge.medium.com/
  - Will Larson: https://lethain.com/
  - Anton: https://www.manager.dev/blog
  - Gergely Orosz: https://newsletter.pragmaticengineer.com/