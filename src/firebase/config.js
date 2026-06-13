import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== 'your_project_id_here' && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key_here';

let app;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("✓ Firebase Firestore database initialized successfully.");
  } catch (error) {
    console.error("✗ Firebase database connection error:", error);
  }
} else {
  console.warn("⚠️ Firebase configuration is missing or holds placeholder values. App is falling back to offline LocalStorage.");
}

export { db, isFirebaseConfigured };
