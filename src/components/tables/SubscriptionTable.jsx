import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listenToCollection,
  updateDocument,
  deleteDocument,
  getDocumentByID, // Import the function to fetch the document by ID
} from "../../services/firestoreCRUD";
import Table from "../common/Table";
import { FaStar } from "react-icons/fa";
import RightSidebar from "../common/RightSidebar";
import Modal from "../common/Modal";
import SubscriptionForm from "../forms/SubscriptionForm";

const SubscriptionTable = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track editing mode
  const [isViewing, setIsViewing] = useState(false); // Track viewing mode
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection("subscriptions", (data) => {
      setSubscriptions(data);
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: "Title", accessor: "title", type: "text" },
    { Header: "Description", accessor: "description", type: "text" },
    { Header: "Price", accessor: "price", type: "text" },
    { Header: "Type", accessor: "type", type: "text" },
    { Header: "Updated At", accessor: "updatedAt", type: "text" },
  ];

  const handleUpdate = (subscription, updatedData) => {
    const updatedSubscription = { ...subscription, ...updatedData };
    updateDocument("subscriptions", updatedSubscription.id, updatedSubscription)
      .then(() => {
        console.log("Subscription updated successfully");
        // Update the local state
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions.map((sub) =>
            sub.id === updatedSubscription.id ? updatedSubscription : sub
          )
        );
        setIsSidebarOpen(false); // Close the sidebar after updating
      })
      .catch((error) => console.error("Error updating subscription:", error));
  };

  const handleDelete = (subscription) => {
    deleteDocument("subscriptions", subscription.id)
      .then(() => console.log("Subscription deleted successfully"))
      .catch((error) => console.error("Error deleting subscription:", error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const subscriptionToDelete = subscriptions.find(
        (subscription) => subscription.id === rowId
      );
      if (subscriptionToDelete) {
        deleteDocument("subscriptions", subscriptionToDelete.id)
          .then(() =>
            console.log(
              `Subscription ${subscriptionToDelete.id} deleted successfully`
            )
          )
          .catch((error) =>
            console.error("Error deleting subscription:", error)
          );
      }
    });

    setSubscriptions((prevSubscriptions) =>
      prevSubscriptions.filter(
        (subscription) => !selectedRows.has(subscription.id)
      )
    );
    setSelectedRows(new Set());
  };

  // Function to handle viewing a subscription (showing the details)
  const handleViewSubscription = async (subscriptionId) => {
    try {
      const fetchedSubscription = await getDocumentByID(
        "subscriptions",
        subscriptionId
      );
      if (fetchedSubscription) {
        setSelectedSubscription(fetchedSubscription);
        setIsViewing(true); // Set viewing mode to true
        setIsEditing(false); // Ensure we are not in editing mode
        setIsSidebarOpen(true); // Open the sidebar
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  // Function to handle editing a subscription (showing the form)
  const handleEditSubscription = async (subscriptionId) => {
    try {
      const fetchedSubscription = await getDocumentByID(
        "subscriptions",
        subscriptionId
      );
      if (fetchedSubscription) {
        setSelectedSubscription(fetchedSubscription);
        setIsEditing(true); // Set editing mode to true
        setIsViewing(false); // Ensure we are not in viewing mode
        setIsSidebarOpen(true); // Open the sidebar
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleOpenModal = () => {
    setSelectedSubscription(null);
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
        title="Subscriptions Table"
        icon={<FaStar />} // Change the icon if desired
        columns={columns}
        data={subscriptions}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={(subscription) => handleEditSubscription(subscription.id)} // Use the ID to fetch the doc by ID for editing
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={(subscription) => handleViewSubscription(subscription.id)} // Use the ID to fetch the doc by ID for viewing
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title={isEditing ? "Edit Subscription" : isViewing ? "Subscription Details" : ""} // Change title based on mode
      >
        {isEditing ? (
          <SubscriptionForm
            subscription={selectedSubscription}
            onClose={toggleSidebar}
            onSubmit={(updatedData) =>
              handleUpdate(selectedSubscription, updatedData)
            } // Handle form submission for editing
          />
        ) : isViewing && selectedSubscription ? (
          <div>
            <p>
              <strong>Title:</strong> {selectedSubscription.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedSubscription.description}
            </p>
            <p>
              <strong>Type:</strong> {selectedSubscription.type}
            </p>
            <p>
              <strong>Badge:</strong> {selectedSubscription.badge}
            </p>
            {/* Displaying key features */}
            <p>
              <strong>Key Features:</strong>
            </p>
            <ul>
              {selectedSubscription.keyFeatures.map((feature, index) => (
                <li key={index}>{feature.feature}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No subscription selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding/editing Subscription */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          selectedSubscription ? "Edit Subscription" : "Add New Subscription"
        }
      >
        <SubscriptionForm
          subscription={selectedSubscription}
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default SubscriptionTable;
