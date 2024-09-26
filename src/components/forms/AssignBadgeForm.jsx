import React, { useState, useEffect } from "react";
import { updateDocument, getAllDocuments } from "../../services/firestoreCRUD";
import Button from "../common/Button";
import Toast from "../common/Toast";
import SelectInput from "../common/SelectInput";
import Input from "../common/Input";

const AssignBadgeForm = () => {
  const [users, setUsers] = useState([]);
  const [badges, setBadges] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  // Fetch users and badges when the component mounts
  useEffect(() => {
    const fetchUsersAndBadges = async () => {
      try {
        const usersData = await getAllDocuments("users");
        setUsers(usersData);

        const badgesData = await getAllDocuments("badges");
        setBadges(badgesData); // Store the full badge objects
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUsersAndBadges();
  }, []);

  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId); // Deselect if already selected
      }
      return [...prev, userId]; // Select user
    });
  };

  const handleAssignBadge = async () => {
    if (!selectedBadge) {
      setToast({
        message: "Please select a badge.",
        type: "error",
        visible: true,
      });
      return;
    }

    try {
      // Update each selected user's document with the selected badge object
      await Promise.all(
        selectedUsers.map((userId) =>
          updateDocument("users", userId, { badge: selectedBadge }) // Store full badge object
        )
      );

      setToast({
        message: `Badge "${selectedBadge.name}" assigned to selected users.`,
        type: "success",
        visible: true,
      });
      setSelectedBadge(null);
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error assigning badge:", error);
      setToast({
        message: "Error assigning badge. Please try again.",
        type: "error",
        visible: true,
      });
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-2">
      <h1 className="text-2xl font-semibold mb-4">Assign Badge to Users</h1>

      {/* Search Users */}
      <div className="mb-4">
        <label htmlFor="userSearch" className="block text-gray-700">
          Search Users
        </label>
        <Input
          id="userSearch"
          placeholder="Type to search users..."
          value={searchTerm || ""} // Ensure value is never undefined
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mt-2 p-2 border border-slate-300"
        />

        <ul className="mt-2 max-h-60 overflow-y-auto border border-slate-300">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li
                key={user.id}
                className="p-2 flex items-center cursor-pointer hover:bg-slate-200 transition-all duration-300"
                onClick={() => handleUserSelection(user.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleUserSelection(user.id)}
                  className="mr-2"
                />
                {user.fullName}
              </li>
            ))
          ) : (
            <li className="p-2 text-slate-400">No users found</li>
          )}
        </ul>
      </div>

      {/* Selected Users */}
      <div className="mb-4">
        <label className="block text-gray-700">Selected Users</label>
        <Input
          type="text"
          value={selectedUsers
            .map((userId) => users.find((user) => user.id === userId)?.fullName)
            .join(", ")}
          readOnly
          placeholder="No users selected"
          className="w-full mt-2 p-2 border border-slate-300"
        />
      </div>

      {/* Select Badge */}
      <div className="mb-4">
        <label htmlFor="badgeSelect" className="block text-gray-700">
          Select Badge
        </label>
        <SelectInput
          options={badges.map(badge => ({ label: badge.name, id: badge.id }))} // Map badges for SelectInput
          placeholder="Select a badge"
          value={selectedBadge ? selectedBadge.name : ""} // Ensure value is never undefined
          onChange={(e) => {
            const badge = badges.find(b => b.name === e.target.value);
            setSelectedBadge(badge);
          }}
          className="w-full mt-2"
        />
      </div>

      {/* Assign Badge Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleAssignBadge}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Assign Badge
        </Button>
      </div>

      {/* Toast for success or error message */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
};

export default AssignBadgeForm;
