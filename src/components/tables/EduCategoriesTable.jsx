import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listenToCollection, updateDocument, deleteDocument } from '../../services/firestoreCRUD'; 
import Table from '../common/Table';
import { FaGraduationCap } from 'react-icons/fa'; // Change the icon as needed
import RightSidebar from '../common/RightSidebar';
import Modal from '../common/Modal';
import EduCategoriesForm from '../forms/EduCategoriesForm'; // Import the EduCategoriesForm

const EduCategoriesTable = () => {
  const [eduCategories, setEduCategories] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEduCategory, setSelectedEduCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = listenToCollection('eduCategories', (data) => {
      setEduCategories(data); 
    });
    return () => unsubscribe();
  }, []);

  const columns = [
    { Header: 'Name', accessor: 'name', type: 'text' },
    { Header: 'Slug', accessor: 'slug', type: 'text' },
  ];

  const handleUpdate = (eduCategory, updatedData) => {
    const updatedEduCategory = { ...eduCategory, ...updatedData };
    updateDocument('eduCategories', updatedEduCategory.id, updatedEduCategory)
      .then(() => console.log('Educational Category updated successfully'))
      .catch((error) => console.error('Error updating educational category:', error));
  };

  const handleDelete = (eduCategory) => {
    deleteDocument('eduCategories', eduCategory.id)
      .then(() => console.log('Educational Category deleted successfully'))
      .catch((error) => console.error('Error deleting educational category:', error));
  };

  const handleBulkDelete = () => {
    selectedRows.forEach((rowId) => {
      const eduCategoryToDelete = eduCategories.find((eduCategory) => eduCategory.id === rowId);
      if (eduCategoryToDelete) {
        deleteDocument('eduCategories', eduCategoryToDelete.id)
          .then(() => console.log(`Educational Category ${eduCategoryToDelete.id} deleted successfully`))
          .catch((error) => console.error('Error deleting educational category:', error));
      }
    });

    setEduCategories((prevEduCategories) => prevEduCategories.filter((eduCategory) => !selectedRows.has(eduCategory.id)));
    setSelectedRows(new Set());
  };

  const handleViewEduCategory = (eduCategory) => {
    setSelectedEduCategory(eduCategory); 
    setIsSidebarOpen(true); 
  };

  const handleOpenModal = () => {
    setSelectedEduCategory(null); 
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
        title="Educational Categories Table"
        icon={<FaGraduationCap />} // Change the icon if desired
        columns={columns}
        data={eduCategories}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        sortable={true}
        filterable={true}
        pagination={true}
        onEdit={handleUpdate}
        onDelete={handleDelete}
        handleBulkDelete={handleBulkDelete}
        onView={handleViewEduCategory}
        onAdd={handleOpenModal}
        className="w-full text-sm text-gray-700"
      />

      {/* RightSidebar Component */}
      <RightSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        title="Educational Category Details"
      >
        {selectedEduCategory ? (
          <div>
            <p><strong>Name:</strong> {selectedEduCategory.name}</p>
            <p><strong>Slug:</strong> {selectedEduCategory.slug}</p>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <p>No educational category selected.</p>
        )}
      </RightSidebar>

      {/* Modal for adding Educational Categories */}
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Educational Category"
      >
        <EduCategoriesForm 
          eduCategory={selectedEduCategory} 
          onClose={handleCloseModal}
        />
      </Modal>
    </>
  );
};

export default EduCategoriesTable;