# Paper websites

The repository hosts two independent paper websites:

- Proof-R1: `https://xiaolizhang77.github.io/Proof-R1/`
- XRAG: `https://xiaolizhang77.github.io/XRAG/`

The root URL has a minimal index linking to both projects and can be replaced with a different homepage later. It does not redirect to either paper.
The previous al-folio personal website remains in this repository for restoration.

## Edit and preview

Edit each project's `index.html`, `blog.html`, and `assets/` inside `Proof-R1/` or `XRAG/`.
The root `index.html` is independent of both projects; `404.html` links visitors back to `/Proof-R1/`.
The sites use static HTML, CSS, and JavaScript; they require a current Node.js runtime (CI uses Node 22), without Jekyll, Ruby, or Docker.

```bash
npm run build
python -m http.server 8080 --directory _site
```

Visit `http://localhost:8080/Proof-R1/` or `http://localhost:8080/XRAG/`. Each project's Chinese article is at its `blog.html` path.
Always preview `_site`, because the repository root also contains the archived personal website.
The build checks local page links, image references, CSS assets, and HTML anchors before replacing the generated `_site` directory.

## What gets published

`scripts/build-paper-site.mjs` copies only these files:

- `index.html`, `404.html`, `robots.txt`, and `sitemap.xml`
- The self-contained `Proof-R1/` and `XRAG/` directories, including each paper page, Chinese article, and assets

The project directory allowlist is defined in `scripts/build-paper-site.mjs`. Each listed project must have an `index.html` and an `assets/` directory. To add another paper, update that allowlist, the root project index, `sitemap.xml`, and the push/pull-request path filters in `.github/workflows/deploy.yml`.

It also generates `.nojekyll`. The old `_pages`, `_data`, `_bibliography`, templates, personal images, CV, and other assets are excluded from the deployment. They remain accessible as repository source; hiding the website does not make this public Git repository private.

`.github/workflows/deploy.yml` runs the same build on pushes to `main` or `master`, then deploys `_site` to `gh-pages` with stale-file cleanup. Pull requests run the build without publishing. GitHub Pages should continue using the `gh-pages` branch.
The post-deployment link check validates the deployed source commit with this same build. The manual Axe accessibility workflow accepts either project's page path, including `XRAG/` and `XRAG/blog.html`.

## Restore the personal website

The personal content and `_config.yml` are unchanged. The previous Jekyll deployment workflow and `robots.txt` are preserved in Git at commit `bb2d681`.

To restore it, first move the new root `index.html` and `404.html` out of the Jekyll source. This prevents conflicts with `_pages/about.md` and `_pages/404.md`.
The paper sites are self-contained under `Proof-R1/` and `XRAG/` and can stay there.
Restore `.github/workflows/deploy.yml`, `.github/workflows/broken-links-site.yml`, `.github/workflows/axe.yml`, and `robots.txt` from `bb2d681`, then follow the Docker build and verification instructions in `INSTALL.md` before publishing.
