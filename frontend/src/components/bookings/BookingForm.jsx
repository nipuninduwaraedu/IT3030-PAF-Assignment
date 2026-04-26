import React, { useState } from 'react';

const BookingForm = ({ resources, onSubmit, onCancel, initialResourceId }) => {
  const [formData, setFormData] = useState({
    resourceId: initialResourceId || '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { resourceId, startTime, endTime, purpose, expectedAttendees } = formData;

    if (!resourceId || !startTime || !endTime || !purpose) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError('End time must be after start time');
      return;
    }

    onSubmit({
      resourceId,
      startTime,
      endTime,
      purpose,
      expectedAttendees: expectedAttendees ? parseInt(expectedAttendees) : null,
    });
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '500px',
    margin: '0 auto',
    padding: '24px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '14px',
  };

  const inputStyle = {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  };

  const buttonRowStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  };

  const submitButtonStyle = {
    padding: '12px 24px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    flex: 2,
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const cancelButtonStyle = {
    padding: '12px 24px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
    flex: 1,
    fontSize: '16px',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ margin: '0 0 16px 0' }}>Request Booking</h2>

      <div>
        <label style={labelStyle}>Resource *</label>
        <select
          name="resourceId"
          value={formData.resourceId}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Select a resource</option>
          {resources.map((res) => (
            <option key={res.id} value={res.id}>
              {res.name} — {res.location}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Start Time *</label>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>End Time *</label>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Purpose *</label>
        <input
          type="text"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          style={inputStyle}
          placeholder="e.g., Team Meeting"
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Expected Attendees</label>
        <input
          type="number"
          name="expectedAttendees"
          value={formData.expectedAttendees}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Optional"
        />
      </div>

      {error && (
        <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '8px' }}>
          {error}
        </div>
      )}

      <div style={buttonRowStyle}>
        <button type="submit" style={submitButtonStyle}>Request Booking</button>
        <button type="button" style={cancelButtonStyle} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default BookingForm;
