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
