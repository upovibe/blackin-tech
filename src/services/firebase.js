import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvMapEyCEuxD0RjTu_878UI3UERgANEI0",
  authDomain: "blackin-tech.firebaseapp.com",
  projectId: "blackin-tech",
  storageBucket: "blackin-tech.appspot.com",
  messagingSenderId: "171101786482",
  appId: "1:171101786482:web:a346216608e70b5f708deb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, googleProvider };