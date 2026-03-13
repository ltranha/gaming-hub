import { getGameBySlug } from "@/lib/game-registry";
import { ConnectFourClient } from "./client";

export const metadata = { title: "Connect Four" };

export default function ConnectFourPage() {
  const game = getGameBySlug("connect-four")!;
  return <ConnectFourClient game={game} />;
}
