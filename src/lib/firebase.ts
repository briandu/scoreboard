"use client";

import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase } from "firebase/database";

let appInstance: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (appInstance) return appInstance;

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error(
      "Missing Firebase config. Ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, and NEXT_PUBLIC_FIREBASE_APP_ID are set."
    );
  }

  appInstance = getApps().length ? getApps()[0] : initializeApp(config);
  return appInstance;
}

export function getRealtimeDatabase() {
  const app = getFirebaseApp();
  const url = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  return url ? getDatabase(app, url) : getDatabase(app);
}


