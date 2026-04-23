import React, { useState, useEffect } from 'react';
import ResourceFilters from '../components/facilities/ResourceFilters';
import ResourceCard from '../components/facilities/ResourceCard';
import ResourceForm from '../components/facilities/ResourceForm';
import { getResources, deleteResource, createResource, updateResource } from '../services/resourceService';

const FacilitiesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchResources = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getResources(filters);
      setResources(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(currentFilters);
  }, [currentFilters]);

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
  };

  const handleAddClick = () => {
    setEditingResource(null);
    setShowForm(true);
  };

  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Delete this resource?")) {
      try {
        await deleteResource(id);
        fetchResources(currentFilters);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete resource');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingResource) {
        await updateResource(editingResource.id, data);
      } else {
        await createResource(data);
      }
      setShowForm(false);
      fetchResources(currentFilters);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save resource');
      setShowForm(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const pageContainerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const addBtnStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const errorBannerStyle = {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #ef9a9a'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  };

  return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0 }}>Facilities & Assets</h1>
        <button style={addBtnStyle} onClick={handleAddClick}>
          Add Resource
        </button>
      </div>

      <ResourceFilters onFilterChange={handleFilterChange} />

      {error && <div style={errorBannerStyle}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px' }}>
          Loading...
        </div>
      ) : (
        <div style={gridStyle}>
          {resources.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#757575' }}>
              No resources found matching the criteria.
            </p>
          ) : (
            resources.map(resource => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>
      )}

      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <ResourceForm 
              initialData={editingResource}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
