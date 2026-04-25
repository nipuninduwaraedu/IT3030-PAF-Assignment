import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ticketService from "../services/ticketService";

const TMyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const studentId = "ST12345"; // Mock ID

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await ticketService.getStudentTickets(studentId);
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await ticketService.deleteTicket(id);
        setTickets(tickets.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    }
  };

  return (
    <div className="page-container">
      <nav className="navbar">
        <h2>Smart Campus</h2>
        <div className="nav-links">
          <Link to="/create-ticket">Report Issue</Link>
          <Link to="/my-tickets" className="active">My Tickets</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      <div className="content-area">
        <h1>My Tickets</h1>
        <p className="subtitle">Track the status of your reported issues.</p>

        {loading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <p>You haven't reported any issues yet.</p>
            <Link to="/create-ticket" className="btn-primary">Report an Issue</Link>
          </div>
        ) : (
          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className={`status-badge ${ticket.status.toLowerCase()}`}>
                  {ticket.status}
                </div>
                <h3>{ticket.category}</h3>
                <p className="ticket-desc">{ticket.description.substring(0, 100)}...</p>
                <div className="ticket-meta">
                  <span>Priority: <strong className={ticket.priority.toLowerCase()}>{ticket.priority}</strong></span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="card-actions">
                  <Link to={`/ticket/${ticket.id}`} className="btn-details">View</Link>
                  {ticket.status === "PENDING" && (
                    <>
                      <Link to={`/edit-ticket/${ticket.id}`} className="btn-edit">Edit</Link>
                      <button onClick={() => handleDelete(ticket.id)} className="btn-delete-small">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TMyTickets;
