import React, { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { FaPlus, FaMinus } from "react-icons/fa";
import { createDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Toast from "../common/Toast";
import generateSlug from "../../utils/slugUtil";
import { formatDate } from "../../utils/dateUtils";
import AvatarUpload from "../common/AvatarUpload";

const BadgeForm = () => {
  const [badges, setBadges] = useState([{ name: "", description: "", icon: "", slug: "" }]);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [existingBadges, setExistingBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const badgesSnapshot = await getAllDocuments("badges");
        const names = badgesSnapshot.map(doc => doc.name.toLowerCase());
        setExistingBadges(names);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchBadges();
  }, []);

  const handleBadgeChange = (index, e) => {
    const newBadges = [...badges];
    const name = e.target.name === "name" ? e.target.value : badges[index].name;
    newBadges[index][e.target.name] = e.target.value;
    newBadges[index].slug = generateSlug(name);
    setBadges(newBadges);
  };

  const handleIconUpload = (index, iconUrl) => {
    const newBadges = [...badges];
    newBadges[index].icon = iconUrl;
    setBadges(newBadges);
  };

  const addBadge = () => {
    setBadges([...badges, { name: "", description: "", icon: "", slug: "" }]);
  };

  const removeBadge = (index) => {
    const newBadges = [...badges];
    newBadges.splice(index, 1);
    setBadges(newBadges);
  };

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const badge of badges) {
        const { name, icon } = badge;
        if (name.trim() !== "" && icon.trim() !== "") {
          if (existingBadges.includes(name.toLowerCase())) {
            showToast(`Badge "${name}" already exists.`, "error");
            continue;
          }

          const timestamp = new Date();
          const formattedTimestamp = formatDate(timestamp);
          const newBadge = {
            name: badge.name,
            slug: badge.slug,
            description: badge.description,
            icon: badge.icon,
            createdAt: formattedTimestamp,
          };

          await createDocument("badges", newBadge);
          showToast(`Badge "${name}" added successfully!`);
        }
      }
      setBadges([{ name: "", description: "", icon: "", slug: "" }]);
    } catch (error) {
      console.error("Error adding badges to Firestore:", error);
      showToast("Error adding badges.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-5">
        {badges.map((badge, index) => (
          <div key={index} className="flex flex-col gap-3 mb-5">
            <div className="flex flex-col">
                <AvatarUpload onUpload={(iconUrl) => handleIconUpload(index, iconUrl)} />
              <Input
                name="name"
                placeholder="Badge Name"
                value={badge.name}
                onChange={(e) => handleBadgeChange(index, e)}
              />
              <Input
                name="description"
                placeholder="Badge Description"
                value={badge.description}
                onChange={(e) => handleBadgeChange(index, e)}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                type="button"
                onClick={addBadge}
                className="bg-blue-500 text-white"
              >
                <FaPlus /> Add Badge
              </Button>
              {index > 0 && (
                <Button
                  type="button"
                  onClick={() => removeBadge(index)}
                  className="bg-red-500 text-white"
                >
                  <FaMinus /> Remove Badge
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button type="submit" className="bg-green-500 text-white">
        Save Badges
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

export default BadgeForm;
