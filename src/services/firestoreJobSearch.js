import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Fetch filtered jobs
export const fetchFilteredJobs = async (filters, currentPage, jobsPerPage) => {
  try {
    const jobsRef = collection(db, 'jobs');
    let jobsQuery = query(jobsRef);

    if (filters.location) jobsQuery = query(jobsQuery, where('location', '==', filters.location));
    if (filters.jobType) jobsQuery = query(jobsQuery, where('jobType', '==', filters.jobType));
    if (filters.remote) jobsQuery = query(jobsQuery, where('remote', '==', filters.remote));

    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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

// Search jobs based on a keyword
export const searchJobs = async (searchQuery, currentPage = 1, jobsPerPage = 10) => {
  try {
    const jobsRef = collection(db, 'jobs');
    const jobsQuery = query(
      jobsRef,
      where('title', '>=', searchQuery),
      where('title', '<=', searchQuery + '\uf8ff')
    );

    const querySnapshot = await getDocs(jobsQuery);
    const jobs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const totalJobs = jobs.length;
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    return { jobs: paginatedJobs, totalJobs };
  } catch (e) {
    console.error("Error searching for jobs: ", e);
    throw e;
  }
};
