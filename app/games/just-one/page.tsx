import { getGameBySlug } from "@/lib/game-registry";
import { JustOneClient } from "./client";

export const metadata = { title: "Just One" };

export default function JustOnePage() {
  const game = getGameBySlug("just-one")!;
  return <JustOneClient game={game} />;
}
