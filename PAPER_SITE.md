# Proof-R1 paper website

The public site now publishes the Proof-R1 project page at `https://xiaolizhang77.github.io/`.
`/Proof-R1/` redirects to that page. The previous al-folio personal website remains in this repository for restoration.

## Edit and preview

Edit `index.html`, `404.html`, and `assets/proof-r1/`. If present, `blog.html` is also published.
The page is static HTML, CSS, and JavaScript; it requires a current Node.js runtime (CI uses Node 22), without Jekyll, Ruby, or Docker.

```bash
npm run build
python -m http.server 8080 --directory _site
```

Visit `http://localhost:8080`. Always preview `_site`, because the repository root also contains the archived personal website.
The build checks local page links, image references, CSS assets, and HTML anchors before replacing the generated `_site` directory.

## What gets published

`scripts/build-paper-site.mjs` copies only these files:

- `index.html`, `404.html`, `robots.txt`, and `sitemap.xml`
- `blog.html`, when present
- Files under `assets/proof-r1/`

It also generates `.nojekyll` and the `/Proof-R1/` redirect. The old `_pages`, `_data`, `_bibliography`, templates, personal images, CV, and other assets are excluded from the deployment. They remain accessible as repository source; hiding the website does not make this public Git repository private.

`.github/workflows/deploy.yml` runs the same build on pushes to `main` or `master`, then deploys `_site` to `gh-pages` with stale-file cleanup. Pull requests run the build without publishing. GitHub Pages should continue using the `gh-pages` branch.
The post-deployment link check validates the deployed source commit with this same build. The manual Axe accessibility workflow also checks the static paper site.

## Restore the personal website

The personal content and `_config.yml` are unchanged. The previous Jekyll deployment workflow and `robots.txt` are preserved in Git at commit `bb2d681`.

To restore it, first move the new root `index.html` and `404.html` out of the Jekyll source, or place the paper site in its own subdirectory and update its asset paths. This prevents conflicts with `_pages/about.md` and `_pages/404.md`.
Restore `.github/workflows/deploy.yml`, `.github/workflows/broken-links-site.yml`, `.github/workflows/axe.yml`, and `robots.txt` from `bb2d681`, then follow the Docker build and verification instructions in `INSTALL.md` before publishing.
