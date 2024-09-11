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
  query, 
  where, 
  increment,
  serverTimestamp, 
  arrayUnion, 
  arrayRemove,
} from "firebase/firestore";

// Function to create a document in Firestore
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

// Function to read a single document from Firestore by ID
export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
};

// Function to read all documents from a collection
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// Function to update a document in Firestore
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

// Function to delete a document from Firestore
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

// Function to listen to real-time updates on a collection
export const listenToCollection = (collectionName, callback) => {
  const collectionRef = collection(db, collectionName);
  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};