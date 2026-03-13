import { getGameBySlug } from "@/lib/game-registry";
import { CodenamesClient } from "./client";

export const metadata = { title: "Codenames" };

export default function CodenamesPage() {
  const game = getGameBySlug("codenames")!;
  return <CodenamesClient game={game} />;
}
