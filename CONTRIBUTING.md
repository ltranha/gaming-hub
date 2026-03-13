# Contributing — games-hub

## How to Contribute

### Adding a New Game
See [docs/ADDING_A_GAME.md](docs/ADDING_A_GAME.md) for the full guide.

Summary:
1. Add entry to `lib/game-registry.ts`
2. Create `lib/games/<slug>.ts` (pure game logic)
3. Create `app/games/<slug>/page.tsx` + `client.tsx`
4. Test with `npm run dev`

### Editing an Existing Game
1. Game logic: `lib/games/<slug>.ts`
2. Game UI: `app/games/<slug>/client.tsx`
3. Keep logic and UI separated

### Updating the Hub
- Game cards: Controlled by `lib/game-registry.ts`
- Hub layout: `components/games/game-grid.tsx`
- Theme: `app/globals.css`

## Code Conventions

- **TypeScript** — all files use `.ts` / `.tsx`
- **Pure functions** — game logic must be pure (no side effects, no DOM)
- **Immutable state** — use spread operators, never mutate state directly
- **Client components** — use `"use client"` directive only where needed
- **No console.log** in production code

## What NOT to Change

- `.cursor/` rules and skills (reference only)
- `cursor-best-practices/` (upstream repo)
- Environment secrets in `.env.local`

## Testing

```bash
npm run dev     # Development
npm run build   # Production build (catches type errors)
npm run lint    # ESLint
```

## Documentation Updates

After changes, update:
- `CONTEXT.md` — current state and decisions
- `TODO.md` — mark completed, add new items
- `ROADMAP.md` — milestone status
- This file — if contribution workflow changed
