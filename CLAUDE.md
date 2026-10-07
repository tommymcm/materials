# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal academic website built with [Eleventy](https://www.11ty.dev/) (v3), templated in Nunjucks, with a Typst-generated CV. Content is data-driven via JSON files in `_data/`.

## Commands

- `make deps` — install dependencies (uses Bun, not npm/yarn)
- `make serve` — start the dev server with live reload
- `make build` — full build (runs `bun run eleventy`)
- `make cv.pdf` — build site and compile CV from Typst to PDF (requires `typst`)

Always use `bun` (not `npm` or `yarn`) if invoking package manager commands directly.

## CV compilation

The CV is generated from `cv/cv.typ.njk` (a Nunjucks template that produces Typst source). The `.eleventy.js` `after` hook runs `typst compile --root _site _site/cv/cv.typ _site/cv/cv.pdf` automatically during build, so images are referenced as `/assets/images/...`. This requires the `typst` CLI on `PATH` (https://github.com/typst/typst/releases). The CV uses Typst's bundled Libertinus Serif, so no system fonts are needed. Text from `_data/` is run through the `typstEscape` filter; use it (with `| safe`) for any new field.

## Content structure

All structured content lives in `_data/`:
- `publications.json` — research publications (fields: `title`, `authors`, `venue`, `year`, `pdf`, `doi`, `artifact`, `abstract`, `tags`, `selected`, `projects`)
- `team.json` — team members (fields: `name`, `url`, `role`, `projects`, `image`)
- `posters.json` — conference posters
- `site.json` / `metadata.json` — site-wide metadata and RSS config

Nunjucks templates in `_includes/` filter this data by `projectName` to render per-project pages.

## Custom Eleventy filters

Defined in `.eleventy.js`: `formatAuthors` (bolds "Tommy McMichen"), `typstEscape` / `typstFormatAuthors` (Typst-safe equivalents), `texEscape` / `texFormatAuthors` (LaTeX-safe, currently unused), `sortByYear`, `dateFormat`, `toWWW`, and standard array utilities (`map`, `head`, `flatten`, `unique`, `sort`).

## Deployment

CI (`.github/workflows/deploy.yml`) deploys from `main` to a separate public GitHub Pages repo (`tommymcm/tommymcm.github.io`) using the `PAGES_DEPLOY_TOKEN` secret. Do not push secrets or tokens into source.

## Build output

`_site/` is the generated output directory — it is gitignored and should never be edited directly.
