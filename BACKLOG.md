# Backlog

## Migrate terminal from LiveTerm to ghostty-web

Replace the current LiveTerm-based fake terminal with [coder/ghostty-web](https://github.com/coder/ghostty-web), a WASM-compiled web terminal emulator using Ghostty's VT100 parser with xterm.js API compatibility.

**Motivation:** Real terminal rendering instead of a simulated React UI. Ghostty-web is a drop-in xterm.js replacement, so the migration surface is bounded. Could support an actual shell session or keep the fake shell with significantly better rendering fidelity.

**References:**
- https://github.com/coder/ghostty-web
- https://github.com/ghostty-org/ghostty

---

## Migrate blog from Sanity CMS to Markdown + GitHub + Obsidian

Replace the current Sanity-backed blog with a Markdown-file-based blog where content lives in the GitHub repo, Vercel handles deployment, and Obsidian serves as the local editor/CMS.

**Approach (per Neil Mathew's setup):**
1. Base the new blog on [vercel/nextjs-portfolio-starter](https://github.com/vercel/nextjs-portfolio-starter)
2. Store posts as `.md` files in a `posts/` directory in the repo
3. Open the project root as an Obsidian vault to write and edit posts
4. Push to GitHub to publish — Vercel auto-deploys

**Motivation:** Eliminates Sanity entirely (no hosted CMS, no API token, no separate `/studio`). Writing workflow becomes: open Obsidian, write, commit, push.

**References:**
- https://www.neilmathew.co/posts/nextjs-blog-with-obsidian-as-cms
- https://github.com/vercel/nextjs-portfolio-starter
