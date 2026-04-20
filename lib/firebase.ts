import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyAKnJ2EmN1q8BHZfBc2GWFbDtyzGg7H3cI',
  authDomain:        'srj-app-f2ab4.firebaseapp.com',
  projectId:         'srj-app-f2ab4',
storageBucket:       "srj-app-f2ab4.appspot.com"
  messagingSenderId: '895107611382',
  appId:             '1:895107611382:web:0312e643918eac606e0ad7',
};

// Prevent duplicate app init on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db      = getFirestore(app);

export default app;
