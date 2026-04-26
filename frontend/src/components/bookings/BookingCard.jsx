import React from 'react';

const BookingCard = ({ booking, onApprove, onReject, onCancel, isAdmin }) => {
  const {
    id,
    resourceName,
    purpose,
    startTime,
    endTime,
    expectedAttendees,
    status,
    rejectionReason,
  } = booking;

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const getStatusBadgeStyle = (status) => {
    let backgroundColor = '#gray';
    switch (status) {
      case 'PENDING':
        backgroundColor = '#ffa500'; // orange
        break;
      case 'APPROVED':
        backgroundColor = '#28a745'; // green
        break;
      case 'REJECTED':
        backgroundColor = '#dc3545'; // red
        break;
      case 'CANCELLED':
        backgroundColor = '#6c757d'; // gray
        break;
      default:
        backgroundColor = '#6c757d';
    }

    return {
      backgroundColor,
      color: '#fff',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
      marginBottom: '8px',
    };
  };

  const buttonStyle = (color) => ({
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    color: '#fff',
    backgroundColor: color,
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '14px',
  });

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{resourceName}</h3>
        <span style={getStatusBadgeStyle(status)}>{status}</span>
      </div>

      <p style={{ margin: '0 0 8px 0', color: '#555' }}>{purpose}</p>

      <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
        <div><strong>From:</strong> {new Date(startTime).toLocaleString()}</div>
        <div><strong>To:</strong> {new Date(endTime).toLocaleString()}</div>
        {expectedAttendees && (
          <div><strong>Attendees:</strong> {expectedAttendees}</div>
        )}
      </div>

      {status === 'REJECTED' && rejectionReason && (
        <p style={{ color: '#dc3545', fontSize: '12px', fontStyle: 'italic', margin: '8px 0' }}>
          Reason: {rejectionReason}
        </p>
      )}

      <div style={{ marginTop: '16px' }}>
        {isAdmin && status === 'PENDING' && (
          <>
            <button style={buttonStyle('#28a745')} onClick={() => onApprove(id)}>Approve</button>
            <button style={buttonStyle('#dc3545')} onClick={() => onReject(id)}>Reject</button>
          </>
        )}

        {!isAdmin && (status === 'PENDING' || status === 'APPROVED') && (
          <button style={buttonStyle('#6c757d')} onClick={() => onCancel(id)}>Cancel</button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
