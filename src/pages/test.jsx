import React, { useState } from 'react';
import TableComponent from '../components/common/TableComponent';
import { FaBox } from 'react-icons/fa';

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Coffee Mug', category: 'Kitchen', price: 12.99, stock: 200, image: 'https://via.placeholder.com/150' },
    // Add more product data here
  ]);

  const handleAdd = () => {
    // Implement add functionality, for now just a console log
    console.log('Add new product');
  };

  const handleEdit = (product) => {
    // Implement edit functionality, for now just update the state
    const updatedProducts = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updatedProducts);
    console.log('Edit product', product);
  };

  const handleDelete = (ids) => {
    // Implement delete functionality
    setProducts(products.filter((product) => !Array.isArray(ids) ? product.id !== ids : !ids.includes(product.id)));
  };

  const handleView = (product) => {
    // Implement view functionality, show product details in console
    console.log('View product', product);
  };

  const handleRefresh = () => {
    // Implement refresh functionality, simply log the refresh action for now
    console.log('Refresh product list');
  };

  const customActions = [
    {
      label: 'Mark as Featured',
      onClick: (product) => console.log('Mark as Featured', product)
    },
    {
      label: 'Apply Discount',
      onClick: (product) => console.log('Apply Discount', product)
    }
  ];

  const selectOptions = [
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Kitchen', label: 'Kitchen' },
    { value: 'Furniture', label: 'Furniture' },
    // Add more categories as needed
  ];

  const columns = [
    { path: 'name', label: 'Product Name' },
    { path: 'category', label: 'Category' },
    { path: 'price', label: 'Price ($)' },
    { path: 'stock', label: 'Stock' },
    { path: 'image', label: 'Image' }
  ];

  return (
    <div className="ProductManagement p-3">
      <TableComponent
        title="Product Inventory"
        icon={FaBox}
        data={products}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        // customActions={customActions}
        useEllipsisForActions={true}
        onRefresh={handleRefresh}
        selectOptions={selectOptions}
      />
    </div>
  );
};

export default ProductManagement;








import React, { useState, useEffect, useRef } from "react";
import { FaEllipsisVertical, FaRotate } from "react-icons/fa6";
import {
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaPlus,
  FaFilter,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
} from "react-icons/fa";
import Dialog from "./Dialog";
import AvatarUpload from "./AvatarUpload";
import Input from "./Input";

const TableComponent = ({
  data,
  title,
  icon: Icon,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
  customActions = [],
  pageSize = 10,
  useEllipsisForActions = false,
  onRefresh,
  selectOptions = [],
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editedData, setEditedData] = useState(data);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [originalValue, setOriginalValue] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageEditRow, setImageEditRow] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);

  const menuRef = useRef(null);

  // Toggle menu visibility
  const toggleMenu = (id) => {
    setMenuVisible(menuVisible === id ? null : id);
  };

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuVisible(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    setEditedData(data);
  }, [data]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(data.map((item) => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleDeleteAll = () => {
    setItemToDelete(selectedRows);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(itemToDelete);
    setSelectedRows([]);
    setIsDialogOpen(false);
    setItemToDelete(null);
  };

  const handleEditClick = (rowId, column) => {
    const originalValue = editedData.find((item) => item.id === rowId)[column];
    setEditingCell({ rowId, column });
    setEditValue(originalValue);
    setOriginalValue(originalValue);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const saveEdit = () => {
    const updatedData = editedData.map((item) => {
      if (item.id === editingCell.rowId) {
        return { ...item, [editingCell.column]: editValue };
      }
      return item;
    });
    onEdit(updatedData.find((item) => item.id === editingCell.rowId));
    setEditedData(updatedData);
    setEditingCell(null);
    setEditValue("");
    setIsEditDialogOpen(false);
  };

  const discardEdit = () => {
    setEditingCell(null);
    setEditValue("");
    setIsEditDialogOpen(false);
  };

  const handleEditConfirm = () => {
    if (editValue !== originalValue) {
      setIsEditDialogOpen(true);
    } else {
      discardEdit();
    }
  };

  const getSortedData = () => {
    let sortedData = [...editedData];
    if (sortColumn) {
      sortedData.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortedData;
  };

  const getFilteredData = () => {
    const filteredData = getSortedData().filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    return filteredData;
  };

  const getCurrentPageData = () => {
    const filteredData = getFilteredData();
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  };

  const pageCount = Math.ceil(getFilteredData().length / pageSize);

  const renderCell = (item, column) => {
    const isEditing =
      editingCell &&
      editingCell.rowId === item.id &&
      editingCell.column === column;

    // Add consistent cell styles for both editing and non-editing states
    const cellStyle = "w-full p-2 text-left";

    if (isEditing) {
      if (column === "role") {
        return (
          <select
            value={editValue}
            onChange={handleEditChange}
            onBlur={handleEditConfirm}
            className="w-full h-10 p-1 border-transparent rounded placeholder-slate-500 border focus:border-slate-500/0 focus:ring-2 focus:ring-slate-300 outline-none transition-colors duration-300"
          >
            {selectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }
      return (
        <input
          type="text"
          value={editValue}
          onChange={handleEditChange}
          onBlur={handleEditConfirm}
          onKeyDown={(e) => e.key === "Enter" && handleEditConfirm()}
          className="w-full p-1 h-10 border-transparent rounded placeholder-slate-500 border focus:border-slate-500/0 focus:ring-2 focus:ring-slate-300 outline-none transition-colors duration-300"
        />
      );
    }

    // For image column, ensure consistency in image sizing and layout
    if (column === "image") {
      return (
        <div className="flex items-center justify-start size-10 rounded-full overflow-hidden">
          <img
            src={item[column]}
            alt="Profile"
            className="w-full h-full object-cover cursor-pointer rounded-full transition-transform duration-300 transform hover:scale-110"
            onClick={() => handleImageClick(item.id, item[column])}
          />
        </div>
      );
    }

    // Default rendering for non-editing state
    return <div className={cellStyle}>{item[column]}</div>;
  };

  const handleImageClick = (rowId, imageUrl) => {
    setSelectedImage(imageUrl);
    setImageEditRow(rowId);
    setIsImageModalOpen(true);
  };

  const handleImageUpload = (newImageUrl) => {
    const updatedData = editedData.map((item) => {
      if (item.id === imageEditRow) {
        return { ...item, image: newImageUrl };
      }
      return item;
    });
    onEdit(updatedData.find((item) => item.id === imageEditRow));
    setEditedData(updatedData);
    setIsImageModalOpen(false);
  };

  const renderActions = (item, isEllipsisMenu = false) => (
    <div
      className={` flex gap-1 ${
        isEllipsisMenu
          ? "flex-col items-start w-full bg-slate-100 p-2 relative "
          : "flex-row items-center justify-end"
      }`}
    >
      <button
        onClick={() => onEdit(item)}
        className="p-2 flex items-center gap-1 hover:bg-slate-300/50 rounded-lg transition-all duration-200 ease-in-out text-sm"
      >
        <FaEdit className=" text-blue-500 group-hover:text-blue-600 size-4" />
        {isEllipsisMenu && <span cl>Edit</span>}
      </button>
      <button
        onClick={() => handleDelete(item.id)}
        className="p-2 flex items-center gap-1 hover:bg-slate-300/50 rounded-lg transition-all duration-200 ease-in-out text-sm"
      >
        <FaTrashAlt className="text-red-500 group-hover:text-red-600 size-4" />
        {isEllipsisMenu && <span>Delete</span>}
      </button>
      <button
        onClick={() => onView(item)}
        className="p-2 flex items-center gap-1 hover:bg-slate-300/50 rounded-lg transition-all duration-200 ease-in-out text-sm"
      >
        <FaEye className="text-green-500 group-hover:text-green-600 size-4" />
        {isEllipsisMenu && <span>View</span>}
      </button>
      {customActions.map((action, index) => (
        <button
          key={index}
          onClick={() => action.onClick(item)}
          className="p-2 flex items-center gap-1 hover:bg-slate-300/50 rounded-lg transition-all duration-200 ease-in-out text-sm"
        >
          {action.label}
        </button>
      ))}
    </div>
  );

  const renderEllipsisMenu = (item) => (
    <div className="">
      <FaEllipsisVertical
        className="cursor-pointer ml-auto"
        onClick={() => toggleMenu(item.id)}
      />
      {menuVisible === item.id && (
        <div className="absolute right-6 mt-2 bg-slate-300 border rounded-lg shadow-lg z-10 flex flex-col">
          {renderActions(item, true)}
        </div>
      )}
    </div>
  );

  return (
    <div className="table-component p-3 bg-white border shadow rounded-lg mb-2 relative w-full">
        {/* Title Section */}
      <div className="flex items-center w-full mb-3">
        {Icon && <Icon className="text-slate-600 mr-2" />}
        <h1 className="text-2xl font-semibold text-slate-700">{title}</h1>
      </div>
      {/* Header Section */}
      <div className="table-header flex items-center justify-between mb-4 gap-2">
        <div className="w-full md:w-4/12 flex items-center gap-2">
          <FaFilter />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2 justify-end w-full md:w-10/12">
          <button
            onClick={onAdd}
            className="p-2 bg-slate-600 text-white rounded flex items-center gap-1 hover:bg-slate-700"
          >
            <FaPlus />
            <span className="hidden lg:inline-flex">Add</span>
          </button>
          {selectedRows.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="p-2 bg-red-600 text-white rounded flex items-center gap-1 hover:bg-red-700"
            >
              <FaTrashAlt />
              <span className="hidden lg:inline-flex">Delete</span>
            </button>
          )}
          <button
            onClick={onRefresh}
            className="p-2 bg-slate-600 text-white rounded flex items-center gap-1 hover:bg-slate-700"
          >
            <FaRotate />
            <span className="hidden lg:inline-flex">Refresh</span>
          </button>
        </div>
      </div>

      {/* Table Wrapper for Responsiveness */}
      <div className="overflow-x-auto  rounded-lg w-full border">
        <table className="w-full">
          <thead className="bg-slate-200 hover:hover:bg-gray-300/80 transition-all ease-linear duration-100">
            <tr className="">
              <th className="px-4 py-2 text-left w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length}
                  onChange={handleSelectAll}
                  className="cursor-pointer"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.path}
                  onClick={() => handleSort(column.path)}
                  className="p-2 cursor-pointer text-left max-w-xs w-1/4"
                >
                  <div className="flex items-center justify-between space-x-1 text-slate-700">
                    <span>{column.label}</span>
                    <div className="w-4 max-h-4 flex items-center justify-center">
                      {sortColumn === column.path ? (
                        sortOrder === "asc" ? (
                          <FaArrowAltCircleUp className="w-full h-full" />
                        ) : (
                          <FaArrowAltCircleDown className="w-full h-full" />
                        )
                      ) : (
                        <span></span>
                      )}
                    </div>
                  </div>
                </th>
              ))}
              <th className="p-4 text-right max-w-sm w-32">Actions</th>{" "}
              {/* Fixed width for Actions column */}
            </tr>
          </thead>

          <tbody className="">
            {getCurrentPageData().length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="text-center p-4">
                  No data matches your search.
                </td>
              </tr>
            ) : (
              getCurrentPageData().map((item) => (
                <tr key={item.id} className="border-t min-h-10 max-h-10 overflow-hidden border-gray-500/20 hover:bg-gray-200/85 transition-all ease-linear duration-100">
                  <td className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleRowSelect(item.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.path}
                      onDoubleClick={() =>
                        handleEditClick(item.id, column.path)
                      }
                      className="p-2"
                    >
                      {renderCell(item, column.path)}
                    </td>
                  ))}
                  <td className="p-2 text-right">
                    {useEllipsisForActions
                      ? renderEllipsisMenu(item)
                      : renderActions(item)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        pageCount={pageCount}
        onPageChange={setCurrentPage}
      />

      {/* Dialogs */}
      <Dialog
        isOpen={isDialogOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete the selected items?"
        onCancel={() => setIsDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      <Dialog
        isOpen={isEditDialogOpen}
        title="Confirm Edit"
        message="You have unsaved changes. Do you want to save them?"
        onCancel={discardEdit}
        onConfirm={saveEdit}
      />

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <AvatarUpload onUpload={handleImageUpload} />
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full h-full object-cover mt-4"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="mt-4 px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ currentPage, pageCount, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= pageCount; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination flex items-center justify-between mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-2 px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50"
      ><FaArrowAltCircleLeft/>
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-slate-900 text-white"
              : "bg-slate-600 text-white hover:bg-slate-700"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
        className="flex items-center flex-row-reverse gap-2 px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 disabled:opacity-50"
      ><FaArrowAltCircleRight/>
        Next
      </button>
    </div>
  );
};

export default TableComponent;








import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaEye,
  FaSyncAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { useDebounce } from "use-debounce"; // Debounce for search

const ResponsiveTable = ({
  data,
  title,
  icon: Icon,
  columns,
  onAdd,
  onEdit,
  onInlineEditSave,
  onDelete,
  onDeleteAll,
  onView,
  onRefresh,
  customActions = [],
  useEllipsisForActions = false,
  loading = false,
  onLoading,
  emptyStateMessage = "No data available",
  rowKey = "id",
  isEditable = true,
  pagination = true,
  onSelect,
  disableActions = false,
  headerActions = [],
  isSortable = true,
  customRowClass,
  rowClick,
  searchable = true,
  multiSelect = true,
  stickyHeader = false,
  rowActionsPosition = "end",
  disableRefresh = false,
}) => {
  // ... (existing state declarations)

  const [filterText, setFilterText] = useState("");
  const [debouncedFilterText] = useDebounce(filterText, 500);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [editCell, setEditCell] = useState(null);
  const [editableData, setEditableData] = useState(data);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuRowId, setOpenMenuRowId] = useState(null);
  const ellipsisMenuRef = useRef();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleDeleteAll = () => {
    if (onDeleteAll) {
      onDeleteAll(selectedRows);
    }
    setSelectedRows([]);
  };

  const filteredData = editableData.filter((row) =>
    columns.some((col) =>
      String(row[col.accessor])
        .toLowerCase()
        .includes(debouncedFilterText.toLowerCase())
    )
  );

  const sortedData = React.useMemo(() => {
    if (!isSortable || !sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, isSortable]);

  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const toggleSort = (key) => {
    if (!isSortable) return;
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const handleSelect = (rowId) => {
    const updatedSelectedRows = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];
    setSelectedRows(updatedSelectedRows);
    if (onSelect) {
      onSelect(updatedSelectedRows);
    }
  };

  const handleEditChange = (rowId, accessor, value) => {
    const updatedData = editableData.map((row) =>
      row[rowKey] === rowId ? { ...row, [accessor]: value } : row
    );
    setEditableData(updatedData);
    setHasUnsavedChanges(true);
  };

  const handleSaveInlineEdit = (rowId, accessor) => {
    if (hasUnsavedChanges && onInlineEditSave) {
      const updatedRow = editableData.find((row) => row[rowKey] === rowId);
      onInlineEditSave({ ...updatedRow, changedField: accessor });
      setEditCell(null);
      setHasUnsavedChanges(false);
    }
  };

  const handleDoubleClick = (rowId, accessor) => {
    setEditCell({ rowId, accessor });
  };

  const toggleEllipsisMenu = (rowId) => {
    setOpenMenuRowId(openMenuRowId === rowId ? null : rowId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ellipsisMenuRef.current &&
        !ellipsisMenuRef.current.contains(event.target)
      ) {
        setOpenMenuRowId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleView = (row) => {
    if (onView) {
      onView(row);
    }
  };

  const handleCustomAction = (action, row) => {
    if (typeof action === "function") {
      action(row);
    } else {
      console.error("Custom action is not a function", action);
    }
  };

  const renderEditableCell = (column, row) => {
    if (column.editable) {
      if (column.editType === "select") {
        return (
          <select
            value={row[column.accessor]}
            onChange={(e) =>
              handleEditChange(row[rowKey], column.accessor, e.target.value)
            }
            onBlur={() =>
              handleSaveInlineEdit(row[rowKey], column.accessor)
            }
          >
            {column.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      } else {
        return (
          <input
            type="text"
            value={row[column.accessor]}
            onChange={(e) =>
              handleEditChange(row[rowKey], column.accessor, e.target.value)
            }
            onBlur={() =>
              handleSaveInlineEdit(row[rowKey], column.accessor)
            }
          />
        );
      }
    }
    return row[column.accessor];
  };

  const renderActionButtons = (row) => (
    <div className="flex space-x-2">
      {onView && (
        <button
          onClick={() => handleView(row)}
          className="text-blue-500 flex items-center"
        >
          <FaEye className="mr-1" /> View
        </button>
      )}
      {isEditable && !disableActions && (
        <>
          <button
            onClick={() => onEdit(row)}
            className="text-yellow-500 flex items-center"
          >
            <FaEdit className="mr-1" /> Edit
          </button>
          <button
            onClick={() => onDelete(row)}
            className="text-red-500 flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </>
      )}
    </div>
  );

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="text-slate-700" />}
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="flex space-x-4">
          {!disableRefresh && (
            <button
              className="btn bg-slate-500 text-white flex items-center"
              onClick={onRefresh}
            >
              <FaSyncAlt className="mr-2" /> Refresh
            </button>
          )}
          {headerActions.map((action, i) => (
            <button
              key={i}
              className="btn bg-slate-500 text-white"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
          {isEditable && (
            <button
              className="btn bg-green-600 text-white flex items-center"
              onClick={onAdd}
            >
              <FaPlus className="mr-2" /> Add New
            </button>
          )}
          {selectedRows.length > 0 && onDeleteAll && (
            <button
              className="btn bg-red-500 text-white flex items-center"
              onClick={handleDeleteAll}
            >
              <FaTrash className="mr-2" /> Delete Selected
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className={stickyHeader ? "sticky top-0 bg-white" : ""}>
            <tr>
              {multiSelect && (
                <th className="border-b border-gray-300">
                  <input
                    type="checkbox"
                    onChange={() => setSelectedRows(selectedRows.length ? [] : data.map(row => row[rowKey]))}
                    checked={selectedRows.length === data.length}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className="border-b border-gray-300 cursor-pointer"
                  onClick={() => toggleSort(column.accessor)}
                >
                  {column.label}{" "}
                  {sortConfig.key === column.accessor && (
                    <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
              {!disableActions && (
                <th className="border-b border-gray-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center p-4">
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row[rowKey]}
                  className={customRowClass ? customRowClass(row) : ""}
                  onClick={rowClick ? () => rowClick(row) : undefined}
                >
                  {multiSelect && (
                    <td className="border-b border-gray-300">
                      <input
                        type="checkbox"
                        onChange={() => handleSelect(row[rowKey])}
                        checked={selectedRows.includes(row[rowKey])}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.accessor}
                      className="border-b border-gray-300"
                      onDoubleClick={() => handleDoubleClick(row[rowKey], column.accessor)}
                    >
                      {editCell && editCell.rowId === row[rowKey] && editCell.accessor === column.accessor
                        ? renderEditableCell(column, row)
                        : row[column.accessor]}
                    </td>
                  ))}
                  {!disableActions && (
                    <td className="border-b border-gray-300">
                      <div ref={ellipsisMenuRef} className="relative">
                        {useEllipsisForActions ? (
                          <>
                            <button onClick={() => toggleEllipsisMenu(row[rowKey])}>
                              <FaEllipsisV />
                            </button>
                            {openMenuRowId === row[rowKey] && (
                              <div className="absolute right-0 bg-white border border-gray-300 z-10">
                                {customActions.map((action, i) => (
                                  <button
                                    key={i}
                                    onClick={() => handleCustomAction(action, row)}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          renderActionButtons(row)
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="btn"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(filteredData.length / pageSize)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredData.length / pageSize)))
            }
            disabled={currentPage >= Math.ceil(filteredData.length / pageSize)}
            className="btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;
