import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { capitalizeWords } from "../../utils/stringUtils";
import { formatDate } from "../../utils/dateUtils";

const PronounsForm = () => {
  const [jobPronouns, setJobPronouns] = useState([{ name: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchJobPronouns = async () => {
      try {
        const jobPronounsSnapshot = await getAllDocuments("jobPronouns");
        const names = jobPronounsSnapshot.map(doc => doc.name.toLowerCase());
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching job pronouns:", error);
      }
    };

    fetchJobPronouns();
  }, []);

  const handleJobPronounChange = (index, e) => {
    const newJobPronouns = [...jobPronouns];
    const name = capitalizeWords(e.target.value); // Capitalize words
    newJobPronouns[index][e.target.name] = name;
    newJobPronouns[index].slug = generateSlug(name);
    setJobPronouns(newJobPronouns);
  };

  const addJobPronoun = () => {
    setJobPronouns([...jobPronouns, { name: "", slug: "" }]);
  };

  const removeJobPronoun = (index) => {
    const newJobPronouns = [...jobPronouns];
    newJobPronouns.splice(index, 1);
    setJobPronouns(newJobPronouns);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const jobPronoun of jobPronouns) {
        const { name } = jobPronoun;
        if (name.trim() !== "") {
          if (existingNames.includes(name.toLowerCase())) {
            showToast(`Job pronoun "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp); // Format the date
          const newJobPronoun = {
            name: jobPronoun.name,
            slug: jobPronoun.slug,
            createdAt: formattedTimestamp, // Use formatted date
          };

          await createDocument("jobPronouns", newJobPronoun);
          showToast(`Job pronoun "${name}" added successfully!`);
        }
      }
      setJobPronouns([{ name: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding job pronouns to Firestore:", error);
      showToast("Error adding job pronouns.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {jobPronouns.map((jobPronoun, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Job Pronoun"
                  value={jobPronoun.name}
                  onChange={(e) => handleJobPronounChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addJobPronoun}
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
                  onClick={() => removeJobPronoun(index)}
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
        Save Job Pronouns
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

export default PronounsForm;
