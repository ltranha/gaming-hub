/**
 * Draw & Guess game logic.
 *
 * One player draws a word while others guess. The drawer sees
 * the word and draws on a canvas. Other players type guesses.
 * Correct guessers and the drawer earn points.
 *
 * @module lib/games/draw-and-guess
 */

export interface DrawState {
  phase: "setup" | "drawing" | "results";
  word: string;
  drawer: number;
  players: string[];
  scores: Record<string, number>;
  guesses: { player: string; text: string; correct: boolean }[];
  round: number;
  maxRounds: number;
  timeLeft: number;
}

const WORDS = [
  "Cat","Dog","House","Tree","Sun","Moon","Car","Boat","Fish","Bird",
  "Flower","Mountain","River","Bridge","Castle","Robot","Pizza","Guitar",
  "Umbrella","Balloon","Rocket","Snowman","Spider","Crown","Diamond",
  "Sword","Dragon","Rainbow","Cloud","Star","Heart","Fire","Book",
  "Camera","Clock","Key","Ladder","Lighthouse","Pirate","Wizard",
  "Dinosaur","Penguin","Tornado","Volcano","Waterfall","Cactus",
  "Bicycle","Helicopter","Submarine","Treasure","Unicorn","Ghost",
];

export function createInitialState(players: string[], maxRounds: number = 3): DrawState {
  return {
    phase: "setup",
    word: "",
    drawer: 0,
    players,
    scores: Object.fromEntries(players.map((p) => [p, 0])),
    guesses: [],
    round: 0,
    maxRounds: maxRounds * players.length,
    timeLeft: 60,
  };
}

export function startRound(state: DrawState): DrawState {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return {
    ...state,
    phase: "drawing",
    word,
    guesses: [],
    timeLeft: 60,
  };
}

export function submitGuess(state: DrawState, player: string, guess: string): DrawState {
  if (state.phase !== "drawing") return state;
  if (player === state.players[state.drawer]) return state;
  if (state.guesses.some((g) => g.player === player && g.correct)) return state;

  const correct = guess.toLowerCase().trim() === state.word.toLowerCase().trim();
  const guesses = [...state.guesses, { player, text: guess, correct }];

  let scores = { ...state.scores };
  if (correct) {
    scores[player] = (scores[player] || 0) + 10;
    scores[state.players[state.drawer]] = (scores[state.players[state.drawer]] || 0) + 5;
  }

  const allGuessed = state.players
    .filter((_, i) => i !== state.drawer)
    .every((p) => guesses.some((g) => g.player === p && g.correct));

  if (allGuessed) {
    return endRound({ ...state, guesses, scores });
  }

  return { ...state, guesses, scores };
}

export function endRound(state: DrawState): DrawState {
  const nextDrawer = (state.drawer + 1) % state.players.length;
  const nextRound = state.round + 1;
  const gameOver = nextRound >= state.maxRounds;

  return {
    ...state,
    phase: gameOver ? "results" : "setup",
    drawer: nextDrawer,
    round: nextRound,
  };
}

export function getWinner(state: DrawState): string {
  return Object.entries(state.scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}
