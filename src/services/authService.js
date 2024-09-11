import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  addDoc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

const adminEmail = "admin@blackin.com";

export const signUpUser = async (email, password, userData) => {
  try {
    // Check if email already exists
    const emailQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const emailQuerySnapshot = await getDocs(emailQuery);
    if (!emailQuerySnapshot.empty) {
      return { success: false, message: "Email is already in use." };
    }

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Set role based on admin or normal user
    const role = email === adminEmail ? 'admin' : 'user';

    // Save user data in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...userData,
      uid: userCredential.user.uid,
      email,
      role, // Assign role here
      provider: "email",
      createdAt: new Date(),
      profileCompleted: false,
    });

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Sign-up error:", error.code, error.message);
    return {
      success: false,
      message: error.message || "An unknown error occurred.",
    };
  }
};

export const signInWithGoogle = async (navigate) => {
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
        fullName: user.email.split("@")[0], // Use email name as full name
        provider: "google",
        role: "user", // Default Google users are 'user'
        createdAt: new Date(),
        profileCompleted: false,
      });

      // Redirect to complete profile page if the profile is incomplete
      navigate("/CompleteProfile");
    } else {
      const userData = userDocSnapshot.data();

      // Check if the profile is completed
      if (!userData.profileCompleted) {
        // Redirect to complete profile page if the profile is incomplete
        navigate("CompleteProfile");
      } else {
        // If profile is already completed, navigate to the user's profile page
        navigate("/profile");
      }
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const signInUser = async (identifier, password) => {
    try {
      const usersRef = collection(db, "users");
  
      let emailToSignIn = identifier;
      let isAdmin = false;
  
      // Check if identifier is an email or username
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
  
      if (!isEmail) {
        // If it's not an email, assume it's a username and look up the email in Firestore
        const q = query(usersRef, where("userName", "==", identifier)); // Adjusted field name
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          emailToSignIn = querySnapshot.docs[0].data().email;
          isAdmin = querySnapshot.docs[0].data().role === 'admin';
        } else {
          throw new Error("Username not found.");
        }
      } else {
        // If it is an email, check if it's an admin
        const q = query(usersRef, where("email", "==", identifier));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          isAdmin = querySnapshot.docs[0].data().role === 'admin';
        }
      }
  
      // Sign in with the resolved email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToSignIn,
        password
      );
  
      const user = userCredential.user;
  
      // Fetch the user document from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        return { success: false, message: "User not found." };
      }
  
      const userData = userDoc.data();
  
      // Check if the user is the admin or a normal user
      if (isAdmin && userData.role === 'admin') {
        return { success: true, user };
      } else if (!isAdmin && userData.role === 'user') {
        return { success: true, user };
      } else {
        return { success: false, message: "Unauthorized access." };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

// Sign out the user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Function to log out the user
export const logoutUser = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.message);
      return { success: false, message: error.message || 'An unknown error occurred.' };
    }
  };

export const updateProfile = async (profileData) => {
  try {
    const user = auth.currentUser; // Get the current user
    const userDocRef = doc(db, "users", user.uid);

    await updateDoc(userDocRef, {
      ...profileData,
      profileCompleted: true, // Mark the profile as completed
    });

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, message: error.message };
  }
};
