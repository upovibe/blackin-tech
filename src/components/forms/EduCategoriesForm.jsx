import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { capitalizeWords } from "../../utils/stringUtils";
import { formatDate } from "../../utils/dateUtils";

const EduCategoriesForm = () => {
  const [eduCategories, setEduCategories] = useState([{ name: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingNames, setExistingNames] = useState([]);

  useEffect(() => {
    const fetchEduCategories = async () => {
      try {
        const eduCategoriesSnapshot = await getAllDocuments("eduCategories");
        const names = eduCategoriesSnapshot.map(doc => doc.name.toLowerCase());
        setExistingNames(names);
      } catch (error) {
        console.error("Error fetching educational categories:", error);
      }
    };

    fetchEduCategories();
  }, []);

  const handleEduCategoryChange = (index, e) => {
    const newEduCategories = [...eduCategories];
    const name = capitalizeWords(e.target.value);
    newEduCategories[index][e.target.name] = name;
    newEduCategories[index].slug = generateSlug(name);
    setEduCategories(newEduCategories);
  };

  const addEduCategory = () => {
    setEduCategories([...eduCategories, { name: "", slug: "" }]);
  };

  const removeEduCategory = (index) => {
    const newEduCategories = [...eduCategories];
    newEduCategories.splice(index, 1);
    setEduCategories(newEduCategories);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const eduCategory of eduCategories) {
        const { name } = eduCategory;
        if (name.trim() !== "") {
          if (existingNames.includes(name.toLowerCase())) {
            showToast(`Educational category "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp);
          const newEduCategory = {
            name: eduCategory.name,
            slug: eduCategory.slug,
            createdAt: formattedTimestamp,
          };

          await createDocument("eduCategories", newEduCategory);
          showToast(`Educational category "${name}" added successfully!`);
        }
      }
      setEduCategories([{ name: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding educational categories to Firestore:", error);
      showToast("Error adding educational categories.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {eduCategories.map((eduCategory, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="name"
                  placeholder="Educational Category"
                  value={eduCategory.name}
                  onChange={(e) => handleEduCategoryChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addEduCategory}
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
                  onClick={() => removeEduCategory(index)}
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
        Save Educational Categories
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

export default EduCategoriesForm;