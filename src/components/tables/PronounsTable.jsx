import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaTools } from 'react-icons/fa';
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';
import PronounsForm from '../forms/PronounsForm';

const PronounsTable = () => {
  const [jobPronouns, setJobPronouns] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobPronoun, setSelectedJobPronoun] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobPronouns', (data) => {
      setJobPronouns(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (jobPronoun, updatedData) => {
    const updatedJobPronoun = { ...jobPronoun, ...updatedData };
    updateDocument('jobPronouns', updatedJobPronoun.id, updatedJobPronoun)
      .then(() => console.log('Job Pronoun updated successfully'))
      .catch((error) => console.error('Error updating job pronoun:', error));
  };

  const handleDelete = (jobPronoun) => {
    deleteDocument('jobPronouns', jobPronoun.id)
      .then(() => console.log('Job Pronoun deleted successfully'))
      .catch((error) => console.error('Error deleting job pronoun:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobPronounToDelete = jobPronouns.find((jobPronoun) => jobPronoun.id === rowId);
      if (jobPronounToDelete) {
        deleteDocument('jobPronouns', jobPronounToDelete.id)
          .then(() => console.log(`Job Pronoun ${jobPronounToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job pronoun:', error));
      }
    });

    setJobPronouns((prevJobPronouns) => prevJobPronouns.filter((jobPronoun) => !selectedRows.has(jobPronoun.id)));
    setSelectedRows(new Set());
  };

  const handleViewJobPronoun = (jobPronoun) => {
    setSelectedJobPronoun(jobPronoun); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedJobPronoun(null); 
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
        title="Job Pronouns Table"
        icon={<FaTools />} // Change the icon if desired
        columns={columns}
        data={jobPronouns}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewJobPronoun}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Job Pronoun Details"
      >
        {selectedJobPronoun ? (
          <div>
            <p><strong>Name:</strong> {selectedJobPronoun.name}</p>
            <p><strong>Slug:</strong> {selectedJobPronoun.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No pronoun selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Job Pronouns */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Pronoun"
      >
        <PronounsForm 
          jobPronoun={selectedJobPronoun} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default PronounsTable;
