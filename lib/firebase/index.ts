/**
 * Firebase module barrel export.
 * Import from `@/lib/firebase` for all Firebase services.
 */

export { LOCAL_MODE, getFirebaseApp } from "./config";
export { signInAsGuest, signInWithEmail, signOut, onAuthChange, getCurrentUser } from "./auth";
export type { AppUser } from "./auth";
export {
  createSession,
  joinSession,
  updateSessionState,
  onSessionUpdate,
  getSession,
  listSessions,
  deleteSession,
} from "./game-store";
export type { GameSession } from "./game-store";
