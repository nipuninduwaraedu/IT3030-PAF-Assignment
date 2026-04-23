import React from 'react';

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'LAB': return '#2196F3'; // blue
      case 'LECTURE_HALL': return '#9C27B0'; // purple
      case 'MEETING_ROOM': return '#4CAF50'; // green
      case 'EQUIPMENT': return '#FF9800'; // orange
      default: return '#757575'; // gray
    }
  };

  const cardStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backgroundColor: '#ffffff'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const typeBadgeStyle = {
    backgroundColor: getTypeColor(resource.type),
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  const statusBadgeStyle = {
    backgroundColor: resource.status === 'ACTIVE' ? '#e8f5e9' : '#ffebee',
    color: resource.status === 'ACTIVE' ? '#2e7d32' : '#c62828',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0'
  };

  const btnStyle = {
    padding: '6px 12px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const editBtnStyle = { ...btnStyle, backgroundColor: '#e3f2fd', color: '#1565c0' };
  const deleteBtnStyle = { ...btnStyle, backgroundColor: '#ffebee', color: '#c62828' };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>{resource.name}</h3>
        <span style={typeBadgeStyle}>{resource.type}</span>
      </div>
      
      <div style={{ fontSize: '14px', color: '#555' }}>
        <strong>Location:</strong> {resource.location}
      </div>
      
      <div style={{ fontSize: '14px', color: '#555' }}>
        <strong>Capacity:</strong> {resource.capacity !== null && resource.capacity !== undefined ? resource.capacity : 'N/A'}
      </div>
      
      <div>
        <span style={statusBadgeStyle}>{resource.status}</span>
      </div>
      
      {resource.description && (
        <p style={{ fontSize: '12px', color: '#888', margin: '4px 0' }}>
          {resource.description}
        </p>
      )}

      <div style={buttonContainerStyle}>
        <button style={editBtnStyle} onClick={() => onEdit(resource)}>Edit</button>
        <button style={deleteBtnStyle} onClick={() => onDelete(resource.id)}>Delete</button>
      </div>
    </div>
  );
};

export default ResourceCard;
