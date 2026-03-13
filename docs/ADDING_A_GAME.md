# Adding a New Game

This guide explains how to add a new game to the Games Hub.

## Overview

Games are:
1. **Registered** in `lib/game-registry.ts` (config-driven)
2. **Logic** lives in `lib/games/<slug>.ts` (pure functions, no UI)
3. **UI** lives in `app/games/<slug>/` (Next.js page + client component)

## Step-by-Step

### 1. Register the Game

Add an entry to the `GAME_REGISTRY` array in `lib/game-registry.ts`:

```typescript
{
  slug: "my-game",
  name: "My Game",
  description: "Short description for the card.",
  icon: "🎯",
  color: "#22d3ee",
  category: "classic",         // classic | strategy | puzzle | party
  modes: ["local", "ai"],     // local | ai | online
  minPlayers: 2,
  maxPlayers: 2,
  status: "active",            // active | coming-soon | hidden
  isPublic: true,              // false = requires sign-in
  difficulty: "medium",        // easy | medium | hard
  estimatedTime: "5 min",
}
```

### 2. Create Game Logic

Create `lib/games/my-game.ts` with:
- A `State` type
- A `createInitialState()` function
- Pure game logic functions (immutable state updates)
- AI logic if applicable

### 3. Create Game Page

Create `app/games/my-game/page.tsx`:
```typescript
import { getGameBySlug } from "@/lib/game-registry";
import { MyGameClient } from "./client";

export const metadata = { title: "My Game" };

export default function MyGamePage() {
  const game = getGameBySlug("my-game")!;
  return <MyGameClient game={game} />;
}
```

Create `app/games/my-game/client.tsx`:
```typescript
"use client";

import { GameShell } from "@/components/games/game-shell";
import { ModeSelector } from "@/components/games/mode-selector";
// ... your game component using GameShell wrapper
```

### 4. Use Shared Components

- **`GameShell`**: Wraps every game with back button, title, status bar, restart button
- **`ModeSelector`**: Displays mode selection cards (local/AI/online)
- **`toast`**: Import from `@/components/ui/toaster` for notifications

### 5. Test

```bash
npm run dev
# Open http://localhost:3000/games/my-game
```

### 6. Control Visibility

- Set `status: "hidden"` to remove from hub (code stays)
- Set `status: "coming-soon"` to show with a badge
- Set `isPublic: false` to require authentication

## Architecture

```
lib/games/my-game.ts    ← Pure logic (state, AI, rules)
app/games/my-game/
  page.tsx               ← Server component (metadata)
  client.tsx             ← Client component (UI, interactions)
```

The separation of logic from UI means:
- Game logic is testable in isolation
- The same logic can be used for local and online modes
- AI and game rules are decoupled from rendering
