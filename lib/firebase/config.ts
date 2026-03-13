/**
 * Firebase configuration and initialization.
 *
 * Reads config from NEXT_PUBLIC_ env vars. When LOCAL_MODE is true,
 * Firebase is not initialized and all services return null.
 *
 * @module lib/firebase/config
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

export const LOCAL_MODE = process.env.NEXT_PUBLIC_LOCAL_MODE === "true";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

let app: FirebaseApp | null = null;

/** Returns the Firebase app instance, or null in LOCAL_MODE. */
export function getFirebaseApp(): FirebaseApp | null {
  if (LOCAL_MODE) return null;
  if (!app && getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  }
  return app ?? getApps()[0] ?? null;
}
