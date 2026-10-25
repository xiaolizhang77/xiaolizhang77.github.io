# Proof-R1 paper website

The Proof-R1 project page lives at `https://xiaolizhang77.github.io/Proof-R1/`.
The root URL has an independent, minimal project link and can be replaced with a different homepage later. It does not redirect to the paper.
The previous al-folio personal website remains in this repository for restoration.

## Edit and preview

Edit `Proof-R1/index.html`, `Proof-R1/blog.html`, and `Proof-R1/assets/` for the paper site.
The root `index.html` is independent of the paper; `404.html` links visitors back to `/Proof-R1/`.
The page is static HTML, CSS, and JavaScript; it requires a current Node.js runtime (CI uses Node 22), without Jekyll, Ruby, or Docker.

```bash
npm run build
python -m http.server 8080 --directory _site
```

Visit `http://localhost:8080/Proof-R1/`. The Chinese article is at `/Proof-R1/blog.html`.
Always preview `_site`, because the repository root also contains the archived personal website.
The build checks local page links, image references, CSS assets, and HTML anchors before replacing the generated `_site` directory.

## What gets published

`scripts/build-paper-site.mjs` copies only these files:

- `index.html`, `404.html`, `robots.txt`, and `sitemap.xml`
- The self-contained `Proof-R1/` directory, including the paper page, Chinese article, and assets

It also generates `.nojekyll`. The old `_pages`, `_data`, `_bibliography`, templates, personal images, CV, and other assets are excluded from the deployment. They remain accessible as repository source; hiding the website does not make this public Git repository private.

`.github/workflows/deploy.yml` runs the same build on pushes to `main` or `master`, then deploys `_site` to `gh-pages` with stale-file cleanup. Pull requests run the build without publishing. GitHub Pages should continue using the `gh-pages` branch.
The post-deployment link check validates the deployed source commit with this same build. The manual Axe accessibility workflow also checks the static paper site.

## Restore the personal website

The personal content and `_config.yml` are unchanged. The previous Jekyll deployment workflow and `robots.txt` are preserved in Git at commit `bb2d681`.

To restore it, first move the new root `index.html` and `404.html` out of the Jekyll source. This prevents conflicts with `_pages/about.md` and `_pages/404.md`.
The paper site is already self-contained under `Proof-R1/` and can stay there.
Restore `.github/workflows/deploy.yml`, `.github/workflows/broken-links-site.yml`, `.github/workflows/axe.yml`, and `robots.txt` from `bb2d681`, then follow the Docker build and verification instructions in `INSTALL.md` before publishing.
