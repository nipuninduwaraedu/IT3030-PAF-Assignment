import React, { useState, useEffect } from "react";
import ResourceFilters from "../components/facilities/ResourceFilters";
import ResourceCard from "../components/facilities/ResourceCard";
import ResourceForm from "../components/facilities/ResourceForm";
import {
  getResources,
  deleteResource,
  createResource,
  updateResource,
} from "../services/resourceService";

const FacilitiesPage = ({ role }) => {
  const isAdmin = role === "ADMIN";

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
      setError("Failed to fetch resources. Make sure the backend is running.");
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
  const handleAddClick = () => {
    setEditingResource(null);
    setShowForm(true);
  };
  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResource(id);
        showSuccess("Resource deleted successfully!");
        fetchResources(currentFilters);
      } catch (err) {
        setError("Failed to delete resource.");
      }
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingResource) {
        await updateResource(editingResource.id, data);
        showSuccess("Resource updated successfully!");
      } else {
        await createResource(data);
        showSuccess("Resource added successfully!");
      }
      setShowForm(false);
      fetchResources(currentFilters);
    } catch (err) {
      setError("Failed to save resource.");
      setShowForm(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "0",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "32px 24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#1a202c",
              margin: "0 0 8px 0",
            }}
          >
            Smart Campus Facilities
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                backgroundColor: isAdmin ? "#fef3c7" : "#dbeafe",
                color: isAdmin ? "#d97706" : "#2563eb",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {isAdmin ? "Admin Access" : "Student Access"}
            </span>
          </p>
          {isAdmin && (
            <button
              onClick={handleAddClick}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginTop: "24px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#1d4ed8";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#2563eb";
              }}
            >
              Add New Resource
            </button>
          )}
        </div>

        {/* Filters — visible to everyone */}
        <ResourceFilters onFilterChange={handleFilterChange} />

        {/* Success Message */}
        {successMsg && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              color: "#166534",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #bbf7d0",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid #fecaca",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        {/* Stats Bar — Admin only */}
        {isAdmin && !loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {[
              {
                label: "Total Resources",
                value: resources.length,
                color: "#2563eb",
              },
              {
                label: "Available",
                value: resources.filter((r) => r.status === "ACTIVE").length,
                color: "#166534",
              },
              {
                label: "Out of Service",
                value: resources.filter((r) => r.status === "OUT_OF_SERVICE")
                  .length,
                color: "#991b1b",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "4px",
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resource Grid */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "#64748b",
              fontSize: "18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #e2e8f0",
                borderTop: "4px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p>Loading campus facilities...</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "24px",
            }}
          >
            {resources.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "80px 20px",
                  color: "#64748b",
                  backgroundColor: "white",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    fontSize: "18px",
                    margin: "0 0 16px 0",
                    fontWeight: "500",
                  }}
                >
                  No resources found matching the criteria.
                </p>
                {isAdmin && (
                  <button
                    onClick={handleAddClick}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Add First Resource
                  </button>
                )}
              </div>
            ) : (
              resources.map((resource) => (
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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "16px",
                width: "90%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                border: "1px solid #e2e8f0",
              }}
            >
              <ResourceForm
                initialData={editingResource}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default FacilitiesPage;
