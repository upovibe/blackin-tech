import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { capitalizeWords } from "../../utils/stringUtils";
import { formatDate } from "../../utils/dateUtils";

const JobSkillsForm = () => {
  const [jobSkills, setJobSkills] = useState([{ name: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchJobSkills = async () => {
      try {
        const jobSkillsSnapshot = await getAllDocuments("jobSkills");
        const names = jobSkillsSnapshot.map(doc => doc.name.toLowerCase());
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching job skills:", error);
      }
    };

    fetchJobSkills();
  }, []);

  const handleJobSkillChange = (index, e) => {
    const newJobSkills = [...jobSkills];
    const name = capitalizeWords(e.target.value); // Capitalize words
    newJobSkills[index][e.target.name] = name;
    newJobSkills[index].slug = generateSlug(name);
    setJobSkills(newJobSkills);
  };

  const addJobSkill = () => {
    setJobSkills([...jobSkills, { name: "", slug: "" }]);
  };

  const removeJobSkill = (index) => {
    const newJobSkills = [...jobSkills];
    newJobSkills.splice(index, 1);
    setJobSkills(newJobSkills);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const jobSkill of jobSkills) {
        const { name } = jobSkill;
        if (name.trim() !== "") {
          if (existingNames.includes(name.toLowerCase())) {
            showToast(`Job skill "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp); // Format the date
          const newJobSkill = {
            name: jobSkill.name,
            slug: jobSkill.slug,
            createdAt: formattedTimestamp, // Use formatted date
          };

          await createDocument("jobSkills", newJobSkill);
          showToast(`Job skill "${name}" added successfully!`);
        }
      }
      setJobSkills([{ name: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding job skills to Firestore:", error);
      showToast("Error adding job skills.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {jobSkills.map((jobSkill, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Job Skill"
                  value={jobSkill.name}
                  onChange={(e) => handleJobSkillChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addJobSkill}
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
                  onClick={() => removeJobSkill(index)}
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
        Save Job Skills
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

export default JobSkillsForm;
