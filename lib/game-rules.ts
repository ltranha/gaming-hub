/**
 * Game rules, history, and how-to-play data for every game.
 * Keyed by game slug. Each entry includes a brief description,
 * step-by-step rules, fun facts, and an optional external link.
 *
 * @module lib/game-rules
 */

export interface GameRulesData {
  howToPlay: string[];
  funFacts: string[];
  wikiLink?: string;
}

export const GAME_RULES: Record<string, GameRulesData> = {
  "tic-tac-toe": {
    howToPlay: [
      "Two players take turns placing X or O on a 3x3 grid.",
      "The first player to get three marks in a row (horizontal, vertical, or diagonal) wins.",
      "If all 9 squares are filled with no winner, the game is a draw.",
      "In AI mode, the computer uses the minimax algorithm — it's unbeatable on Hard!",
    ],
    funFacts: [
      "Tic-Tac-Toe dates back to ancient Egypt around 1300 BCE.",
      "The game has 255,168 possible games but only 138 unique ending positions.",
      "Two perfect players will always draw — the game is 'solved'.",
      "It's called 'Noughts and Crosses' in the UK and 'Tres en Raya' in Spain.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Tic-tac-toe",
  },

  "connect-four": {
    howToPlay: [
      "Two players take turns dropping colored discs into a 7-column, 6-row grid.",
      "Discs fall to the lowest available row in the chosen column.",
      "The first player to form a horizontal, vertical, or diagonal line of four wins.",
      "If all 42 spaces are filled with no winner, the game is a draw.",
    ],
    funFacts: [
      "Connect Four was first sold by Milton Bradley in 1974.",
      "The game was mathematically solved in 1988 — the first player can always win with perfect play.",
      "There are over 4 trillion possible board positions.",
      "The game is also known as 'Four in a Row', 'Four Up', and 'Captain's Mistress'.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Connect_Four",
  },

  memory: {
    howToPlay: [
      "Cards are placed face-down on the board in a grid.",
      "Flip two cards per turn. If they match, they stay face-up and you score a point.",
      "If they don't match, they flip back face-down. Try to remember their positions!",
      "The game ends when all pairs are found. Try to finish in as few moves as possible.",
    ],
    funFacts: [
      "The memory card game (also called Concentration) likely originated in Japan as 'Kai-awase' in the Heian period (794–1185).",
      "Research shows that children often outperform adults at memory games — young brains are better at this specific task.",
      "The world record for matching a 52-pair deck is under 2 minutes.",
      "Playing memory games regularly can improve working memory and cognitive function.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Concentration_(card_game)",
  },

  chess: {
    howToPlay: [
      "Two players (White and Black) take turns moving pieces on an 8x8 board.",
      "Each piece type moves differently: King (1 square), Queen (any direction), Rook (straight), Bishop (diagonal), Knight (L-shape), Pawn (forward).",
      "Capture opponent pieces by moving to their square.",
      "The goal is to checkmate the opponent's King — trap it so it cannot escape capture.",
    ],
    funFacts: [
      "Chess originated in India around the 6th century CE as 'Chaturanga'.",
      "The number of possible chess games exceeds the number of atoms in the observable universe.",
      "The longest possible chess game is 5,949 moves.",
      "The word 'checkmate' comes from Persian 'shāh māt' meaning 'the king is helpless'.",
      "IBM's Deep Blue defeated world champion Garry Kasparov in 1997, a landmark in AI history.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Chess",
  },

  "just-one": {
    howToPlay: [
      "One player is the Guesser. Everyone else writes a one-word clue related to the secret word.",
      "Before showing clues, any duplicate or too-similar clues are eliminated.",
      "The Guesser sees only the remaining unique clues and tries to guess the secret word.",
      "If correct, the team scores a point. After all rounds, try to beat your high score!",
    ],
    funFacts: [
      "Just One won the prestigious Spiel des Jahres (Game of the Year) award in 2019.",
      "The game was designed by Ludovic Roudy and Bruno Sautter.",
      "It supports 3-7 players, making it one of the best party games for varied group sizes.",
      "The duplicate elimination mechanic creates surprising tension — obvious clues are risky!",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Just_One_(game)",
  },

  "2048": {
    howToPlay: [
      "Slide numbered tiles on a 4x4 grid using arrow keys (or swipe on mobile).",
      "When two tiles with the same number collide, they merge into one tile with double the value.",
      "A new '2' tile appears after each move. Plan ahead to avoid filling the board!",
      "The goal is to create a tile with the value 2048 — but you can keep going for a higher score.",
    ],
    funFacts: [
      "2048 was created by Gabriele Cirulli in March 2014 — he was 19 years old.",
      "He built it in a single weekend as a learning project.",
      "The game went viral, reaching millions of players within days of release.",
      "Mathematically, the maximum possible tile is 131,072 (2^17) on a 4x4 grid.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/2048_(video_game)",
  },

  minesweeper: {
    howToPlay: [
      "Click a square to reveal it. Numbers show how many adjacent mines exist.",
      "Use the numbers to deduce which squares are safe and which hide mines.",
      "Right-click (or long-press) to flag a square you think contains a mine.",
      "Reveal all non-mine squares to win. Click a mine and it's game over!",
    ],
    funFacts: [
      "Minesweeper was included in Windows 3.1 (1992) to teach right-clicking.",
      "The world record for Expert mode (30x16 grid, 99 mines) is under 30 seconds.",
      "Determining if a Minesweeper board is solvable is NP-complete — one of the hardest problems in computer science.",
      "The game has been played billions of times, making it one of the most-played video games ever.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Minesweeper_(video_game)",
  },

  sudoku: {
    howToPlay: [
      "Fill a 9x9 grid so every row, column, and 3x3 box contains digits 1-9.",
      "Some cells are pre-filled as clues. Use logic to deduce the rest.",
      "No guessing needed — every puzzle has exactly one solution.",
      "Start with rows/columns/boxes that have the most given digits.",
    ],
    funFacts: [
      "Modern Sudoku was designed by Howard Garns in 1979 and first published as 'Number Place'.",
      "It became a worldwide phenomenon after being popularized in Japan in 1986.",
      "The minimum number of clues for a unique Sudoku solution is 17.",
      "There are 6,670,903,752,021,072,936,960 valid completed Sudoku grids.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Sudoku",
  },

  othello: {
    howToPlay: [
      "Two players (Black and White) take turns placing discs on an 8x8 board.",
      "You must place your disc so it 'sandwiches' one or more opponent discs between yours.",
      "All sandwiched discs flip to your color. You must flip at least one disc per turn.",
      "If you can't make a valid move, you pass. The player with the most discs when the board is full wins.",
    ],
    funFacts: [
      "Othello is based on Reversi, which was invented in 1883 by Lewis Waterman.",
      "The modern version was trademarked in 1971 by Goro Hasegawa in Japan.",
      "Its tagline is 'A minute to learn, a lifetime to master.'",
      "NTest, an Othello AI from 2003, can solve the entire game from a set opening position.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Reversi",
  },

  mancala: {
    howToPlay: [
      "Two players sit opposite each other with a board of 12 pits (6 per side) and 2 stores.",
      "Pick up all seeds from one of your pits and sow them counter-clockwise, one per pit.",
      "If your last seed lands in your store, you get another turn.",
      "If your last seed lands in an empty pit on your side, you capture that seed plus the seeds in the opposite pit.",
      "The game ends when one side is empty. The player with the most seeds in their store wins.",
    ],
    funFacts: [
      "Mancala is one of the oldest known board games — archaeological evidence dates to 6000 BCE.",
      "Over 800 named variants exist across Africa, Asia, and the Caribbean.",
      "The name comes from the Arabic 'naqala' meaning 'to move'.",
      "Traditional boards are often carved into stone or wood, with seeds, stones, or shells as pieces.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Mancala",
  },

  codenames: {
    howToPlay: [
      "Two teams compete. A grid of 25 word cards is laid out.",
      "Each team has a Spymaster who gives one-word clues linked to multiple cards belonging to their team.",
      "Teammates guess which cards match the clue. Correct guesses reveal their team's cards.",
      "Avoid the Assassin card (instant loss) and the other team's cards. First team to find all their cards wins.",
    ],
    funFacts: [
      "Codenames was designed by Vlaada Chvátil and won the 2016 Spiel des Jahres.",
      "The game has sold over 4 million copies worldwide.",
      "There are spin-offs including Codenames: Pictures, Codenames: Duet, and Codenames: Disney.",
      "The key card mechanism ensures each game is unique — there are 40 possible key configurations.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Codenames_(board_game)",
  },

  "draw-and-guess": {
    howToPlay: [
      "One player draws a word or phrase while others try to guess what it is.",
      "The drawer cannot use letters, numbers, or verbal clues — only drawings!",
      "Players type their guesses. The first correct guess scores points for both drawer and guesser.",
      "After the time limit, a new player becomes the drawer with a new word.",
    ],
    funFacts: [
      "Drawing games like Pictionary have been party staples since 1985.",
      "Online versions like skribbl.io made the format massively popular in the 2020s.",
      "Research shows drawing activates different brain regions than writing, aiding creativity.",
      "The average person can recognize a simple sketch in under 2 seconds.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/Pictionary",
  },

  "pixel-art": {
    howToPlay: [
      "A shared canvas is displayed as a grid of pixels.",
      "Pick a color from the palette, then click a pixel to color it.",
      "There's a cooldown between placements — plan your pixels carefully!",
      "Collaborate with others to create artwork, or work on your own masterpiece.",
    ],
    funFacts: [
      "Reddit's r/place experiment in 2017 let millions of users place one pixel at a time, creating collaborative art.",
      "The 2022 edition attracted over 160 million pixel placements.",
      "Pixel art originated in the 1970s-80s due to hardware limitations in early computers and consoles.",
      "Modern pixel art is considered a distinct art form, with dedicated communities and galleries.",
    ],
    wikiLink: "https://en.wikipedia.org/wiki/R/place",
  },
};
