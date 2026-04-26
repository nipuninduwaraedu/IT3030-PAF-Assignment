import React, { useEffect, useState } from "react";
import ticketService from "../services/ticketService";
import AdminNavbar from "../components/AdminNavbar";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to load incidents. Please check if the backend service is running.");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === "PENDING").length,
    accepted: tickets.filter(t => t.status === "ACCEPTED").length,
    rejected: tickets.filter(t => t.status === "REJECTED").length
  };

  return (
    <div className="page-container admin-page">
      <AdminNavbar />

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Admin Overview</h1>
          <p className="subtitle">High-level statistics for campus incident management.</p>
        </div>

        {error && <p className="error-banner">{error}</p>}

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Incidents</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card pending-card">
            <span className="stat-label">Pending Review</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
          <div className="stat-card accepted-card">
            <span className="stat-label">Accepted</span>
            <span className="stat-value">{stats.accepted}</span>
          </div>
          <div className="stat-card rejected-card">
            <span className="stat-label">Rejected</span>
            <span className="stat-value">{stats.rejected}</span>
          </div>
        </div>

        <div className="admin-quick-actions">
          <h2>System Management</h2>
          <div className="action-links">
            <div className="action-card">
              <h3>Incident Tracking</h3>
              <p>View and manage all student reports.</p>
              <a href="/admin/tickets">Manage Tickets →</a>
            </div>
            <div className="action-card disabled">
              <h3>User Management</h3>
              <p>Manage campus staff and student accounts.</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-page { background: white; color: var(--text); }
        .dashboard-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-muted); font-size: 1.1rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin: 3rem 0; }
        .stat-card { background: white; padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
        .stat-label { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem; display: block; font-weight: 600; }
        .stat-value { font-size: 2.5rem; font-weight: 800; color: var(--text-h); }
        
        .pending-card { border-top: 5px solid var(--warning); }
        .accepted-card { border-top: 5px solid var(--success); }
        .rejected-card { border-top: 5px solid var(--error); }

        .admin-quick-actions { margin-top: 2rem; }
        .action-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
        .action-card { background: white; padding: 2rem; border-radius: 1.2rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
        .action-card h3 { margin-top: 0; }
        .action-card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
        .action-card a { font-weight: 700; color: var(--primary); text-decoration: none; }
        
        .disabled { opacity: 0.6; background: #f8fafc; }
        .coming-soon { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
