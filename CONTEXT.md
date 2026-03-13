# Context — games-hub

## Objective

Build a production-ready games hub with 5 playable games, config-driven game management, admin dashboard, and Firebase integration for online play.

## What Was Done

### Architecture
- **Framework**: Next.js 15 with App Router (migrated from vanilla HTML/JS)
- **Styling**: Inline styles with CSS custom properties (design tokens in `globals.css`). No CSS framework — all layout is explicit inline CSS for predictable centering and control.
- **State management**: React useState with pure game logic functions
- **Game registry**: Config-driven from `lib/game-registry.ts`

### Games Implemented (5 total)

| Game | Logic File | Modes | AI | Status |
|------|-----------|-------|-----|--------|
| Tic-Tac-Toe | `lib/games/tic-tac-toe.ts` | Local, AI, Online | Minimax (3 difficulties) | Complete |
| Connect Four | `lib/games/connect-four.ts` | Local, AI, Online | Win/block + center preference | Complete |
| Memory | `lib/games/memory.ts` | Local | N/A | Complete |
| Chess | `lib/games/chess.ts` | Local, AI | Capture-priority + random | Complete |
| Just One | `lib/games/just-one.ts` | Local (pass-and-play) | N/A | Complete |

### Shared Components
- `GameShell` — consistent wrapper with back nav, title, status, restart
- `ModeSelector` — mode selection cards (local/AI/online)
- `GameGrid` — hub card grid with category filter and search
- `Toaster` — lightweight toast notification system
- `Navbar` — sticky navigation with active state

### Admin Dashboard
- Password-protected admin panel at `/admin`
- Game registry table with status, modes, visibility
- Quick actions and management guide
- Stats cards (total games, active, public, categories)

### Documentation
- README.md with badges, structure, quick start
- ADDING_A_GAME.md step-by-step guide
- Full markdown pack (CONTEXT, DEPLOY, CONTRIBUTING, etc.)

## Decisions Made

- **Next.js over vanilla HTML**: App Router with file-based routing makes adding games trivial (`app/games/[slug]/`). Slug-based routing replaces manual link wiring.
- **Pure logic separation**: Game logic (`lib/games/*.ts`) is pure functions with immutable state updates. No DOM manipulation. This makes logic testable and reusable for both local and online modes.
- **Config-driven registry**: One file (`lib/game-registry.ts`) controls what appears on the hub. Hide, show, or categorize games without touching game code.
- **Local-first development**: All games work without Firebase. LOCAL_MODE is the default via `.env.local`.
- **Chess simplified**: No castling, en passant, or deep checkmate detection. King capture ends the game. This is documented as a known limitation.
- **Just One adapted**: Original used socket.io; this version uses pass-and-play locally with Firebase online planned for v1.1.

## Known Limitations

- Chess lacks castling, en passant, and proper check/checkmate validation
- Online multiplayer requires Firebase setup (not included in v1.0 local build)
- Just One is currently pass-and-play only (online requires room system)
- Admin dashboard uses hardcoded password (switch to Firebase Auth for production)

## Current State

**v1.0 complete.** All 5 games playable locally. Hub page, admin dashboard, and documentation complete. Firebase online mode planned for v1.1.

## Performance Notes

- Build size: ~8 routes, 2–8 KB JS per page (game logic only)
- Shared chunk: ~102 KB (Next.js + React runtime, loaded once, cached)
- All pages are statically prerendered (no server-side rendering at request time)
- No external API calls at build time
- Zero runtime dependencies beyond Next.js and React

### Scaling: Adding More Games

Next.js code-splits each route into its own JS chunk. **Adding new games does NOT increase
load time for existing pages.** The hub page only loads game metadata (~200 bytes per game),
not the game logic itself. Each game's logic and UI are loaded only when the user navigates
to that game's page. Even with 50+ games, the hub page stays lightweight because it only
renders card metadata from `game-registry.ts`.

For images, use lazy loading (`loading="lazy"`) and keep icons as SVGs (< 5KB each).
