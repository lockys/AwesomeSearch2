# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Awesome Search is a React web application that provides a unified search interface for all "awesome" lists from [sindresorhus/awesome](https://github.com/sindresorhus/awesome). The app fetches data from the GitHub API and allows users to browse and search through curated lists of resources.

Live site: https://awesomelists.top

## Development Commands

```bash
npm start          # Start Rspack dev server (port 5173, auto-opens browser)
npm run build      # Build for production to /dist
npm run preview    # Preview production build locally
npm run deploy     # Build and deploy to GitHub Pages
```

## Architecture

**Build System**: Rspack with SWC (migrated from Vite)

**Routing**: HashRouter from react-router-dom (enables direct linking like `/#/user/repo`)

**State Management**: Local component state (class-based in containers, functional in components)

**Styling**: CSS Modules + [Hack CSS framework](https://hackcss.egoist.dev/) (loaded via CDN)

**Key Data Flow**:
1. `AwesomeSearch` (container) fetches awesome.json from `lockys/awesome.json` repo on mount
2. Data is indexed with Fuse.js for fuzzy search in the search input
3. When a repo is selected, `AwesomeReadme` fetches the rendered README from `api.awesomelists.top`
4. GitHub API provides repo metadata (stars, last update) with localStorage caching

**Component Structure**:
- `src/containers/` - Stateful container components (AwesomeSearch, AwesomeReadme)
- `src/components/` - Presentational components (AwesomeInput, AwesomeLists, etc.)
- `src/components/UI/` - Reusable UI primitives (Spinner, Backdrop)

**Theme Support**: Dark/light mode toggle persisted in localStorage (`__isDark`), uses Hack CSS's solarized-dark theme

## External Dependencies

- **Data source**: https://raw.githubusercontent.com/lockys/awesome.json/master/awesome/awesome.json
- **README API**: https://api.awesomelists.top/readme/{user}/{repo}
- **GitHub API**: https://api.github.com/repos/{user}/{repo} (60 requests/hr rate limit)

## Deployment

GitHub Actions workflow deploys to GitHub Pages on push to main/master. Build output goes to `./build` directory for deployment (note: local Vite builds to `./dist`).
