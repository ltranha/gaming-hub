import { getGameBySlug } from "@/lib/game-registry";
import { DrawAndGuessClient } from "./client";

export const metadata = { title: "Draw & Guess" };

export default function DrawAndGuessPage() {
  const game = getGameBySlug("draw-and-guess")!;
  return <DrawAndGuessClient game={game} />;
}
