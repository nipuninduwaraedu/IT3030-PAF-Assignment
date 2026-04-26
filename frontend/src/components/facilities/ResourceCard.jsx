import React from "react";
import { useNavigate } from "react-router-dom";

const ResourceCard = ({ resource, onEdit, onDelete, isAdmin }) => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate("/bookings", { state: { preSelectedResourceId: resource.id } });
  };
  const getTypeColor = (type) => {
    switch (type) {
      case "LAB":
        return { bg: "#f1f5f9", text: "#475569" };
      case "LECTURE_HALL":
        return { bg: "#f1f5f9", text: "#475569" };
      case "MEETING_ROOM":
        return { bg: "#f1f5f9", text: "#475569" };
      case "EQUIPMENT":
        return { bg: "#f1f5f9", text: "#475569" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  const getStatusConfig = (status) => {
    return status === "ACTIVE"
      ? { bg: "#dcfce7", text: "#166534", label: "Available" }
      : { bg: "#fee2e2", text: "#991b1b", label: "Out of Service" };
  };

  const typeConfig = getTypeColor(resource.type);
  const statusConfig = getStatusConfig(resource.status);

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    margin: 0,
  };

  const typeBadgeStyle = {
    backgroundColor: typeConfig.bg,
    color: typeConfig.text,
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.025em",
  };

  const statusBadgeStyle = {
    backgroundColor: statusConfig.bg,
    color: statusConfig.text,
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    display: "inline-flex",
  };

  const infoRowStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    fontSize: "14px",
    color: "#64748b",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#475569",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "8px",
    marginTop: "auto",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9",
  };

  const btnStyle = {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",
    textAlign: "center",
  };

  const editBtnStyle = {
    ...btnStyle,
    backgroundColor: "#f1f5f9",
    color: "#475569",
  };

  const deleteBtnStyle = {
    ...btnStyle,
    backgroundColor: "#fef2f2",
    color: "#991b1b",
  };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={statusBadgeStyle}>{statusConfig.label}</span>
          <h3 style={titleStyle}>{resource.name}</h3>
        </div>
        <span style={typeBadgeStyle}>{resource.type.replace("_", " ")}</span>
      </div>

      <div style={infoRowStyle}>
        <div>
          <span style={labelStyle}>Location</span>
          <div style={{ color: "#1e293b", marginTop: "2px" }}>{resource.location}</div>
        </div>
        <div style={{ marginTop: "8px" }}>
          <span style={labelStyle}>Capacity</span>
          <div style={{ color: "#1e293b", marginTop: "2px" }}>
            {resource.capacity ? `${resource.capacity} People` : "Not specified"}
          </div>
        </div>
      </div>

      {resource.description && (
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineBreak: "anywhere" }}>
          {resource.description}
        </p>
      )}

      {isAdmin ? (
        <div style={buttonContainerStyle}>
          <button
            style={editBtnStyle}
            onClick={() => onEdit(resource)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e2e8f0")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f1f5f9")}
          >
            Edit
          </button>
          <button
            style={deleteBtnStyle}
            onClick={() => onDelete(resource.id)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#fee2e2")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#fef2f2")}
          >
            Delete
          </button>
        </div>
      ) : (
        resource.status === "ACTIVE" && (
          <div style={buttonContainerStyle}>
            <button
              style={{
                ...btnStyle,
                backgroundColor: "#2563eb",
                color: "white",
              }}
              onClick={handleBookClick}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              Book Now
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default ResourceCard;
