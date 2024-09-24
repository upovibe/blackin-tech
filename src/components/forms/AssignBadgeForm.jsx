import React, { useState, useEffect } from "react";
import { updateDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import TagInput from "../../components/common/TagInput";
import SelectInput from "../../components/common/SelectInput";

const AssignBadgeForm = () => {
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchUsersAndBadges = async () => {
      try {
        const usersData = await getAllDocuments("users");
        setUsers(usersData); // Set full user objects for later reference

        const badgesData = await getAllDocuments("badges");
        setBadges(badgesData); // Store badge objects with full structure
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsersAndBadges();
  }, []);

  const handleAssignBadge = async (e) => {
    e.preventDefault();

    // Debugging - Check selected users and badge
    console.log("Selected Users:", selectedUsers);
    console.log("Selected Badge:", selectedBadge);

    if (selectedUsers.length === 0 || !selectedBadge) {
      setToast({
        visible: true,
        message: "Please select at least one user and a badge.",
        type: "error",
      });
      return;
    }

    try {
      const currentDate = new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      // Format badge data to match the desired structure
      const badgeData = {
        id: selectedBadge.id,
        name: selectedBadge.name,
        slug: selectedBadge.slug,
        description: selectedBadge.description,
        icon: selectedBadge.icon,
        createdAt: currentDate,
      };

      // Filter out the selected user objects
      const selectedUserDocs = users.filter((user) =>
        selectedUsers.includes(`${user.fullName} (${user.email})`)
      );

      // Debugging - Check the filtered user objects
      console.log("Selected User Docs:", selectedUserDocs);

      // Assign the selected badge to all selected users
      await Promise.all(
        selectedUserDocs.map((user) =>
          updateDocument("users", user.id, { badge: badgeData })
        )
      );

      setToast({
        visible: true,
        message: `Badge "${selectedBadge.name}" assigned to selected users.`,
        type: "success",
      });
      setSelectedUsers([]);
      setSelectedBadge(null);
    } catch (error) {
      console.error("Error assigning badge:", error);
      setToast({
        visible: true,
        message: "Error assigning badge.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Assign Badge to Users</h1>

      <form onSubmit={handleAssignBadge} className="space-y-4">
        {/* Select Users using TagInput */}
        <div>
          <label htmlFor="userTags" className="block text-gray-700">
            Select Users
          </label>
          <TagInput
            options={users.map((user) => `${user.fullName} (${user.email})`)} // Use fullName and email for display
            placeholder="Search and select users"
            onChange={(selected) => {
              console.log("TagInput selected users:", selected); // Debugging
              setSelectedUsers(selected);
            }}
            maxTags={10} // Max 10 users can be selected
          />
        </div>

        {/* Select Badge using SelectInput */}
        <div>
          <label htmlFor="badgeSelect" className="block text-gray-700">
            Select Badge
          </label>
          <SelectInput
            options={badges.map((badge) => ({
              value: badge.name,
              label: `${badge.name} - ${badge.description}`,
              id: badge.id,
              description: badge.description,
              icon: badge.icon,
              slug: badge.slug,
            }))} // Badge name, id, description, icon, slug for proper structure
            placeholder="Select a badge"
            onChange={(selectedBadgeValue) => {
              const badge = badges.find(
                (badge) => badge.name === selectedBadgeValue
              );
              console.log("SelectInput selected badge:", badge); // Debugging
              setSelectedBadge(badge);
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-green-500 text-white">
            Assign Badge
          </Button>
        </div>
      </form>

      {/* Toast Notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default AssignBadgeForm;
