import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging"; 
// Import the functions you need from the SDKs you need 
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; 

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

 
function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted."); 
    const app =initializeApp(firebaseConfig)
      const messaging = getMessaging(app);
      getToken(messaging, {
        vapidKey:
          "BPyh4hdlS6a_jwhiZSf1YGLloh_MAp-5BASTajTYsPkJhpEosnlIncmLOa3E4tWvUHHGlPfUwsls9T-mqi9WWfY",
      }).then((currentToken) => {
        if (currentToken) {
          console.log("currentToken: ", currentToken);
        } else {
          console.log("Can not get token");
        }
      });
    } else {
      console.log("Do not have permission!");
    }
  });
}

requestPermission();