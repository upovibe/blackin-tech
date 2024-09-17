import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";


// Save a job for a user and increment save count
export const saveJob = async (userId, jobId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);
    let savedJobs = savedJobsSnap.exists() ? savedJobsSnap.data().jobs || [] : [];

    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      await setDoc(savedJobsDocRef, { jobs: savedJobs }, { merge: true });

      const jobDocRef = doc(db, 'jobs', jobId);
      await updateDoc(jobDocRef, { saveCount: increment(1) });

      console.log("Job saved and save count incremented.");
    } else {
      console.log("Job is already saved.");
    }
  } catch (e) {
    console.error("Error saving job: ", e);
  }
};


export const removeSavedJob = async (userId, jobId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);

    if (savedJobsSnap.exists()) {
      let savedJobs = savedJobsSnap.data().jobs || [];
      if (savedJobs.includes(jobId)) {
        savedJobs = savedJobs.filter(id => id !== jobId);
        await setDoc(savedJobsDocRef, { jobs: savedJobs }, { merge: true });

        const jobDocRef = doc(db, 'jobs', jobId);
        const jobSnap = await getDoc(jobDocRef);
        if (jobSnap.exists()) {
          await updateDoc(jobDocRef, { saveCount: increment(-1) });
          console.log("Job removed and save count decremented.");
        } else {
          console.error(`Error: No job found with ID ${jobId} to update.`);
        }
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


// Increment the view count for a job
export const incrementJobViewCount = async (jobId) => {
  try {
    const jobDocRef = doc(db, 'jobs', jobId);
    const jobSnap = await getDoc(jobDocRef);

    if (jobSnap.exists()) {
      await updateDoc(jobDocRef, { viewCount: increment(1) });
      console.log("Job view count incremented.");
    } else {
      console.error("Error: No job found with ID:", jobId);
    }
  } catch (e) {
    console.error("Error incrementing view count: ", e.message);
    throw e;
  }
};


// Get saved jobs for a user
export const getSavedJobs = async (userId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);
    return savedJobsSnap.exists() ? savedJobsSnap.data().jobs || [] : [];
  } catch (e) {
    console.error("Error fetching saved jobs: ", e);
    return [];
  }
};

// Get all saved jobs with their details for a user
export const getAllSavedJobsWithDetails = async (userId) => {
  try {
    const savedJobsDocRef = doc(db, 'savedJobs', userId);
    const savedJobsSnap = await getDoc(savedJobsDocRef);

    if (savedJobsSnap.exists()) {
      const savedJobIds = savedJobsSnap.data().jobs || [];
      if (savedJobIds.length === 0) return [];

      const jobsQuery = query(collection(db, 'jobs'), where('__name__', 'in', savedJobIds));
      const jobsSnapshot = await getDocs(jobsQuery);
      return jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      console.log("No saved jobs found for this user.");
      return [];
    }
  } catch (e) {
    console.error("Error fetching saved jobs with details: ", e);
    return [];
  }
};

// Get jobs posted by a user
export const getPostedJobsByUser = async (userId) => {
  try {
    const jobsQuery = query(collection(db, 'jobs'), where('postedBy', '==', userId));
    const jobsSnapshot = await getDocs(jobsQuery);
    return jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching posted jobs:", e);
    return [];
  }
};

// Get applied jobs by user
export const getAppliedJobs = async (userId) => {
  try {
    const q = query(collection(db, 'jobApplications'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting applied jobs:', error);
    return [];
  }
};

export const getJobDetails = async (jobId) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    const docSnap = await getDoc(jobRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : {};
  } catch (e) {
    console.error('Error fetching job details:', e.message);
    throw e;
  }
};

// Create a job application
export const createApplication = async (applicationData) => {
  try {
    const docRef = await addDoc(collection(db, 'jobApplications'), applicationData);
    console.log("Application submitted with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error submitting application: ", e.message);
    throw e;
  }
};
