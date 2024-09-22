import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { capitalizeWords } from "../../utils/stringUtils";
import { formatDate } from "../../utils/dateUtils";

const JobAbilitiesForm = () => {
  const [jobAbilities, setJobAbilities] = useState([{ name: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchJobAbilities = async () => {
      try {
        const jobAbilitiesSnapshot = await getAllDocuments("jobAbilities");
        const names = jobAbilitiesSnapshot.map(doc => doc.name.toLowerCase());
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching job abilities:", error);
      }
    };

    fetchJobAbilities();
  }, []);

  const handleJobAbilityChange = (index, e) => {
    const newJobAbilities = [...jobAbilities];
    const name = capitalizeWords(e.target.value); // Capitalize words
    newJobAbilities[index][e.target.name] = name;
    newJobAbilities[index].slug = generateSlug(name);
    setJobAbilities(newJobAbilities);
  };

  const addJobAbility = () => {
    setJobAbilities([...jobAbilities, { name: "", slug: "" }]);
  };

  const removeJobAbility = (index) => {
    const newJobAbilities = [...jobAbilities];
    newJobAbilities.splice(index, 1);
    setJobAbilities(newJobAbilities);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const jobAbility of jobAbilities) {
        const { name } = jobAbility;
        if (name.trim() !== "") {
          if (existingNames.includes(name.toLowerCase())) {
            showToast(`Job ability "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp); // Format the date
          const newJobAbility = {
            name: jobAbility.name,
            slug: jobAbility.slug,
            createdAt: formattedTimestamp, // Use formatted date
          };

          await createDocument("jobAbilities", newJobAbility);
          showToast(`Job ability "${name}" added successfully!`);
        }
      }
      setJobAbilities([{ name: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding job abilities to Firestore:", error);
      showToast("Error adding job abilities.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {jobAbilities.map((jobAbility, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Job Ability"
                  value={jobAbility.name}
                  onChange={(e) => handleJobAbilityChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addJobAbility}
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
                  onClick={() => removeJobAbility(index)}
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
        Save Job Abilities
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

export default JobAbilitiesForm;
