export interface SiteConfig {
  author: string;
  desc: string;
  title: string;
  ogImage: string;
  canonicalURL: string;
  lang: string;
  base: string;
  website: string;
  social: Record<string, string>;
  googleAnalyticsId?: string;
  homeHeroDescription: string;
  blogDescription: string;
  projectsDescription: string;

  // Homepage post counts
  featuredPostsCount: number;
  latestPostsCount: number;

  // Homepage projects
  homeProjects: {
    enabled: boolean;
    count: number;
  };

  // CTA (Call-to-Action) block for blog posts
  cta: {
    enabled: boolean;
    filePath: string;
  };

  // Homepage Hero block
  hero: {
    enabled: boolean;
    filePath: string;
  };

  // Giscus comments configuration
  comments: {
    enabled: boolean;
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
    reactionsEnabled: boolean;
    emitMetadata: boolean;
    inputPosition: 'top' | 'bottom';
    theme: string;
    lang: string;
  };
}

export const SITE: SiteConfig = {
  author: 'Christoph Zwerschke',
  desc: "Seasoned & Agile - Cito's Personal Blog",
  title: 'Seasoned & Agile',
  ogImage: 'og.png',
  canonicalURL: 'https://cito.github.io',
  lang: 'en',
  base: '/',
  website: 'https://cito.github.io',
  social: {
    GitHub: 'https://github.com/cito',
    LinkedIn: 'https://www.linkedin.com/in/christoph-zwerschke',
    BlueSky: 'https://bsky.app/profile/lecito.bsky.social',
    Mastodon: 'https://fosstodon.org/@Cito',
    Email: 'mailto:cito@online.de',
  },
  googleAnalyticsId: '',
  homeHeroDescription:
    'A software developer sharing his thoughts on humans, technology and the world at large.',
  blogDescription:
    'Articles on software development, science, technology and the state of the world.',
  projectsDescription: '',

  featuredPostsCount: 3,
  latestPostsCount: 3,

  homeProjects: {
    enabled: false,
    count: 0,
  },

  cta: {
    enabled: false,
    filePath: 'site/cta.md',
  },

  hero: {
    enabled: true,
    filePath: 'site/hero.md',
  },

  comments: {
    enabled: false,
    repo: '',
    repoId: '',
    category: 'General',
    categoryId: '',
    mapping: 'pathname',
    reactionsEnabled: true,
    emitMetadata: false,
    inputPosition: 'bottom',
    theme: 'preferred_color_scheme',
    lang: 'en',
  },
};
