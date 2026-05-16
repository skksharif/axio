# Repository Guidelines

## Project Overview

Axio is a React 19 + Vite 8 loan application wizard. There is no client-side router — screen navigation is index-based, driven entirely by `AppContext`. All 14 screens live in `src/screens/`, are lazy-loaded via `React.lazy`, and share state through a single context.

## Project Structure & Module Organization

| Path | Purpose |
|---|---|
| `src/screens/` | One file (+ optional paired `.css`) per wizard step |
| `src/components/layout/` | `Sidebar`, `TopBar` — persistent shell chrome |
| `src/components/common/`, `ui/`, `feature/`, `forms/` | Shared UI primitives and form controls |
| `src/context/AppContext.jsx` | Single source of truth: all wizard state + navigation helpers |
| `src/constants/screens.js` | Ordered `SCREENS` array — the screen index must stay in sync with `SCREEN_COMPONENTS` in `App.jsx` |
| `src/data/` | Static lookup tables (lenders, income types, expense categories, etc.) |
| `src/validations/` | Form validation logic |
| `src/styles/` | Global CSS (`variables.css`, `global.css`, `animations.css`) |

**Navigation:** call `next()`, `prev()`, or `goTo(i)` from `useApp()`. Never manipulate `currentScreen` directly. Adding a new screen requires: (1) add entry to `SCREENS` in `screens.js`, (2) create the screen component, (3) add a lazy import and push to `SCREEN_COMPONENTS` in `App.jsx` at the matching index.

## Build & Development Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # Production build → dist/
npm run preview   # Serve the production build locally
npm run lint      # ESLint (js, jsx)
```

No test runner is configured.

## Design System — CSS Variables

All styling uses CSS custom properties defined in `src/styles/variables.css`. **Never hardcode colors, radii, or spacing.**

- **Backgrounds:** `--bg0` through `--bg4` (dark purple scale)
- **Brand:** `--accent`, `--accent2`, `--cta`, `--hover`, `--deep`
- **Gradients:** `--accentg`, `--accentg-deep`, `--dashg`
- **Glass/borders:** `--border`, `--border2`, `--glass-border`, `--white-glass`
- **Text:** `--text0` (primary), `--text1` (muted), `--text2` (dim/labels)
- **Status:** `--green/--greenbg/--greenborder`, `--yellow*`, `--red*`
- **Glow/shadows:** `--glow-sm/md/lg`, `--card-shadow`, `--card-shadow-hover`
- **Radii:** `--r6` through `--r32`
- **Spacing scale:** `--sp4` through `--sp36`
- **Fonts:** `--font-display` / `--font-body` (Inter), `--font-ai` (Geist)
- **Layout:** `--sidebar-w` (276px), `--topbar-h` (60px), `--content-px/py/pb`

## Coding Style & Conventions

- **JavaScript only** — no TypeScript. Files use `.jsx` for components, `.js` for everything else.
- **Pure CSS** — no Tailwind, no CSS-in-JS, no styled-components. Each screen/component may have a co-located `.css` file.
- **Named exports** for all screen components; `App.jsx` uses `.then(m => ({ default: m.ScreenName }))` in lazy imports.
- **Hooks:** always consume context via `useApp()`, never import `AppContext` directly.
- ESLint enforces `eslint:recommended` + `react-hooks` + `react-refresh` rules.

## Commit Conventions

Short imperative summary with an optional prefix. Common patterns from history:

```
Fix : <what>
Enhancement : <what>
Revert: <what>
<Feature name>        ← for larger additions
```
