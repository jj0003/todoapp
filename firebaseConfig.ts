import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence  } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';




// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBvYafBIerPlcWWT7jonBE9cY0cLzQ5KNI",
  authDomain: "mytodoapp-37b8a.firebaseapp.com",
  projectId: "mytodoapp-37b8a",
  storageBucket: "mytodoapp-37b8a.appspot.com",
  messagingSenderId: "50132981197",
  appId: "1:50132981197:web:82e6c0fd6597c0184fe084"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// Initialize Auth with AsyncStorage for persistence
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);