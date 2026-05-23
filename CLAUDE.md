# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal academic website built with [Eleventy](https://www.11ty.dev/) (v3), templated in Nunjucks, with a LaTeX-generated CV. Content is data-driven via JSON files in `_data/`.

## Commands

- `make deps` — install dependencies (uses Bun, not npm/yarn)
- `make serve` — start the dev server with live reload
- `make build` — full build (runs `bun run eleventy`)
- `make cv.pdf` — build site and compile CV from LaTeX to PDF (requires `pdflatex`)

Always use `bun` (not `npm` or `yarn`) if invoking package manager commands directly.

## CV compilation

The CV is generated from `cv/cv.tex.njk` (a Nunjucks template that produces LaTeX). The `.eleventy.js` `after` hook runs `pdflatex` twice automatically during build to resolve references. This requires a working LaTeX installation (`texlive-latex-base`, `texlive-latex-extra`, `texlive-fonts-recommended`). `TEXINPUTS` is set to include `_site/assets/images/` so image paths resolve correctly.

## Content structure

All structured content lives in `_data/`:
- `publications.json` — research publications (fields: `title`, `authors`, `venue`, `year`, `pdf`, `doi`, `artifact`, `abstract`, `tags`, `selected`, `projects`)
- `team.json` — team members (fields: `name`, `url`, `role`, `projects`, `image`)
- `posters.json` — conference posters
- `site.json` / `metadata.json` — site-wide metadata and RSS config

Nunjucks templates in `_includes/` filter this data by `projectName` to render per-project pages.

## Custom Eleventy filters

Defined in `.eleventy.js`: `formatAuthors` (bolds "Tommy McMichen"), `texEscape` / `texFormatAuthors` (LaTeX-safe equivalents), `sortByYear`, `dateFormat`, `toWWW`, and standard array utilities (`map`, `head`, `flatten`, `unique`, `sort`).

## Deployment

CI (`.github/workflows/deploy.yml`) deploys from `main` to a separate public GitHub Pages repo (`tommymcm/tommymcm.github.io`) using the `PAGES_DEPLOY_TOKEN` secret. Do not push secrets or tokens into source.

## Build output

`_site/` is the generated output directory — it is gitignored and should never be edited directly.
