# CLAUDE.md

## Project Overview

**AwesomeSearch** is a React single-page application that provides a searchable interface for browsing [sindresorhus/awesome](https://github.com/sindresorhus/awesome) GitHub lists. Users can search across thousands of curated awesome lists, view README files with interactive table of contents, and toggle dark mode.

**Live site:** [awesomelists.top](https://awesomelists.top)

## Tech Stack

- **Framework:** React 17 (Create React App)
- **Routing:** React Router DOM 5 (HashRouter for GitHub Pages compatibility)
- **Search:** Fuse.js (fuzzy search)
- **HTTP:** Axios
- **Styling:** CSS Modules + Hack CSS framework
- **Icons:** React Icons, FontAwesome
- **Deployment:** GitHub Pages via `gh-pages` package
- **Package Manager:** npm (pnpm-lock.yaml also present)

## Project Structure

```
src/
├── components/           # Presentational (stateless) components
│   ├── AwesomeRwdMenu/   # Responsive mobile hamburger menu
│   ├── AwesomeLists/     # List display + sidebar menu (AwesomeListMenu)
│   ├── AwesomeHome/      # Homepage content & about section
│   ├── AwesomeInput/     # Search input bar
│   └── UI/
│       ├── Spinner/      # Loading indicator
│       └── Backdrop/     # Modal backdrop overlay
├── containers/           # Stateful container components
│   ├── AwesomeSearch/    # Main app state, data fetching, routing
│   └── AwesomeReadme/    # README viewer with dynamic TOC
├── App.js                # Root component, theme (dark mode) management
├── App.css
├── index.js              # React DOM entry point
└── index.css
public/
├── index.html            # HTML template
├── CNAME                 # Custom domain: awesomelists.top
└── manifest.json         # PWA manifest
```

## Development Commands

```bash
npm start          # Start dev server (port 3000)
npm run build      # Production build
npm test           # Run tests (React Testing Library)
npm run deploy     # Build + deploy to GitHub Pages
```

Note: Scripts use `--openssl-legacy-provider` flag for Node.js compatibility.

## Architecture & Patterns

### Component Architecture
- **Containers** (`src/containers/`): Class-based components managing state and lifecycle methods. These handle data fetching, routing, and business logic.
- **Presentational** (`src/components/`): Functional components for pure UI rendering. Receive data via props.
- **No global state management** — state is local to components. Theme state lives in `App.js`.

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
- **README content:** `https://api.awesomelists.top/readme/{user}/{repo}`
- **Repo metadata:** `https://api.github.com/repos/{user}/{repo}`

### Theme System
- Dark mode toggle persisted in `localStorage` key `__isDark`
- App component applies class `hacksolarized-dark` or `hack` to root div
- Uses Hack CSS framework's solarized-dark theme variant

## Code Conventions

- **Component naming:** PascalCase for files and exports (e.g., `AwesomeSearch.js`)
- **CSS:** CSS Modules with `ComponentName.module.css` naming
- **Variables/functions:** camelCase
- **Responsive breakpoint:** `@media (max-width: 768px)`
- **Linting:** ESLint with `react-app` and `react-app/jest` presets (configured in `package.json`)

## Key localStorage Keys

| Key | Purpose |
|-----|---------|
| `__isDark` | Dark mode preference (boolean) |
| `infoLastMod` | Timestamp of last repo metadata fetch |
| `repoInfo` | Cached repository metadata JSON |

## Deployment

- Hosted on **GitHub Pages** with custom domain `awesomelists.top`
- Deploy via `npm run deploy` (runs `gh-pages -d build`)
- Backend API at `api.awesomelists.top` proxies GitHub README requests to avoid rate limits

## Common Pitfalls

- The `--openssl-legacy-provider` flag is required in npm scripts for compatibility with the current Node.js version and react-scripts 4
- GitHub API has rate limits — the custom backend at `api.awesomelists.top` helps mitigate this for README fetching
- Image URLs in READMEs need path fixing for relative references (handled in `AwesomeReadme`)
- HashRouter URLs use `/#/` prefix (e.g., `/#/sindresorhus/awesome-nodejs`)
