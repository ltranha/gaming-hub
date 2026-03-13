/**
 * Game state persistence with Firestore + LOCAL_MODE fallback.
 *
 * Provides CRUD operations for game sessions. Each game session
 * is a Firestore document in the `games/{gameSlug}/sessions/{id}` collection.
 * In LOCAL_MODE, sessions are stored in memory.
 *
 * @module lib/firebase/game-store
 */

import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseApp, LOCAL_MODE } from "./config";

export interface GameSession {
  id: string;
  gameSlug: string;
  players: string[];
  state: Record<string, unknown>;
  status: "waiting" | "active" | "finished";
  currentTurn: string;
  createdAt: unknown;
  updatedAt: unknown;
  createdBy: string;
}

let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (LOCAL_MODE) return null;
  if (!db) {
    const app = getFirebaseApp();
    if (app) db = getFirestore(app);
  }
  return db;
}

/* ── LOCAL_MODE in-memory store ── */
const memStore = new Map<string, GameSession>();
const memListeners = new Map<string, Set<(s: GameSession | null) => void>>();

function notifyMemListeners(id: string) {
  const session = memStore.get(id) ?? null;
  memListeners.get(id)?.forEach((fn) => fn(session));
}

/* ── Public API ── */

/** Create a new game session. Returns the session ID. */
export async function createSession(
  gameSlug: string,
  createdBy: string,
  initialState: Record<string, unknown>,
): Promise<string> {
  const id = generateId();
  const session: GameSession = {
    id,
    gameSlug,
    players: [createdBy],
    state: initialState,
    status: "waiting",
    currentTurn: createdBy,
    createdAt: LOCAL_MODE ? Date.now() : serverTimestamp(),
    updatedAt: LOCAL_MODE ? Date.now() : serverTimestamp(),
    createdBy,
  };

  if (LOCAL_MODE) {
    memStore.set(id, session);
    notifyMemListeners(id);
    return id;
  }

  const d = getDb()!;
  await setDoc(doc(d, "games", gameSlug, "sessions", id), session);
  return id;
}

/** Join an existing session. */
export async function joinSession(gameSlug: string, sessionId: string, playerId: string): Promise<GameSession | null> {
  if (LOCAL_MODE) {
    const s = memStore.get(sessionId);
    if (!s) return null;
    if (!s.players.includes(playerId)) s.players.push(playerId);
    if (s.players.length >= 2) s.status = "active";
    notifyMemListeners(sessionId);
    return s;
  }

  const d = getDb()!;
  const ref = doc(d, "games", gameSlug, "sessions", sessionId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as GameSession;
  const players = data.players.includes(playerId) ? data.players : [...data.players, playerId];
  const status = players.length >= 2 ? "active" : "waiting";
  await updateDoc(ref, { players, status, updatedAt: serverTimestamp() });
  return { ...data, players, status };
}

/** Update the game state for a session. */
export async function updateSessionState(
  gameSlug: string,
  sessionId: string,
  state: Record<string, unknown>,
  currentTurn: string,
  status?: "active" | "finished",
): Promise<void> {
  if (LOCAL_MODE) {
    const s = memStore.get(sessionId);
    if (s) {
      s.state = state;
      s.currentTurn = currentTurn;
      if (status) s.status = status;
      s.updatedAt = Date.now();
      notifyMemListeners(sessionId);
    }
    return;
  }

  const d = getDb()!;
  const update: Record<string, unknown> = { state, currentTurn, updatedAt: serverTimestamp() };
  if (status) update.status = status;
  await updateDoc(doc(d, "games", gameSlug, "sessions", sessionId), update);
}

/** Subscribe to real-time updates on a session. Returns unsubscribe function. */
export function onSessionUpdate(
  gameSlug: string,
  sessionId: string,
  callback: (session: GameSession | null) => void,
): () => void {
  if (LOCAL_MODE) {
    const set = memListeners.get(sessionId) ?? new Set();
    set.add(callback);
    memListeners.set(sessionId, set);
    callback(memStore.get(sessionId) ?? null);
    return () => { set.delete(callback); };
  }

  const d = getDb()!;
  const ref = doc(d, "games", gameSlug, "sessions", sessionId);
  const unsub: Unsubscribe = onSnapshot(ref, (snap) => {
    callback(snap.exists() ? (snap.data() as GameSession) : null);
  });
  return unsub;
}

/** Get a specific session. */
export async function getSession(gameSlug: string, sessionId: string): Promise<GameSession | null> {
  if (LOCAL_MODE) return memStore.get(sessionId) ?? null;
  const d = getDb()!;
  const snap = await getDoc(doc(d, "games", gameSlug, "sessions", sessionId));
  return snap.exists() ? (snap.data() as GameSession) : null;
}

/** List active or waiting sessions for a game. */
export async function listSessions(gameSlug: string, statusFilter?: "waiting" | "active"): Promise<GameSession[]> {
  if (LOCAL_MODE) {
    return Array.from(memStore.values()).filter(
      (s) => s.gameSlug === gameSlug && (!statusFilter || s.status === statusFilter),
    );
  }

  const d = getDb()!;
  const col = collection(d, "games", gameSlug, "sessions");
  const q = statusFilter
    ? query(col, where("status", "==", statusFilter), orderBy("createdAt", "desc"))
    : query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as GameSession);
}

/** Delete a session. */
export async function deleteSession(gameSlug: string, sessionId: string): Promise<void> {
  if (LOCAL_MODE) {
    memStore.delete(sessionId);
    notifyMemListeners(sessionId);
    return;
  }
  const d = getDb()!;
  await deleteDoc(doc(d, "games", gameSlug, "sessions", sessionId));
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
