# Research websites

This repository hosts two standalone paper websites:

- [Proof-R1](https://xiaolizhang77.github.io/Proof-R1/)
- [XRAG](https://xiaolizhang77.github.io/XRAG/)

The root page is a small project directory while the personal homepage is being redesigned. The previous al-folio template and its Jekyll/Ruby/Docker build have been removed.

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

The build copies only `index.html`, `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`, and the two paper directories to `_site/`. It first clears previous generated output, then checks local links, anchors, the sitemap, and byte-for-byte preservation of every published file. Source files, saved profile material, and retired personal pages are not published.

## Deployment

Push source changes to `main` to trigger **Deploy site**. The workflow builds and validates the site, saves the `validated-site` artifact, and publishes to `gh-pages` with stale-file cleanup. GitHub Pages should continue serving `gh-pages` at `/ (root)`.

Pull requests build without deploying. The site validation workflow checks the artifact from the exact deployment run; manual checks export the current `gh-pages` branch. Accessibility checks cover the project directory and both paper sites.

## Rebuilding the personal homepage

The material already filled in is preserved in [content/profile](content/profile/README.md): biography, six Scholar publications, contact and affiliation details, CV data, repositories, and portrait. This directory is not included in Pages output; it remains part of the source repository.

The full previous homepage is recoverable from Git commit `71e4d43`. There is no active copy of its layouts, plugins, vendor assets, or template configuration.

Keep `/Proof-R1/` and `/XRAG/` stable when adding the new homepage. If it needs new root assets, update the explicit build and validation file lists together.
