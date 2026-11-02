# Qili Zhang's research homepage

This repository contains a new static personal homepage at the root and two standalone paper websites:

- [Proof-R1](https://xiaolizhang77.github.io/Proof-R1/)
- [XRAG](https://xiaolizhang77.github.io/XRAG/)

The personal homepage is implemented in `index.html`, with its CSS, JavaScript, portrait, and favicon in `homepage/`. The previous al-folio template and its Jekyll/Ruby/Docker build have been removed. Both paper websites retain their own original files and URLs.

## Build and preview

Node.js 22 or newer is sufficient to build the site. Install the development formatter with `npm ci`, then run:

```sh
npm run format
npm run build
npm run check:site
```

To preview the generated files with Python:

```sh
python -m http.server 8080 --bind 127.0.0.1 --directory _site
```

Open `http://127.0.0.1:8080/`, `/Proof-R1/`, or `/XRAG/`.

The build copies only `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`, `homepage/`, and the two paper directories to `_site/`. It first clears previous generated output, then checks local links, anchors, the sitemap, required homepage assets, and byte-for-byte preservation of every published file. Saved profile material, build scripts, and retired personal pages are not published.

## Deployment

Push source changes to `main` to trigger **Deploy site**. The workflow builds and validates the site, saves the `validated-site` artifact, and publishes to `gh-pages` with stale-file cleanup. GitHub Pages should continue serving `gh-pages` at `/ (root)`.

Pull requests build without deploying. The site validation workflow checks the artifact from the exact deployment run; manual checks export the current `gh-pages` branch. Accessibility checks cover the personal homepage and both paper sites.

## Updating the personal homepage

The source material is preserved in [content/profile](content/profile/README.md): biography, six Scholar publications, contact and affiliation details, CV data, repositories, and portrait. This directory is not included in Pages output; it remains part of the source repository. The public homepage uses the selected content in `index.html` and public assets in `homepage/`.

The six publication entries are static HTML in `index.html`; they are not generated from BibTeX. Keep their titles, authors, venues, years, and links synchronized with `content/profile/publications.bib` when updating either file. Keep other confirmed profile details consistent with the saved material as well.

The full previous homepage is recoverable from Git commit `71e4d43`. There is no active copy of its layouts, plugins, vendor assets, or template configuration.

Keep `/Proof-R1/` and `/XRAG/` stable. The homepage may reference existing paper logos and images without modifying the paper directories. Place new homepage assets in `homepage/`; if adding a new public root path, update the explicit build and validation file lists together.
