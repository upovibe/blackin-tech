import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenToCollection,
  updateDocument,
  deleteDocument,
} from "../../services/firestoreCRUD";
import Table from "../common/Table";
import { FaTag } from "react-icons/fa";
import RightSidebar from "../common/RightSidebar";
import Modal from "../common/Modal";
import SubTypesForm from "../forms/SubTypesForm";

const SubTypesTable = () => {
  const [subTypes, setSubTypes] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubType, setSelectedSubType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection("subTypes", (data) => {
      setSubTypes(data);
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: "Type", accessor: "type", type: "text" },
    { Header: "Slug", accessor: "slug", type: "text" },
    { Header: "Updated At", accessor: "updatedAt", type: "text" },
  ];

  const handleUpdate = (subType, updatedData) => {
    const updatedSubType = { ...subType, ...updatedData };
    updateDocument("subTypes", updatedSubType.id, updatedSubType)
      .then(() => console.log("SubType updated successfully"))
      .catch((error) => console.error("Error updating subtype:", error));
  };

  const handleDelete = (subType) => {
    deleteDocument("subTypes", subType.id)
      .then(() => console.log("SubType deleted successfully"))
      .catch((error) => console.error("Error deleting subtype:", error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const subTypeToDelete = subTypes.find((subType) => subType.id === rowId);
      if (subTypeToDelete) {
        deleteDocument("subTypes", subTypeToDelete.id)
          .then(() =>
            console.log(`SubType ${subTypeToDelete.id} deleted successfully`)
          )
          .catch((error) => console.error("Error deleting subtype:", error));
      }
    });

    setSubTypes((prevSubTypes) =>
      prevSubTypes.filter((subType) => !selectedRows.has(subType.id))
    );
    setSelectedRows(new Set());
  };

  const handleViewSubType = (subType) => {
    setSelectedSubType(subType);
    setIsSidebarOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedSubType(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Table
        title="SubTypes Table"
        icon={<FaTag />} // Change the icon if desired
        columns={columns}
        data={subTypes}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewSubType}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="SubType Details"
      >
        {selectedSubType ? (
          <div>
            <p>
              <strong>Type:</strong> {selectedSubType.type}
            </p>
            <p>
              <strong>Slug:</strong> {selectedSubType.slug}
            </p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No subtype selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding SubTypes */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New SubType"
      >
        <SubTypesForm subType={selectedSubType} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default SubTypesTable;
