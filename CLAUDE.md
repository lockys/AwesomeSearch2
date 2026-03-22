# CLAUDE.md

## Project Overview

**AwesomeSearch** is a React single-page application that provides a searchable interface for browsing [sindresorhus/awesome](https://github.com/sindresorhus/awesome) GitHub lists. Users can search across thousands of curated awesome lists, view README files with interactive table of contents, and toggle dark mode.

**Live site:** [awesomelists.calvinjeng.io](https://awesomelists.calvinjeng.io)

## Tech Stack

- **Framework:** React 18 (functional + class components)
- **Bundler:** Rsbuild
- **Routing:** React Router DOM 5 (HashRouter for GitHub Pages compatibility)
- **Search:** Fuse.js (fuzzy search)
- **HTTP:** Axios
- **Styling:** CSS Modules + Hack CSS framework (loaded via CDN)
- **Icons:** React Icons, FontAwesome
- **Testing:** Vitest + React Testing Library
- **Deployment:** GitHub Pages via GitHub Actions + `gh-pages` package
- **Package Manager:** npm

## Project Structure

```
src/
├── components/              # Presentational (stateless) components
│   ├── AwesomeRwdMenu/      # Responsive mobile hamburger menu
│   ├── AwesomeLists/        # List display + sidebar menu (AwesomeListMenu)
│   ├── AwesomeHome/         # Homepage content & about section
│   ├── AwesomeInput/        # Search input bar
│   └── UI/
│       ├── Spinner/         # Loading indicator
│       └── Backdrop/        # Modal backdrop overlay
├── containers/              # Stateful container components
│   ├── AwesomeSearch/       # Main app state, data fetching, routing
│   └── AwesomeReadme/       # README viewer with dynamic TOC
├── App.jsx                  # Root component, theme (dark mode) management
├── App.css
├── index.jsx                # React DOM entry point (createRoot)
├── index.css
└── setupTests.js            # Vitest test setup
public/
├── index.html               # HTML template
├── CNAME                    # Custom domain: awesomelists.calvinjeng.io
└── manifest.json            # PWA manifest
.github/
└── workflows/
    └── deploy.yml           # GitHub Actions: build + deploy on push to main
rsbuild.config.mjs           # Rsbuild configuration
vitest.config.mjs            # Vitest configuration
```

## Development Commands

```bash
npm start          # Start dev server (rsbuild dev)
npm run build      # Production build (output: dist/)
npm run preview    # Preview production build locally
npm test           # Run tests once (vitest run)
npm run test:watch # Run tests in watch mode (vitest)
npm run deploy     # Build + deploy to GitHub Pages via gh-pages
```

## Architecture & Patterns

### Component Architecture
- **Containers** (`src/containers/`): Class-based components managing state and lifecycle methods. Handle data fetching, routing, and business logic.
- **Presentational** (`src/components/`): Functional components for pure UI rendering. Receive data via props.
- **No global state management** — state is local to components. Theme state lives in `App.jsx`.

### File Extensions
- All React component files use `.jsx` extension (required by Vite/Vitest for JSX parsing)
- All component files must `import React from 'react'` (needed for class components and legacy compatibility)

### Routing
- Uses `HashRouter` (not `BrowserRouter`) for GitHub Pages compatibility
- Routes:
  - `/` — Homepage with category list menu
  - `/:user/:repo` — README viewer for a specific repo

### Data Flow
1. `AwesomeSearch` fetches `awesome.json` from GitHub on mount
2. Data is flattened into a searchable array for Fuse.js indexing
3. Category selection filters and displays items via `AwesomeLists`
4. Clicking an item navigates to `AwesomeReadme`, which fetches the README via custom backend
5. Repo metadata (stars, last update) is cached in `localStorage`

### API Endpoints
- **Awesome list data:** `https://raw.githubusercontent.com/lockys/awesome.json/master/awesome/awesome.json`
- **README content:** `https://api-awesomelists.calvinjeng.io/readme/{user}/{repo}`
- **Repo metadata:** `https://api.github.com/repos/{user}/{repo}`

### Theme System
- Dark mode toggle persisted in `localStorage` key `__isDark`
- App component applies class `hacksolarized-dark` or `hack` to root div
- Uses Hack CSS framework's solarized-dark theme variant

## Code Conventions

- **Component naming:** PascalCase for files and exports (e.g., `AwesomeSearch.jsx`)
- **File extensions:** `.jsx` for all files containing JSX
- **CSS:** CSS Modules with `ComponentName.module.css` naming
- **Variables/functions:** camelCase
- **Responsive breakpoint:** `@media (max-width: 768px)`
- **Tests:** Co-located with components as `ComponentName.test.jsx`

## Testing

Tests use **Vitest** with **React Testing Library** and **jsdom** environment.

- Config: `vitest.config.mjs`
- Setup file: `src/setupTests.js` (imports `@testing-library/jest-dom`)
- Mock HTTP with `vi.mock('axios')`
- Components requiring routing must be wrapped in `<MemoryRouter>`
- Run: `npm test` (single run) or `npm run test:watch` (watch mode)

## Key localStorage Keys

| Key | Purpose |
|-----|---------|
| `__isDark` | Dark mode preference (boolean) |
| `infoLastMod` | Timestamp of last repo metadata fetch |
| `repoInfo` | Cached repository metadata JSON |

## CI/CD

- **GitHub Actions** workflow at `.github/workflows/deploy.yml`
- Triggers on push to `main` branch
- Steps: install → test → build → deploy to gh-pages branch
- Uses `peaceiris/actions-gh-pages@v4` with CNAME preservation
- Custom domain: `awesomelists.calvinjeng.io`

## Deployment

- Production build outputs to `dist/` directory
- Hosted on **GitHub Pages** with custom domain `awesomelists.calvinjeng.io`
- Manual deploy via `npm run deploy` (runs `gh-pages -d dist`)
- Automated deploy via GitHub Actions on push to main
- Backend API at `api-awesomelists.calvinjeng.io` proxies GitHub README requests to avoid rate limits

## Common Pitfalls

- GitHub API has rate limits — the custom backend at `api-awesomelists.calvinjeng.io` helps mitigate this for README fetching
- Image URLs in READMEs need path fixing for relative references (handled in `AwesomeReadme`)
- HashRouter URLs use `/#/` prefix (e.g., `/#/sindresorhus/awesome-nodejs`)
- jsdom doesn't fully support `innerText` — avoid relying on it in tests (the `walk` method in AwesomeReadme uses it for TOC generation)
- All `.jsx` files must import React explicitly for compatibility with the current setup
