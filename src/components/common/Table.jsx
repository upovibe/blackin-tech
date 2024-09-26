import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  FaEllipsisVertical,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaTrash,
  FaPenToSquare,
  FaUserSlash,
} from "react-icons/fa6";
import AvatarUpload from "./AvatarUpload";
import Divider from "./Divider";
import { FaPlusCircle } from "react-icons/fa";

const Table = ({
  title,
  icon,
  columns,
  setData,
  data = [],
  sortable = false,
  filterable = false,
  pagination = false,
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onDisable = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState(data || []);
  const [sortedData, setSortedData] = useState(data || []);
  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [originalValue, setOriginalValue] = useState("");
  const [showActions, setShowActions] = useState(null);

  const [modal, setModal] = useState({
    visible: false,
    action: null,
    rowData: null,
    newImageURL: null,
  });

  const [selectedRows, setSelectedRows] = useState(new Set());
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [sortDirection, setSortDirection] = useState({});

  useEffect(() => {
    let filtered = data;

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filtered = filtered.filter((item) =>
          item[key]
            .toString()
            .toLowerCase()
            .includes(filters[key].toLowerCase())
        );
      }
    });

    if (JSON.stringify(filtered) !== JSON.stringify(filteredData)) {
      setFilteredData(filtered);
    }

    const sorted = [...filtered].sort((a, b) => {
      const sortedColumn = Object.keys(sortDirection)[0];
      if (!sortedColumn) return 0;

      const direction = sortDirection[sortedColumn];

      if (a[sortedColumn] < b[sortedColumn])
        return direction === "asc" ? -1 : 1;
      if (a[sortedColumn] > b[sortedColumn])
        return direction === "asc" ? 1 : -1;
      return 0;
    });

    if (JSON.stringify(sorted) !== JSON.stringify(sortedData)) {
      setSortedData(sorted);
    }
  }, [filters, data, filteredData, sortedData, sortDirection]);

  const handleSort = (column) => {
    if (!sortable) return;
    const direction = sortDirection[column.accessor] === "asc" ? "desc" : "asc";
    setSortDirection({ [column.accessor]: direction });
    const sorted = [...sortedData].sort((a, b) => {
      if (direction === "asc") {
        return a[column.accessor] < b[column.accessor] ? -1 : 1;
      } else {
        return a[column.accessor] > b[column.accessor] ? -1 : 1;
      }
    });

    setSortedData(sorted);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e, accessor) => {
    setFilters({
      ...filters,
      [accessor]: e.target.value,
    });
  };

  const handleCellClick = (rowIndex, column) => {
    setEditing({ rowIndex, accessor: column.accessor });
    setOriginalValue(currentData[rowIndex][column.accessor]);
    setEditValue(currentData[rowIndex][column.accessor]);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
    const currentColumn = columns.find(
      (col) => col.accessor === editing?.accessor
    );
    if (currentColumn?.selectOptions) {
      handleSaveEdit();
    }
  };

  const handleSaveEdit = () => {
    const updatedData = [...sortedData];
    const rowIndex = sortedData.findIndex(
      (row) => row.id === currentData[editing.rowIndex].id
    );
    updatedData[rowIndex][editing.accessor] = editValue;
    setSortedData(updatedData);
    setFilteredData(updatedData);
    setEditing(null);
    setOriginalValue("");
    setModal({ visible: false });
    onEdit(updatedData[rowIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editValue !== originalValue) {
        setModal({ visible: true, action: "edit" });
      } else {
        setEditing(null);
      }
    }
  };

  const handleClickOutside = (e) => {
    if (editing) {
      const currentColumn = columns.find(
        (col) => col.accessor === editing.accessor
      );
      if (currentColumn?.selectOptions) {
        return;
      }
    }

    if (inputRef.current && !inputRef.current.contains(e.target)) {
      if (editValue !== originalValue) {
        setModal({ visible: true, action: "edit" });
      } else {
        setEditing(null);
      }
    }

    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowActions(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleActionsToggle = (rowIndex) => {
    if (showActions === rowIndex) {
      setShowActions(null);
    } else {
      setShowActions(rowIndex);
    }
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowId)) {
        newSelectedRows.delete(rowId);
      } else {
        newSelectedRows.add(rowId);
      }
      return newSelectedRows;
    });
  };

  const handleBulkDelete = () => {
    const newData = filteredData.filter((row) => !selectedRows.has(row.id));
    setFilteredData(newData); // This updates your data without the selected rows
    setSelectedRows(new Set()); // Clear the selected rows after deletion
  }; //////////////////////////Bugs

  const handleBulkDeleteClick = () => {
    setModal({
      visible: true,
      action: "bulkDelete",
      rowData: null,
    });
  };

  const handleImageUpdate = (newImageURL) => {
    if (!modal.rowData) return;

    const rowIndex = sortedData.findIndex((row) => row === modal.rowData);
    if (rowIndex === -1) return;

    const updatedData = [...sortedData];
    const imageColumn = columns.find((col) => col.type === "image");
    if (!imageColumn) return;
    const accessor = imageColumn.accessor;
    updatedData[rowIndex][accessor] = newImageURL;
    setSortedData(updatedData);
    setFilteredData(updatedData);
    setModal({
      visible: false,
      action: null,
      rowData: null,
      newImageURL: null,
    });
    onEdit(updatedData[rowIndex]);
  };

  // Render table headers
  const renderHeaders = () => {
    return (
      <tr className="bg-gray-200 border-b border-gray-300">
        <th className="p-2">
          <input
            type="checkbox"
            checked={
              selectedRows.size === currentData.length && currentData.length > 0
            }
            onChange={(e) => {
              const isChecked = e.target.checked;
              setSelectedRows(
                new Set(isChecked ? currentData.map((_, i) => i) : [])
              );
            }}
          />
        </th>
        {columns.map((column) => (
          <th
            key={column.accessor}
            onClick={() => handleSort(column)}
            className={`p-2 bg-gray-200 border-b border-gray-300 cursor-pointer ${
              column.type === "image" ? "text-center" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{column.Header}</span>
              {sortable &&
                sortDirection[column.accessor] &&
                (sortDirection[column.accessor] === "asc" ? (
                  <FaSortUp className="ml-2 text-gray-500" />
                ) : (
                  <FaSortDown className="ml-2 text-gray-500" />
                ))}
            </div>
            {filterable && (
              <input
                type="text"
                onChange={(e) => handleFilterChange(e, column.accessor)}
                placeholder={`Filter ${column.Header}`}
                className="mt-1 block w-full p-1 border border-gray-300 rounded placeholder-slate-500 border-slate-300/15 focus:border-transparent focus:border-slate-500 focus:ring-2 focus:ring-slate-300 outline-none transition-all duration-300"
              />
            )}
          </th>
        ))}
        <th className="p-2">Actions</th>
      </tr>
    );
  };

  // Render table rows
  const renderRows = () => {
    return currentData.map((row, rowIndex) => (
      <React.Fragment key={rowIndex}>
        <tr
          className={`relative border-b border-gray-300 w-full ${
            selectedRows.has(rowIndex) ? "bg-gray-100" : ""
          }`}
        >
          <td className="p-2 text-center">
            <input
              type="checkbox"
              checked={selectedRows.has(rowIndex)}
              onChange={() => handleRowSelect(rowIndex)}
            />
          </td>
          {columns.map((column) => (
            <td
              key={column.accessor}
              onClick={() =>
                column.type !== "image" && handleCellClick(rowIndex, column)
              }
              className={`p-2 ${
                column.type === "image" ? "text-center mr-auto" : ""
              }`}
            >
              {editing &&
              editing.rowIndex === rowIndex &&
              editing.accessor === column.accessor ? (
                column.selectOptions ? (
                  <select
                    ref={inputRef}
                    value={editValue}
                    onChange={handleEditChange}
                    onKeyDown={handleKeyDown}
                    className="w-full h-10 p-1 border-transparent rounded placeholder-slate-500 border focus:border-slate-500/0 focus:ring-2 focus:ring-slate-300 outline-none transition-colors duration-300"
                  >
                    {column.selectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={handleEditChange}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 min-h-10 border-transparent rounded placeholder-slate-500 border focus:border-slate-500/0 focus:ring-2 focus:ring-slate-300 outline-none transition-colors duration-300"
                  />
                )
              ) : column.type === "image" ? (
                <div className="flex items-center justify-start overflow-hidden w-12 h-12 rounded-full">
                  <img
                    src={
                      row[column.accessor] || "https://via.placeholder.com/50"
                    }
                    alt={column.Header}
                    className="w-full h-full object-cover cursor-pointer rounded-full transition-transform duration-300 transform hover:scale-110"
                    onClick={() =>
                      setModal({
                        visible: true,
                        action: "viewImage",
                        rowData: row,
                        newImageURL: null,
                      })
                    }
                  />
                </div>
              ) : (
                row[column.accessor]
              )}
            </td>
          ))}
          <td className="flex items-center justify-end size-full p-2">
            <div className="relative size-fit">
              <button
                onClick={() => onView(row)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <FaEye className="text-green-500 group-hover:text-green-600" />
              </button>
              <button
                onClick={() => handleActionsToggle(rowIndex)}
                className="p-1 rounded hover:bg-gray-200"
              >
                <FaEllipsisVertical />
              </button>
            </div>
            
        {showActions === rowIndex && (
          <div className="absolute right-5 top-5 z-50">
            <ul
              ref={dropdownRef}
              className="bg-white border border-gray-300 rounded shadow-lg mt-1 p-2 space-y-1"
            >
              <li
                onClick={() => onView(row)}
                className="group transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-200 p-1 rounded flex items-center gap-2 px-2"
              >
                <FaEye className="text-green-500 group-hover:text-green-600" />
                View
              </li>
              <li
                onClick={() => onEdit(row)}
                className="group transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-200 p-1 rounded flex items-center gap-2 px-2"
              >
                <FaPenToSquare className="text-blue-500 group-hover:text-blue-600" />{" "}
                Edit
              </li>
              <li
                onClick={() =>
                  setModal({
                    visible: true,
                    action: "delete",
                    rowData: row,
                  })
                }
                className="group transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-200 p-1 rounded flex items-center gap-2 px-2"
              >
                <FaTrash className="text-red-500 group-hover:text-red-600" />
                Delete
              </li>
            </ul>
          </div>
        )}
          </td>
        </tr>
      </React.Fragment>
    ));
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedData.length / rowsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-3 mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`size-8 text-sm font-semibold rounded ${
              number === currentPage ? "bg-slate-800 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  const renderModal = () => {
    if (!modal.visible) return null;
    return (
      <div
        onClick={() =>
          setModal({
            visible: false,
            action: null,
            rowData: null,
            newImageURL: null,
          })
        }
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      >
        <div
          onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2 lg:w-1/3"
        >
          {modal.action === "disable" && (
            <>
              <h2 className="text-lg font-semibold">Disable Row</h2>
              <p>Are you sure you want to disable this row?</p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onDisable(modal.rowData); // Call the onDisable function
                    setModal({ visible: false, action: null, rowData: null });
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Disable
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setModal({ visible: false, action: null, rowData: null })
                  }
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {modal.action === "viewImage" && (
            <>
              <h2 className="text-lg font-semibold">View Image</h2>
              <div className="mt-4 flex flex-col items-center">
                {/* Display the new image if uploaded, else display the original */}
                <img
                  src={
                    modal.newImageURL ||
                    modal.rowData[
                      columns.find((col) => col.type === "image").accessor
                    ]
                  }
                  alt="Preview"
                  className="max-w-full h-auto mb-4"
                />
                <AvatarUpload
                  initialImage={
                    modal.rowData[
                      columns.find((col) => col.type === "image").accessor
                    ]
                  }
                  onUpload={(newImageURL) => {
                    // Handle Image Upload: Store the new image URL temporarily
                    setModal((prevModal) => ({
                      ...prevModal,
                      newImageURL,
                    }));
                  }}
                />
              </div>
              <div className="mt-4 flex justify-end">
                {/* Continue Button to Save the New Image */}
                <button
                  type="button"
                  onClick={() => {
                    if (modal.newImageURL) {
                      handleImageUpdate(modal.newImageURL);
                    } else {
                      // If no new image uploaded, just close the modal
                      setModal({
                        visible: false,
                        action: null,
                        rowData: null,
                        newImageURL: null,
                      });
                    }
                  }}
                  className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                    !modal.newImageURL ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!modal.newImageURL}
                >
                  Continue
                </button>
                {/* Close Button to Discard Changes */}
                <button
                  type="button"
                  onClick={() =>
                    setModal({
                      visible: false,
                      action: null,
                      rowData: null,
                      newImageURL: null,
                    })
                  }
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {modal.action === "bulkDelete" && (
            <>
              <h2 className="text-lg font-semibold">Bulk Delete</h2>
              <p>Are you sure you want to delete the selected rows?</p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    handleBulkDelete();
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete Selected
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setModal({ visible: false, action: null, rowData: null })
                  }
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {modal.action === "edit" && (
            <>
              <h2 className="text-lg font-semibold">Edit Row</h2>
              <p>Are you sure you want to edit this row?</p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setModal({
                      visible: false,
                      action: null,
                      rowData: null,
                      newImageURL: null,
                    })
                  }
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
          {modal.action === "delete" && (
            <>
              <h2 className="text-lg font-semibold">Delete Row</h2>
              <p>Are you sure you want to delete this row?</p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(modal.rowData);
                    setModal({
                      visible: false,
                      action: null,
                      rowData: null,
                      newImageURL: null,
                    });
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setModal({
                      visible: false,
                      action: null,
                      rowData: null,
                      newImageURL: null,
                    })
                  }
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative p-3 bg-white shadow-md rounded-lg mb-2 overflow-x-auto">
      {title && (
        <div className="flex items-center justify-between gap-3 h-14 pb-3">
          <div className="flex items-center gap-2 text-bold text-slate-900 text-xl font-bold">
            {icon && <span>{icon}</span>}
            <h2>{title}</h2>
          </div>
          <div className="flex items-center gap-2 transition-all duration-200 ease-in-out">
            <button
              type="button"
              onClick={onAdd}
              className="bg-green-500 text-white p-2 text-sm font-semibold rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              <FaPlusCircle />
              <span className="hidden lg:block">Add New</span>
            </button>
            {selectedRows.size > 0 && (
              <button
                onClick={handleBulkDeleteClick}
                className="bg-red-500 text-white p-2 flex items-center gap-2 rounded-md hover:bg-red-600 text-sm font-semibold"
              >
                <FaTrash />
                <span className="hidden lg:block">Delete Selected</span>
              </button>
            )}
          </div>
        </div>
      )}
      <div className="overflow-auto pb-32">
        <table className="min-w-full max-w-full border-collapse border border-gray-200">
          <thead>{renderHeaders()}</thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="text-center p-4">
                  No data available.
                </td>
              </tr>
            ) : (
              renderRows()
            )}
          </tbody>
        </table>
      </div>
      <Divider className="bg-slate-500/10" />
      {pagination && renderPagination()}
      {renderModal()}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      selectOptions: PropTypes.arrayOf(PropTypes.string),
      type: PropTypes.oneOf(["text", "image", "select"]),
      editable: PropTypes.bool,
      Cell: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  pagination: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onDisable: PropTypes.func,
  onAdd: PropTypes.func,
  selectedRows: PropTypes.instanceOf(Set),
  handleBulkDelete: PropTypes.func,
};

export default Table;
