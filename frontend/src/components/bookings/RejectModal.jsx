import React, { useState } from 'react';

const RejectModal = ({ onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    onConfirm(reason);
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const modalStyle = {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '14px',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '16px',
    boxSizing: 'border-box',
    fontSize: '14px',
    resize: 'vertical',
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  };

  const confirmButtonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const cancelButtonStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ margin: '0 0 16px 0' }}>Reject Booking</h2>
        
        <label style={labelStyle}>Reason for rejection *</label>
        <textarea
          rows={3}
          style={textareaStyle}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          placeholder="Enter reason..."
        />

        {error && (
          <div style={{ color: '#dc3545', fontSize: '14px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <div style={buttonRowStyle}>
          <button style={confirmButtonStyle} onClick={handleConfirm}>Confirm Reject</button>
          <button style={cancelButtonStyle} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
