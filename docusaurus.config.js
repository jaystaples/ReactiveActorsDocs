// @ts-check
// Reactive Actors documentation site.
// Before deploying, set the four values marked SET ME (your GitHub user and repo names).

import {themes as prismThemes} from 'prism-react-renderer';

const githubUser = 'YOUR-GITHUB-USER'; // SET ME
const repoName = 'ReactiveActorsDocs'; // SET ME: the repo this site lives in

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Reactive Actors',
  tagline: 'Give any actor in your level its own behaviour, without a new Blueprint class.',
  favicon: 'img/favicon.svg',

  url: `https://${githubUser}.github.io`, // SET ME if you use a custom domain
  baseUrl: `/${repoName}/`, // SET ME: '/' for a custom domain or a <user>.github.io repo

  organizationName: 'JayStaples',
  projectName: 'reactive-actors-docs',
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // .md files are plain Markdown (no MDX), so text like {braces} and <angle brackets> is safe to write
  markdown: {
    format: 'detect',
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({hashed: true, docsRouteBasePath: '/', indexBlog: false, highlightSearchTermsOnTargetPage: true}),
    ],
  ],

  i18n: {defaultLocale: 'en', locales: ['en']},

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // docs-only site: Home is the front page
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {defaultMode: 'dark', respectPrefersColorScheme: true},
      navbar: {
        title: 'Reactive Actors',
        logo: {alt: 'Reactive Actors', src: 'img/logo.svg'},
        items: [
          {type: 'doc', docId: 'getting-started', label: 'Getting Started', position: 'left'},
          {type: 'doc', docId: 'built-in-reference', label: 'Reference', position: 'left'},
          {type: 'doc', docId: 'faq', label: 'FAQ', position: 'left'},
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Backyard Games Pty Ltd. Built with Docusaurus.`,
      },
      tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 3},
      prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula, additionalLanguages: ['cpp', 'ini']},
      mermaid: {theme: {light: 'neutral', dark: 'dark'}},
    }),
};

export default config;
