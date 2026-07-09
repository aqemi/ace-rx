# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server at http://localhost:3000
pnpm build        # production build → dist/
pnpm lint:fix         # ESLint (airbnb ruleset) on src/
pnpm preview      # serve the production build at :3000
```

No test suite — `pnpm test` exits with an error.

## Environment

Copy `env.template` to `.env` before running. Required vars:

Two build-time globals injected by `vite.config.js`: `__APP_VERSION__` (semver + git hash) and `__APP_EMAIL_B64__` (base64 of email).

## Architecture

React 19 class components (not hooks) + Redux Toolkit. The React Compiler babel preset is active via `@rolldown/plugin-babel`. Styles are Less with per-module files imported in each module's `index.js`.

**Module layout** — every feature under `src/modules/<Name>/` follows the same pattern:
- `component.jsx` — pure presentational component
- `container.js` — `connect()` wiring (Redux state/dispatch → props)
- `reducer.js` — or `slice.js` for newer modules using RTK's `createSlice`
- `actions.js` — thunks and plain action creators
- `api.js` — raw `fetch` calls
- `index.js` — re-exports + imports the module's Less file

## Rules
 - Prefer styles in .less file and BEM classes. Put in sx property only dynamic values.
 - Don't rewrite EXISTING Redux stores to new api
 - Don't rewrite EXISTING React class components without sufficient need
 - For colors use less variables if static, otherwise css variables if per-theme
 - Prefer MUI components


