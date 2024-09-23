import React, { useState, useEffect } from "react";
import { UserAuth } from '../../contexts/AuthContext';
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { capitalizeWords } from "../../utils/stringUtils";
import { formatDate } from "../../utils/dateUtils";

const SubTypesForm = () => {
  const { user } = UserAuth();
  const [subTypes, setSubTypes] = useState([{ type: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingTypes, setExistingTypes] = useState([]);

  useEffect(() => {
    const fetchSubTypes = async () => {
      try {
        const subTypesSnapshot = await getAllDocuments("subTypes");
        const types = subTypesSnapshot.map(doc => doc.type.toLowerCase());
        setExistingTypes(types);
      } catch (error) {
        console.error("Error fetching subtypes:", error);
      }
    };

    fetchSubTypes();
  }, []);

  const handleSubTypeChange = (index, e) => {
    const newSubTypes = [...subTypes];
    const type = capitalizeWords(e.target.value); // Capitalize words
    newSubTypes[index][e.target.name] = type;
    newSubTypes[index].slug = generateSlug(type); // Generate slug
    setSubTypes(newSubTypes);
  };

  const addSubType = () => {
    setSubTypes([...subTypes, { type: "", slug: "" }]);
  };

  const removeSubType = (index) => {
    const newSubTypes = [...subTypes];
    newSubTypes.splice(index, 1);
    setSubTypes(newSubTypes);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const subType of subTypes) {
        const { type } = subType;
        if (type.trim() !== "") {
          if (existingTypes.includes(type.toLowerCase())) {
            showToast(`SubType "${type}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedCreatedAt = formatDate(timestamp); // Format the date
          const formattedUpdatedAt = formatDate(timestamp);

          const newSubType = {
            type: subType.type,
            slug: subType.slug,
            createdBy: {
              id: user.uid,
              avatarUrl: user.avatarUrl,
              fullName: user.fullName,
              email: user.email,
            },
            createdAt: formattedCreatedAt, // Use formatted date
            updatedAt: formattedUpdatedAt,
          };

          await createDocument("subTypes", newSubType);
          showToast(`SubType "${type}" added successfully!`);
        }
      }
      setSubTypes([{ type: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding subtypes to Firestore:", error);
      showToast("Error adding subtypes.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {subTypes.map((subType, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <Input
                  name="type"
                  placeholder="SubType"
                  value={subType.type}
                  onChange={(e) => handleSubTypeChange(index, e)}
                />
              </div>
              <div className="size-fit">
                <Button
                  type="button"
                  onClick={addSubType}
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
                  onClick={() => removeSubType(index)}
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
        Save SubTypes
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

export default SubTypesForm;
