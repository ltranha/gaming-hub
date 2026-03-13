# Agent Guidelines — games-hub

## Workspace Purpose

A multiplayer games hub built with Next.js. Contains 5 playable games with local and AI modes, config-driven game management, and admin dashboard.

## Architecture

- **Game registry**: `lib/game-registry.ts` — single source of truth for all games
- **Game logic**: `lib/games/<slug>.ts` — pure functions, no UI dependencies
- **Game UI**: `app/games/<slug>/client.tsx` — React client components
- **Shared UI**: `components/games/` — GameShell, ModeSelector, GameGrid
- **Design tokens**: `app/globals.css` — CSS custom properties under `:root`

## Styling

**Inline styles only.** No Tailwind, no CSS modules, no className attributes.

- All layout uses `style={{ ... }}` on JSX elements
- Colors reference CSS variables: `var(--color-primary)`, etc.
- Centering: `marginLeft: "auto", marginRight: "auto"` with explicit `maxWidth`
- Reusable styles are extracted as `React.CSSProperties` constants
- See `.cursor/rules/styling.mdc` for full guidelines

## Key Conventions

1. Game logic is pure functions (immutable state, no side effects)
2. All games use `GameShell` wrapper for consistent navigation and centering
3. New games follow the pattern in `docs/ADDING_A_GAME.md`
4. Config changes go in `lib/game-registry.ts` (hide/show/categorize)
5. No console.log in production code
6. JSDoc comments on all exported functions
7. Update CONTEXT.md after significant changes
8. Test locally with `npm run dev` before marking complete

## When Adding a Game

1. Add entry to `lib/game-registry.ts`
2. Create `lib/games/<slug>.ts` (pure logic)
3. Create `app/games/<slug>/page.tsx` + `client.tsx` (UI with inline styles)
4. Use `GameShell` wrapper, inline styles, and design tokens
5. Verify it appears on hub and is playable
6. Update CONTEXT.md and TODO.md
