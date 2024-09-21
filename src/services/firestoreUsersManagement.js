import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

// Save a connection for a user (connectedUserId is the profile receiving connections)
export const saveConnection = async (
  connectedUserId,
  connectingUserId,
  connectingUserDetails
) => {
  try {
    const connectedUserDocRef = doc(db, "userConnections", connectedUserId); // Target connected user's profile
    const connectedUserSnap = await getDoc(connectedUserDocRef);

    let connections = connectedUserSnap.exists()
      ? connectedUserSnap.data().connections || []
      : [];

    // Ensure connectingUserDetails has required fields
    if (
      !connectingUserDetails ||
      !connectingUserDetails.fullName ||
      !connectingUserDetails.avatarUrl
    ) {
      console.error("Invalid connecting user details:", connectingUserDetails);
      return;
    }

    // Check if this connecting user is already in the list of connections
    if (!connections.some((conn) => conn.id === connectingUserId)) {
      connections.push({ id: connectingUserId, ...connectingUserDetails });
      await setDoc(connectedUserDocRef, { connections }, { merge: true }); // Update connected user's profile
      console.log("Connection saved to the connected user's profile.");
    } else {
      console.log("Connection already exists.");
    }
  } catch (e) {
    console.error("Error saving connection: ", e);
  }
};

// Remove a connection for a user
export const removeConnection = async (connectedUserId, connectingUserId) => {
  try {
    const connectedUserDocRef = doc(db, "userConnections", connectedUserId); // Target connected user's profile
    const connectedUserSnap = await getDoc(connectedUserDocRef);

    if (connectedUserSnap.exists()) {
      let connections = connectedUserSnap.data().connections || [];
      if (connections.some((conn) => conn.id === connectingUserId)) {
        connections = connections.filter(
          (conn) => conn.id !== connectingUserId
        ); // Remove the connection
        await setDoc(connectedUserDocRef, { connections }, { merge: true });
        console.log("Connection removed.");
      } else {
        console.log("Connection not found.");
      }
    } else {
      console.log("No connections found for this user.");
    }
  } catch (e) {
    console.error("Error removing connection: ", e);
  }
};

// Get all connections for a user
export const getConnections = async (connectedUserId) => {
  try {
    const connectedUserDocRef = doc(db, "userConnections", connectedUserId); // Target connected user's profile
    const connectedUserSnap = await getDoc(connectedUserDocRef);
    return connectedUserSnap.exists()
      ? connectedUserSnap.data().connections || []
      : [];
  } catch (e) {
    console.error("Error fetching connections: ", e);
    return [];
  }
};

// Get connection details by connection ID
export const getConnectionDetails = async (connectionId) => {
  try {
    const connectionRef = doc(db, "users", connectionId); // Assuming user details are stored in 'users' collection
    const docSnap = await getDoc(connectionRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : {};
  } catch (e) {
    console.error("Error fetching connection details:", e.message);
    throw e;
  }
};

// Real-time listener for connection count
export const listenToConnectionCount = (userId, callback) => {
  const userConnectionsDocRef = doc(db, "userConnections", userId);
  return onSnapshot(userConnectionsDocRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const connections = docSnapshot.data().connections || [];
      callback(connections.length);
    } else {
      callback(0); // No connections if the document doesn't exist
    }
  });
};

export const getUserByUsername = async (userName) => {
    try {
      const usersQuery = query(collection(db, 'users'), where('userName', '==', userName));
      const usersCollection = await getDocs(usersQuery);
      
      if (usersCollection.empty) {
        return null; // User not found
      }
  
      const userDoc = usersCollection.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  };