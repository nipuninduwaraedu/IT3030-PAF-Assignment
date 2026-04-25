import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ticketService from "../services/ticketService";
import AdminNavbar from "../components/AdminNavbar";

const AdminAllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionData, setActionData] = useState({ id: null, comment: "" });
  const [message, setMessage] = useState("");
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

  const handleAction = async (id, status) => {
    if (!actionData.comment) {
      alert("Please add a comment before taking action.");
      return;
    }

    try {
      await ticketService.updateTicketAction(id, status, actionData.comment);
      setMessage(`Ticket ${status} successfully!`);
      setActionData({ id: null, comment: "" });
      fetchTickets();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await ticketService.deleteTicket(id);
        setMessage("Ticket deleted successfully!");
        fetchTickets();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting ticket:", error);
        alert("Failed to delete ticket.");
      }
    }
  };

  return (
    <div className="page-container admin-page">
      <AdminNavbar />

      <div className="content-area">
        <div className="dashboard-header">
          <h1>Detailed Ticket Reports</h1>
          <p className="subtitle">Comprehensive list of all campus incident reports.</p>
        </div>

        {message && <p className="success-banner">{message}</p>}
        {error && <p className="error-banner">{error}</p>}

        <div className="admin-tickets-section">
          {loading ? (
            <p className="loading-text">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <p>No incident reports found.</p>
            </div>
          ) : (
            <div className="ticket-details-list">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="ticket-detail-card">
                  <div className="card-header">
                    <span className={`status-pill ${ticket.status?.toLowerCase() || 'pending'}`}>
                      {ticket.status}
                    </span>
                    <span className="date-text">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="card-body">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Category</span>
                        <span className="value">{ticket.category}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Priority</span>
                        <span className={`priority-value ${ticket.priority?.toLowerCase() || 'medium'}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">Contact</span>
                        <span className="value">{ticket.contactDetails}</span>
                      </div>
                    </div>
                    
                    <div className="description-box">
                      <span className="label">Description</span>
                      <p>{ticket.description}</p>
                    </div>
                  </div>

                  <div className="card-footer">
                    {ticket.status === "PENDING" ? (
                      <div className="admin-actions-area">
                        <textarea 
                          placeholder="Add administrative comment/resolution..." 
                          value={actionData.id === ticket.id ? actionData.comment : ""}
                          onChange={(e) => setActionData({ id: ticket.id, comment: e.target.value })}
                        />
                        <div className="action-buttons">
                          <button className="btn-accept" onClick={() => handleAction(ticket.id, "ACCEPTED")}>Approve & Resolve</button>
                          <button className="btn-reject" onClick={() => handleAction(ticket.id, "REJECTED")}>Reject</button>
                        </div>
                      </div>
                    ) : (
                      <div className="resolution-info">
                        <span className="label">Administrative Feedback:</span>
                        <p className="resolution-text">{ticket.adminComment || "No comment provided."}</p>
                      </div>
                    )}
                    <div className="card-secondary-actions">
                      <Link to={`/ticket/${ticket.id}`} className="view-link">Open Full Details</Link>
                      <button onClick={() => handleDelete(ticket.id)} className="btn-delete-card">Remove Record</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-page { background: white; color: var(--text); }
        .dashboard-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; }
        .subtitle { color: var(--text-muted); font-size: 1.1rem; margin-bottom: 3rem; }
        
        .ticket-details-list { display: flex; flex-direction: column; gap: 2.5rem; }
        .ticket-detail-card { background: white; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); padding: 2.5rem; }
        
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .status-pill { padding: 0.4rem 1.2rem; border-radius: 2rem; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; }
        .status-pill.pending { background: #fef3c7; color: #d97706; }
        .status-pill.accepted { background: #dcfce7; color: #16a34a; }
        .status-pill.rejected { background: #fee2e2; color: #dc2626; }
        
        .date-text { color: var(--text-muted); font-size: 0.9rem; font-weight: 500; }
        
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
        .info-item { display: flex; flex-direction: column; gap: 0.4rem; }
        .label { color: var(--text-muted); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .value { color: var(--text-h); font-weight: 600; }
        
        .priority-value.high { color: #ef4444; }
        .priority-value.medium { color: #f59e0b; }
        .priority-value.low { color: #10b981; }

        .description-box { background: #f8fafc; padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid #f1f5f9; }
        .description-box p { color: var(--text); line-height: 1.7; margin-top: 0.5rem; }

        .card-footer { background: #fcfcfc; padding: 2rem; border-radius: 1.2rem; border: 1px solid var(--border); }
        .admin-actions-area textarea { width: 100%; border: 1px solid var(--border); border-radius: 1rem; padding: 1rem; margin-bottom: 1rem; resize: vertical; min-height: 100px; box-sizing: border-box; }
        .action-buttons { display: flex; gap: 1rem; }
        .btn-accept { background: var(--primary); color: white; flex: 1; padding: 0.9rem; border-radius: 0.8rem; border: none; font-weight: 700; cursor: pointer; transition: background 0.2s; }
        .btn-accept:hover { background: #2563eb; }
        .btn-reject { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; flex: 1; padding: 0.9rem; border-radius: 0.8rem; font-weight: 700; cursor: pointer; }
        
        .resolution-text { color: #16a34a; font-weight: 600; font-style: italic; margin-top: 0.5rem; }
        
        .card-secondary-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
        .view-link { font-weight: 700; font-size: 0.9rem; }
        .btn-delete-card { background: none; border: none; color: #ef4444; font-weight: 600; cursor: pointer; font-size: 0.9rem; }
      `}</style>
    </div>
  );
};

export default AdminAllTickets;
