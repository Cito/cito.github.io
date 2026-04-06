# Seasoned & Agile

Source code for [Cito's personal blog](https://cito.github.io/) — the blog of
Christoph Zwerschke, a software developer and programming enthusiast writing
about Python, web development, GraphQL, and technology.

## Tech Stack

This blog is built with [Astro](https://astro.build/) using the
[Spaceship](https://github.com/alec-c4/spaceship) theme and deployed to
[GitHub Pages](https://pages.github.com/) via GitHub Actions.

## Credits

- [Astro](https://astro.build/) — the web framework for content-driven websites.
  Thanks to the Astro team for building such a great tool.
- [Spaceship](https://github.com/alec-c4/spaceship) — a modern, fast blog theme
  for Astro. Many thanks to [Alexey Poimtsev](https://github.com/alec-c4) for
  creating and maintaining this beautiful theme.

## How It Works

### Deployment

Deployment is fully automatic. A GitHub Actions workflow
(`.github/workflows/deploy.yml`) runs whenever you push to the `main` branch.
It installs dependencies, builds the site, and deploys the result to GitHub
Pages. You can also trigger a deployment manually from the Actions tab on GitHub
("workflow_dispatch").

**As the blog author, all you need to do is push (or merge) to `main`.** The
rest happens automatically. The live site at <https://cito.github.io/> updates
within a couple of minutes.

### Local Development vs. Production Build

| | `pnpm dev` | `pnpm build` + `pnpm preview` |
| --- | --- | --- |
| **Purpose** | Live preview while writing | Test the production build locally |
| **Drafts** | Shown (posts with `draft: true`) | Hidden |
| **Future posts** | Shown (posts with `pubDate` in the future) | Hidden |
| **Speed** | Hot-reloads on file save | Requires rebuild after changes |

Use `pnpm dev` when writing or editing posts. Use `pnpm build` followed by
`pnpm preview` if you want to verify exactly what will be deployed.

Before using either command for the first time (or after pulling changes),
install dependencies:

```bash
pnpm install
```

## Common Tasks

### Adding a New Blog Post

1. Create a new Markdown file in `site/content/posts/`, e.g.
   `site/content/posts/my-new-post.md`.
2. Add YAML frontmatter at the top:

   ```yaml
   ---
   title: "My New Post"
   description: "A short summary for SEO and post listings."
   pubDate: 2026-04-04
   tags: ["Python", "Programming"]
   ---
   ```

3. Write the post body in Markdown below the frontmatter.
4. Illustrative images go in `site/assets/img/` (`![alt](/img/file.jpg)`).
   Screenshots and full-width images go in `site/assets/scr/` (`![alt](/scr/file.png)`).
5. Run `pnpm dev` to preview, then commit and push to `main` to publish.

**Frontmatter fields:**

| Field | Required | Description |
| --- | --- | --- |
| `title` | yes | Post title |
| `description` | yes | Short summary (used in listings and SEO) |
| `pubDate` | yes | Publication date (`YYYY-MM-DD`) |
| `tags` | no | Array of tag strings (defaults to `["others"]`) |
| `draft` | no | Set to `true` to hide in production |
| `updatedDate` | no | Date of last significant edit |
| `featured` | no | Set to `true` to feature on the homepage |
| `slug` | no | Custom URL slug (default: `YYYY-MM-DD-filename`) |

### Updating an Existing Blog Post

1. Edit the Markdown file in `site/content/posts/`.
2. Optionally add or update the `updatedDate` field in the frontmatter.
3. Commit and push to `main`.

### Updating the Astro Framework

Astro is the static site generator that turns Markdown into HTML. Update it
when you want bug fixes, performance improvements, or new Markdown/MDX
features. This is a low-risk update that you can do periodically (e.g. every
few months) or when you hit a specific bug.

```bash
pnpm update astro
pnpm build  # verify the build still works
```

For a major version upgrade (e.g. Astro 6 to 7), check the
[Astro upgrade guide](https://docs.astro.build/en/guides/upgrade-to/latest/)
first, as breaking changes may require config or code adjustments.

### Updating the Spaceship Theme

The Spaceship theme provides the visual design, layout components, and
page templates. It lives in the `src/` directory. Your content in `site/` is
separate from the theme engine, so theme updates should not touch your posts.

Update the theme when you want new design features, bug fixes, or
compatibility with newer Astro versions. Check the
[Spaceship changelog](https://github.com/alec-c4/spaceship/blob/main/CHANGELOG.md)
to decide whether an update is worth it.

To update:

1. Download or clone the latest version of Spaceship.
2. Replace these directories/files with the new versions:
   - `src/`
   - `astro.config.mjs` (merge carefully — our file has custom `redirects`
     and `site` settings)
   - `package.json` (merge carefully — keep the `name`, remove `prepare`
     script, keep `sharp` dependency)
   - `tsconfig.json`
   - `svelte.config.js`
3. Re-apply the local customisations listed below (they live in `src/` and
   will be overwritten).
4. Run `pnpm install` and `pnpm build` to verify.

**Keep your `site/` directory untouched** — it contains all your content and
configuration.

#### Local customisations to re-apply after a theme update

- **`src/content.config.ts`** — change `import { z } from 'zod'` to
  `import { z } from 'astro:schema'` (Astro 6 compatibility fix; may already
  be fixed in a newer theme release). Also remove `projects` and `appearances`
  from the `collections` export (keep their definitions but prefix them with
  `_` so they are not loaded — the content directories don't exist and would
  cause warnings).
- **`src/components/Header.svelte` and `Header.astro`** — remove
  `{ name: 'Projects', href: '/projects' }` and
  `{ name: 'Appearances', href: '/appearances' }` from the `navLinks` array,
  keeping only `Posts` and `About`.
- **`src/pages/index.astro`** — remove the `projects` and `appearances`
  collection fetches near the top, and remove the entire "Projects" and
  "Talks & Appearances" `<section>` blocks from the page body.
- **`src/pages/about.astro`** — add `linkedin`, `bluesky`, `mastodon`, and
  `email` entries to the `socialIcons` map (with proper SVG path data), and
  remove unused entries (`x`, `telegram`, `facebook`, `youtube`).
- **`src/styles/global.css`** — append the "Site customisations" section from
  the bottom of the file (post image sizing: constrained for `/img/`, full-width
  for `/scr/`).
- **`src/components/SocialShare.svelte`** — replace the `platforms` array
  with LinkedIn, BlueSky, and Mastodon entries (each with a `name`, `icon`
  SVG path string, and `getShareUrl` function), removing X, Telegram, and
  Facebook. In the template, render the icon via `{@html platform.icon}`
  inside an `<svg>` element (same pattern as the original, just new platforms).

## Project Structure

```text
site/                  # Content (posts, about page, config, assets)
  config.ts            # Site title, author, social links, feature flags
  hero.md              # Homepage hero text
  content/
    posts/*.md         # Blog posts
    about/index.md     # About page
  assets/              # Static files (images, favicons, legacy redirects)
    img/               # Illustrative images (displayed at constrained size)
    scr/               # Screenshots (displayed at full content width)
src/                   # Theme engine (Spaceship) — don't edit for content
.github/workflows/     # GitHub Actions deployment
```

## Author

All blog content (posts, images, and text) is
copyright (c) 2016-2026 [Christoph Zwerschke](https://github.com/Cito).
All rights reserved.
