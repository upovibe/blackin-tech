import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    getAuth,
    GoogleAuthProvider,
    signOut
  } from "firebase/auth";
  import { doc, getDoc, addDoc, setDoc, query, where, getDocs, collection, updateDoc  } from "firebase/firestore";
  import { auth, db } from "./firebase";


  // Sign up user with email and password
export const signUpUser = async (email, password, userData) => {
    try {
      // Check if email already exists
      const emailQuery = query(collection(db, 'users'), where('email', '==', email));
      const emailQuerySnapshot = await getDocs(emailQuery);
      if (!emailQuerySnapshot.empty) {
        return { success: false, message: 'Email is already in use.' };
      }
  
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        uid: userCredential.user.uid,
        email,
        provider: 'email',
        createdAt: new Date(),
      });
  
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error("Sign-up error:", error.code, error.message);
      return { success: false, message: error.message || 'An unknown error occurred.' };
    }
  };