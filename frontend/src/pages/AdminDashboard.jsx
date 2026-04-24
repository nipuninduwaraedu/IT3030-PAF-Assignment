import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ticketService from "../services/ticketService";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionData, setActionData] = useState({ id: null, comment: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getAllTickets();
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
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

  return (
    <div className="page-container">
      <nav className="navbar">
        <h2>Smart Campus Admin</h2>
        <div className="nav-links">
          <Link to="/create-ticket">Report Issue</Link>
          <Link to="/my-tickets">My Tickets</Link>
          <Link to="/admin" className="active">Admin Dashboard</Link>
        </div>
      </nav>

      <div className="content-area">
        <h1>Admin Management</h1>
        <p className="subtitle">Review and manage reported campus incidents.</p>

        {message && <p className="success-banner">{message}</p>}

        {loading ? (
          <p>Loading tickets...</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td>{ticket.category}</td>
                    <td><span className={`priority-tag ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></td>
                    <td>{ticket.studentId}</td>
                    <td><span className={`status-tag ${ticket.status.toLowerCase()}`}>{ticket.status}</span></td>
                    <td>
                      {ticket.status === "PENDING" ? (
                        <div className="action-cell">
                          <textarea 
                            placeholder="Add comment..." 
                            value={actionData.id === ticket.id ? actionData.comment : ""}
                            onChange={(e) => setActionData({ id: ticket.id, comment: e.target.value })}
                          />
                          <div className="action-buttons">
                            <button className="btn-accept" onClick={() => handleAction(ticket.id, "ACCEPTED")}>Accept</button>
                            <button className="btn-reject" onClick={() => handleAction(ticket.id, "REJECTED")}>Reject</button>
                          </div>
                        </div>
                      ) : (
                        <span className="action-done">Resolved</span>
                      )}
                      <Link to={`/ticket/${ticket.id}`} className="view-link">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
