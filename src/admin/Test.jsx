import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import ResponsiveTable from "../components/common/ResponsiveTable"; // Assuming you have the ResponsiveTable in the same directory

const Test = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@example.com", age: 25, role: "Admin" },
    { id: 2, name: "Bob", email: "bob@example.com", age: 30, role: "User" },
    { id: 3, name: "Charlie", email: "charlie@example.com", age: 35, role: "User" },
    { id: 4, name: "Dave", email: "dave@example.com", age: 40, role: "Editor" },
    { id: 5, name: "Eve", email: "eve@example.com", age: 22, role: "Admin" },
    { id: 6, name: "Frank", email: "frank@example.com", age: 28, role: "User" },
    { id: 7, name: "Grace", email: "grace@example.com", age: 33, role: "Editor" },
    { id: 8, name: "Hank", email: "hank@example.com", age: 45, role: "User" },
    { id: 9, name: "Ivy", email: "ivy@example.com", age: 29, role: "Admin" },
    { id: 10, name: "Jack", email: "jack@example.com", age: 31, role: "User" },
  ]);

  const [loading, setLoading] = useState(false);

  const roleOptions = ["Admin", "User", "Editor"];

  const handleAdd = () => {
    const newUser = {
      id: users.length + 1,
      name: `New User ${users.length + 1}`,
      email: `user${users.length + 1}@example.com`,
      age: Math.floor(Math.random() * 20) + 20,
      role: "User",
    };
    setUsers([...users, newUser]);
  };

  const handleEdit = (user) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, name: `${u.name} (Edited)` } : u
    );
    setUsers(updatedUsers);
  };

  const handleDelete = (user) => {
    const updatedUsers = users.filter((u) => u.id !== user.id);
    setUsers(updatedUsers);
  };

  const handleDeleteAll = (selectedRows) => {
    const updatedUsers = users.filter((u) => !selectedRows.includes(u.id));
    setUsers(updatedUsers);
  };

  const handleView = (user) => {
    alert(`Viewing user: ${user.name}`);
  };

  const handleInlineEditSave = (updatedUser) => {
    const updatedUsers = users.map((u) =>
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    alert(`Saved changes for: ${updatedUser.name}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Data refreshed");
    }, 1500);
  };

  const customActions = [
    {
      label: "Promote to Admin",
      action: (user) => {
        const updatedUsers = users.map((u) =>
          u.id === user.id ? { ...u, role: "Admin" } : u
        );
        setUsers(updatedUsers);
      },
    },
  ];

  const columns = [
    { label: "Name", accessor: "name", editable: true },
    { label: "Email", accessor: "email" },
    { label: "Age", accessor: "age", editable: true },
    { 
      label: "Role", 
      accessor: "role", 
      editable: true,
      editType: "select", // Specify this is a select dropdown for inline editing
      options: roleOptions // Pass the role options here
    },
  ];

  const headerActions = [
    {
      label: "Export CSV",
      onClick: () => {
        alert("CSV exported!");
      },
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <ResponsiveTable
        data={users}
        title="User Management"
        icon={FaUsers}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onInlineEditSave={handleInlineEditSave}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
        onView={handleView}
        onRefresh={handleRefresh}
        customActions={customActions}
        useEllipsisForActions={true}
        loading={loading}
        onLoading={setLoading}
        emptyStateMessage="No users found."
        rowKey="id"
        isEditable={true}
        pagination={true}
        onSelect={(selectedRows) =>
          console.log("Selected rows:", selectedRows)
        }
        disableActions={false}
        headerActions={headerActions}
        isSortable={true}
        customRowClass={(row) =>
          row.age > 40 ? "bg-red-100" : "bg-green-100"
        }
        rowClick={(row) => alert(`Clicked on ${row.name}`)}
        searchable={true}
        multiSelect={true}
        stickyHeader={true}
        disableRefresh={false}
        rowActionsPosition="end"
      />
    </div>
  );
};

export default Test;
