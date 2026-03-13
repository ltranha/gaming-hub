import { getGameBySlug } from "@/lib/game-registry";
import { TicTacToeClient } from "./client";

export const metadata = { title: "Tic-Tac-Toe" };

export default function TicTacToePage() {
  const game = getGameBySlug("tic-tac-toe")!;
  return <TicTacToeClient game={game} />;
}
