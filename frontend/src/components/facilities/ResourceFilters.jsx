import React, { useState } from "react";

const ResourceFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = { search: "", type: "", status: "" };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const filterContainerStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginBottom: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const rowStyle = {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    alignItems: "flex-end",
  };

  const fieldStyle = {
    flex: 1,
    minWidth: "200px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#64748b",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const clearBtnStyle = {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <div style={filterContainerStyle}>
      <div style={rowStyle}>
        <div style={{ ...fieldStyle, flex: 2 }}>
          <label style={labelStyle}>Search Facilities</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by name, location or description..."
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            style={selectStyle}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Available</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>

        <button
          onClick={handleClear}
          style={clearBtnStyle}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f1f5f9";
            e.target.style.color = "#1e293b";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#64748b";
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ResourceFilters;
