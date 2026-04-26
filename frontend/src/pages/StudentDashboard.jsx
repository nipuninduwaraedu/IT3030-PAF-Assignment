import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ticketService from "../services/ticketService";
import authService from "../services/authService";
import TNavbar from "../components/TNavbar";

const StudentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();
  const studentId = user?.id || "GUEST";

  useEffect(() => {
    if (studentId !== "GUEST") {
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [studentId]);

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getStudentTickets(studentId);
      setTickets(response.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "PENDING").length,
    resolved: tickets.filter(
      (t) => t.status === "ACCEPTED" || t.status === "REJECTED",
    ).length,
  };

  const recentTickets = tickets.slice(0, 3);

  return (
    <div className="page-container">
      <TNavbar />

      <div className="content-area">
        <div className="dashboard-header">
          <div>
            <h1>Student Hub</h1>
            <p className="subtitle">
              Welcome {user?.username || "Student"}! Manage your campus reports.
            </p>
          </div>
          <Link
            to="/create-ticket"
            className="btn-submit"
            style={{
              width: "auto",
              padding: "0.8rem 2rem",
              textDecoration: "none",
            }}
          >
            + Report New Issue
          </Link>
        </div>

        {/* Quick Access Grid - Easy to merge other parts here */}
        <div
          className="quick-access-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div className="quick-card">
            <h3>Incident Reporting</h3>
            <p>Track and report campus issues.</p>
            <Link
              to="/my-tickets"
              className="view-link"
              style={{
                color: "#2563eb",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Manage Tickets →
            </Link>
          </div>
          <div className="quick-card">
            <h3>Campus Facilities</h3>
            <p>Browse and review available campus resources.</p>
            <Link
              to="/facilities?role=student"
              className="view-link"
              style={{
                color: "#2563eb",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View Facilities →
            </Link>
          </div>
          <div className="quick-card">
            <h3>Facility Bookings</h3>
            <p>View and manage your resource reservations.</p>
            <Link
              to="/bookings?role=student"
              className="view-link"
              style={{
                color: "#2563eb",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              My Bookings →
            </Link>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Reported</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card pending-card">
            <span className="stat-label">Pending Review</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
          <div className="stat-card resolved-card">
            <span className="stat-label">Resolved</span>
            <span className="stat-value">{stats.resolved}</span>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <Link to="/my-tickets" className="view-link">
              View All
            </Link>
          </div>

          {loading ? (
            <p>Loading your activity...</p>
          ) : studentId === "GUEST" ? (
            <div className="empty-state">
              <p>Please log in to view your activity.</p>
            </div>
          ) : recentTickets.length === 0 ? (
            <div className="empty-state">
              <p>No recent activity found.</p>
            </div>
          ) : (
            <div className="ticket-grid">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div
                    className={`status-badge ${ticket.status?.toLowerCase() || "pending"}`}
                  >
                    {ticket.status}
                  </div>
                  <h3>{ticket.category}</h3>
                  <p className="ticket-desc">
                    {ticket.description.substring(0, 80)}...
                  </p>
                  <div className="ticket-meta">
                    <span>
                      Priority:{" "}
                      <strong
                        className={ticket.priority?.toLowerCase() || "medium"}
                      >
                        {ticket.priority}
                      </strong>
                    </span>
                    <span>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="card-actions">
                    <Link to={`/ticket/${ticket.id}`} className="btn-details">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .quick-card {
          background: var(--glass);
          padding: 2rem;
          border-radius: 1rem;
          border: 1px solid var(--glass-border);
          text-align: left;
          transition: transform 0.3s;
        }
        .quick-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
        }
        .quick-card h3 {
          margin-bottom: 0.5rem;
          color: var(--primary);
        }
        .quick-card p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .quick-card.placeholder {
          opacity: 0.7;
          background: rgba(0, 0, 0, 0.02);
        }
        .badge {
          background: #eee;
          padding: 0.2rem 0.6rem;
          border-radius: 2rem;
          font-size: 0.7rem;
          color: #666;
          font-weight: bold;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: var(--glass);
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }
        .stat-label {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .dashboard-section {
          margin-top: 2rem;
          text-align: left;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .section-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }
        .pending-card {
          border-left: 4px solid var(--warning);
        }
        .resolved-card {
          border-left: 4px solid var(--success);
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
