import { getGameBySlug } from "@/lib/game-registry";
import { SudokuClient } from "./client";

export const metadata = { title: "Sudoku" };

export default function SudokuPage() {
  const game = getGameBySlug("sudoku")!;
  return <SudokuClient game={game} />;
}
