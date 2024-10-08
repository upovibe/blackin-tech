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
  const [pronouns, setPronouns] = useState([{ name: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchPronouns = async () => {
      try {
        const pronounsSnapshot = await getAllDocuments("pronouns");
        const names = pronounsSnapshot.map(doc => doc.name.toLowerCase());
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching pronouns:", error);
      }
    };

    fetchPronouns();
  }, []);

  const handlePronounChange = (index, e) => {
    const newPronouns = [...pronouns];
    const name = capitalizeWords(e.target.value); // Capitalize words
    newPronouns[index][e.target.name] = name;
    newPronouns[index].slug = generateSlug(name);
    setPronouns(newPronouns);
  };

  const addPronoun = () => {
    setPronouns([...pronouns, { name: "", slug: "" }]);
  };

  const removePronoun = (index) => {
    const newPronouns = [...pronouns];
    newPronouns.splice(index, 1);
    setPronouns(newPronouns);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const pronoun of pronouns) {
        const { name } = pronoun;
        if (name.trim() !== "") {
          if (existingNames.includes(name.toLowerCase())) {
            showToast(`Pronoun "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp); // Format the date
          const newPronoun = {
            name: pronoun.name,
            slug: pronoun.slug,
            createdAt: formattedTimestamp, // Use formatted date
          };

          await createDocument("pronouns", newPronoun);
          showToast(`Pronoun "${name}" added successfully!`);
        }
      }
      setPronouns([{ name: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding pronouns to Firestore:", error);
      showToast("Error adding pronouns.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {pronouns.map((pronoun, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Pronoun"
                  value={pronoun.name}
                  onChange={(e) => handlePronounChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addPronoun}
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
                  onClick={() => removePronoun(index)}
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
        Save Pronouns
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
