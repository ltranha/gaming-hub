/**
 * Game Registry — Central configuration for all games in the hub.
 *
 * Add, remove, enable/disable, or categorize games by editing the
 * GAME_REGISTRY array below. The hub landing page, admin dashboard,
 * and routing all read from this single source of truth.
 *
 * @module lib/game-registry
 */

/** Available play modes for a game. */
export type GameMode = "local" | "ai" | "online";

/** Game categories for filtering on the hub. */
export type GameCategory = "classic" | "strategy" | "party" | "puzzle";

/**
 * Visibility status:
 * - "active": shown on hub, playable
 * - "coming-soon": shown with badge, not playable
 * - "hidden": not shown (code stays for reactivation)
 */
export type GameStatus = "active" | "coming-soon" | "hidden";

/** Configuration for a single game in the registry. */
export interface GameConfig {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: GameCategory;
  modes: GameMode[];
  minPlayers: number;
  maxPlayers: number;
  status: GameStatus;
  isPublic: boolean;
  difficulty: "easy" | "medium" | "hard";
  estimatedTime: string;
}

/**
 * Central game registry. Add, remove, enable, or disable games here.
 * Games with status "hidden" won't appear on the hub.
 * Games with status "coming-soon" show a badge but aren't playable.
 * Set isPublic to false for games that require sign-in.
 */
export const GAME_REGISTRY: GameConfig[] = [
  {
    slug: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Classic 3x3 strategy. Outsmart your opponent or challenge the AI.",
    icon: "❌",
    color: "#6366f1",
    category: "classic",
    modes: ["local", "ai", "online"],
    minPlayers: 2,
    maxPlayers: 2,
    status: "active",
    isPublic: true,
    difficulty: "easy",
    estimatedTime: "2 min",
  },
  {
    slug: "connect-four",
    name: "Connect Four",
    description: "Drop pieces in a 7x6 grid. First to connect four in a row wins.",
    icon: "🔴",
    color: "#ef4444",
    category: "classic",
    modes: ["local", "ai", "online"],
    minPlayers: 2,
    maxPlayers: 2,
    status: "active",
    isPublic: true,
    difficulty: "easy",
    estimatedTime: "5 min",
  },
  {
    slug: "memory",
    name: "Memory",
    description: "Flip cards to find matching pairs. Test your memory and speed.",
    icon: "🧠",
    color: "#22d3ee",
    category: "puzzle",
    modes: ["local"],
    minPlayers: 1,
    maxPlayers: 1,
    status: "active",
    isPublic: true,
    difficulty: "medium",
    estimatedTime: "3 min",
  },
  {
    slug: "chess",
    name: "Chess",
    description: "The king of strategy games. Play locally or challenge the AI.",
    icon: "♟️",
    color: "#a855f7",
    category: "strategy",
    modes: ["local", "ai"],
    minPlayers: 2,
    maxPlayers: 2,
    status: "active",
    isPublic: true,
    difficulty: "hard",
    estimatedTime: "15 min",
  },
  {
    slug: "just-one",
    name: "Just One",
    description: "Cooperative word guessing party game. Give one-word clues!",
    icon: "💬",
    color: "#f59e0b",
    category: "party",
    modes: ["local"],
    minPlayers: 3,
    maxPlayers: 7,
    status: "active",
    isPublic: true,
    difficulty: "easy",
    estimatedTime: "10 min",
  },
  {
    slug: "2048",
    name: "2048",
    description: "Slide tiles on a 4x4 grid. Merge matching numbers to reach 2048!",
    icon: "🔢",
    color: "#edc22e",
    category: "puzzle",
    modes: ["local"],
    minPlayers: 1,
    maxPlayers: 1,
    status: "active",
    isPublic: true,
    difficulty: "medium",
    estimatedTime: "5 min",
  },
  {
    slug: "minesweeper",
    name: "Minesweeper",
    description: "Uncover squares without detonating hidden mines. Use logic!",
    icon: "💣",
    color: "#64748b",
    category: "puzzle",
    modes: ["local"],
    minPlayers: 1,
    maxPlayers: 1,
    status: "active",
    isPublic: true,
    difficulty: "medium",
    estimatedTime: "5 min",
  },
  {
    slug: "sudoku",
    name: "Sudoku",
    description: "Fill the 9x9 grid so every row, column, and box has digits 1-9.",
    icon: "🔟",
    color: "#0ea5e9",
    category: "puzzle",
    modes: ["local"],
    minPlayers: 1,
    maxPlayers: 1,
    status: "active",
    isPublic: true,
    difficulty: "medium",
    estimatedTime: "10 min",
  },
  {
    slug: "othello",
    name: "Othello",
    description: "Flip your opponent's discs by outflanking them on an 8x8 board.",
    icon: "⚫",
    color: "#059669",
    category: "strategy",
    modes: ["local", "ai"],
    minPlayers: 2,
    maxPlayers: 2,
    status: "active",
    isPublic: true,
    difficulty: "medium",
    estimatedTime: "10 min",
  },
  {
    slug: "mancala",
    name: "Mancala",
    description: "Ancient seed-sowing game. Capture more seeds than your opponent!",
    icon: "🫘",
    color: "#92400e",
    category: "strategy",
    modes: ["local", "ai"],
    minPlayers: 2,
    maxPlayers: 2,
    status: "active",
    isPublic: true,
    difficulty: "easy",
    estimatedTime: "10 min",
  },
  {
    slug: "codenames",
    name: "Codenames",
    description: "Give one-word clues to help your team find their secret agents.",
    icon: "🕵️",
    color: "#dc2626",
    category: "party",
    modes: ["local"],
    minPlayers: 4,
    maxPlayers: 8,
    status: "active",
    isPublic: true,
    difficulty: "medium",
    estimatedTime: "15 min",
  },
  {
    slug: "draw-and-guess",
    name: "Draw & Guess",
    description: "One player draws, everyone else guesses. Like Pictionary online!",
    icon: "🎨",
    color: "#ec4899",
    category: "party",
    modes: ["local"],
    minPlayers: 3,
    maxPlayers: 8,
    status: "active",
    isPublic: true,
    difficulty: "easy",
    estimatedTime: "10 min",
  },
  {
    slug: "pixel-art",
    name: "Pixel Art",
    description: "Collaborative pixel canvas. Pick a color and paint together!",
    icon: "🖼️",
    color: "#8b5cf6",
    category: "party",
    modes: ["local"],
    minPlayers: 1,
    maxPlayers: 99,
    status: "active",
    isPublic: true,
    difficulty: "easy",
    estimatedTime: "∞",
  },
];

export function getActiveGames(): GameConfig[] {
  return GAME_REGISTRY.filter((g) => g.status !== "hidden");
}

export function getPlayableGames(): GameConfig[] {
  return GAME_REGISTRY.filter((g) => g.status === "active");
}

export function getPublicGames(): GameConfig[] {
  return GAME_REGISTRY.filter((g) => g.status === "active" && g.isPublic);
}

export function getGameBySlug(slug: string): GameConfig | undefined {
  return GAME_REGISTRY.find((g) => g.slug === slug);
}

export function getGamesByCategory(category: GameCategory): GameConfig[] {
  return getActiveGames().filter((g) => g.category === category);
}

export const CATEGORIES: { id: GameCategory; label: string; icon: string }[] = [
  { id: "classic", label: "Classic", icon: "🎲" },
  { id: "strategy", label: "Strategy", icon: "🧩" },
  { id: "puzzle", label: "Puzzle", icon: "🧠" },
  { id: "party", label: "Party", icon: "🎉" },
];
