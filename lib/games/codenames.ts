/**
 * Codenames-style word association game logic.
 *
 * A 5x5 grid of word cards. Two teams try to find their team's
 * words based on one-word clues from their Spymaster. One card
 * is the Assassin — guess it and your team loses instantly.
 *
 * @module lib/games/codenames
 */

export type CardType = "red" | "blue" | "neutral" | "assassin";
export type Team = "red" | "blue";

export interface Card {
  word: string;
  type: CardType;
  revealed: boolean;
}

export interface CodenamesState {
  cards: Card[];
  currentTeam: Team;
  clue: string;
  clueCount: number;
  guessesRemaining: number;
  phase: "clue" | "guess" | "over";
  winner: Team | null;
  redRemaining: number;
  blueRemaining: number;
  spymasterView: boolean;
}

const WORD_POOL = [
  "Apple","Bank","Bear","Block","Board","Book","Bridge","Cap","Card","Castle",
  "Cat","Cell","Chair","Change","Charge","Check","Chest","Circle","Cliff","Clock",
  "Cloud","Code","Cold","Corn","Couch","Court","Cover","Crane","Cross","Crown",
  "Cycle","Day","Deck","Diamond","Dice","Doctor","Dog","Draft","Dragon","Dress",
  "Drill","Drop","Drum","Duck","Dust","Eagle","Edge","Engine","Eye","Face",
  "Fair","Fan","Field","Film","Fire","Fish","Flag","Floor","Fly","Force",
  "Forest","Fork","Fox","Frame","Game","Ghost","Giant","Glass","Gold","Grace",
  "Grass","Green","Guard","Ham","Hand","Hawk","Head","Heart","Hero","Honey",
  "Hood","Hook","Horn","Horse","House","Ice","Iron","Jack","Jam","Jet",
  "Judge","Key","King","Kite","Knight","Lace","Lake","Lamp","Lead","Leaf",
  "Lemon","Letter","Light","Line","Link","Lion","Lock","Log","Luck","Map",
  "March","Mark","Mass","Match","Mercury","Mill","Mine","Moon","Moss","Mouse",
  "Nail","Needle","Net","Night","Note","Nurse","Oak","Ocean","Oil","Opera",
  "Orange","Organ","Palm","Pan","Paper","Park","Pass","Paste","Penguin","Piano",
  "Pin","Pipe","Pitch","Plant","Plate","Plot","Point","Pole","Pool","Port",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createInitialState(): CodenamesState {
  const words = shuffle(WORD_POOL).slice(0, 25);

  // First team (9 cards), second team (8 cards), 7 neutral, 1 assassin
  const firstTeam: Team = Math.random() < 0.5 ? "red" : "blue";
  const types: CardType[] = [];
  for (let i = 0; i < 9; i++) types.push(firstTeam);
  for (let i = 0; i < 8; i++) types.push(firstTeam === "red" ? "blue" : "red");
  for (let i = 0; i < 7; i++) types.push("neutral");
  types.push("assassin");
  const shuffledTypes = shuffle(types);

  const cards: Card[] = words.map((word, i) => ({
    word,
    type: shuffledTypes[i],
    revealed: false,
  }));

  return {
    cards,
    currentTeam: firstTeam,
    clue: "",
    clueCount: 0,
    guessesRemaining: 0,
    phase: "clue",
    winner: null,
    redRemaining: cards.filter((c) => c.type === "red").length,
    blueRemaining: cards.filter((c) => c.type === "blue").length,
    spymasterView: false,
  };
}

export function giveClue(state: CodenamesState, clue: string, count: number): CodenamesState {
  if (state.phase !== "clue") return state;
  return { ...state, clue, clueCount: count, guessesRemaining: count + 1, phase: "guess" };
}

export function guessCard(state: CodenamesState, cardIndex: number): CodenamesState {
  if (state.phase !== "guess") return state;
  if (state.cards[cardIndex].revealed) return state;

  const cards = state.cards.map((c, i) => i === cardIndex ? { ...c, revealed: true } : c);
  const card = cards[cardIndex];

  if (card.type === "assassin") {
    const winner: Team = state.currentTeam === "red" ? "blue" : "red";
    return { ...state, cards, phase: "over", winner };
  }

  const redRemaining = cards.filter((c) => c.type === "red" && !c.revealed).length;
  const blueRemaining = cards.filter((c) => c.type === "blue" && !c.revealed).length;

  if (redRemaining === 0) return { ...state, cards, phase: "over", winner: "red", redRemaining, blueRemaining };
  if (blueRemaining === 0) return { ...state, cards, phase: "over", winner: "blue", redRemaining, blueRemaining };

  if (card.type !== state.currentTeam) {
    const nextTeam: Team = state.currentTeam === "red" ? "blue" : "red";
    return { ...state, cards, currentTeam: nextTeam, phase: "clue", clue: "", clueCount: 0, guessesRemaining: 0, redRemaining, blueRemaining };
  }

  const remaining = state.guessesRemaining - 1;
  if (remaining <= 0) {
    const nextTeam: Team = state.currentTeam === "red" ? "blue" : "red";
    return { ...state, cards, currentTeam: nextTeam, phase: "clue", clue: "", clueCount: 0, guessesRemaining: 0, redRemaining, blueRemaining };
  }

  return { ...state, cards, guessesRemaining: remaining, redRemaining, blueRemaining };
}

export function endGuessing(state: CodenamesState): CodenamesState {
  if (state.phase !== "guess") return state;
  const nextTeam: Team = state.currentTeam === "red" ? "blue" : "red";
  return { ...state, currentTeam: nextTeam, phase: "clue", clue: "", clueCount: 0, guessesRemaining: 0 };
}

export function toggleSpymasterView(state: CodenamesState): CodenamesState {
  return { ...state, spymasterView: !state.spymasterView };
}
