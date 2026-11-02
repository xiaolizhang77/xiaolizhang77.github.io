# Personal homepage and paper websites

The root URL `https://xiaolizhang77.github.io/` serves Qili Zhang's al-folio personal homepage again. Both paper websites keep their URLs and are linked from the About page:

- Proof-R1: `https://xiaolizhang77.github.io/Proof-R1/`
- XRAG: `https://xiaolizhang77.github.io/XRAG/`

Their HTML, CSS, JavaScript, logos, figures, and PDFs remain self-contained; Jekyll copies them without processing their content.

The paper directories are excluded from Jekyll Minifier. A small post-write hook restores their original scripts because Jekyll Terser has no per-path exclusion. This also applies to local watch rebuilds.

## Edit and preview

- Biography and paper links: `_pages/about.md`.
- Publications: `_bibliography/papers.bib`, synchronized with the six entries on [Google Scholar](https://scholar.google.com/citations?user=MKR62vEAAAAJ&hl=zh-CN) on 2026-11-02.
- Web CV: `_data/cv.yml`. The old PDF is retained in source but excluded from publication; its download and search entries have been removed.
- Contact: `_data/socials.yml`; repositories: `_data/repositories.yml`.
- Paper websites: each project's `index.html`, `blog.html`, and `assets/`.

Use the existing Docker workflow:

```bash
docker compose up --build
```

Visit `http://localhost:8080/`, `/Proof-R1/`, or `/XRAG/`. Stop with `docker compose down`.

With Ruby, Bundler, Node.js, ImageMagick, and the dependencies installed:

```bash
bundle install
npm run build
python -m http.server 8080 --directory _site
```

`npm run build` builds and validates the complete Jekyll site. The former paper-only builder has been removed so it cannot erase the rest of a full build.

`npm run check:site` validates an existing `_site`. Use `node scripts/validate-built-site.mjs --directory <path>` for another build directory. It checks personal routes, local references, sitemap, excluded templates, and byte-for-byte preservation of both paper websites.

## Deployment

`.github/workflows/deploy.yml` builds the complete site on pushes to `main` or `master`, validates it, saves the build artifact, and publishes `_site` to `gh-pages` with stale-file cleanup. Pull requests build without publishing. Keep GitHub Pages configured to publish from `gh-pages`.

The post-deployment check validates the same build artifact against its source commit. The manual Axe workflow checks the published site and accepts `/`, `Proof-R1/`, `XRAG/`, or another page path.

Do not add a static root `index.html`, `404.html`, or `sitemap.xml`: the About page, 404 page, and Jekyll sitemap generate those paths.

## Content still to finish

Reviewed on 2026-11-02. The biography now says “third-year,” the public email is `zhangqili@buaa.edu.cn`, and the publications match the user's Google Scholar list. Beihang University links to its verified official homepage. A public official website for Zhongguancun Laboratory could not be verified, so its name is displayed without a placeholder link.

| Area             | Follow-up                                                                                                                                  | Source                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| Web CV           | Add research/internship experience, teaching assistance, awards, and publications as appropriate; only Education and Skills are populated. | `_data/cv.yml`                     |
| Laboratory link  | Add a verified official website if one becomes available.                                                                                  | `_pages/about.md`                  |
| Optional details | Add a contact note, favicon/share image, news, teaching, projects, or more repositories only if needed.                                    | `_config.yml`, `_data/`, `_pages/` |

The erroneous Einstein INSPIRE social link has been removed. The unused Einstein JSON/PDF samples and unfinished teaching/projects pages remain in source but are excluded from publication. The active CV uses `_data/cv.yml`; JSONResume loading is disabled until its sample is replaced.

Coauthor and venue examples remain in `_data/coauthors.yml` and `_data/venues.yml`. They do not match the current paper entries and can be replaced when needed. Comments, analytics, newsletters, and most social accounts are optional; their empty settings do not prevent the homepage from working.
