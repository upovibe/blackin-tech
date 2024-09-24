import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenToCollection,
  updateDocument,
  deleteDocument,
} from "../../services/firestoreCRUD";
import Table from "../common/Table";
import { FaAward } from "react-icons/fa"; // Icon for badges
import RightSidebar from "../common/RightSidebar";
import Modal from "../common/Modal";
import BadgeForm from "../forms/BadgeForm"; // Import the BadgeForm component

const BadgesTable = () => {
  const [badges, setBadges] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection("badges", (data) => {
      setBadges(data);
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    {
      Header: "Icon",
      accessor: "icon",
      type: "image",
      Cell: ({ value }) => (
        <div>
          <img src={value || "https://via.placeholder.com/50"} alt="Badge" />
        </div>
      ),
    },
    { Header: "Name", accessor: "name", type: "text" },
    { Header: "Slug", accessor: "slug", type: "text" },
    { Header: "Description", accessor: "description", type: "text" },
  ];

  const handleUpdate = (badge, updatedData) => {
    const updatedBadge = { ...badge, ...updatedData };
    updateDocument("badges", updatedBadge.id, updatedBadge)
      .then(() => console.log("Badge updated successfully"))
      .catch((error) => console.error("Error updating badge:", error));
  };

  const handleDelete = (badge) => {
    deleteDocument("badges", badge.id)
      .then(() => console.log("Badge deleted successfully"))
      .catch((error) => console.error("Error deleting badge:", error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const badgeToDelete = badges.find((badge) => badge.id === rowId);
      if (badgeToDelete) {
        deleteDocument("badges", badgeToDelete.id)
          .then(() =>
            console.log(`Badge ${badgeToDelete.id} deleted successfully`)
          )
          .catch((error) => console.error("Error deleting badge:", error));
      }
    });

    setBadges((prevBadges) =>
      prevBadges.filter((badge) => !selectedRows.has(badge.id))
    );
    setSelectedRows(new Set());
  };

  const handleViewBadge = (badge) => {
    setSelectedBadge(badge);
    setIsSidebarOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedBadge(null);
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
        title="Badges Table"
        icon={<FaAward />} // Icon for badges
        columns={columns}
        data={badges}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewBadge}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Badge Details"
      >
        {selectedBadge ? (
          <div>
            <p>
              <strong>Name:</strong> {selectedBadge.name}
            </p>
            <p>
              <strong>Slug:</strong> {selectedBadge.slug}
            </p>
            <p>
              <strong>Description:</strong> {selectedBadge.description}
            </p>
            <img
              src={selectedBadge.icon}
              alt={selectedBadge.name}
              className="w-16 h-16"
            />
          </div>
        ) : (
          <p>No badge selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding/editing Badges */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Badge"
      >
        <BadgeForm badge={selectedBadge} onClose={handleCloseModal} />
      </Modal>
    </>
  );
};

export default BadgesTable;
