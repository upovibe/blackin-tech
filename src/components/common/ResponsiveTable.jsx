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
  onInlineEditSave, // Function to save inline edits
  onDelete,
  onDeleteAll, // Function to delete all selected rows
  onView,
  onRefresh,
  customActions = [],
  useEllipsisForActions = false,
  loading = false,
  onLoading, // New prop to handle loading state
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
  const [filterText, setFilterText] = useState("");
  const [debouncedFilterText] = useDebounce(filterText, 500); // Debounce search input
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState([]);
  const [editCell, setEditCell] = useState(null); // Now holds both rowId and accessor for cell-based editing
  const [editableData, setEditableData] = useState(data);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuRowId, setOpenMenuRowId] = useState(null);
  const ellipsisMenuRef = useRef();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(loading); // Loading state

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
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
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

  // Add this function to handle custom actions
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
        // Render a select dropdown if the editType is select
        return (
          <select
            value={row[column.accessor]}
            onChange={(e) =>
              handleEditChange(row[rowKey], column.accessor, e.target.value)
            }
            onBlur={() => handleSaveInlineEdit(row[rowKey], column.accessor)}
          >
            {column.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      } else {
        // Default to text input for editable cells
        return (
          <input
            type="text"
            value={row[column.accessor]}
            onChange={(e) =>
              handleEditChange(row[rowKey], column.accessor, e.target.value)
            }
            onBlur={() => handleSaveInlineEdit(row[rowKey], column.accessor)}
          />
        );
      }
    }
    return row[column.accessor]; // If not editable, just display the value
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-slate-600">
        {emptyStateMessage}
      </div>
    );
  }


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
              <FaTrash className="mr-2" /> Delete All
            </button>
          )}
        </div>
      </div>

      {searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => {
            setFilterText(e.target.value);
            // onLoading(true);
          }}
          className="border p-2 mb-4 w-full"
        />
      )}

      <div className="overflow-x-auto">
        <table className="table-auto min-w-full border-collapse border border-slate-300">
          <thead
            className={`${stickyHeader ? "sticky top-0 bg-white z-10" : ""}`}
          >
            <tr>
              {multiSelect && (
                <th className="border border-slate-300 px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length}
                    onChange={() =>
                      setSelectedRows(
                        selectedRows.length === data.length
                          ? []
                          : data.map((d) => d[rowKey])
                      )
                    }
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="border border-slate-300 px-4 py-2 cursor-pointer"
                  onClick={() => toggleSort(col.accessor)}
                >
                  {col.label}
                  {isSortable &&
                    sortConfig.key === col.accessor &&
                    (sortConfig.direction === "asc" ? " 🔼" : " 🔽")}
                </th>
              ))}
              <th className="border border-slate-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-4 text-slate-600"
                >
                  {emptyStateMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row[rowKey]}
                  className={customRowClass ? customRowClass(row) : ""}
                >
                  {multiSelect && (
                    <td className="border border-slate-300 px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row[rowKey])}
                        onChange={() => handleSelect(row[rowKey])}
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.accessor}
                      className="border border-slate-300 px-4 py-2"
                      onDoubleClick={() =>
                        col.editable &&
                        handleDoubleClick(row[rowKey], col.accessor)
                      }
                    >
                      {
                        editCell &&
                        editCell.rowId === row[rowKey] &&
                        editCell.accessor === col.accessor
                          ? renderEditableCell(col, row) // Call the new function here
                          : row[col.accessor] // If not in edit mode, just display the value
                      }
                    </td>
                  ))}

                  <td className="border border-slate-300 px-4 py-2">
                    {useEllipsisForActions ? (
                      <div className="relative">
                        <button
                          onClick={() => toggleEllipsisMenu(row[rowKey])}
                          className="btn"
                        >
                          <FaEllipsisV />
                        </button>
                        {openMenuRowId === row[rowKey] && (
                          <div
                            ref={ellipsisMenuRef}
                            className="absolute right-0 bg-white border border-slate-300 shadow-lg z-20 p-2 space-y-2"
                          >
                            {customActions.map((action, i) => (
                              <button
                                key={i}
                                className="btn"
                                onClick={() => handleCustomAction(action, row)}
                              >
                                {action.label}
                              </button>
                            ))}
                            {renderActionButtons(row)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        {customActions.map((customAction, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleCustomAction(customAction.action, row)
                            }
                          >
                            {customAction.label}
                          </button>
                        ))}
                        {renderActionButtons(row)}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && sortedData.length > pageSize && (
        <div className="flex justify-between items-center mt-4">
          <div>
            Showing {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <button
              className="btn"
              disabled={currentPage * pageSize >= sortedData.length}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(sortedData.length / pageSize))
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveTable;