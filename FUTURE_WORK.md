# Future Work — games-hub

## Online Multiplayer
- Firebase Realtime game state sync
- Room system with join codes
- Matchmaking (random opponents)
- Spectator mode

## New Games
- **Wordle with Friends** — daily word challenge with shared progress
- **Battleship** — turn-based with Firebase state
- **Checkers** — simpler than chess, good for beginners
- **Idle Clicker** — persistent resource management
- **Collaborative Pixel Art** — shared canvas, one pixel at a time

## Platform Features
- Theme toggle (light/dark/system)
- Sound effects and haptic feedback
- Game statistics dashboard (games played, win rate, streaks)
- Player profiles with avatars
- Leaderboards per game
- Tournament system
- Chat and messaging
- Push notifications for turn-based games
- PWA support for mobile home screen

## Admin Enhancements
- Firebase Admin SDK integration
- Real-time game monitoring
- Player management (ban, mute)
- Game state reset from dashboard
- Analytics (daily active users, popular games)

## Technical
- E2E testing with Playwright
- Game logic unit tests
- WebSocket fallback for real-time games
- Code splitting per game (already handled by Next.js dynamic routes)
- SEO optimization with Open Graph images per game
