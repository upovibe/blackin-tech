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
  setDoc,
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



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to save a job for a user and increment save count
export const saveJob = async (userId, jobId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);
    let savedJobs = [];
    if (savedJobsSnap.exists()) {
      savedJobs = savedJobsSnap.data().jobs || [];
    }
    
    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      await setDoc(savedJobsDocRef, { jobs: savedJobs }, { merge: true });
      
      // Increment save count in the job document
      const jobDocRef = doc(db, 'jobs', jobId);
      await updateDoc(jobDocRef, {
        saveCount: increment(1),
      });

      console.log("Job saved and save count incremented.");
    } else {
      console.log("Job is already saved.");
    }
  } catch (e) {
    console.error("Error saving job: ", e);
  }
};



// Function to remove a saved job for a user and decrement save count
export const removeSavedJob = async (userId, jobId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);
    if (savedJobsSnap.exists()) {
      let savedJobs = savedJobsSnap.data().jobs || [];
      if (savedJobs.includes(jobId)) {
        savedJobs = savedJobs.filter(id => id !== jobId);
        await setDoc(savedJobsDocRef, { jobs: savedJobs }, { merge: true });

        // Decrement save count in the job document
        const jobDocRef = doc(db, 'jobs', jobId);
        await updateDoc(jobDocRef, {
          saveCount: increment(-1),
        });

        console.log("Job removed and save count decremented.");
      } else {
        console.log("Job not found in saved jobs.");
      }
    } else {
      console.log("No saved jobs found for this user.");
    }
  } catch (e) {
    console.error("Error removing job: ", e);
  }
};



// Function to increment the view count for a job
export const incrementJobViewCount = async (jobId) => {
  try {
    const jobDocRef = doc(db, 'jobs', jobId);
    await updateDoc(jobDocRef, {
      viewCount: increment(1),
    });
    console.log("Job view count incremented.");
  } catch (e) {
    console.error("Error incrementing view count: ", e);
    throw e;
  }
};



// Function to get saved jobs for a user
export const getSavedJobs = async (userId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);
    if (savedJobsSnap.exists()) {
      return savedJobsSnap.data().jobs || [];
    } else {
      return [];
    }
  } catch (e) {
    console.error("Error fetching saved jobs: ", e);
    return [];
  }
};


// Function to get all saved jobs with their details for a user
export const getAllSavedJobsWithDetails = async (userId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);

    if (savedJobsSnap.exists()) {
      const savedJobIds = savedJobsSnap.data().jobs || [];

      if (savedJobIds.length === 0) {
        return []; // No saved jobs
      }

      // Fetch details of all saved jobs
      const jobsQuery = query(collection(db, 'jobs'), where('__name__', 'in', savedJobIds));
      const jobsSnapshot = await getDocs(jobsQuery);
      const savedJobsDetails = jobsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return savedJobsDetails;
    } else {
      console.log("No saved jobs found for this user.");
      return [];
    }
  } catch (e) {
    console.error("Error fetching saved jobs with details: ", e);
    return [];
  }
};


// Function to fetch filtered jobs
export const fetchFilteredJobs = async (filters, currentPage, jobsPerPage) => {
  try {
    const jobsRef = collection(db, 'jobs');
    let jobsQuery = query(jobsRef);

    // Apply filters
    if (filters.location) {
      jobsQuery = query(jobsQuery, where('location', '==', filters.location));
    }
    if (filters.jobType) {
      jobsQuery = query(jobsQuery, where('jobType', '==', filters.jobType));
    }
    if (filters.remote) {
      jobsQuery = query(jobsQuery, where('remote', '==', filters.remote));
    }

    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Calculate pagination
    const totalJobs = jobs.length;
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    return { jobs: paginatedJobs, totalJobs };
  } catch (e) {
    console.error("Error fetching filtered jobs: ", e);
    throw e;
  }
};


