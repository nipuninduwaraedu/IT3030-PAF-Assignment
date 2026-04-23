import React, { useState } from 'react';

const ResourceFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    minCapacity: '',
    location: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const activeFilters = {};
    if (filters.type) activeFilters.type = filters.type;
    if (filters.status) activeFilters.status = filters.status;
    if (filters.minCapacity) activeFilters.minCapacity = parseInt(filters.minCapacity, 10);
    if (filters.location) activeFilters.location = filters.location;
    
    onFilterChange(activeFilters);
  };

  const handleClear = () => {
    setFilters({ type: '', status: '', minCapacity: '', location: '' });
    onFilterChange({});
  };

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px',
    alignItems: 'center'
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px'
  };

  const btnStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white'
  };

  return (
    <div style={containerStyle}>
      <select 
        name="type" 
        value={filters.type} 
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">All Types</option>
        <option value="LECTURE_HALL">LECTURE_HALL</option>
        <option value="LAB">LAB</option>
        <option value="MEETING_ROOM">MEETING_ROOM</option>
        <option value="EQUIPMENT">EQUIPMENT</option>
      </select>

      <select 
        name="status" 
        value={filters.status} 
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
      </select>

      <input 
        type="number" 
        name="minCapacity" 
        placeholder="Min capacity" 
        value={filters.minCapacity} 
        onChange={handleChange}
        style={inputStyle}
      />

      <input 
        type="text" 
        name="location" 
        placeholder="Location" 
        value={filters.location} 
        onChange={handleChange}
        style={inputStyle}
      />

      <button 
        style={{ ...btnStyle, backgroundColor: '#1976d2' }} 
        onClick={handleSearch}
      >
        Search
      </button>
      <button 
        style={{ ...btnStyle, backgroundColor: '#757575' }} 
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
};

export default ResourceFilters;
