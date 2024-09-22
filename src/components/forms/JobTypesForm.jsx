import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { capitalizeWords } from "../../utils/stringUtils"; // Import capitalizeWords
import { formatDate } from "../../utils/dateUtils"; // Import formatDate

const JobTypesForm = () => {
  const [jobTypes, setJobTypes] = useState([{ name: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const jobTypesSnapshot = await getAllDocuments("jobTypes");
        const names = jobTypesSnapshot.map(doc => doc.name.toLowerCase());
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching job types:", error);
      }
    };

    fetchJobTypes();
  }, []);

  const handleJobTypeChange = (index, e) => {
    const newJobTypes = [...jobTypes];
    const name = capitalizeWords(e.target.value); // Capitalize words
    newJobTypes[index][e.target.name] = name;
    newJobTypes[index].slug = generateSlug(name); 
    setJobTypes(newJobTypes);
  };

  const addJobType = () => {
    setJobTypes([...jobTypes, { name: "", slug: "" }]);
  };

  const removeJobType = (index) => {
    const newJobTypes = [...jobTypes];
    newJobTypes.splice(index, 1);
    setJobTypes(newJobTypes);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const jobType of jobTypes) {
        const { name } = jobType;
        if (name.trim() !== "") {
          if (existingNames.includes(name.toLowerCase())) {
            showToast(`Job type "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp); // Format the date
          const newJobType = {
            name: jobType.name,
            slug: jobType.slug,
            createdAt: formattedTimestamp, // Use formatted date
          };

          await createDocument("jobTypes", newJobType);
          showToast(`Job type "${name}" added successfully!`);
        }
      }
      setJobTypes([{ name: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding job types to Firestore:", error);
      showToast("Error adding job types.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {jobTypes.map((jobType, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Job Type"
                  value={jobType.name}
                  onChange={(e) => handleJobTypeChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addJobType}
                  className="bg-blue-500 text-white size-10"
                >
                  <FaPlus />
                </Button>
              </div>
            </div>
            {index > 0 && (
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={() => removeJobType(index)}
                  className="bg-red-500 text-white ml-auto size-10"
                >
                  <FaMinus />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button type="submit" className="bg-green-500 text-white">
        Save Job Types
      </Button>

      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </form>
  );
};

export default JobTypesForm;
