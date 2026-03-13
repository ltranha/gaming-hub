/**
 * Authentication service with LOCAL_MODE fallback.
 *
 * In Firebase mode: uses Firebase Auth (email/password + Google).
 * In LOCAL_MODE: uses a mock auth that accepts any email/name
 * and stores the user in memory.
 *
 * @module lib/firebase/auth
 */

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import { getFirebaseApp, LOCAL_MODE } from "./config";

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  isAnonymous: boolean;
}

let auth: Auth | null = null;

function getAuthInstance(): Auth | null {
  if (LOCAL_MODE) return null;
  if (!auth) {
    const app = getFirebaseApp();
    if (app) auth = getAuth(app);
  }
  return auth;
}

/* ── LOCAL_MODE mock state ── */
let mockUser: AppUser | null = null;
const mockListeners = new Set<(u: AppUser | null) => void>();

function notifyMockListeners() {
  mockListeners.forEach((fn) => fn(mockUser));
}

/* ── Public API ── */

/** Sign in anonymously (creates a temporary guest identity). */
export async function signInAsGuest(): Promise<AppUser> {
  if (LOCAL_MODE) {
    const id = Math.random().toString(36).slice(2, 10);
    mockUser = { uid: `guest_${id}`, displayName: `Guest_${id.slice(0, 4)}`, email: null, isAnonymous: true };
    notifyMockListeners();
    return mockUser;
  }
  const a = getAuthInstance()!;
  const cred = await signInAnonymously(a);
  return toAppUser(cred.user);
}

/** Sign in with email and password. Creates account if it doesn't exist. */
export async function signInWithEmail(email: string, password: string): Promise<AppUser> {
  if (LOCAL_MODE) {
    mockUser = { uid: `local_${email}`, displayName: email.split("@")[0], email, isAnonymous: false };
    notifyMockListeners();
    return mockUser;
  }
  const a = getAuthInstance()!;
  try {
    const cred = await signInWithEmailAndPassword(a, email, password);
    return toAppUser(cred.user);
  } catch {
    const cred = await createUserWithEmailAndPassword(a, email, password);
    return toAppUser(cred.user);
  }
}

/** Sign out the current user. */
export async function signOut(): Promise<void> {
  if (LOCAL_MODE) {
    mockUser = null;
    notifyMockListeners();
    return;
  }
  const a = getAuthInstance();
  if (a) await firebaseSignOut(a);
}

/** Subscribe to auth state changes. Returns unsubscribe function. */
export function onAuthChange(callback: (user: AppUser | null) => void): () => void {
  if (LOCAL_MODE) {
    mockListeners.add(callback);
    callback(mockUser);
    return () => { mockListeners.delete(callback); };
  }
  const a = getAuthInstance()!;
  return onAuthStateChanged(a, (u) => callback(u ? toAppUser(u) : null));
}

/** Get current user synchronously (may be null if not loaded yet). */
export function getCurrentUser(): AppUser | null {
  if (LOCAL_MODE) return mockUser;
  const a = getAuthInstance();
  return a?.currentUser ? toAppUser(a.currentUser) : null;
}

function toAppUser(u: User): AppUser {
  return {
    uid: u.uid,
    displayName: u.displayName,
    email: u.email,
    isAnonymous: u.isAnonymous,
  };
}
