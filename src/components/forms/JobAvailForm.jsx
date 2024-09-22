import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { capitalizeWords } from "../../utils/stringUtils"; // Import capitalizeWords
import { formatDate } from "../../utils/dateUtils"; // Import formatDate

const JobAvailForm = () => {
  const [jobAvailabilities, setJobAvailabilities] = useState([{ name: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchJobAvailabilities = async () => {
      try {
        const jobAvailabilitiesSnapshot = await getAllDocuments("jobAvailabilities");
        const names = jobAvailabilitiesSnapshot.map(doc => doc.name.toLowerCase());
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching job availabilities:", error);
      }
    };

    fetchJobAvailabilities();
  }, []);

  const handleJobAvailabilityChange = (index, e) => {
    const newJobAvailabilities = [...jobAvailabilities];
    const name = capitalizeWords(e.target.value); // Capitalize words
    newJobAvailabilities[index][e.target.name] = name;
    newJobAvailabilities[index].slug = generateSlug(name);
    setJobAvailabilities(newJobAvailabilities);
  };

  const addJobAvailability = () => {
    setJobAvailabilities([...jobAvailabilities, { name: "", slug: "" }]);
  };

  const removeJobAvailability = (index) => {
    const newJobAvailabilities = [...jobAvailabilities];
    newJobAvailabilities.splice(index, 1);
    setJobAvailabilities(newJobAvailabilities);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const jobAvailability of jobAvailabilities) {
        const { name } = jobAvailability;
        if (name.trim() !== "") {
          if (existingNames.includes(name.toLowerCase())) {
            showToast(`Job availability "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp); // Format the date
          const newJobAvailability = {
            name: jobAvailability.name,
            slug: jobAvailability.slug,
            createdAt: formattedTimestamp, // Use formatted date
          };

          await createDocument("jobAvailabilities", newJobAvailability);
          showToast(`Job availability "${name}" added successfully!`);
        }
      }
      setJobAvailabilities([{ name: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding job availabilities to Firestore:", error);
      showToast("Error adding job availabilities.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {jobAvailabilities.map((jobAvailability, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Job Availability"
                  value={jobAvailability.name}
                  onChange={(e) => handleJobAvailabilityChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addJobAvailability}
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
                  onClick={() => removeJobAvailability(index)}
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
        Save Job Availabilities
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

export default JobAvailForm;
