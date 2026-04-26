import React, { useState, useEffect } from "react";

const ResourceForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "LECTURE_HALL",
    capacity: "",
    location: "",
    status: "ACTIVE",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        type: initialData.type || "LECTURE_HALL",
        capacity: initialData.capacity || "",
        location: initialData.location || "",
        status: initialData.status || "ACTIVE",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

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

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  };

  const modalStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "550px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "32px",
    border: "1px solid #e2e8f0",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 24px 0",
  };

  const formGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const errorTextStyle = {
    color: "#dc2626",
    fontSize: "12px",
    marginTop: "4px",
    fontWeight: "500",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "32px",
  };

  const btnStyle = {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const submitBtnStyle = {
    ...btnStyle,
    backgroundColor: "#2563eb",
    color: "white",
  };

  const cancelBtnStyle = {
    ...btnStyle,
    backgroundColor: "#f1f5f9",
    color: "#475569",
  };

  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={titleStyle}>{initialData ? "Edit Facility" : "Add New Facility"}</h2>

        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Facility Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g. Main Auditorium"
            />
            {errors.name && <div style={errorTextStyle}>{errors.name}</div>}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>Resource Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Laboratory</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="ACTIVE">Available</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g. Building A, Floor 2"
              />
              {errors.location && <div style={errorTextStyle}>{errors.location}</div>}
            </div>
            <div>
              <label style={labelStyle}>Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                style={inputStyle}
                placeholder="Number of people"
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{
                ...inputStyle,
                height: "100px",
                resize: "none",
                fontFamily: "inherit",
              }}
              placeholder="Brief details about the facility..."
            />
          </div>

          <div style={buttonContainerStyle}>
            <button
              type="button"
              onClick={onCancel}
              style={cancelBtnStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e2e8f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#f1f5f9")}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={submitBtnStyle}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              {initialData ? "Update Facility" : "Create Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
