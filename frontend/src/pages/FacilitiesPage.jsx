import React, { useState, useEffect } from 'react';
import ResourceFilters from '../components/facilities/ResourceFilters';
import ResourceCard from '../components/facilities/ResourceCard';
import ResourceForm from '../components/facilities/ResourceForm';
import { getResources, deleteResource, createResource, updateResource } from '../services/resourceService';

const FacilitiesPage = ({ role }) => {
  const isAdmin = role === 'ADMIN';

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchResources = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getResources(filters);
      setResources(data);
    } catch (err) {
      setError('Failed to fetch resources. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(currentFilters);
  }, [currentFilters]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFilterChange = (filters) => setCurrentFilters(filters);
  const handleAddClick = () => { setEditingResource(null); setShowForm(true); };
  const handleEditClick = (resource) => { setEditingResource(resource); setShowForm(true); };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        showSuccess('Resource deleted successfully!');
        fetchResources(currentFilters);
      } catch (err) {
        setError('Failed to delete resource.');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingResource) {
        await updateResource(editingResource.id, data);
        showSuccess('Resource updated successfully!');
      } else {
        await createResource(data);
        showSuccess('Resource added successfully!');
      }
      setShowForm(false);
      fetchResources(currentFilters);
    } catch (err) {
      setError('Failed to save resource.');
      setShowForm(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#1a237e' }}>Facilities & Assets</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
            {isAdmin
              ? '🔧 Admin View — You can add, edit and delete resources'
              : '🎓 Student View — Browse and search available resources'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleAddClick}
            style={{
              padding: '12px 24px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '15px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            + Add Resource
          </button>
        )}
      </div>

      {/* Filters — visible to everyone */}
      <ResourceFilters onFilterChange={handleFilterChange} />

      {/* Success Message */}
      {successMsg && (
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '16px',
          border: '1px solid #a5d6a7',
          fontWeight: 'bold'
        }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '16px',
          border: '1px solid #ef9a9a'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Stats Bar — Admin only */}
      {isAdmin && !loading && (
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Total', value: resources.length, color: '#1a237e' },
            { label: 'Active', value: resources.filter(r => r.status === 'ACTIVE').length, color: '#2e7d32' },
            { label: 'Out of Service', value: resources.filter(r => r.status === 'OUT_OF_SERVICE').length, color: '#c62828' },
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${stat.color}`
            }}>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Resource Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px', color: '#666' }}>
          ⏳ Loading resources...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {resources.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px',
              color: '#757575',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '18px', margin: 0 }}>No resources found matching the criteria.</p>
              {isAdmin && (
                <button
                  onClick={handleAddClick}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  + Add First Resource
                </button>
              )}
            </div>
          ) : (
            resources.map(resource => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onEdit={isAdmin ? handleEditClick : null}
                onDelete={isAdmin ? handleDeleteClick : null}
                isAdmin={isAdmin}
              />
            ))
          )}
        </div>
      )}

      {/* Modal Form — Admin only */}
      {showForm && isAdmin && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '10px',
            width: '520px',
            maxWidth: '95%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <ResourceForm
              initialData={editingResource}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;