import { getGameBySlug } from "@/lib/game-registry";
import { MinesweeperClient } from "./client";

export const metadata = { title: "Minesweeper" };

export default function MinesweeperPage() {
  const game = getGameBySlug("minesweeper")!;
  return <MinesweeperClient game={game} />;
}
