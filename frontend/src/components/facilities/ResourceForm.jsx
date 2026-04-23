import React, { useState, useEffect } from 'react';

const ResourceForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    capacity: '',
    location: '',
    availabilityWindows: '',
    status: 'ACTIVE',
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'LECTURE_HALL',
        capacity: initialData.capacity || '',
        location: initialData.location || '',
        availabilityWindows: initialData.availabilityWindows || '',
        status: initialData.status || 'ACTIVE',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      if (submitData.capacity) {
        submitData.capacity = parseInt(submitData.capacity, 10);
      } else {
        submitData.capacity = null;
      }
      onSubmit(submitData);
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    maxWidth: '500px'
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '14px'
  };

  const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px'
  };

  const errorStyle = {
    color: '#d32f2f',
    fontSize: '12px',
    margin: '0'
  };

  const buttonContainer = {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  };

  const btnStyle = {
    padding: '10px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white'
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ margin: '0 0 10px 0' }}>
        {initialData ? 'Update Resource' : 'Add Resource'}
      </h2>

      <div style={fieldStyle}>
        <label style={labelStyle}>Name *</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          style={inputStyle} 
        />
        {errors.name && <p style={errorStyle}>{errors.name}</p>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Type *</label>
        <select 
          name="type" 
          value={formData.type} 
          onChange={handleChange} 
          style={inputStyle}
        >
          <option value="LECTURE_HALL">LECTURE_HALL</option>
          <option value="LAB">LAB</option>
          <option value="MEETING_ROOM">MEETING_ROOM</option>
          <option value="EQUIPMENT">EQUIPMENT</option>
        </select>
        {errors.type && <p style={errorStyle}>{errors.type}</p>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Location *</label>
        <input 
          type="text" 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          style={inputStyle} 
        />
        {errors.location && <p style={errorStyle}>{errors.location}</p>}
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Capacity</label>
        <input 
          type="number" 
          name="capacity" 
          value={formData.capacity} 
          onChange={handleChange} 
          style={inputStyle} 
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Availability Windows</label>
        <input 
          type="text" 
          name="availabilityWindows" 
          value={formData.availabilityWindows} 
          onChange={handleChange} 
          style={inputStyle}
          placeholder="e.g. Mon-Fri 8am-6pm"
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Status</label>
        <select 
          name="status" 
          value={formData.status} 
          onChange={handleChange} 
          style={inputStyle}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
        />
      </div>

      <div style={buttonContainer}>
        <button type="submit" style={{ ...btnStyle, backgroundColor: '#4CAF50' }}>
          {initialData ? 'Update Resource' : 'Add Resource'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ ...btnStyle, backgroundColor: '#9e9e9e' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ResourceForm;
