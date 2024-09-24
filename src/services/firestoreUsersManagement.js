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
  deleteDoc, // Make sure to import deleteDoc
} from "firebase/firestore";

/// Add Connection and Increment the Connected User's Count
export const addConnection = async (
  userId,
  connectedUserId,
  userAvatarUrl,
  userFullName
) => {
  const connectionRef = collection(db, "connections");
  const connectedUserRef = doc(db, "users", connectedUserId); // Update connectedUserId's count

  try {
    // Add a connection document
    await addDoc(connectionRef, {
      userId,
      connectedUserId,
      userAvatarUrl,
      userFullName,
      createdAt: new Date(),
    });

    // Increment the connection count for the connected user
    await updateDoc(connectedUserRef, {
      connectionCount: increment(1),
    });

    console.log("Connection added and connected user's connection count updated successfully!");
  } catch (error) {
    console.error("Error adding connection and updating count: ", error);
  }
};

// Remove Connection and Decrement the Connected User's Count
export const removeConnection = async (userId, connectedUserId) => {
  const connectionRef = collection(db, "connections");
  const connectedUserRef = doc(db, "users", connectedUserId); // Update connectedUserId's count

  try {
    // Find and delete the connection document
    const q = query(
      connectionRef,
      where("userId", "==", userId),
      where("connectedUserId", "==", connectedUserId)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref); // Delete the document
    });

    // Decrement the connection count for the connected user
    await updateDoc(connectedUserRef, {
      connectionCount: increment(-1),
    });

    console.log("Connection removed and connected user's connection count updated successfully!");
  } catch (error) {
    console.error("Error removing connection and updating count: ", error);
  }
};

// Get Connections by User ID (Users this person has connected with)
export const getConnectionsByUserId = async (userId) => {
  const connectionRef = collection(db, "connections");

  try {
    const q = query(connectionRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const connections = [];
    querySnapshot.forEach((doc) => {
      connections.push(doc.data());
    });

    return connections; // Return all users this user is connected to
  } catch (error) {
    console.error("Error getting connections: ", error);
  }
};

// Get Users Connected To a Specific User (Users who have connected with this person)
export const getUsersConnectedTo = async (userId) => {
  const connectionRef = collection(db, "connections");

  try {
    const q = query(connectionRef, where("connectedUserId", "==", userId));
    const querySnapshot = await getDocs(q);

    const connections = [];
    querySnapshot.forEach((doc) => {
      connections.push(doc.data());
    });

    return connections; // Return all users connected to this user
  } catch (error) {
    console.error("Error getting users connected to this user: ", error);
  }
};

// Listen to Connection Count in Real-Time
export const listenToConnectionCount = (userId, callback) => {
  const userRef = doc(db, "users", userId);

  return onSnapshot(
    userRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const connectionCount = data.connectionCount || 0;
        callback(connectionCount); // Send the count back through the callback
      }
    },
    (error) => {
      console.error("Error listening to connection count: ", error);
    }
  );
};

// Check Connection Status
export const checkConnectionStatus = async (userId, profileUserId) => {
  const connectionRef = collection(db, "connections");

  try {
    const q = query(
      connectionRef,
      where("userId", "==", userId),
      where("connectedUserId", "==", profileUserId)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Returns true if the connection exists, false otherwise
  } catch (error) {
    console.error("Error checking connection status: ", error);
    return false;
  }
};

// Listen to Real-Time Connection Status
export const listenToConnectionStatus = (userId, profileUserId, callback) => {
  const connectionRef = collection(db, "connections");

  return onSnapshot(
    query(
      connectionRef,
      where("userId", "==", userId),
      where("connectedUserId", "==", profileUserId)
    ),
    (snapshot) => {
      callback(!snapshot.empty); // Pass true/false to the callback based on connection status
    },
    (error) => {
      console.error("Error listening to connection status: ", error);
    }
  );
};

// Get User by Username
export const getUserByUsername = async (userName) => {
  try {
    const usersQuery = query(
      collection(db, "users"),
      where("userName", "==", userName)
    );
    const usersCollection = await getDocs(usersQuery);

    if (usersCollection.empty) {
      return null; // User not found
    }

    const userDoc = usersCollection.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
};

// Assign badge to user
export const assignBadgeToUser = async (userId, badge) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { badge: badge });
    console.log("Badge assigned successfully");
  } catch (e) {
    console.error("Error assigning badge:", e);
    throw e;
  }
};