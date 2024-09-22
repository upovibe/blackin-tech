import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaTools } from 'react-icons/fa'; // Change the icon as needed
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';
import JobSkillsForm from '../forms/JobSkillsForm'; // Import the JobSkillsForm

const JobSkillsTable = () => {
  const [jobSkills, setJobSkills] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobSkill, setSelectedJobSkill] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('jobSkills', (data) => {
      setJobSkills(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (jobSkill, updatedData) => {
    const updatedJobSkill = { ...jobSkill, ...updatedData };
    updateDocument('jobSkills', updatedJobSkill.id, updatedJobSkill)
      .then(() => console.log('Job Skill updated successfully'))
      .catch((error) => console.error('Error updating job skill:', error));
  };

  const handleDelete = (jobSkill) => {
    deleteDocument('jobSkills', jobSkill.id)
      .then(() => console.log('Job Skill deleted successfully'))
      .catch((error) => console.error('Error deleting job skill:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const jobSkillToDelete = jobSkills.find((jobSkill) => jobSkill.id === rowId);
      if (jobSkillToDelete) {
        deleteDocument('jobSkills', jobSkillToDelete.id)
          .then(() => console.log(`Job Skill ${jobSkillToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting job skill:', error));
      }
    });

    setJobSkills((prevJobSkills) => prevJobSkills.filter((jobSkill) => !selectedRows.has(jobSkill.id)));
    setSelectedRows(new Set());
  };

  const handleViewJobSkill = (jobSkill) => {
    setSelectedJobSkill(jobSkill); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedJobSkill(null); 
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
        title="Job Skills Table"
        icon={<FaTools />} // Change the icon if desired
        columns={columns}
        data={jobSkills}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewJobSkill}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Job Skill Details"
      >
        {selectedJobSkill ? (
          <div>
            <p><strong>Name:</strong> {selectedJobSkill.name}</p>
            <p><strong>Slug:</strong> {selectedJobSkill.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No job skill selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Job Skills */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Job Skill"
      >
        <JobSkillsForm 
          jobSkill={selectedJobSkill} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default JobSkillsTable;
