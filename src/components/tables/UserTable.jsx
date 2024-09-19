import React, { useState, useEffect } from "react";
import { getAllDocuments, updateDocument } from "../../services/firestoreCRUD"; // Import your update function
import Table from "../common/Table";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllDocuments("users");
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle the action (edit, delete, change role, etc.)
  const handleAction = async (updatedUser) => {
    try {
      if (actionType === "edit" || actionType === "changeRole") {
        await updateDocument("users", updatedUser.id, {
          fullName: updatedUser.fullName,
          userName: updatedUser.userName, // Ensure userName is updated
          role: updatedUser.role,
          status: updatedUser.status,
        });
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      } else if (actionType === "delete") {
        await deleteDocument("users", updatedUser.id);
        setUsers(users.filter((u) => u.id !== updatedUser.id));
      } else if (actionType === "disable") {
        const newStatus = updatedUser.status === "active" ? "disabled" : "active";
        await updateDocument("users", updatedUser.id, { status: newStatus });
        setUsers(users.map((u) => (u.id === updatedUser.id ? { ...u, status: newStatus } : u)));
      }
      setIsModalOpen(false); // Close the modal after action
    } catch (error) {
      console.error("Error performing action: ", error);
    }
  };
  

  // Define columns for the Table component
  const userColumns = [
    {
      Header: 'Avatar',
      accessor: 'avatarUrl',
      Cell: ({ value }) => <img src={value} alt="avatar" className="w-10 h-10 rounded-full" />
    },
    { Header: 'Full Name', accessor: 'fullName' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Username', accessor: 'userName' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'Status', accessor: 'status', Cell: ({ value }) => value || "active" },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <DropdownActions user={row.original} onActionSelect={(user, actionType) => {
          setSelectedUser(user);
          setActionType(actionType);
          setIsModalOpen(true);
        }} />
      )
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={userColumns}
        data={users}
        sortable={true}
        filterable={true}
        pagination={true}
      />

      {/* Reusable Action Modal */}
      <ActionModal
        isOpen={isModalOpen}
        actionType={actionType}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onAction={handleAction}
      />
    </div>
  );
};

export default UserTable;
