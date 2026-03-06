import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { environment } from '../environments/environment';

export const firebaseApp = initializeApp(environment.firebase);

// Autenticación
export const auth = getAuth(firebaseApp);

// Base de datos con caché persistente (offline)
export const db = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({})
});