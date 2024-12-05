import { getAnalytics } from "firebase/analytics";
import { getApps, initializeApp } from "firebase/app";
import { getPerformance } from "firebase/performance";

const FIREBASE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function firebaseClient() {
  if (!getApps().length) {
    initializeApp(FIREBASE_CONFIG);
    // Check that `window` is in scope for the analytics module!
    if (typeof window !== "undefined") {
      // Enable analytics.
      if ("measurementId" in FIREBASE_CONFIG) {
        getAnalytics();
        getPerformance();
      }
    }
  }
}
