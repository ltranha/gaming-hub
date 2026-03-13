/**
 * Just One cooperative word game logic.
 *
 * Turn-based party game: one player guesses a word based on
 * one-word clues from other players. Duplicate clues are
 * automatically eliminated. Supports 3-7 players.
 *
 * @module lib/games/just-one
 */

export type Phase = "setup" | "clue" | "reveal" | "guess" | "result";

export interface JustOneState {
  phase: Phase;
  word: string;
  players: string[];
  guesser: number;
  clues: Record<string, string>;
  visibleClues: Record<string, boolean>;
  guess: string;
  correct: number;
  wrong: number;
  round: number;
  maxRounds: number;
  gameOver: boolean;
}

const WORD_LISTS: Record<string, string[]> = {
  easy: [
    "Apple","Beach","Castle","Dragon","Eagle","Forest","Guitar","Hammer",
    "Island","Jungle","Kite","Lemon","Mountain","Notebook","Ocean","Piano",
    "Rainbow","Sunset","Tiger","Umbrella","Volcano","Whale","Zebra","Balloon",
    "Camera","Diamond","Elephant","Firework","Garden","Honey","Iceberg",
  ],
  medium: [
    "Algorithm","Blueprint","Carousel","Dynasty","Eclipse","Folklore",
    "Gondola","Hologram","Infinity","Labyrinth","Mythology","Nebula",
    "Orchestra","Paradox","Quicksand","Riddle","Silhouette","Telescope",
    "Universe","Vortex","Waterfall","Catalyst","Mirage","Phantom",
  ],
  hard: [
    "Abstraction","Bioluminescence","Cryptocurrency","Dystopia","Euphoria",
    "Fibonacci","Geopolitics","Heliocentric","Improvisation","Juxtaposition",
    "Kaleidoscope","Luminescence","Metamorphosis","Neuroscience",
    "Onomatopoeia","Photosynthesis","Renaissance","Synesthesia",
  ],
};

function getRandomWord(used: Set<string>, difficulty: string = "easy"): string {
  const words = WORD_LISTS[difficulty] || WORD_LISTS.easy;
  const available = words.filter((w) => !used.has(w));
  if (available.length === 0) return words[Math.floor(Math.random() * words.length)];
  return available[Math.floor(Math.random() * available.length)];
}

function areSimilar(a: string, b: string): boolean {
  const na = a.toLowerCase().trim();
  const nb = b.toLowerCase().trim();
  if (na === nb) return true;
  // Simple stemming: one is prefix of the other
  if (na.startsWith(nb) || nb.startsWith(na)) return true;
  return false;
}

export function createInitialState(players: string[], maxRounds: number = 5): JustOneState {
  return {
    phase: "setup",
    word: "",
    players,
    guesser: 0,
    clues: {},
    visibleClues: {},
    guess: "",
    correct: 0,
    wrong: 0,
    round: 0,
    maxRounds,
    gameOver: false,
  };
}

export function startRound(state: JustOneState, difficulty: string = "easy"): JustOneState {
  const usedWords = new Set<string>();
  const word = getRandomWord(usedWords, difficulty);
  const guesser = state.round % state.players.length;
  const clues: Record<string, string> = {};
  const visibleClues: Record<string, boolean> = {};
  state.players.forEach((p, i) => {
    if (i !== guesser) {
      clues[p] = "";
      visibleClues[p] = true;
    }
  });
  return {
    ...state,
    phase: "clue",
    word,
    guesser,
    clues,
    visibleClues,
    guess: "",
  };
}

export function submitClue(state: JustOneState, player: string, clue: string): JustOneState {
  const clues = { ...state.clues, [player]: clue };
  return resolveCluesIfComplete({ ...state, clues });
}

/** Mark a player's clue as skipped so the round can proceed without them. */
export function skipClue(state: JustOneState, player: string): JustOneState {
  const clues = { ...state.clues, [player]: "(skipped)" };
  return resolveCluesIfComplete({ ...state, clues });
}

function resolveCluesIfComplete(state: JustOneState): JustOneState {
  const allSubmitted = Object.entries(state.clues).every(([, v]) => v.length > 0);
  if (!allSubmitted) return state;

  const vis: Record<string, boolean> = {};
  const entries = Object.entries(state.clues).filter(([, v]) => v !== "(skipped)");
  for (const [name, c] of entries) {
    vis[name] = true;
    for (const [otherName, otherClue] of entries) {
      if (name !== otherName && areSimilar(c, otherClue)) {
        vis[name] = false;
        vis[otherName] = false;
      }
    }
  }
  // Skipped players are never visible
  for (const [p, v] of Object.entries(state.clues)) {
    if (v === "(skipped)") vis[p] = false;
  }
  return { ...state, visibleClues: vis, phase: "reveal" };
}

export function moveToGuess(state: JustOneState): JustOneState {
  return { ...state, phase: "guess" };
}

export function submitGuess(state: JustOneState, guess: string): JustOneState {
  const isCorrect = areSimilar(guess, state.word);
  const correct = state.correct + (isCorrect ? 1 : 0);
  const wrong = state.wrong + (isCorrect ? 0 : 1);
  const round = state.round + 1;
  const gameOver = round >= state.maxRounds;
  return { ...state, guess, correct, wrong, round, phase: "result", gameOver };
}

export function skipGuess(state: JustOneState): JustOneState {
  const round = state.round + 1;
  const gameOver = round >= state.maxRounds;
  return { ...state, guess: "(skipped)", round, phase: "result", gameOver };
}
