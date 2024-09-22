import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaUsers } from 'react-icons/fa';
import RightSidebar from '../common/RightSidebar'; // Adjust the path as needed

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for sidebar details
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('users', (data) => {
      setUsers(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    {
      Header: 'Avatar',
      accessor: 'avatarUrl',
      type: 'image',
      Cell: ({ value }) => (
        <div>
          <img
            src={value || 'https://via.placeholder.com/50'}
            alt="Avatar"
          />
        </div>
      ),
    },
    { Header: 'Full Name', accessor: 'fullName', type: 'text' },
    { Header: 'Email', accessor: 'email', type: 'text' },
    { Header: 'Username', accessor: 'userName', type: 'text' },
    { Header: 'Role', accessor: 'role', type: 'text' },
  ];

  const handleUpdate = (user, updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    updateDocument('users', updatedUser.id, updatedUser)
      .then(() => console.log('User updated successfully'))
      .catch((error) => console.error('Error updating user:', error));
  };

  const handleDelete = (user) => {
    deleteDocument('users', user.id)
      .then(() => console.log('User deleted successfully'))
      .catch((error) => console.error('Error deleting user:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const userToDelete = users.find((user) => user.id === rowId);
      if (userToDelete) {
        deleteDocument('users', userToDelete.id)
          .then(() => console.log(`User ${userToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting user:', error));
      }
    });

    setUsers((prevUsers) => prevUsers.filter((user) => !selectedRows.has(user.id)));
    setSelectedRows(new Set());
  };

  const handleDisable = (user) => {
    handleUpdate(user, { active: false });
  };

  // When a user clicks "View", open the sidebar and show the selected user
  const handleViewUser = (user) => {
    setSelectedUser(user); // Set the clicked user details
    setIsSidebarOpen(true); // Open the sidebar
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Table
        title="Users Table"
        icon={<FaUsers />}
        columns={columns}
        data={users}
        selectedRows={selectedRows} 
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={(user) => console.log('Editing user:', user)}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onDisable={handleDisable}
        onView={handleViewUser} // Updated to call handleViewUser
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title={selectedUser ? `Details for ${selectedUser.fullName}` : 'User Details'} // Dynamically change the sidebar title
      >
        {selectedUser ? (
          <div className="space-y-4">
            <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Username:</strong> {selectedUser.userName}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Avatar:</strong></p>
            <img
              src={selectedUser.avatarUrl || 'https://via.placeholder.com/50'}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No user selected.</p>
        )}
      </RightSidebar>
    </>
  );
};

export default UserTable;
