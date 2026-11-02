# Static site development instructions

This repository contains a new static personal homepage and two standalone paper
websites. The previous al-folio personal homepage and its build system have been removed.

## Structure

- `Proof-R1/`: Proof-R1 website, article, and assets.
- `XRAG/`: XRAG website, article, and assets.
- `index.html`: personal homepage, including six static publication entries.
- `homepage/`: homepage CSS, JavaScript, portrait, and favicon.
- Root static pages and metadata: the error page, robots, and sitemap.
- `scripts/build-site.mjs`: the allowlist-based Node.js builder.
- `scripts/validate-built-site.mjs`: the published-file and link validator.
- `content/profile/`: saved personal-profile source material; never included in Pages output.
- `_site/`: generated deployment output; never commit this directory.

Read `README.md` for the current source layout and preview commands. Follow
[`GIT_WORKFLOW.md`](GIT_WORKFLOW.md) for commit conventions.

## Build and check

Use Node.js 22 and the locked npm dependencies:

```sh
npm ci
npm run build
npm run format:check
```

The build must validate the generated site. It copies only explicitly allowed
public files into `_site/`; source documentation, backups, configuration, and
dependencies must not be published. When adding a new public file, update the
builder's allowlist and validator as needed.

There is no Jekyll, Liquid, Ruby, Python, Docker, Sass, or PurgeCSS build step.

## Editing rules

- Preserve `/Proof-R1/` and `/XRAG/`, including their relative asset URLs.
- Keep paper-site files unchanged during the build. Edit their source files only
  when a requested content or design change requires it.
- Keep the six static publication entries in `index.html` synchronized with
  `content/profile/publications.bib`; no BibTeX-to-HTML generation step exists.
- Place homepage assets in `homepage/`. Reference existing paper images and logos
  without changing their files.
- Keep biography drafts, private materials, and old personal-site backups out of
  the build output.
- Format changed files with the repository's installed Prettier.
- Run the build after source changes. Preview affected pages and check navigation,
  images, responsive layout, and interactive controls.
- Do not regenerate or replace either paper's logo without a request.

## Deployment

`Deploy site` builds with Node.js, saves the `validated-site` artifact, and publishes
`_site/` to the `gh-pages` branch on a default-branch push or manual run. Pull requests
only build and validate. GitHub Pages must use `gh-pages` at its root.

The deployed-site checker validates the exact artifact produced by a successful
deployment. Axe accessibility testing is available manually for the root and both
paper sites. Prettier checks use the locked npm dependencies and never rewrite or
push source files.

Do not commit or push unless authorized by the user.
