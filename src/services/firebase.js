import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMVexuA_3wu9Q1gE3mtcOgTCrxf7ys4NQ",
  authDomain: "blackin-tech-1bf4c.firebaseapp.com",
  projectId: "blackin-tech-1bf4c",
  storageBucket: "blackin-tech-1bf4c.appspot.com",
  messagingSenderId: "99756766742",
  appId: "1:99756766742:web:0e807fa86c04922c2d2737"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, googleProvider };