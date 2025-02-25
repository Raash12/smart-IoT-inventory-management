// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Importing getAuth for authentication
import { getFirestore } from 'firebase/firestore';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrZMno56Y-1hK_c3Szi_c348JaIrkUwA4",
  authDomain: "smartiotinventory.firebaseapp.com",
  projectId: "smartiotinventory",
  storageBucket: "smartiotinventory.firebasestorage.app",
  messagingSenderId: "Y830966514696",
  appId: "1:830966514696:web:fb4b969becdd901aeb3dbd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Exporting app, auth, and db
export { app, auth, db };