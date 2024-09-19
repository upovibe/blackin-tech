import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  FaEllipsisVertical,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaTrash,
} from "react-icons/fa6";

const Table = ({
  columns,
  data = [], // Default empty array
  sortable = false,
  filterable = false,
  pagination = false,
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
  });
  const [selectedRows, setSelectedRows] = useState(new Set());
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [sortDirection, setSortDirection] = useState({});

  // Sorting logic
  useEffect(() => {
    let filtered = data;

    // Apply filters
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

    // Check if filtered data has changed
    if (JSON.stringify(filtered) !== JSON.stringify(filteredData)) {
      setFilteredData(filtered);
    }

    // Perform sorting based on sortDirection
    const sorted = [...filtered].sort((a, b) => {
      const sortedColumn = Object.keys(sortDirection)[0]; // Get the column being sorted
      if (!sortedColumn) return 0; // No sorting applied

      const direction = sortDirection[sortedColumn];

      // Compare values
      if (a[sortedColumn] < b[sortedColumn])
        return direction === "asc" ? -1 : 1;
      if (a[sortedColumn] > b[sortedColumn])
        return direction === "asc" ? 1 : -1;
      return 0;
    });

    // Check if sorted data has changed
    if (JSON.stringify(sorted) !== JSON.stringify(sortedData)) {
      setSortedData(sorted);
    }

    console.log("Filters changed:", filters);
    console.log("Data length:", data.length);
  }, [filters, data, filteredData, sortedData, sortDirection]);

  const handleSort = (column) => {
    if (!sortable) return; // Ensure sorting is allowed
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

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle filter change
  const handleFilterChange = (e, accessor) => {
    setFilters({
      ...filters,
      [accessor]: e.target.value,
    });
  };

  // Handle cell click for editing
  const handleCellClick = (rowIndex, column) => {
    setEditing({ rowIndex, accessor: column.accessor });
    setOriginalValue(currentData[rowIndex][column.accessor]); // Track original value
    setEditValue(currentData[rowIndex][column.accessor]);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  // Handle edit change
  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    const updatedData = [...sortedData];
    const rowIndex = indexOfFirstRow + editing.rowIndex;
    updatedData[rowIndex][editing.accessor] = editValue;
    setSortedData(updatedData);
    setEditing(null);
    setOriginalValue(""); // Reset original value
    setModal({ visible: false });
    onEdit(updatedData[rowIndex]); // Notify parent about the edit
  };

  // Handle enter key and click outside
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editValue !== originalValue) {
        // Only show modal if changes were made
        setModal({ visible: true, action: "edit" });
      } else {
        setEditing(null);
      }
    }
  };
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      if (editValue !== originalValue) {
        // Only show modal if changes were made
        setModal({ visible: true, action: "edit" });
      } else {
        setEditing(null);
      }
    }

    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowActions(null); // Close actions dropdown
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // Toggle action dropdown
  const handleActionsToggle = (rowIndex) => {
    if (showActions === rowIndex) {
      setShowActions(null); // Close if already open
    } else {
      setShowActions(rowIndex); // Open the clicked row's actions
    }
  };

  // Handle row selection
  const handleRowSelect = (rowIndex) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(rowIndex)) {
        newSelectedRows.delete(rowIndex);
      } else {
        newSelectedRows.add(rowIndex);
      }
      return newSelectedRows;
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const rowsToDelete = Array.from(selectedRows).map(
      (index) => index + indexOfFirstRow
    );
    setSortedData((prevData) =>
      prevData.filter((_, index) => !rowsToDelete.includes(index))
    );
    setSelectedRows(new Set());
  };

  // Render table headers
  const renderHeaders = () => {
    return (
      <tr className="bg-gray-200 border-b border-gray-300">
        <th className="p-2">
          <input
            type="checkbox"
            checked={selectedRows.size === currentData.length}
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
            className="p-2 bg-gray-200 border-b border-gray-300 cursor-pointer"
          >
            <div className="flex items-center">
              {column.Header}
              {sortable && sortDirection[column.accessor] === "asc" && (
                <FaSortUp className="ml-2 text-gray-500" />
              )}
              {sortable && sortDirection[column.accessor] === "desc" && (
                <FaSortDown className="ml-2 text-gray-500" />
              )}
            </div>
            {filterable && (
              <input
                type="text"
                onChange={(e) => handleFilterChange(e, column.accessor)}
                placeholder={`Filter ${column.Header}`}
                className="mt-1 block w-full p-1 border border-gray-300 rounded"
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
      <tr
        key={rowIndex}
        className={`border-b border-gray-300 ${
          selectedRows.has(rowIndex) ? "bg-gray-100" : ""
        }`}
      >
        <td className="p-2">
          <input
            type="checkbox"
            checked={selectedRows.has(rowIndex)}
            onChange={() => handleRowSelect(rowIndex)}
          />
        </td>
        {columns.map((column) => (
          <td
            key={column.accessor}
            onClick={() => handleCellClick(rowIndex, column)}
            className="p-2"
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
                  className="w-full p-1 border border-gray-300 rounded"
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
                  className="w-full p-1 border border-gray-300 rounded"
                />
              )
            ) : (
              row[column.accessor]
            )}
          </td>
        ))}
        <td className="p-2 flex items-center space-x-2 relative">
          <button
            onClick={() => handleActionsToggle(rowIndex)}
            className="p-1 rounded hover:bg-gray-200"
          >
            <FaEllipsisVertical />
          </button>
          {showActions === rowIndex && (
            <ul
              ref={dropdownRef} // Add this line
              className="absolute bg-white border border-gray-300 rounded shadow-lg mt-1 p-2 space-y-1"
            >
              <li
                onClick={() =>
                  setModal({ visible: true, action: "edit", rowData: row })
                }
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
              >
                Edit
              </li>
              <li
                onClick={() =>
                  setModal({ visible: true, action: "delete", rowData: row })
                }
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
              >
                Delete
              </li>
              <li
                onClick={() => onView(row)}
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
              >
                View
              </li>
              <li
                onClick={() => onDisable(row)}
                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
              >
                Disable
              </li>
            </ul>
          )}
          <button
            onClick={() => onView(row)}
            className="p-1 rounded hover:bg-gray-200"
          >
            <FaEye />
          </button>
        </td>
      </tr>
    ));
  };

  // Render pagination
  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedData.length / rowsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 mx-1 rounded ${
              number === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  // Render modal
  const renderModal = () => {
    if (!modal.visible) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-4 rounded shadow-lg">
          {modal.action === "edit" && (
            <>
              <h2 className="text-lg font-semibold">Edit Row</h2>
              <p>Are you sure you want to edit this row?</p>
              <div className="mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setModal({ visible: false })}
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
              <div className="mt-4">
                <button
                  onClick={() => {
                    onDelete(modal.rowData);
                    setModal({ visible: false });
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setModal({ visible: false })}
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
    <div className="relative">
      <div className="flex justify-between mb-2">
        {selectedRows.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete Selected
          </button>
        )}
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>{renderHeaders()}</thead>
        <tbody>
          {currentData.length === 0 ? (
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
      {pagination && renderPagination()}
      {renderModal()}
    </div>
  );
};

// PropTypes definition remains the same
Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      selectOptions: PropTypes.array,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  pagination: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onView: PropTypes.func,
  onDisable: PropTypes.func,
};

export default Table;
