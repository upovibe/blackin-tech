import React, { useState, useEffect } from 'react';
import { UserAuth } from "../../contexts/AuthContext";
import { getDocumentByID } from '../../services/firestoreCRUD'; 

const ProfileProgress = () => {
  const { user } = UserAuth();
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const fetchProfileCompletion = async () => {
      if (!user) return;

      // Fetch user profile from Firestore
      const userProfile = await getDocumentByID('users', user.uid);

      if (userProfile) {
        const percentage = calculateCompletion(userProfile);
        setCompletion(percentage);
      } else {
        console.log("User profile data is missing.");
      }
    };

    fetchProfileCompletion();
  }, [user]);

  const calculateCompletion = (profileData = {}) => {
    // Initial Profile Setup
    const initialProfileFields = [
      profileData?.avatarUrl,
      profileData?.bio,
      profileData?.city,
      profileData?.country,
      profileData?.email,
      profileData?.fullName,
      profileData?.profileCompleted,
      profileData?.pronouns
    ];
  
    // Professional Information
    const professionalInfoFields = [
      profileData?.professionalTitle,
      profileData?.summary
    ];
  
    // Skills and Expertise
    const skillsAndExpertiseFields = [
      profileData?.skills?.length > 0,
      profileData?.abilities?.length > 0
    ];
  
    // Work History
    const workHistoryFields = profileData?.workHistory?.length > 0 
      ? profileData.workHistory.every(entry =>
          entry.companyName &&
          entry.jobTitle &&
          entry.startDate &&
          entry.endDate &&
          entry.description
        )
      : false;
  
    // Educational Qualifications
    const educationFields = profileData?.education?.length > 0 
      ? profileData.education.every(entry =>
          entry.category &&
          entry.institution &&
          entry.startDate &&
          entry.endDate
        )
      : false;
  
    // Certifications
    const certificationsFields = profileData?.certifications?.length > 0 
      ? profileData.certifications.every(entry =>
          entry.certName &&
          entry.issuingOrg &&
          entry.dateObtained
        )
      : false;
  
    // Additional Information
    const additionalInfoFields = [
      profileData?.availability,
      profileData?.resumeURL || profileData?.cvFile
    ];
  
    // Calculate percentages
    const initialProfilePercentage = initialProfileFields.every(Boolean) ? 25 : 0;
    const professionalInfoPercentage = professionalInfoFields.every(Boolean) ? 15 : 0;
    const skillsAndExpertisePercentage = skillsAndExpertiseFields.every(Boolean) ? 10 : 0;
    const workHistoryPercentage = workHistoryFields ? 15 : 0;
    const educationPercentage = educationFields ? 10 : 0;
    const certificationsPercentage = certificationsFields ? 10 : 0;
    const additionalInfoPercentage = additionalInfoFields.every(Boolean) ? 15 : 0;
  
    // Calculate total completion
    const totalCompletion = initialProfilePercentage +
      professionalInfoPercentage +
      skillsAndExpertisePercentage +
      workHistoryPercentage +
      educationPercentage +
      certificationsPercentage +
      additionalInfoPercentage;
  
    return totalCompletion;
  };
  
  

  return (
    <div>
      {completion === 0 ? (
        <p>No progress data available yet. Please complete your profile.</p>
      ) : (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${completion}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-700">
            {completion}% completed
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileProgress;
