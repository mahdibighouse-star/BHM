import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  databaseId: firebaseConfig.firestoreDatabaseId,
  experimentalForceLongPolling: true,
} as any);
export const auth = getAuth(app);
export const storage = getStorage(app);
