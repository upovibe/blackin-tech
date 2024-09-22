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


        // onView={(user) => navigate(`/profile/@${user.userName}`)}
















<div className="gap-3 grid grid-cols-2 place-items-center place-self-center self-center md:grid-cols-3 lg:grid-cols-4" data-pg-collapsed> 
    <!-- Card 1 -->     
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>
    <div style="width: 180px; height: 260px;" className="border-2 border-opacity-30 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all" data-pg-collapsed> 
        <div className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full" style="background-image: url('img/icons/photo-1724123301969-22859c2a3823.jpeg');"></div>         
        <div className="flex flex-col flex-grow items-center justify-between relative"> 
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20"> 
                <img src="https://images.unsplash.com/photo-1723945785190-b6f91da9eceb?ixid=M3wyMDkyMnwwfDF8cmFuZG9tfHx8fHx8fHx8MTcyNjg4MTIwNHw&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=1000&h=1000&fit=crop"> 
            </div>             
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full"> 
                <div className="p-3 size-full text-black"> 
                    <h2 className="antialiased font-bold leading-tight text-center truncate">FullName</h2> 
                    <p className="font-normal leading-tight text-center text-sm truncate">This is a paragraph, one or more lines of text. Each paragraph is displayed in a new line.</p> 
                </div>                 
                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100"> 
                    <button className="border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-full hover:bg-slate-800 hover:text-white/80">Click me!</button>                     
                </div>                 
            </div>             
        </div>         
    </div>     
    <!-- Repeat the above div structure for each card -->     
</div>


                {/* <p className="text-center mt-1 text-sm text-gray-400 flex w-full">
                  {`Connections: ${connectionCounts[profile.id] || 0}`}
                </p> */}







import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import {
  getUserByUsername,
  getConnections,
  saveConnection,
  removeConnection,
  listenToConnectionCount,
} from "../services/firestoreUsersManagement.js";
import Lottie from "lottie-react";
import pageloading from "../assets/animations/Animation - LoadingPage.json";
import Modal from "../components/common/Modal";
import UserInsightsForm from "../components/auth/UserInsightsForm";
import ProfileProgress from "../components/auth/ProfileProgress";
import JobProfile from "../components/lists/JobProfile";
import Divider from "../components/common/Divider";
import TabComponent from "../components/common/TabComponent.jsx";
import DefaultCoverImage from "../assets/images/coverimage.jpg";
import DefaultAvatar from "../assets/images/avatar-default.png";
import { FaInfoCircle, FaMapMarker, FaUser } from "react-icons/fa";
import { FaPencil, FaUserMinus, FaUserPlus } from "react-icons/fa6";
import Toast from "../components/common/Toast"; // Toast component

function Profile() {
  const { userName } = useParams(); // Get username from URL
  const { user } = UserAuth(); // Current logged-in user
  const [profileUser, setProfileUser] = useState(null); // State for the profile user
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connections, setConnections] = useState(new Set()); // Store connections
  const [connectionCount, setConnectionCount] = useState(0); // Store connection count
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userName) {
        console.error("Username is undefined");
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserByUsername(userName);
        if (profile) {
          setProfileUser(profile);

          // Fetch connections and connection count
          const connectionList = await getConnections(profile.id);
          setConnections(new Set(connectionList.map((conn) => conn.id)));
          setConnectionCount(connectionList.length); // Set initial connection count

          // Listen to the connection count changes
          listenToConnectionCount(profile.id, (count) => {
            setConnectionCount(count);
          });
        } else {
          console.error("User profile not found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userName]);

  // Connect user
  const handleConnect = async () => {
    try {
      await saveConnection(user.uid, profileUser.id, {
        fullName: profileUser.fullName,
        avatarUrl: profileUser.avatarUrl,
      });
      setConnections((prevConnections) =>
        new Set([...prevConnections, profileUser.id])
      );
      setConnectionCount((prevCount) => prevCount + 1); // Increment count

      setToastMessage("User connected successfully!");
      setToastType("success");
      setToastVisible(true);
    } catch (error) {
      console.error("Error connecting user:", error);
      setToastMessage("Failed to connect.");
      setToastType("error");
      setToastVisible(true);
    }
  };

  // Disconnect user
  const handleDisconnect = async () => {
    try {
      await removeConnection(user.uid, profileUser.id);
      setConnections((prevConnections) => {
        const updatedConnections = new Set(prevConnections);
        updatedConnections.delete(profileUser.id);
        return updatedConnections;
      });
      setConnectionCount((prevCount) => prevCount - 1); // Decrement count

      setToastMessage("User disconnected successfully!");
      setToastType("success");
      setToastVisible(true);
    } catch (error) {
      console.error("Error disconnecting user:", error);
      setToastMessage("Failed to disconnect.");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Lottie animationData={pageloading} loop={true} className="w-48 h-48" />
      </div>
    );
  }

  if (!profileUser) {
    return <p>User not found</p>;
  }

  const tabs = [
    profileUser.role === "admin" && {
      label: "Posted",
      content: <JobProfile tab="Posted" />,
    },
    { label: "Applied", content: <JobProfile tab="Applied" /> },
    { label: "Saved", content: <JobProfile tab="Saved" /> },
  ].filter(Boolean);

  return (
    <main>
      <section className="w-screen flex flex-col items-center justify-center">
        <div className="w-full h-64 bg-gray-200 relative">
          <img
            src={profileUser.coverImageUrl || DefaultCoverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container flex items-start flex-col lg:flex-row p-0 px-2 md:py-2 gap-5 lg:gap-10">
          <div className="flex items-center flex-col gap-2 mb-4 w-full lg:w-3/6 xl:w-2/6 transform -translate-y-16">
            <div className="flex items-center flex-col gap-5 w-full">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-start lg:items-start flex-col gap-1 w-full">
                  <div className="relative flex flex-col items-center justify-center">
                    <img
                      src={profileUser.avatarUrl || DefaultAvatar}
                      alt="User Avatar"
                      className="w-28 h-28 rounded-full border-2 border-opacity-20 border-gray-300"
                    />
                    {profileUser.role === "admin" && (
                      <span className="absolute bottom-0 text-sm px-3 py-[1px] shadow bg-orange-400 text-white rounded-full font-semibold w-max">
                        {profileUser.role}
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold">
                    {profileUser.fullName || "Anonymous"}
                  </span>
                  <div className="flex flex-row gap-2 items-center">
                    <span className="font-semibold text-lg lowercase">
                      @{profileUser.userName}
                    </span>
                    &#183;
                    <span className="text-sm font-semibold underline">
                      {profileUser.pronouns}
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-max ml-auto mt-5 flex items-center gap-1 transform translate-y-12">
                  {user.userName === profileUser.userName ? (
                    <button
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-1 rounded-full text-slate-950 transition-all w-40 px-5 hover:bg-slate-800 hover:text-white/80"
                      onClick={handleModalOpen}
                    >
                      <FaPencil />
                      Edit
                    </button>
                  ) : (
                    <>
                      {connections.has(profileUser.id) ? (
                        <button
                          className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-1 rounded-full text-slate-950 transition-all w-40 px-5 hover:bg-slate-800 hover:text-white/80"
                          onClick={handleDisconnect}
                        >
                          <FaUserMinus /> Disconnect
                        </button>
                      ) : (
                        <button
                          className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-1 rounded-full text-slate-950 transition-all w-40 px-5 hover:bg-slate-800 hover:text-white/80"
                          onClick={handleConnect}
                        >
                          <FaUserPlus /> Connect
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <ProfileProgress profileUser={profileUser} />
            </div>
          </div>

          <div className="w-full lg:w-3/6 xl:w-4/6 mt-[-50px]">
            <section className="w-full flex justify-start items-center flex-wrap md:justify-between p-3 py-3 gap-3 border-t border-gray-200 text-gray-500">
              <span className="flex items-center gap-2">
                <FaMapMarker />
                {profileUser.location || "Location unavailable"}
              </span>
              <span className="flex items-center gap-2">
                <FaUser />
                {connectionCount}{" "}
                {connectionCount === 1 ? "Connection" : "Connections"}
              </span>
            </section>

            <TabComponent tabs={tabs} />
            <Divider />
          </div>
        </div>

        {isModalOpen && (
          <Modal
            title="Edit Your Profile"
            onClose={handleModalClose}
            size="full"
          >
            <UserInsightsForm onClose={handleModalClose} />
          </Modal>
        )}

        {toastVisible && (
          <Toast
            type={toastType}
            message={toastMessage}
            onClose={() => setToastVisible(false)}
          />
        )}
      </section>
    </main>
  );
}

export default Profile;













import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaBriefcase } from 'react-icons/fa'; // Icon for job types
import RightSidebar from '../common/RightSidebar'; // Adjust the path as needed
import Modal from '../common/Modal'; // Assuming you have a modal component
import JobTypesForm from '../forms/JobTypesForm'; // The job types form

const JobTypesTable = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for adding/editing job types
  const [selectedJobType, setSelectedJobType] = useState(null); // Selected job type for sidebar details
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobTypes', (data) => {
      setJobTypes(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (jobType, updatedData) => {
    const updatedJobType = { ...jobType, ...updatedData };
    updateDocument('jobTypes', updatedJobType.id, updatedJobType)
      .then(() => console.log('Job Type updated successfully'))
      .catch((error) => console.error('Error updating job type:', error));
  };

  const handleDelete = (jobType) => {
    deleteDocument('jobTypes', jobType.id)
      .then(() => console.log('Job Type deleted successfully'))
      .catch((error) => console.error('Error deleting job type:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobTypeToDelete = jobTypes.find((jobType) => jobType.id === rowId);
      if (jobTypeToDelete) {
        deleteDocument('jobTypes', jobTypeToDelete.id)
          .then(() => console.log(`Job Type ${jobTypeToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job type:', error));
      }
    });

    setJobTypes((prevJobTypes) => prevJobTypes.filter((jobType) => !selectedRows.has(jobType.id)));
    setSelectedRows(new Set());
  };

  const handleViewJobType = (jobType) => {
    setSelectedJobType(jobType); 
    setIsSidebarOpen(true); 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Open modal for adding a new job type
  const handleOpenModal = (jobType) => {
    setSelectedJobType(jobType); // Pass job type data to modal
    setIsModalOpen(true);
  };

  // Close modal and reset job type
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJobType(null);
  };

  return (
    <>
      <Table
        title="Job Types Table"
        icon={<FaBriefcase />}
        columns={columns}
        data={jobTypes}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={(jobType) => handleOpenModal(jobType)} // Open modal for editing
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewJobType}
        onAdd={() => handleOpenModal(null)} // Open modal for adding new job types
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Job Type Details"
      >
        {selectedJobType ? (
          <div>
            <p><strong>Name:</strong> {selectedJobType.name}</p>
            <p><strong>Slug:</strong> {selectedJobType.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No job type selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding/editing Job Types */}
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        >
          <JobTypesForm 
            jobType={selectedJobType} 
            onClose={handleCloseModal}
          />
        </Modal>
      )}
    </>
  );
};

export default JobTypesTable;
