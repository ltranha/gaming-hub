# Games Hub

A collection of multiplayer games with local, AI, and online modes. Built with Next.js, CSS custom properties, and Firebase.

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-000?style=for-the-badge&logo=nextdotjs" alt="Next.js"></a>
  <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Ready-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase"></a>
</p>

## Games

| Game | Modes | Difficulty | Status |
|------|-------|------------|--------|
| **Tic-Tac-Toe** | Local, AI (minimax), Online | Easy | Active |
| **Connect Four** | Local, AI, Online | Easy | Active |
| **Memory** | Local (solo) | Medium | Active |
| **Chess** | Local, AI | Hard | Active |
| **Just One** | Online (party) | Easy | Active |

## Features

- **Config-driven game registry** — add, hide, or disable games from one file
- **Discord-style UI** — dark theme, smooth animations, glow cards
- **Shared game shell** — consistent navigation and status across all games
- **Category filtering** — Classic, Strategy, Puzzle, Party
- **Search** — find games by name or description
- **Admin dashboard** — view game stats, manage registry, quick actions
- **Mobile responsive** — all games scale properly on mobile
- **LOCAL_MODE** — runs without Firebase for development and testing

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Open http://localhost:3000

# Build for production
npm run build && npm start
```

## Project Structure

```
games-hub/
├── app/
│   ├── layout.tsx              # Root layout with navbar
│   ├── page.tsx                # Hub landing page
│   ├── globals.css             # Theme and global styles
│   ├── admin/                  # Admin dashboard
│   └── games/
│       ├── tic-tac-toe/        # page.tsx + client.tsx
│       ├── connect-four/
│       ├── memory/
│       ├── chess/
│       └── just-one/
├── components/
│   ├── layout/navbar.tsx       # Top navigation
│   ├── ui/toaster.tsx          # Toast notifications
│   └── games/
│       ├── game-grid.tsx       # Hub game cards
│       ├── game-shell.tsx      # Shared game wrapper
│       ├── hero-section.tsx    # Hub hero
│       └── mode-selector.tsx   # Mode selection cards
├── lib/
│   ├── game-registry.ts        # Central game config
│   └── games/
│       ├── tic-tac-toe.ts      # Pure game logic
│       ├── connect-four.ts
│       ├── memory.ts
│       ├── chess.ts
│       └── just-one.ts
├── docs/
│   └── ADDING_A_GAME.md       # Guide for adding new games
├── .cursor/                    # Cursor IDE config
├── .env.example                # Environment template
└── README.md                   # This file
```

## Adding a New Game

See [docs/ADDING_A_GAME.md](docs/ADDING_A_GAME.md) for a step-by-step guide.

Quick version:
1. Add entry to `lib/game-registry.ts`
2. Create game logic in `lib/games/<slug>.ts`
3. Create page in `app/games/<slug>/`
4. Done — the hub picks it up automatically

## Managing Games

Games are controlled from `lib/game-registry.ts`:

| Action | How |
|--------|-----|
| Hide a game | Set `status: "hidden"` |
| Coming soon badge | Set `status: "coming-soon"` |
| Require sign-in | Set `isPublic: false` |
| Add a category | Add to `CATEGORIES` array |
| Remove a game | Set `status: "hidden"` (code stays) |

## Firebase Setup

For online multiplayer, set up Firebase:
1. Follow [platform-setup-playbook/guides/firebase-setup.md](../platform-setup-playbook/guides/firebase-setup.md)
2. Copy `.env.example` to `.env.local` and fill in Firebase config
3. Set `NEXT_PUBLIC_LOCAL_MODE=false`

## Deployment

See [DEPLOY.md](DEPLOY.md) for Vercel, Cloudflare Pages, and GitHub Pages instructions.

## Related Repositories

| Repository | Purpose |
|------------|---------|
| [platform-setup-playbook](../platform-setup-playbook/) | Firebase, Vercel, hosting guides |
| [cursor-best-practices](../cursor-best-practices/) | Cursor IDE rules and skills |
| [portfolio-studio](../portfolio-studio/) | Portfolio site |

## License

MIT
