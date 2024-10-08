import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// Create a document
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e.message);
    throw e;
  }
};

// Read a document by ID
export const getDocumentByID = async (collectionName, docId) => {
   try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);    
    // Check if the document exists
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data();
  } catch (e) {
    console.error("Error getting document:", e);
    throw e;
  }
};

// Read all documents from a collection
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};


// Function to get documents with pagination
export const getAllDocumentsWithLimit = async (collectionName, pageSize, page) => {
  const collectionRef = collection(db, collectionName);
  const q = query(
    collectionRef,
    orderBy("fullName"), // Adjust field if needed
    limit(pageSize)
  );

  let snapshot;
  if (page === 1) {
    snapshot = await getDocs(q);
  } else {
    const previousSnapshots = await getDocs(query(collectionRef, orderBy("fullName"), limit((page - 1) * pageSize)));
    const lastVisible = previousSnapshots.docs[previousSnapshots.docs.length - 1];
    snapshot = await getDocs(query(collectionRef, orderBy("fullName"), startAfter(lastVisible), limit(pageSize)));
  }

  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return docs;
}

// Update a document
export const updateDocument = async (collectionName, docId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted successfully");
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

// Listen to real-time updates on a collection
export const listenToCollection = (collectionName, callback) => {
  const collectionRef = collection(db, collectionName);
  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};
