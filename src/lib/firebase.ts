
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAifU25dT1LUqLM4AcFmjNFKiYWBBV4IqQ",
  authDomain: "cloudstage-live.firebaseapp.com",
  projectId: "cloudstage-live",
  storageBucket: "cloudstage-live.appspot.com",
  messagingSenderId: "98523613252",
  appId: "1:98523613252:web:68adfca06edb3b8f059411"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
