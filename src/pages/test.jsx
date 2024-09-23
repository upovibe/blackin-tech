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



// UserProfileList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getConnections,
  saveConnection,
  removeConnection,
  listenToConnectionCount,
} from "../../services/firestoreUsersManagement";
import { truncateText } from "../../utils/truncate";
import { getAllDocuments } from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";
import { FaUserPlus, FaUserMinus, FaEye, FaTimes } from "react-icons/fa";

const UserProfileList = () => {
  const { user } = UserAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());
  const [connectionCounts, setConnectionCounts] = useState({});
  const [removedProfiles, setRemovedProfiles] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeList = []; // To store multiple unsubscribe functions

    const fetchProfiles = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const connectionList = await getConnections(user.uid);
        setConnections(new Set(connectionList.map((conn) => conn.connectedTo)));

        const allProfiles = await getAllDocuments("users");
        const validProfiles = allProfiles.filter((profile) => profile.fullName && profile.id !== user.uid); // Exclude self

        // Shuffle profiles for random arrangement
        const shuffledProfiles = validProfiles.sort(() => Math.random() - 0.5);
        setProfiles(shuffledProfiles);

        // Set up listeners for each profile's connection count
        shuffledProfiles.forEach((profile) => {
          const unsubscribe = listenToConnectionCount(profile.id, (count) => {
            setConnectionCounts((prevCounts) => ({
              ...prevCounts,
              [profile.id]: count,
            }));
          });
          unsubscribeList.push(unsubscribe);
        });
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

    // Cleanup all listeners on unmount
    return () => {
      unsubscribeList.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  const handleRemove = (profileId) => {
    setRemovedProfiles((prevRemoved) => new Set([...prevRemoved, profileId]));
  };

  const handleConnect = async (profileId, profile) => {
    if (user) {
      try {
        const fullName = profile.fullName || "Anonymous User";
        await saveConnection(user.uid, profileId, {
          fullName,
          avatarUrl: profile.avatarUrl,
        });
        // No need to manually update connections here; listener will handle it
        setToastMessage("Connected successfully!");
        setToastType("success");
        setToastVisible(true);
      } catch (error) {
        console.error("Error connecting user: ", error);
        setToastMessage("Failed to connect.");
        setToastType("error");
        setToastVisible(true);
      }
    } else {
      setToastMessage("Sign in to get started!");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleDisconnect = async (profileId) => {
    if (user) {
      try {
        await removeConnection(user.uid, profileId);
        // No need to manually update connections here; listener will handle it
        setToastMessage("Disconnected successfully!");
        setToastType("success");
        setToastVisible(true);
      } catch (error) {
        console.error("Error disconnecting user: ", error);
        setToastMessage("Failed to disconnect.");
        setToastType("error");
        setToastVisible(true);
      }
    } else {
      setToastMessage("Sign in to get started!");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <Lottie animationData={loadingAnimation} className="w-64 h-64" />
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Lottie animationData={noDataAnimation} className="w-64 h-64" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="profile-list-results gap-3 grid grid-cols-2 place-items-center place-self-center self-center md:grid-cols-3 lg:grid-cols-4">
      {profiles.map((profile) => {
        if (removedProfiles.has(profile.id)) return null;
        return (
          <div
            key={profile.id}
            className="border-2 border-opacity-30 bg-slate-50 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all"
            style={{ width: "180px", minHeight: "260px" }}
            onClick={() => handleProfileClick(profile.userName)}
          >
            <div className="relative">
              <div
                className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full"
                style={{
                  backgroundImage: `url(${profile.coverImageUrl || "https://via.placeholder.com/150"})`,
                }}
              />
              {/* Close button at top-right of cover image */}
              <button
                className="absolute top-1 right-1 p-2 text-white bg-black/25 hover:bg-black/50 rounded-full transition-all duration-200 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(profile.id);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col flex-grow items-center justify-between relative">
              <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20">
                <img
                  src={profile.avatarUrl || "https://via.placeholder.com/150"}
                  alt={profile.fullName}
                  className=""
                />
              </div>
              <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full">
                <div className="p-3 size-full text-center">
                  <h3 className="text-center font-semibold truncate mt-1">
                    {profile.fullName}
                  </h3>
                  <span className="text-sm truncate">
                    {profile.professionalTitle || "No title"}
                  </span>
                  <p className="text-sm text-slate-500">
                    {truncateText((profile.skills || []).join(" | "), 100)}{" "}
                  </p>
                </div>

                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100">
                  <div className="flex justify-center">
                    {user.uid === profile.id ? (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={() => navigate(`/profile/${profile.userName}`)}
                      >
                        <FaEye />
                        View
                      </button>
                    ) : connections.has(profile.id) ? (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDisconnect(profile.id);
                        }}
                      >
                        <FaUserMinus /> Disconnect
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(profile.id, {
                            fullName: profile.fullName,
                            avatarUrl: profile.avatarUrl,
                          });
                        }}
                      >
                        <FaUserPlus /> Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Toast Notification */}
      <Toast
        role="alert"
        aria-live="assertive"
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default UserProfileList;




// UserProfileList.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getConnections,
  saveConnection,
  removeConnection,
  listenToConnectionCount,
} from "../../services/firestoreUsersManagement";
import { truncateText } from "../../utils/truncate";
import { getAllDocuments } from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";
import { FaUserPlus, FaUserMinus, FaEye, FaTimes } from "react-icons/fa";

const UserProfileList = () => {
  const { user } = UserAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());
  const [connectionCounts, setConnectionCounts] = useState({});
  const [removedProfiles, setRemovedProfiles] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeList = []; // To store multiple unsubscribe functions

    const fetchProfiles = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const connectionList = await getConnections(user.uid);
        setConnections(new Set(connectionList.map((conn) => conn.connectedTo)));

        const allProfiles = await getAllDocuments("users");
        const validProfiles = allProfiles.filter((profile) => profile.fullName && profile.id !== user.uid); // Exclude self

        // Shuffle profiles for random arrangement
        const shuffledProfiles = validProfiles.sort(() => Math.random() - 0.5);
        setProfiles(shuffledProfiles);

        // Set up listeners for each profile's connection count
        shuffledProfiles.forEach((profile) => {
          const unsubscribe = listenToConnectionCount(profile.id, (count) => {
            setConnectionCounts((prevCounts) => ({
              ...prevCounts,
              [profile.id]: count,
            }));
          });
          unsubscribeList.push(unsubscribe);
        });
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

    // Cleanup all listeners on unmount
    return () => {
      unsubscribeList.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  const handleRemove = (profileId) => {
    setRemovedProfiles((prevRemoved) => new Set([...prevRemoved, profileId]));
  };

  const handleConnect = async (profileId, profile) => {
    if (user) {
      try {
        const fullName = profile.fullName || "Anonymous User";
        await saveConnection(user.uid, profileId, {
          fullName,
          avatarUrl: profile.avatarUrl,
        });
        // No need to manually update connections here; listener will handle it
        setToastMessage("Connected successfully!");
        setToastType("success");
        setToastVisible(true);
      } catch (error) {
        console.error("Error connecting user: ", error);
        setToastMessage("Failed to connect.");
        setToastType("error");
        setToastVisible(true);
      }
    } else {
      setToastMessage("Sign in to get started!");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleDisconnect = async (profileId) => {
    if (user) {
      try {
        await removeConnection(user.uid, profileId);
        // No need to manually update connections here; listener will handle it
        setToastMessage("Disconnected successfully!");
        setToastType("success");
        setToastVisible(true);
      } catch (error) {
        console.error("Error disconnecting user: ", error);
        setToastMessage("Failed to disconnect.");
        setToastType("error");
        setToastVisible(true);
      }
    } else {
      setToastMessage("Sign in to get started!");
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <Lottie animationData={loadingAnimation} className="w-64 h-64" />
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Lottie animationData={noDataAnimation} className="w-64 h-64" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="profile-list-results gap-3 grid grid-cols-2 place-items-center place-self-center self-center md:grid-cols-3 lg:grid-cols-4">
      {profiles.map((profile) => {
        if (removedProfiles.has(profile.id)) return null;
        return (
          <div
            key={profile.id}
            className="border-2 border-opacity-30 bg-slate-50 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all"
            style={{ width: "180px", minHeight: "260px" }}
            onClick={() => handleProfileClick(profile.userName)}
          >
            <div className="relative">
              <div
                className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full"
                style={{
                  backgroundImage: `url(${profile.coverImageUrl || "https://via.placeholder.com/150"})`,
                }}
              />
              {/* Close button at top-right of cover image */}
              <button
                className="absolute top-1 right-1 p-2 text-white bg-black/25 hover:bg-black/50 rounded-full transition-all duration-200 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(profile.id);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col flex-grow items-center justify-between relative">
              <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20">
                <img
                  src={profile.avatarUrl || "https://via.placeholder.com/150"}
                  alt={profile.fullName}
                  className=""
                />
              </div>
              <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full">
                <div className="p-3 size-full text-center">
                  <h3 className="text-center font-semibold truncate mt-1">
                    {profile.fullName}
                  </h3>
                  <span className="text-sm truncate">
                    {profile.professionalTitle || "No title"}
                  </span>
                  <p className="text-sm text-slate-500">
                    {truncateText((profile.skills || []).join(" | "), 100)}{" "}
                  </p>
                </div>

                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100">
                  <div className="flex justify-center">
                    {user.uid === profile.id ? (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={() => navigate(`/profile/${profile.userName}`)}
                      >
                        <FaEye />
                        View
                      </button>
                    ) : connections.has(profile.id) ? (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDisconnect(profile.id);
                        }}
                      >
                        <FaUserMinus /> Disconnect
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(profile.id, {
                            fullName: profile.fullName,
                            avatarUrl: profile.avatarUrl,
                          });
                        }}
                      >
                        <FaUserPlus /> Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Toast Notification */}
      <Toast
        role="alert"
        aria-live="assertive"
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default UserProfileList;














// Profile.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import {
  getUserByUsername,
  getConnections,
  saveConnection,
  removeConnection,
  listenToConnectionCount,
} from "../services/firestoreUsersManagement";
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
import { FaInfoCircle, FaMapMarker, FaUser, FaPencil, FaUserMinus, FaUserPlus } from "react-icons/fa6";
import Toast from "../components/common/Toast";

function Profile() {
  const { userName } = useParams(); // Get username from URL
  const navigate = useNavigate();
  const { user } = UserAuth(); // Current logged-in user
  const [profileUser, setProfileUser] = useState(null); // State for the profile user
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connections, setConnections] = useState(new Set()); // Store connections
  const [connectionCount, setConnectionCount] = useState(0); // Store connection count
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");

  const handleNavigateToSettings = () => {
    navigate(`/settings`);
  };

  useEffect(() => {
    let unsubscribe = null; // To store the unsubscribe function for the listener

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
          unsubscribe = listenToConnectionCount(profile.id, (count) => {
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

    // Cleanup the listener on unmount or when userName changes
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userName]);

  // Connect user
  const handleConnect = async () => {
    try {
      await saveConnection(user.uid, profileUser.id, {
        fullName: profileUser.fullName,
        avatarUrl: profileUser.avatarUrl,
      });
      // No need to manually update connections and connectionCount here
      // The real-time listener will handle it
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
      // No need to manually update connections and connectionCount here
      // The real-time listener will handle it
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
                {/* Left Section */}
                <div className="flex items-start lg:items-start flex-col gap-1 w-1/2">
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
                  <span className="text-2xl font-bold text-wrap">
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

                {/* Right Section */}
                <div className="flex items-center justify-end md:w-1/2 ml-auto mt-5 gap-1 transform translate-y-12">
                  {user.userName === profileUser.userName ? (
                    <button
                      onClick={handleNavigateToSettings}
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-1 rounded-full text-slate-950 transition-all w-40 px-5 hover:bg-slate-800 hover:text-white/80"
                    >
                      <FaPencil /> Edit
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

              <div className="rounded-xl border-2 border-slate-300/80 p-3 flex flex-col items-center gap-3 w-full">
                <span className="flex items-baseline space-x-2 text-slate-800 font-semibold text-sm mr-auto">
                  <FaInfoCircle />
                  <p>{profileUser.bio}</p>
                </span>
                <Divider direction="horizontal" className="opacity-50" />
                <div className="flex items-baseline space-x-2 mr-auto text-slate-800 font-semibold text-sm">
                  <FaMapMarker />
                  <span>
                    {profileUser.country}&nbsp;{profileUser.city}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold text-slate-800">
                    Connections: {connectionCount}{" "}
                    {/* Display connection count */}
                  </span>
                </div>
                {user.userName === profileUser.userName && <ProfileProgress />}
              </div>
            </div>
          </div>

          <div className="flex items-center flex-col gap-2 mb-4 rounded-xl size-full border-slate-300/80 p-3">
            <div className="size-full">
              <TabComponent
                tabs={tabs}
                defaultActiveTab="Saved"
                onTabChange={() => {}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modal for editing user insights */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Edit Your Insights"
        className="h-screen"
      >
        <UserInsightsForm />
      </Modal>

      {/* Toast notifications */}
      {toastVisible && (
        <Toast
          role="alert"
          aria-live="assertive"
          visible={toastVisible}
          type={toastType}
          message={toastMessage}
          onClose={() => setToastVisible(false)}
        />
      )}
    </main>
  );
}

export default Profile;











import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  addConnection, 
  removeConnection, 
  getConnectionsByUserId, 
  listenToConnectionCount 
} from "../../services/firestoreUsersManagement"; // Import the relevant Firestore functions
import { truncateText } from "../../utils/truncate";
import { getAllDocuments } from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";
import { FaUserPlus, FaUserMinus, FaEye, FaTimes } from "react-icons/fa";

const UserProfileList = () => {
  const { user } = UserAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());
  const [connectionCounts, setConnectionCounts] = useState({});
  const [removedProfiles, setRemovedProfiles] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  // Fetch profiles and listen for real-time connection counts
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const connectionList = await getConnectionsByUserId(user.uid);
        setConnections(new Set(connectionList.map((conn) => conn.connectedUserId)));

        const allProfiles = await getAllDocuments("users");
        const validProfiles = allProfiles.filter((profile) => profile.fullName && profile.id !== user.uid);

        // Shuffle profiles for random arrangement
        const shuffledProfiles = validProfiles.sort(() => Math.random() - 0.5);
        setProfiles(shuffledProfiles);

        // Set up real-time listener for connection counts
        shuffledProfiles.forEach((profile) => {
          listenToConnectionCount(profile.id, (count) => {
            setConnectionCounts((prevCounts) => ({
              ...prevCounts,
              [profile.id]: count,
            }));
          });
        });
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  // Handle connection
  const handleConnect = async (profileId, profile) => {
    try {
      await addConnection(user.uid, profileId, profile.avatarUrl, profile.fullName);
      setConnections((prevConnections) => new Set([...prevConnections, profileId]));
      setToastMessage("Connection added successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error adding connection.");
      setToastType("error");
    }
    setToastVisible(true);
  };

  // Handle disconnection
  const handleDisconnect = async (profileId) => {
    try {
      await removeConnection(user.uid, profileId);
      setConnections((prevConnections) => {
        const updatedConnections = new Set(prevConnections);
        updatedConnections.delete(profileId);
        return updatedConnections;
      });
      setToastMessage("Connection removed successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error removing connection.");
      setToastType("error");
    }
    setToastVisible(true);
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <Lottie animationData={loadingAnimation} className="w-64 h-64" />
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Lottie animationData={noDataAnimation} className="w-64 h-64" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="profile-list-results gap-3 grid grid-cols-2 place-items-center place-self-center self-center md:grid-cols-3 lg:grid-cols-4">
      {profiles.map((profile) => {
        if (removedProfiles.has(profile.id)) return null;
        return (
          <div
            key={profile.id}
            className="border-2 border-opacity-30 bg-slate-50 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all"
            style={{ width: "180px", minHeight: "260px" }}
            onClick={() => handleProfileClick(profile.userName)}
          >
            <div className="relative">
              <div
                className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full"
                style={{
                  backgroundImage: `url(${profile.coverImageUrl || "https://via.placeholder.com/150"})`,
                }}
              />
              {/* Close button at top-right of cover image */}
              <button
                className="absolute top-1 right-1 p-2 text-white bg-black/25 hover:bg-black/50 rounded-full transition-all duration-200 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(profile.id);
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex flex-col flex-grow items-center justify-between relative">
              <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20">
                <img
                  src={profile.avatarUrl || "https://via.placeholder.com/150"}
                  alt={profile.fullName}
                />
              </div>
              <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full">
                <div className="p-3 size-full text-center">
                  <h3 className="text-center font-semibold truncate mt-1">
                    {profile.fullName}
                  </h3>
                  <span className="text-sm truncate">
                    {profile.professionalTitle || "No title"}
                  </span>
                  <p className="text-sm text-slate-500">
                    {truncateText((profile.skills || []).join(" | "), 100)}{" "}
                  </p>
                </div>

                <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100">
                  <div className="flex justify-center">
                    {user.uid === profile.id ? (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={() => navigate(`/profile/${profile.userName}`)}
                      >
                        <FaEye />
                        View
                      </button>
                    ) : connections.has(profile.id) ? (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDisconnect(profile.id);
                        }}
                      >
                        <FaUserMinus /> Disconnect
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnect(profile.id, {
                            fullName: profile.fullName,
                            avatarUrl: profile.avatarUrl,
                          });
                        }}
                      >
                        <FaUserPlus /> Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {/* Toast Notification */}
      <Toast










import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addConnection,
  removeConnection,
  getConnectionsByUserId,
  listenToConnectionCount,
} from "../../services/firestoreUsersManagement";
import { truncateText } from "../../utils/truncate";
import { getAllDocuments } from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";
import { FaUserPlus, FaUserMinus, FaEye, FaTimes } from "react-icons/fa";

const UserProfileList = ({ profiles, keywords, selectedAvailability, selectedLocation }) => {
  const { user } = UserAuth();
  const [profileList, setProfileList] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());
  const [connectionCounts, setConnectionCounts] = useState({});
  const [removedProfiles, setRemovedProfiles] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        const connectionList = await getConnectionsByUserId(user.uid);
        setConnections(new Set(connectionList.map((conn) => conn.connectedUserId)));

        const allProfiles = await getAllDocuments("users");
        const validProfiles = allProfiles.filter(
          (profile) => profile.fullName && profile.id !== user.uid
        );

        const shuffledProfiles = validProfiles.sort(() => Math.random() - 0.5);
        setProfileList(shuffledProfiles);

        shuffledProfiles.forEach((profile) => {
          listenToConnectionCount(profile.id, (count) => {
            setConnectionCounts((prevCounts) => ({
              ...prevCounts,
              [profile.id]: count,
            }));
          });
        });
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user]);

  const handleRemove = (profileId) => {
    setRemovedProfiles((prevRemoved) => new Set([...prevRemoved, profileId]));
  };

  const handleConnect = async (profileId, profile) => {
    setIsConnecting(true);
    try {
      await addConnection(user.uid, profileId, profile.avatarUrl, profile.fullName);
      setConnections((prevConnections) => new Set(prevConnections).add(profileId));
      showToast("Connection added successfully!", "success");
    } catch (error) {
      showToast("Error adding connection.", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (profileId) => {
    setIsDisconnecting(true);
    try {
      await removeConnection(user.uid, profileId);
      setConnections((prevConnections) => {
        const updatedConnections = new Set(prevConnections);
        updatedConnections.delete(profileId);
        return updatedConnections;
      });
      showToast("Connection removed successfully!", "success");
    } catch (error) {
      showToast("Error removing connection.", "error");
    } finally {
      setIsDisconnecting(false);
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const filteredProfiles = profileList.filter((profile) => {
    const keywordMatch = keywords
      ? profile.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
        profile.professionalTitle?.toLowerCase().includes(keywords.toLowerCase()) ||
        profile.skills?.some((skill) =>
          skill.toLowerCase().includes(keywords.toLowerCase())
        )
      : true;

    const availabilityMatch = selectedAvailability
      ? profile.availability === selectedAvailability
      : true;

    const locationMatch = selectedLocation
      ? profile.location?.toLowerCase() === selectedLocation.toLowerCase()
      : true;

    return keywordMatch && availabilityMatch && locationMatch && !removedProfiles.has(profile.id);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col">
        <Lottie animationData={loadingAnimation} className="w-64 h-64" />
        <p>Loading profiles...</p>
      </div>
    );
  }

  if (filteredProfiles.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <Lottie animationData={noDataAnimation} className="w-64 h-64" />
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className="profile-list-results gap-3 grid grid-cols-2 place-items-center md:grid-cols-3 lg:grid-cols-4">
      {filteredProfiles.map((profile) => (
        <div
          key={profile.id}
          className="border-2 border-opacity-30 bg-slate-50 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:shadow-md transition-all duration-300"
          style={{ width: "180px", minHeight: "260px" }}
          onClick={() => handleProfileClick(profile.userName)}
        >
          <div className="relative">
            <div
              className="bg-center bg-cover h-20 w-full"
              style={{
                backgroundImage: `url(${profile.coverImageUrl || "https://via.placeholder.com/150"})`,
              }}
            />
            <button
              className="absolute top-1 right-1 p-2 text-white bg-black/25 hover:bg-black/50 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(profile.id);
              }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col items-center relative">
            <div className="-translate-y-9 border-4 border-white h-20 w-20 rounded-full overflow-hidden">
              <img
                src={profile.avatarUrl || "https://via.placeholder.com/150"}
                alt={profile.fullName}
                className="w-full h-full"
              />
            </div>
            <div className="absolute bottom-0 flex flex-col items-center p-3 w-full bg-white group-hover:bg-slate-200 transition-all">
              <h3 className="text-center font-semibold truncate">{profile.fullName}</h3>
              <span className="text-sm">{profile.professionalTitle || "No title"}</span>
              <p className="text-sm text-slate-500">
                {truncateText((profile.skills || []).join(" | "), 100)}
              </p>

              <div className="mt-2">
                {user.uid === profile.id ? (
                  <button
                    className="flex items-center gap-2 p-2 text-sm font-semibold text-slate-950 border-2 border-slate-600/25 rounded-full hover:bg-slate-800 hover:text-white"
                    onClick={() => navigate(`/profile/${profile.userName}`)}
                  >
                    <FaEye />
                    View
                  </button>
                ) : connections.has(profile.id) ? (
                  <button
                    className="flex items-center gap-2 p-2 text-sm font-semibold text-slate-950 border-2 border-slate-600/25 rounded-full hover:bg-slate-800 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDisconnect(profile.id);
                    }}
                    disabled={isDisconnecting}
                  >
                    <FaUserMinus /> {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 p-2 text-sm font-semibold text-slate-950 border-2 border-slate-600/25 rounded-full hover:bg-slate-800 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnect(profile.id, {
                        fullName: profile.fullName,
                        avatarUrl: profile.avatarUrl,
                      });
                    }}
                    disabled={isConnecting}
                  >
                    <FaUserPlus /> {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <Toast
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default UserProfileList;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addConnection,
  removeConnection,
  getConnectionsByUserId,
  listenToConnectionCount,
} from "../../services/firestoreUsersManagement";
import { truncateText } from "../../utils/truncate";
import { getAllDocumentsWithLimit } from "../../services/firestoreCRUD"; // New function to fetch with limit
import { UserAuth } from "../../contexts/AuthContext";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/animations/Animation - Loading.json";
import noDataAnimation from "../../assets/animations/Animation - No Data Found.json";
import Toast from "../common/Toast";
import { FaUserPlus, FaUserMinus, FaEye, FaTimes } from "react-icons/fa";

const PAGE_SIZE = 10; // Number of profiles to load per page

const UserProfileList = ({ profiles, keywords, selectedAvailability, selectedLocation }) => {
  const { user } = UserAuth();
  const [profileList, setProfileList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState(new Set());
  const [connectionCounts, setConnectionCounts] = useState({});
  const [removedProfiles, setRemovedProfiles] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Flag to check if more profiles exist
  const navigate = useNavigate();

  // Fetch profiles and listen for real-time connection counts
  useEffect(() => {
    const fetchProfiles = async (page) => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        const connectionList = await getConnectionsByUserId(user.uid);
        setConnections(new Set(connectionList.map((conn) => conn.connectedUserId)));

        // Fetch profiles with pagination (limited number)
        const allProfiles = await getAllDocumentsWithLimit("users", PAGE_SIZE, page);
        const validProfiles = allProfiles.filter(
          (profile) => profile.fullName && profile.id !== user.uid
        );

        if (validProfiles.length < PAGE_SIZE) {
          setHasMore(false); // No more profiles to load
        }

        setProfileList((prevProfiles) => [...prevProfiles, ...validProfiles]);

        // Set up real-time listener for connection counts
        validProfiles.forEach((profile) => {
          listenToConnectionCount(profile.id, (count) => {
            setConnectionCounts((prevCounts) => ({
              ...prevCounts,
              [profile.id]: count,
            }));
          });
        });
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles(page);
  }, [user, page]);

  const handleRemove = (profileId) => {
    setRemovedProfiles((prevRemoved) => new Set([...prevRemoved, profileId]));
  };

  const handleConnect = async (profileId, profile) => {
    setIsConnecting(true);
    try {
      await addConnection(user.uid, profileId, profile.avatarUrl, profile.fullName);
      setConnections((prevConnections) => new Set(prevConnections).add(profileId));
      setToastMessage("Connection added successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error adding connection.");
      setToastType("error");
    } finally {
      setIsConnecting(false);
      setToastVisible(true);
    }
  };

  const handleDisconnect = async (profileId) => {
    setIsDisconnecting(true);
    try {
      await removeConnection(user.uid, profileId);
      setConnections((prevConnections) => {
        const updatedConnections = new Set(prevConnections);
        updatedConnections.delete(profileId);
        return updatedConnections;
      });
      setToastMessage("Connection removed successfully!");
      setToastType("success");
    } catch (error) {
      setToastMessage("Error removing connection.");
      setToastType("error");
    } finally {
      setIsDisconnecting(false);
      setToastVisible(true);
    }
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  // Filter profiles based on keywords, availability, and location
  const filteredProfiles = profileList.filter((profile) => {
    const keywordMatch = keywords
      ? profile.fullName.toLowerCase().includes(keywords.toLowerCase()) ||
        profile.professionalTitle?.toLowerCase().includes(keywords.toLowerCase()) ||
        profile.skills?.some((skill) =>
          skill.toLowerCase().includes(keywords.toLowerCase())
        )
      : true;

    const availabilityMatch = selectedAvailability
      ? profile.availability === selectedAvailability
      : true;

    const locationMatch = selectedLocation
      ? profile.location?.toLowerCase() === selectedLocation.toLowerCase()
      : true;

    return keywordMatch && availabilityMatch && locationMatch && !removedProfiles.has(profile.id);
  });

  return (
    <>
      <div className="profile-list-results gap-3 grid grid-cols-2 place-items-center place-self-center self-center md:grid-cols-3 lg:grid-cols-4">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            className="border-2 border-opacity-30 bg-slate-50 border-slate-400 cursor-pointer flex flex-col group overflow-hidden rounded-xl shadow hover:duration-300 hover:ease-in-out hover:shadow-md hover:transition-all"
            style={{ width: "180px", minHeight: "260px" }}
            onClick={() => handleProfileClick(profile.userName)}
          >
<div className="relative">
            <div
              className="bg-center bg-cover h-20 min-h-20 overflow-hidden w-full z-"
              style={{
                backgroundImage: `url(${profile.coverImageUrl || "https://via.placeholder.com/150"})`,
              }}
            />
            <button
              className="absolute top-1 right-1 p-2 text-white bg-black/25 hover:bg-black/50 rounded-full transition-all duration-200 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(profile.id);
              }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col flex-grow items-center justify-between relative">
            <div className="-translate-y-9 border-4 border-white h-1/6 min-h-20 min-w-20 overflow-hidden rounded-full size-20">
              <img
                src={profile.avatarUrl || "https://via.placeholder.com/150"}
                alt={profile.fullName}
              />
            </div>
            <div className="absolute bottom-0 flex flex-col flex-grow h-5/6 justify-between size-full">
              <div className="p-3 size-full text-center">
                <h3 className="text-center font-semibold truncate mt-1">
                  {profile.fullName}
                </h3>
                <span className="text-sm truncate">
                  {profile.professionalTitle || "No title"}
                </span>
                <p className="text-sm text-slate-500">
                  {truncateText((profile.skills || []).join(" | "), 100)}
                </p>
              </div>

              <div className="absolute bg-gradient-to-t bg-slate-100 bottom-0 duration-300 ease-in-out flex flex-grow from-slate-400 h-1/2 items-center justify-center opacity-0 p-3 size-full to-slate-50 transition-opacity via-slate-200 group-hover:opacity-100">
                <div className="flex justify-center">
                  {user.uid === profile.id ? (
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={() => navigate(`/profile/${profile.userName}`)}
                    >
                      <FaEye />
                      View
                    </button>
                  ) : connections.has(profile.id) ? (
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnect(profile.id);
                      }}
                      disabled={isDisconnecting}
                    >
                      <FaUserMinus /> {isDisconnecting ? "Disconnecting..." : "Disconnect"} 
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 border-2 border-slate-600/25 duration-300 ease-in-out font-semibold p-2 rounded-full text-slate-950 text-sm transition-all w-36 hover:bg-slate-800 hover:text-white/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(profile.id, {
                          fullName: profile.fullName,
                          avatarUrl: profile.avatarUrl,
                        });
                      }}
                      disabled={isConnecting}
                    >
                      <FaUserPlus /> {isConnecting ? "Connecting..." : "Connect"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={() => setPage((prevPage) => prevPage + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        role="alert"
        aria-live="assertive"
        visible={toastVisible}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastVisible(false)}
      />
    </>
  );
};

export default UserProfileList;




<div className="flex flex-col min-h-screen">
  {/* Header at the top */}
  <header className="flex items-center justify-between h-16 px-2 bg-white shadow-md w-full">
    <div className="flex items-center gap-10">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        {/* Hidden Sidebar - Show "BT" for small screens */}
        {isHidden && windowWidth < 768 && (
          <div className="flex items-center gap-1">
            <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
              B
            </span>
            <span className="h-10 w-0.5 bg-slate-700"></span>
            <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
              T
            </span>
          </div>
        )}
        {isHidden && windowWidth >= 768 && (
          <div className="flex items-center">
            <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
              B
            </span>
            <span className="text-gray-900 text-2xl font-semibold border-b-2 border-slate-700 pb-[2px]">
              lack
              <span className="text-slate-700 text-2xl font-extrabold">In</span>
              <span className="text-gray-900 text-2xl font-semibold">Tech</span>
            </span>
          </div>
        )}
      </Link>
      <SearchInput />
    </div>

    <div className="flex items-center gap-4">
      <NavAvatar />
      <div className="flex items-center justify-center">
        {/* Hide/Show Sidebar Button */}
        {!isHidden && (
          <button
            className="text-gray-700 hover:bg-gray-300 p-2 rounded-full"
            onClick={toggleHide}
          >
            <FaBarsStaggered className="text-lg" title="Hide Sidebar" />
          </button>
        )}
        {isHidden && (
          <button
            className="text-gray-700 hover:bg-gray-300 p-2 rounded-full"
            onClick={toggleHide}
          >
            <FaBars className="text-lg" title="Show Sidebar" />
          </button>
        )}
      </div>
    </div>
  </header>

  {/* Main content in the middle */}
  <main className="flex-grow relative overflow-y-auto w-full p-4">
    {children}
  </main>

  {/* Footer at the bottom */}
  <footer className="bg-slate-100 py-4 w-full">
    <div className="container mx-auto flex justify-between items-center px-4">
      <p className="text-sm">BlackinTech &copy; 2022</p>
      <ul className="flex gap-x-4">
        <li>
          <a
            href="#"
            className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
          >
            Privacy
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
          >
            Terms
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
          >
            Support
          </a>
        </li>
      </ul>
    </div>
  </footer>
</div>










import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenToCollection,
  updateDocument,
  deleteDocument,
  getDocumentByID,
  getAllDocuments
} from "../../services/firestoreCRUD";
import Table from "../common/Table";
import { FaStar } from "react-icons/fa";
import RightSidebar from "../common/RightSidebar";
import Modal from "../common/Modal";
import SubscriptionForm from "../forms/SubscriptionForm";

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection("subscriptions", (data) => {
      setSubscriptions(data);
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: "Title", accessor: "title", type: "text" },
    { Header: "Description", accessor: "description", type: "text" },
    { Header: "Price", accessor: "price", type: "text" },
    { Header: "Type", accessor: "type", type: "text" },
    { Header: "Updated At", accessor: "updatedAt", type: "text" },
  ];

  const handleUpdate = (subscription, updatedData) => {
    const updatedSubscription = { ...subscription, ...updatedData };
    updateDocument("subscriptions", updatedSubscription.id, updatedSubscription)
      .then(() => console.log("Subscription updated successfully"))
      .catch((error) => console.error("Error updating subscription:", error));
  };

  const handleDelete = (subscription) => {
    deleteDocument("subscriptions", subscription.id)
      .then(() => console.log("Subscription deleted successfully"))
      .catch((error) => console.error("Error deleting subscription:", error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const subscriptionToDelete = subscriptions.find((subscription) => subscription.id === rowId);
      if (subscriptionToDelete) {
        deleteDocument("subscriptions", subscriptionToDelete.id)
          .then(() => console.log(`Subscription ${subscriptionToDelete.id} deleted successfully`))
          .catch((error) => console.error("Error deleting subscription:", error));
      }
    });

    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.filter((subscription) => !selectedRows.has(subscription.id))
    );
    setSelectedRows(new Set());
  };

  const handleViewSubscription = (subscriptionId) => {
    setLoadingSubscription(true);
    getDocumentByID("subscriptions", subscriptionId)
      .then((doc) => {
        setSelectedSubscription(doc);
        setIsSidebarOpen(true); // Open the sidebar after setting the subscription
        setLoadingSubscription(false);
      })
      .catch((error) => {
        console.error("Error fetching subscription:", error);
        setLoadingSubscription(false);
      });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Table
        title="Subscriptions Table"
        icon={<FaStar />} // Change the icon if desired
        columns={columns}
        data={subscriptions}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewSubscription} // This will handle viewing a subscription
        onAdd={() => setIsSidebarOpen(true)}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title={selectedSubscription ? "Edit Subscription" : "Add Subscription"}
      >
        {/* Check if loading, otherwise render the form */}
        {loadingSubscription ? (
          <p>Loading...</p>
        ) : selectedSubscription ? (
          <SubscriptionForm
            subscription={selectedSubscription}
            onSave={handleUpdate}
            onClose={toggleSidebar}
          />
        ) : (
          <SubscriptionForm
            onSave={handleUpdate}
            onClose={toggleSidebar}
          />
        )}
      </RightSidebar>
    </>
  );
};

export default SubscriptionTable;
