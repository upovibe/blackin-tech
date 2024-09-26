import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import TextArea from "../common/TextArea";
import TagInput from "../common/TagInput";
import SelectInput from "../common/SelectInput";
import Button from "../common/Button";
import DocsUpload from "../common/DocsUpload";
import SlidingCheckbox from "../common/SlidingCheckBox";
import Lottie from "lottie-react";
import successAnimation from "../../assets/animations/Animation - JobPosted.json";
import formLoading from "../../assets/animations/Animation - FormLoading.json";
import Toast from "../common/Toast";
import HorizontalLineWithText from "../common/HorizontalLineWithText";
import Divider from "../common/Divider";
import { updateDocument, getDocumentByID, getAllDocuments } from "../../services/firestoreCRUD";
import { UserAuth } from "../../contexts/AuthContext";
import { FaMinus, FaPlus } from "react-icons/fa6";

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
        // Fetch skills from Firestore
        const skillsData = await getAllDocuments("jobSkills");
        const formattedSkills = skillsData.map((skill) => ({
          label: skill.name,
          value: skill.slug,
        }));
        setSkillsOptions(formattedSkills);
  
        // Fetch abilities from Firestore
        const abilitiesData = await getAllDocuments("jobAbilities");
        const formattedAbilities = abilitiesData.map((ability) => ({
          label: ability.name,
          value: ability.slug,
        }));
        setAbilitiesOptions(formattedAbilities);
  
        // Fetch availability statuses from Firestore
        const availabilityData = await getAllDocuments("jobAvailabilities");
        const formattedAvailability = availabilityData.map((availability) => ({
          label: availability.name,
          value: availability.slug,
        }));
        setAvailabilityOptions(formattedAvailability);
  
        // Fetch educational categories from the existing API
        const educationalCategoriesData = await getAllDocuments("eduCategories");
        const formattedEducationalCategories = educationalCategoriesData.map((category) => ({
          label: category.name,
          value: category.slug,
        }));
        setEducationalCategories(formattedEducationalCategories);
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
    if (
      !professionalTitle ||
      !summary ||
      skills.length === 0 ||
      abilities.length === 0
    ) {
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
            <form onSubmit={handleSubmit} className="">
              {/* Professional Information */}
              <HorizontalLineWithText>
                <span className="text-sm font-semibold">
                  {" "}
                  Professional Information{" "}
                </span>
              </HorizontalLineWithText>
              <div className="flex flex-col items-center justify-between gap-3 my-5 mb-14">
                <div className="w-full">
                  <Input
                    name="professionalTitle"
                    placeholder="Professional Title"
                    value={formValues.professionalTitle}
                    onChange={handleChange}
                    className=""
                  />
                </div>
                <div className="w-full">
                  <TextArea
                    name="summary"
                    placeholder="Summary/Objective"
                    value={formValues.summary}
                    onChange={handleChange}
                    className=""
                  />
                </div>
              </div>

              {/* Skills and Expertise */}
              <HorizontalLineWithText>
                <span className="text-sm font-semibold my-8">
                  Skills and Expertise
                </span>
              </HorizontalLineWithText>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3 my-5 mb-14">
                <div className="w-full lg:w-1/2">
                  <TagInput
                    options={skillsOptions.map((o) => o.label)}
                    placeholder="Select skills"
                    value={formValues.skills} // Make sure this is correctly set
                    onChange={(tags) => handleTagChange("skills", tags)}
                    maxTags={5}
                    className="mb-2"
                  />
                </div>
                <div className="w-full lg:w-1/2">
                  <TagInput
                    options={abilitiesOptions.map((o) => o.label)}
                    placeholder="Select abilities"
                    value={formValues.abilities}
                    onChange={(tags) => handleTagChange("abilities", tags)}
                    maxTags={5}
                    className="mb-2"
                  />
                </div>
              </div>

              {/* Work History */}
              <HorizontalLineWithText>
                <span className="text-sm font-semibold">Work History</span>
              </HorizontalLineWithText>
              <div className="my-5 mb-14">
                {formValues.workHistory.map((work, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-between gap-3 w-full"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
                      <div className="w-full">
                        <Input
                          name="companyName"
                          placeholder="Company Name"
                          value={work.companyName}
                          onChange={(e) => handleWorkHistoryChange(index, e)}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          name="jobTitle"
                          placeholder="Job Title"
                          value={work.jobTitle}
                          onChange={(e) => handleWorkHistoryChange(index, e)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
                      <div className="w-full">
                        <Input
                          name="startDate"
                          placeholder="Start Date"
                          type="date"
                          value={work.startDate}
                          onChange={(e) => handleWorkHistoryChange(index, e)}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          name="endDate"
                          placeholder="End Date"
                          type="date"
                          value={work.endDate}
                          onChange={(e) => handleWorkHistoryChange(index, e)}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <TextArea
                        name="description"
                        placeholder="Description"
                        value={work.description}
                        onChange={(e) => handleWorkHistoryChange(index, e)}
                      />
                    </div>
                    {index > 0 && (
                      <div className="size-full flex items-end justify-end">
                        <Button
                          type="button"
                          onClick={() => removeWorkHistory(index)}
                          className="bg-red-500 text-white size-10"
                        >
                          <FaMinus />
                        </Button>
                      </div>
                    )}
                    
                  <Divider className="bg-black/5 mb-3"/>
                  </div>
                ))}
                <div className="size-full flex items-end justify-end">
                  <Button
                    type="button"
                    onClick={addWorkHistory}
                    className="bg-blue-500 text-white my-3 size-10"
                  >
                    <FaPlus />
                  </Button>
                </div>
              </div>

              {/* Educational Qualifications */}
              <HorizontalLineWithText>
                <span className="text-sm font-semibold">Qualifications</span>
              </HorizontalLineWithText>
              <div className="my-5 mb-14">
                {formValues.education.map((edu, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                      <div className="w-full">
                        <SelectInput
                          name="category"
                          placeholder="Select Category"
                          value={edu.category}
                          onChange={(e) => handleEducationChange(index, e)}
                          options={educationalCategories}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          name="startDate"
                          placeholder="Start Date"
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => handleEducationChange(index, e)}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          name="endDate"
                          placeholder="End Date"
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => handleEducationChange(index, e)}
                        />
                      </div>
                      <div className="size-fit ml-auto">
                        <Button
                          type="button"
                          onClick={addEducation}
                          className="bg-blue-500 text-white size-10"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="size-fit my-5">
                        <Button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="bg-red-500 text-white ml-auto size-10"
                        >
                          <FaMinus />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <HorizontalLineWithText>
                <span className="text-sm font-semibold">Certifications</span>
              </HorizontalLineWithText>
              <div className="my-5 mb-14">
                {formValues.certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                      <div className="w-full">
                        <Input
                          name="certName"
                          placeholder="Certification Name"
                          value={cert.certName}
                          onChange={(e) => handleCertificationChange(index, e)}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          name="issuingOrg"
                          placeholder="Issuing Organization"
                          value={cert.issuingOrg}
                          onChange={(e) => handleCertificationChange(index, e)}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          name="dateObtained"
                          placeholder="Date Obtained"
                          type="date"
                          value={cert.dateObtained}
                          onChange={(e) => handleCertificationChange(index, e)}
                        />
                      </div>
                      <div className="size-fit ml-auto">
                        <Button
                          type="button"
                          onClick={addCertification}
                          className="bg-blue-500 text-white size-10"
                        >
                          <FaPlus />
                        </Button>
                      </div>
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="bg-red-500 text-white size-10"
                      >
                        <FaMinus />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Information */}
              <HorizontalLineWithText>
                <span className="text-sm font-semibold">
                  Additional Information
                </span>
              </HorizontalLineWithText>
              <div className="my-5">
                <div className=" flex flex-col md:flex-row items-center gap-3 mb-14">
                  <div className="w-full">
                    <Input
                      name="resumeURL"
                      placeholder="Resume/Portfolio URL"
                      value={formValues.resumeURL}
                      onChange={handleChange}
                      className="mb-2"
                    />
                  </div>
                  <div className="w-full">
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
                  </div>
                </div>
                {/* Sliding Checkbox for CV Upload */}
                <HorizontalLineWithText>
                  <span className="text-sm font-semibold">
                    Slide the Checkbox for CV Upload
                  </span>
                </HorizontalLineWithText>
                <div className="flex flex-col items-start justify-start gap-3 my-5 mb-14 ">
                  <div className="flex items-center gap-3">
                    <SlidingCheckbox
                      id="media-toggle"
                      name="showDocsUpload"
                      checked={showDocsUpload}
                      onChange={() => setShowDocsUpload(!showDocsUpload)}
                    />
                    <span className="text-sm font-medium text-gray-700">
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
              </div>

              {/* Submit Button */}
              <div className="w-full flex items-end justify-end">
                <Button
                  type="submit"
                  className="bg-green-500 text-white"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
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
