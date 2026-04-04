// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import remarkEmoji from 'remark-emoji';
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';

import { SITE } from './site/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  publicDir: 'site/assets',
  redirects: {
    '/blog/welcome': '/posts/2016-12-22-welcome',
    '/blog/pinboard-review': '/posts/2016-12-23-pinboard-review',
    '/blog/f-strings': '/posts/2016-12-24-f-strings',
    '/blog/python-36-towers': '/posts/2016-12-27-python-36-towers',
    '/blog/never-iterate-a-changing-dict': '/posts/2017-01-07-never-iterate-a-changing-dict',
    '/blog/overlay-icon-battle': '/posts/2017-01-13-overlay-icon-battle',
    '/blog/web-ext-with-angular': '/posts/2017-02-01-web-ext-with-angular',
    '/blog/shakespeare-with-graphql': '/posts/2018-08-17-shakespeare-with-graphql',
  },
  integrations: [
    svelte(),
    mdx(),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },

  markdown: {
    shikiConfig: {
      themes: {
        light: 'min-light',
        dark: 'catppuccin-frappe',
      },
      defaultColor: false,
      wrap: true,
      transformers: [
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff(),
      ],
    },
    remarkPlugins: [remarkEmoji],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            className: ['heading-link'],
            ariaLabel: 'Link to section',
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      ],
    ],
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@/config': path.resolve(__dirname, './site/config.ts'),
        '@/site-assets': path.resolve(__dirname, './site/assets'),
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
