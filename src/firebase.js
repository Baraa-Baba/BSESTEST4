// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getMessaging,getToken  } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey: "AIzaSyDlfYPrXQb-Jq0CS9B8BGaS4vrqHl60j2A",
  authDomain: "bses-1fed7.firebaseapp.com",
  projectId: "bses-1fed7",
  storageBucket: "bses-1fed7.appspot.com",
  messagingSenderId: "320498537701",
  appId: "1:320498537701:web:4392b2ff333e1a6b81700c",
  measurementId: "G-DFGQ5G1GLT"
};

 

// Initialize Firebase 
export  const app = initializeApp(firebaseConfig) 
export const auth =getAuth(app)
export const storage = getStorage(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
