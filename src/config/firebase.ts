// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyG3lJQTShYpUnood3BcQQKEKoP59jyaI",
  authDomain: "crrm-b99f1.firebaseapp.com",
  projectId: "crrm-b99f1",
  storageBucket: "crrm-b99f1.firebasestorage.app",
  messagingSenderId: "724049225612",
  appId: "1:724049225612:web:953401527d941de9d098a9",
  measurementId: "G-CHTFCQQ1KS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in production and client-side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };