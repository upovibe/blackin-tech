import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaUserTag } from 'react-icons/fa'; // Changed icon to something related to pronouns
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';
import PronounsForm from '../forms/PronounsForm'; // Import the PronounsForm

const PronounsTable = () => {
  const [pronouns, setPronouns] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPronoun, setSelectedPronoun] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('pronouns', (data) => {
      setPronouns(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (pronoun, updatedData) => {
    const updatedPronoun = { ...pronoun, ...updatedData };
    updateDocument('pronouns', updatedPronoun.id, updatedPronoun)
      .then(() => console.log('Pronoun updated successfully'))
      .catch((error) => console.error('Error updating pronoun:', error));
  };

  const handleDelete = (pronoun) => {
    deleteDocument('pronouns', pronoun.id)
      .then(() => console.log('Pronoun deleted successfully'))
      .catch((error) => console.error('Error deleting pronoun:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const pronounToDelete = pronouns.find((pronoun) => pronoun.id === rowId);
      if (pronounToDelete) {
        deleteDocument('pronouns', pronounToDelete.id)
          .then(() => console.log(`Pronoun ${pronounToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting pronoun:', error));
      }
    });

    setPronouns((prevPronouns) => prevPronouns.filter((pronoun) => !selectedRows.has(pronoun.id)));
    setSelectedRows(new Set());
  };

  const handleViewPronoun = (pronoun) => {
    setSelectedPronoun(pronoun); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedPronoun(null); 
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
        title="Pronouns Table"
        icon={<FaUserTag />} // Icon related to pronouns
        columns={columns}
        data={pronouns}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewPronoun}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Pronoun Details"
      >
        {selectedPronoun ? (
          <div>
            <p><strong>Name:</strong> {selectedPronoun.name}</p>
            <p><strong>Slug:</strong> {selectedPronoun.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No pronoun selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Pronouns */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Pronoun"
      >
        <PronounsForm 
          pronoun={selectedPronoun} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default PronounsTable;
