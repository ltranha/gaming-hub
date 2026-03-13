import { getGameBySlug } from "@/lib/game-registry";
import { Game2048Client } from "./client";

export const metadata = { title: "2048" };

export default function Game2048Page() {
  const game = getGameBySlug("2048")!;
  return <Game2048Client game={game} />;
}
