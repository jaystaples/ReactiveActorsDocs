# Reactive Actors documentation

The source for the Reactive Actors docs site, built with [Docusaurus](https://docusaurus.io/).

## Edit the docs

Every page is a Markdown file in `docs/`. The sidebar order is set in `sidebars.js`.

| File | Page |
| --- | --- |
| `docs/home.md` | Home (the front page) |
| `docs/getting-started.md` | Getting Started |
| `docs/core-concepts.md` | Core Concepts |
| `docs/guides.md` | Guides |
| `docs/built-in-reference.md` | Built-in Reference |
| `docs/making-your-own.md` | Making Your Own |
| `docs/debugging-and-settings.md` | Debugging and Settings |
| `docs/faq.md` | FAQ and Troubleshooting |

- Callouts use `:::tip`, `:::note`, `:::warning` or `:::info[Your title]`, closed with `:::`.
- Link to another page by its file: `[Guides](./guides.md#save-and-load)`. Broken links stop the build.
- Diagrams use Mermaid code blocks (see `docs/core-concepts.md`).
- Images go in `static/img/` and are linked as `/img/name.png`.

## Preview on your computer

Needs [Node.js](https://nodejs.org/) 20 or later.

```bash
npm install
npm start
```

This opens the site at http://localhost:3000 and reloads as you edit.

## Publish to GitHub Pages

1. `docusaurus.config.js` is set up for `github.com/jaystaples/ReactiveActorsDocs`. If the repo moves or is renamed, change `githubUser` and `repoName` at the top to match.
2. Push this folder to that GitHub repo, on the `main` branch.
3. In the repo, go to **Settings > Pages** and set **Source** to **GitHub Actions**.

Every push to `main` now builds and publishes the site to `https://<githubUser>.github.io/<repoName>/`.
