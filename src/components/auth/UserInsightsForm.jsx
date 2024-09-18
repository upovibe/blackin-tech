import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import TagInput from "../common/TagInput";
import SelectInput from "../common/SelectInput";
import Button from "../common/Button";
import DocsUpload from "../common/DocsUpload";
import SlidingCheckbox from "../common/SlidingCheckbox";
import Lottie from "lottie-react";
import successAnimation from "../../assets/animations/Animation - JobPosted.json";
import formLoading from "../../assets/animations/Animation - FormLoading.json";
import Toast from "../common/Toast";
import {
  fetchSkills,
  fetchAbilities,
  fetchAvailabilityStatuses,
  fetchEducationalCategories,
} from "../../api/usersInsight";
import {
  updateDocument, 
  getDocumentByID,
} from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";

const UserInsightsForm = () => {
  const { user } = UserAuth();
  const userID = user?.uid;
  const [showDocsUpload, setShowDocsUpload] = useState(false);

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

  const [skillsOptions, setSkillsOptions] = useState([]);
  const [abilitiesOptions, setAbilitiesOptions] = useState([]);
  const [availabilityOptions, setAvailabilityOptions] = useState([]);
  const [educationalCategories, setEducationalCategories] = useState([]);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const skills = await fetchSkills();
        const abilities = await fetchAbilities();
        const availability = await fetchAvailabilityStatuses();
        const educationalCategories = await fetchEducationalCategories();

        setSkillsOptions(skills.map((s) => ({ label: s, value: s })));
        setAbilitiesOptions(abilities.map((a) => ({ label: a, value: a })));
        setAvailabilityOptions(
          availability.map((a) => ({ label: a, value: a }))
        );
        setEducationalCategories(
          educationalCategories.map((e) => ({ label: e, value: e }))
        );
      } catch (error) {
        console.error("Failed to load options:", error);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (name, tags) => {
    setFormValues((prev) => ({ ...prev, [name]: tags }));
  };

  const handleWorkHistoryChange = (index, e) => {
    const { name, value } = e.target;
    const newWorkHistory = [...formValues.workHistory];
    newWorkHistory[index][name] = value;
    setFormValues((prev) => ({ ...prev, workHistory: newWorkHistory }));
  };

  const addWorkHistory = () => {
    setFormValues((prev) => ({
      ...prev,
      workHistory: [
        ...prev.workHistory,
        {
          companyName: "",
          jobTitle: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const removeWorkHistory = (index) => {
    const newWorkHistory = formValues.workHistory.filter((_, i) => i !== index);
    setFormValues((prev) => ({ ...prev, workHistory: newWorkHistory }));
  };

  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;
    const newCertifications = [...formValues.certifications];
    newCertifications[index][name] = value;
    setFormValues((prev) => ({ ...prev, certifications: newCertifications }));
  };

  const addCertification = () => {
    setFormValues((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { certName: "", issuingOrg: "", dateObtained: "" },
      ],
    }));
  };

  const removeCertification = (index) => {
    const newCertifications = formValues.certifications.filter(
      (_, i) => i !== index
    );
    setFormValues((prev) => ({ ...prev, certifications: newCertifications }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducation = [...formValues.education];
    newEducation[index][name] = value;
    setFormValues((prev) => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setFormValues((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { category: "", institution: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeEducation = (index) => {
    const newEducation = formValues.education.filter((_, i) => i !== index);
    setFormValues((prev) => ({ ...prev, education: newEducation }));
  };

  const handleResumeUpload = (urls) => {
    setFormValues((prev) => ({ ...prev, resumeURL: urls[0] }));
  };

  const handleCVUpload = (file) => {
    setFormValues((prev) => ({ ...prev, cvFile: file }));
  };

  // Handle form submit
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
  

  return (
    <>
      {/* Lottie Loading Animation */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Lottie
            animationData={formLoading}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
        </div>
      ) : (
        <>
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold">
                  Professional Information
                </h3>
                <Input
                  name="professionalTitle"
                  placeholder="Professional Title"
                  value={formValues.professionalTitle}
                  onChange={handleChange}
                  className="mb-2"
                />
                <TextArea
                  name="summary"
                  placeholder="Summary/Objective"
                  value={formValues.summary}
                  onChange={handleChange}
                  className="mb-2"
                />
              </div>

              {/* Skills and Expertise */}
              <div>
                <h3 className="text-lg font-semibold">Skills and Expertise</h3>
                <TagInput
                  options={skillsOptions.map((o) => o.label)}
                  placeholder="Select skills"
                  value={formValues.skills} // Make sure this is correctly set
                  onChange={(tags) => handleTagChange("skills", tags)}
                  maxTags={5}
                  className="mb-2"
                />

                <TagInput
                  options={abilitiesOptions.map((o) => o.label)}
                  placeholder="Select abilities"
                  value={formValues.abilities}
                  onChange={(tags) => handleTagChange("abilities", tags)}
                  maxTags={5}
                  className="mb-2"
                />
              </div>

              {/* Work History */}
              <div>
                <h3 className="text-lg font-semibold">Work History</h3>
                {formValues.workHistory.map((work, index) => (
                  <div key={index} className="space-y-2 mb-2">
                    <Input
                      name="companyName"
                      placeholder="Company Name"
                      value={work.companyName}
                      onChange={(e) => handleWorkHistoryChange(index, e)}
                    />
                    <Input
                      name="jobTitle"
                      placeholder="Job Title"
                      value={work.jobTitle}
                      onChange={(e) => handleWorkHistoryChange(index, e)}
                    />
                    <Input
                      name="startDate"
                      placeholder="Start Date"
                      type="date"
                      value={work.startDate}
                      onChange={(e) => handleWorkHistoryChange(index, e)}
                    />
                    <Input
                      name="endDate"
                      placeholder="End Date"
                      type="date"
                      value={work.endDate}
                      onChange={(e) => handleWorkHistoryChange(index, e)}
                    />
                    <TextArea
                      name="description"
                      placeholder="Description"
                      value={work.description}
                      onChange={(e) => handleWorkHistoryChange(index, e)}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => removeWorkHistory(index)}
                        className="bg-red-500 text-white"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addWorkHistory}
                  className="bg-blue-500 text-white"
                >
                  Add Work History
                </Button>
              </div>

              {/* Educational Qualifications */}
              <div>
                <h3 className="text-lg font-semibold">
                  Educational Qualifications
                </h3>
                {formValues.education.map((edu, index) => (
                  <div key={index} className="space-y-2 mb-2">
                    <SelectInput
                      name="category"
                      placeholder="Select Category"
                      value={edu.category}
                      onChange={(e) => handleEducationChange(index, e)}
                      options={educationalCategories}
                    />
                    <Input
                      name="institution"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                    />
                    <Input
                      name="startDate"
                      placeholder="Start Date"
                      type="date"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, e)}
                    />
                    <Input
                      name="endDate"
                      placeholder="End Date"
                      type="date"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, e)}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="bg-red-500 text-white"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addEducation}
                  className="bg-blue-500 text-white"
                >
                  Add Education
                </Button>
              </div>

              {/* Certifications */}
              <div>
                <h3 className="text-lg font-semibold">Certifications</h3>
                {formValues.certifications.map((cert, index) => (
                  <div key={index} className="space-y-2 mb-2">
                    <Input
                      name="certName"
                      placeholder="Certification Name"
                      value={cert.certName}
                      onChange={(e) => handleCertificationChange(index, e)}
                    />
                    <Input
                      name="issuingOrg"
                      placeholder="Issuing Organization"
                      value={cert.issuingOrg}
                      onChange={(e) => handleCertificationChange(index, e)}
                    />
                    <Input
                      name="dateObtained"
                      placeholder="Date Obtained"
                      type="date"
                      value={cert.dateObtained}
                      onChange={(e) => handleCertificationChange(index, e)}
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="bg-red-500 text-white"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addCertification}
                  className="bg-blue-500 text-white"
                >
                  Add Certification
                </Button>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-semibold">
                  Additional Information
                </h3>
                <Input
                  name="resumeURL"
                  placeholder="Resume/Portfolio URL"
                  value={formValues.resumeURL}
                  onChange={handleChange}
                  className="mb-2"
                />
                {/* Availability */}
                <SelectInput
                  name="availability"
                  placeholder="Current Status"
                  value={formValues.availability}
                  onChange={(e) =>
                    setFormValues((prev) => ({
                      ...prev,
                      availability: e.target.value,
                    }))
                  }
                  options={availabilityOptions}
                  className="mb-2"
                />
                {/* Sliding Checkbox for CV Upload */}
                <div className="flex items-center my-4">
                  <SlidingCheckbox
                    id="media-toggle"
                    name="showDocsUpload"
                    checked={showDocsUpload}
                    onChange={() => setShowDocsUpload(!showDocsUpload)}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Upload credential files (Optional)
                  </span>
                </div>
                {showDocsUpload && (
                  <>
                    <DocsUpload setMedia={handleCVUpload} />
                    {formValues.cvFile && (
                      <p className="text-gray-500">
                        CV/Portfolio/Resume: {formValues.cvFile.name}
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="bg-green-500 text-white"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          ) : (
            <div className="flex justify-center items-center">
              <Lottie animationData={successAnimation} loop={false} />
            </div>
          )}

          {/* Toast Notification */}
          <Toast
            type={toast.type}
            message={toast.message}
            visible={toast.visible}
            onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
          />
        </>
      )}
    </>
  );
};

export default UserInsightsForm;
