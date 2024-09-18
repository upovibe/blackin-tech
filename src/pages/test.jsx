rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data in the 'users' collection
    match /users/{userId} {
      // Allow read access to everyone (even if not signed in)
      allow read: if true;
      
      // Allow write access only if the user is signed in
      allow write: if request.auth != null;
    }
    
    // Rules for jobs collection
    match /jobs/{jobId} {
      // Allow read access to everyone (even if not signed in)
      allow read: if true;
      
      // Allow write access only if the user is signed in
      allow write: if request.auth != null;
    }

    // Rules for job applications
    match /jobApplications/{applicationId} {
      // Allow read/write if the user is authenticated
      allow create: if request.auth != null;
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Rules for saved jobs
    match /savedJobs/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
     match /userInsights/{userId} {
      // Allow read access to everyone (even if not signed in)
      allow read: if true;
      
      // Allow write access only if the user is signed in
      allow write: if request.auth != null;
    }
  }
}



import { updateDocument, getDocumentByID } from "./yourFirestoreFunctions"; // Example import for Firestore helpers

const { user } = UserAuth(); // Assuming you have the user from your authentication
const userID = user?.uid; // Get the user's unique ID from authentication
const [loading, setLoading] = useState(false);
const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

// Form values to update specific fields in the user's document
const [formValues, setFormValues] = useState({
  professionalTitle: "",
  summary: "",
  skills: [],
  abilities: [],
  workHistory: [
    {
      companyName: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  certifications: [{ certName: "", issuingOrg: "", dateObtained: "" }],
  education: [{ category: "", institution: "", startDate: "", endDate: "" }],
  availability: "",
  resumeURL: "",
  cvFile: null,
  dateSubmitted: "",
});

// Fetch the existing user document and prefill the form
useEffect(() => {
  const fetchUserData = async () => {
    if (!userID) return;

    try {
      setLoading(true);
      
      // Get the user's document by ID
      const userDoc = await getDocumentByID("users", userID);
      
      if (userDoc) {
        // Populate the form with the user's existing data
        setFormValues((prev) => ({ ...prev, ...userDoc }));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [userID]);

// Handle form submit for updating the user's document
const handleSubmit = async (e) => {
  e.preventDefault();

  const { professionalTitle, summary, skills, abilities } = formValues;
  if (!professionalTitle || !summary || skills.length === 0 || abilities.length === 0) {
    setToast({
      visible: true,
      message: "Please fill all required fields",
      type: "error",
    });
    return;
  }

  if (!userID) {
    setToast({
      visible: true,
      message: "User not authenticated",
      type: "error",
    });
    return;
  }

  setLoading(true); // Start loading
  const currentDate = new Date().toISOString();
  const updatedFormValues = { ...formValues, dateSubmitted: currentDate };

  try {
    // Update the existing document in Firestore
    await updateDocument("users", userID, updatedFormValues);
    setToast({
      visible: true,
      message: "Profile updated successfully!",
      type: "success",
    });
  } catch (error) {
    console.error("Failed to update user document:", error);
    setToast({
      visible: true,
      message: "Failed to update profile",
      type: "error",
    });
  } finally {
    setLoading(false); // End loading
  }
};


import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig"; // Your Firebase config file

const updateDocument = async (collectionName, docID, updatedData) => {
  const docRef = doc(firestore, collectionName, docID);
  return await updateDoc(docRef, updatedData);
};

const getDocumentByID = async (collectionName, docID) => {
  const docRef = doc(firestore, collectionName, docID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error("No such document!");
  }
};


Sure! Here’s a comprehensive list of elements that should be on the admin dashboard for BlackInTech:

1. Overview Section
Total Jobs Posted: The total number of job listings on the platform.
Total Applications: The total number of job applications submitted.
Active Users: The current number of active users (both job seekers and employers).
New Registrations: The number of new user registrations over a specific period.
Jobs by Category: A breakdown of job postings by different categories (e.g., IT, Marketing, Finance).
2. User Management
User List: A detailed list of users with options to view, edit, and delete user profiles.
User Roles: Management of user roles and permissions (e.g., admin, recruiter, job seeker).
User Activity: Logs showing recent activities by users (e.g., logins, applications submitted).
3. Job Management
Job Listings: A list of all job postings with options to approve, edit, or delete listings.
Pending Approvals: Jobs that require admin approval before being published.
Job Expiry: A list of jobs that are nearing expiry or have expired.
Applications Per Job: The number of applications received for each job listing.
4. Application Management
Application Status: Tracking the status of job applications (e.g., pending, reviewed, accepted, rejected).
Resume Database: Access to resumes submitted by job seekers.
Application Insights: Metrics and trends on job applications, such as peak application times.
5. Analytics & Reports
User Growth: Charts and graphs showing user registration trends over time.
Job Posting Trends: Visual representation of trends in job postings.
Application Metrics: Detailed analysis of job applications, categorized by job type, location, etc.
Conversion Rates: Metrics on how many applications lead to successful hires.
6. Notifications & Alerts
System Alerts: Notifications about important system events or updates.
User Alerts: Alerts for user actions that require admin attention (e.g., flagged content, support requests).
7. Settings & Configurations
Platform Settings: General settings for managing platform operations.
Email Templates: Management of email templates used for notifications sent to users.
Payment Settings: Management of payment gateways and viewing transaction history (if applicable).
8. Support & Feedback
Support Tickets: Management of support requests submitted by users.
User Feedback: Viewing and responding to feedback provided by users.
9. Content Management
Blog/News Management: Management of blog posts or news updates related to the platform.
Static Pages: Editing content on static pages (e.g., About Us, Contact Us).
10. Security & Compliance
Audit Logs: Tracking changes and actions taken by admins and users.
Compliance Reports: Ensuring adherence to legal and regulatory requirements.