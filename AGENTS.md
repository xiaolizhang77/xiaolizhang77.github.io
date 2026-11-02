# Agent guidelines

## Monitoring cadence

For recurring monitoring or inspection, use an interval of at least two hours unless the user explicitly requests a different cadence.

## Project

This repository is a static project directory plus the independent `Proof-R1/` and `XRAG/` paper websites. The old al-folio/Jekyll personal homepage has been removed at the user's request.

Read [.github/copilot-instructions.md](.github/copilot-instructions.md) and [README.md](README.md) before editing. Follow [.github/GIT_WORKFLOW.md](.github/GIT_WORKFLOW.md) for commits.

- Preserve both paper paths and assets unless the user requests changes to them.
- Keep saved material in `content/profile/` out of published output.
- Edit source files, never generated `_site/` or the `gh-pages` branch.
- Keep the build and validator publication allowlists synchronized when adding files.
- Do not invent personal details or publication metadata.
- The user handles pushing unless they explicitly request it.

Before committing, run `npm run format`, `npm run build`, and `npm run format:check`. Inspect the root page and both paper sites in a browser, including a mobile viewport. No Jekyll, Ruby, Docker, or PurgeCSS step is required.
