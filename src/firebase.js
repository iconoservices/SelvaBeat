// src/firebase.js
// Centralized Firebase initialization using validated environment variables.

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { env } from './envValidator'; // throws if any required var is missing

// Firebase configuration object – all values come from NEXT_PUBLIC_ env vars.
const firebaseConfig = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app – this will run once per page load.
const app = initializeApp(firebaseConfig);

// Export frequently used Firebase services.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional helper to re‑initialize (useful in tests)
export function initFirebase(customConfig) {
    const cfg = customConfig || firebaseConfig;
    return initializeApp(cfg);
}

// Guard: if any service fails to initialize, log a clear error.
if (!app) {
    console.error('🚨 Firebase failed to initialize – check environment variables.');
}
