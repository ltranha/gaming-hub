import { getGameBySlug } from "@/lib/game-registry";
import { MemoryClient } from "./client";

export const metadata = { title: "Memory" };

export default function MemoryPage() {
  const game = getGameBySlug("memory")!;
  return <MemoryClient game={game} />;
}
