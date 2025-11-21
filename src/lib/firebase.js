import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZELwb2pAg7YHsF-w8PztlqgobCzQ_Mak",
    authDomain: "boardingsolutions-4c87c.firebaseapp.com",
    projectId: "boardingsolutions-4c87c",
    storageBucket: "boardingsolutions-4c87c.firebasestorage.app",
    messagingSenderId: "99534088396",
    appId: "1:99534088396:web:97d875630abe65cc4d3a69",
    measurementId: "G-JHE6KYVQD4"
};

// Initialize Firebase (Singleton pattern for Next.js to prevent re-initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
