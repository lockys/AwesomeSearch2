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
- **Unit Testing:** Vitest + React Testing Library
- **E2E Testing:** Playwright (Chromium)
- **Linting:** ESLint (react-app preset)
- **Deployment:** GitHub Pages via GitHub Actions + `gh-pages` package
- **Package Manager:** npm
- **Node.js:** 20 (CI), 18 (PR previews)

## Project Structure

```
src/
├── components/              # Presentational (stateless) components
│   ├── AwesomeRwdMenu/      # Responsive mobile hamburger menu
│   ├── AwesomeLists/        # List display + sidebar menu (AwesomeListMenu)
│   ├── AwesomeHome/         # Homepage content, about section, GoogleAd
│   ├── AwesomeInput/        # Search input bar
│   ├── KeyboardShortcuts/   # Keyboard shortcut reference page
│   └── UI/
│       ├── Spinner/         # Loading indicator
│       └── Backdrop/        # Modal backdrop overlay
├── containers/              # Stateful container components
│   ├── AwesomeSearch/       # Main app state, data fetching, routing
│   └── AwesomeReadme/       # README viewer with dynamic TOC
├── App.jsx                  # Root component, theme (dark mode) management
├── App.css
├── App.test.jsx             # Root component tests
├── index.jsx                # React DOM entry point (createRoot)
├── index.css
└── setupTests.js            # Vitest test setup
e2e/                         # Playwright end-to-end tests
├── fixtures.mjs             # Mock data and helpers
├── homepage.spec.mjs        # Homepage loading, spinner, categories
├── search.spec.mjs          # Search input, results, keyboard navigation
├── theme.spec.mjs           # Dark mode toggle and persistence
└── shortcuts.spec.mjs       # Keyboard shortcuts page
public/
├── index.html               # HTML template
├── CNAME                    # Custom domain: awesomelists.calvinjeng.io
└── manifest.json            # PWA manifest
.github/
└── workflows/
    ├── deploy.yml           # GitHub Actions: build + deploy on push to main
    └── pr-preview.yml       # PR preview deployments with auto-cleanup
rsbuild.config.mjs           # Rsbuild configuration
vitest.config.mjs            # Vitest configuration
playwright.config.mjs        # Playwright configuration
.eslintrc.json               # ESLint config (react-app preset)
```

## Development Commands

```bash
npm start            # Start dev server (rsbuild dev, port 4173)
npm run build        # Production build (output: dist/)
npm run preview      # Preview production build locally
npm test             # Run unit tests once (vitest run)
npm run test:watch   # Run unit tests in watch mode (vitest)
npm run test:e2e     # Run Playwright e2e tests (starts dev server automatically)
npm run test:e2e:ui  # Run Playwright e2e tests with interactive UI
npm run deploy       # Build + deploy to GitHub Pages via gh-pages
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
  - `/shortcuts` — Keyboard shortcuts reference page

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
- **Unit tests:** Co-located with components as `ComponentName.test.jsx`
- **E2E tests:** In `e2e/` directory as `feature.spec.mjs`

## Testing

### Unit Tests (Vitest)

Tests use **Vitest** with **React Testing Library** and **jsdom** environment.

- Config: `vitest.config.mjs`
- Setup file: `src/setupTests.js` (imports `@testing-library/jest-dom`)
- Globals enabled (`describe`, `it`, `expect` available without imports)
- CSS Modules use `non-scoped` classNameStrategy in tests
- Mock HTTP with `vi.mock('axios')`
- Components requiring routing must be wrapped in `<MemoryRouter>`
- E2E tests are excluded from Vitest (`**/e2e/**`)
- Run: `npm test` (single run) or `npm run test:watch` (watch mode)

### E2E Tests (Playwright)

End-to-end tests use **Playwright** with Chromium.

- Config: `playwright.config.mjs`
- Test directory: `e2e/`
- Shared fixtures/mocks: `e2e/fixtures.mjs`
- Base URL: `http://localhost:4173` (auto-starts dev server)
- 1 retry with trace capture on first retry
- Run: `npm run test:e2e` or `npm run test:e2e:ui` (interactive)

## Key localStorage Keys

| Key | Purpose |
|-----|---------|
| `__isDark` | Dark mode preference (boolean) |
| `infoLastMod` | Timestamp of last repo metadata fetch |
| `repoInfo` | Cached repository metadata JSON |

## CI/CD

### Production Deploy (`deploy.yml`)
- Triggers on push to `main` branch
- Node.js 20, uses `npm ci`
- Steps: install → test → build → deploy to gh-pages branch
- Uses `peaceiris/actions-gh-pages@v4` with CNAME preservation
- Concurrency group `pages` with cancel-in-progress

### PR Preview Deploy (`pr-preview.yml`)
- Triggers on PR open/synchronize/reopen
- Node.js 18, uses `npm ci`
- Builds with `PUBLIC_URL` set for path-based deployment
- Deploys to `pr-preview/pr-{number}` on gh-pages
- Auto-comments on PR with preview URL (updates existing comment on subsequent pushes)
- Cleanup job removes preview folder when PR is closed

## Deployment

- Production build outputs to `dist/` directory
- Hosted on **GitHub Pages** with custom domain `awesomelists.calvinjeng.io`
- Manual deploy via `npm run deploy` (runs `gh-pages -d dist`)
- Automated deploy via GitHub Actions on push to main
- PR previews available at `awesomelists.calvinjeng.io/pr-preview/pr-{number}`
- Backend API at `api-awesomelists.calvinjeng.io` proxies GitHub README requests to avoid rate limits

## Common Pitfalls

- GitHub API has rate limits — the custom backend at `api-awesomelists.calvinjeng.io` helps mitigate this for README fetching
- Image URLs in READMEs need path fixing for relative references (handled in `AwesomeReadme`)
- HashRouter URLs use `/#/` prefix (e.g., `/#/sindresorhus/awesome-nodejs`)
- jsdom doesn't fully support `innerText` — avoid relying on it in tests (the `walk` method in AwesomeReadme uses it for TOC generation)
- All `.jsx` files must import React explicitly for compatibility with the current setup
- Dev server runs on port 4173 (configured in `rsbuild.config.mjs`), same port Playwright expects
- Vitest excludes `e2e/` directory — don't put Playwright tests elsewhere
