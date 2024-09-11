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
  
  export const signUpUser = async (email, password, userData) => {
    try {
      // Check if email already exists
      const emailQuery = query(collection(db, 'users'), where('email', '==', email));
      const emailQuerySnapshot = await getDocs(emailQuery);
      if (!emailQuerySnapshot.empty) {
        return { success: false, message: 'Email is already in use.' };
      }

     // Check if username already exists
        const userNameQuery = query(collection(db, 'users'), where('userName', '==', userData.userName));
        const userNameQuerySnapshot = await getDocs(userNameQuery);
        if (!userNameQuerySnapshot.empty) {
          return { success: false, message: 'Username is already in use.' };
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


  // Sign in the user with Google
export const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      
      // Check if the user document already exists
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        // If it doesn't exist, create a new user document
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          provider: 'google',
          createdAt: new Date(),
        });
      }
  
      return { success: true, user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
  

// Sign in the user with email or username
export const signInUser = async (emailOrUsername, password) => {
    try {
      let email = emailOrUsername;
  
      // Check if the input is an email or username
      if (!emailOrUsername.includes('@')) {
        // The input is assumed to be a username. Fetch the corresponding email from Firestore
        const userDoc = await getDoc(doc(db, 'users', emailOrUsername));
        if (userDoc.exists()) {
          email = userDoc.data().email; // Fetch the email stored in Firestore
        } else {
          return { success: false, message: 'Username does not exist' };
        }
      }
  
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  
  // Sign out the user
  export const logoutUser = async () => {
    try {
      await signOut(auth);
      return { success: true, message: "User logged out successfully." };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };
