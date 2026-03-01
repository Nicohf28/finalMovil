import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';

export const firebaseApp = initializeApp(environment.firebase);

// Autenticación
export const auth = getAuth(firebaseApp);

// Base de datos
export const db = getFirestore(firebaseApp);