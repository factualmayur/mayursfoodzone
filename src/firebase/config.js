import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Helper to check if a config object is valid
export const checkConfigValidity = (config) => {
  return !!(
    config &&
    config.apiKey &&
    config.apiKey !== 'your_api_key_here' &&
    config.apiKey.trim() !== '' &&
    config.projectId &&
    config.projectId !== 'your_project_id_here' &&
    config.projectId.trim() !== ''
  );
};

// Check env config first
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const getSavedFirebaseConfig = () => {
  try {
    const saved = localStorage.getItem('aura_custom_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (checkConfigValidity(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading custom Firebase config from localStorage:", e);
  }
  
  if (checkConfigValidity(envConfig)) {
    return envConfig;
  }
  
  return null;
};

export let db = null;
export let isFirebaseConfigured = false;

export const initializeFirebaseDynamically = (config) => {
  if (!checkConfigValidity(config)) {
    db = null;
    isFirebaseConfigured = false;
    return null;
  }

  try {
    const apps = getApps();
    if (apps.length > 0) {
      // Clean up default app to prevent "Firebase App already exists" error
      // deleteApp returns a promise, we handle it
      deleteApp(apps[0]).catch(err => console.warn("Error deleting app during re-init:", err));
    }
    
    const app = initializeApp(config);
    db = getFirestore(app);
    isFirebaseConfigured = true;
    console.log("✓ Firebase Firestore dynamically initialized successfully.");
    return db;
  } catch (error) {
    console.error("✗ Firebase dynamic initialization failed:", error);
    db = null;
    isFirebaseConfigured = false;
    return null;
  }
};

// Helper to test if a config is valid by performing a test fetch
export const testFirebaseConnection = async (config) => {
  if (!checkConfigValidity(config)) {
    return { success: false, message: "Invalid configuration values." };
  }

  try {
    // Initialize a temporary app with a unique name so we don't disturb the main app
    const tempAppName = `temp-test-${Date.now()}`;
    const tempApp = initializeApp(config, tempAppName);
    const tempDb = getFirestore(tempApp);
    
    // Attempt to read a sample document to verify connection
    const docRef = doc(tempDb, "user_data", "connection_test_check");
    await getDoc(docRef);
    
    // Clean up temporary app
    await deleteApp(tempApp);
    return { success: true };
  } catch (error) {
    console.error("Firestore test connection error details:", error);
    let errorMsg = error.message || "Unknown error connecting to Firestore.";
    if (error.code === "permission-denied") {
      errorMsg = "Database rules permission denied. Ensure Firestore rules allow read/write in Test Mode.";
    } else if (error.code === "not-found") {
      // document not found is actually a successful connection because we reached the DB!
      return { success: true };
    }
    return { success: false, message: errorMsg };
  }
};

// Auto-initialize on first import if config is available
const initialConfig = getSavedFirebaseConfig();
if (initialConfig) {
  initializeFirebaseDynamically(initialConfig);
}

