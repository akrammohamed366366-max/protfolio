import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig as staticConfig } from './firebaseConfig';

const getEnvOrFallback = (envValue: unknown, fallbackValue: string): string => {
  if (typeof envValue === 'string' && envValue.trim() !== '') {
    return envValue.trim();
  }
  return (fallbackValue || '').trim();
};

const apiKey = getEnvOrFallback(import.meta.env.VITE_FIREBASE_API_KEY, staticConfig.apiKey);
const authDomain = getEnvOrFallback(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, staticConfig.authDomain);
const projectId = getEnvOrFallback(import.meta.env.VITE_FIREBASE_PROJECT_ID, staticConfig.projectId);
const storageBucket = getEnvOrFallback(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, staticConfig.storageBucket);
const messagingSenderId = getEnvOrFallback(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, staticConfig.messagingSenderId);
const appId = getEnvOrFallback(import.meta.env.VITE_FIREBASE_APP_ID, staticConfig.appId);

export const isFirebaseConfigured = Boolean(apiKey && projectId);
export const activeProjectId = isFirebaseConfigured ? projectId : null;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    const config = {
      apiKey,
      authDomain: authDomain || undefined,
      projectId,
      storageBucket: storageBucket || undefined,
      messagingSenderId: messagingSenderId || undefined,
      appId: appId || undefined,
    };
    app = getApps().length === 0 ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('Firebase initialization warning:', error);
    app = null;
    auth = null;
    db = null;
  }
} else {
  console.warn(
    'Firebase is not configured. Missing apiKey or projectId. Falling back to static content.'
  );
}

export { app, auth, db };
