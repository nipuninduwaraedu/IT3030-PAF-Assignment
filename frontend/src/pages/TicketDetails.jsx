import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ticketService from "../services/ticketService";

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await ticketService.getTicketById(id);
        setTicket(response.data);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) return <div className="page-container">Loading...</div>;
  if (!ticket) return <div className="page-container">Ticket not found.</div>;

  return (
    <div className="page-container">
      <nav className="navbar">
        <h2>Smart Campus</h2>
        <div className="nav-links">
          <Link to="/create-ticket">Report Issue</Link>
          <Link to="/my-tickets">My Tickets</Link>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      <div className="details-card">
        <Link to="/my-tickets" className="back-link">← Back to List</Link>
        
        <div className="details-header">
          <h1>{ticket.category} Ticket</h1>
          <div className={`status-pill ${ticket.status.toLowerCase()}`}>{ticket.status}</div>
        </div>

        <div className="details-body">
          <section>
            <label>Description</label>
            <p>{ticket.description}</p>
          </section>

          <div className="details-grid">
            <div>
              <label>Priority</label>
              <p className={ticket.priority.toLowerCase()}>{ticket.priority}</p>
            </div>
            <div>
              <label>Reported On</label>
              <p>{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <label>Contact</label>
              <p>{ticket.contactDetails}</p>
            </div>
          </div>

          {ticket.imageUrls && ticket.imageUrls.length > 0 && (
            <section className="image-section">
              <label>Attached Images</label>
              <div className="image-gallery">
                {ticket.imageUrls.map((url, index) => (
                  <img 
                    key={index} 
                    src={`http://localhost:8080${url}`} 
                    alt={`Ticket visual ${index + 1}`} 
                    className="gallery-img"
                    onClick={() => window.open(`http://localhost:8080${url}`, '_blank')}
                  />
                ))}
              </div>
            </section>
          )}

          {ticket.adminComment && (
            <section className="admin-feedback">
              <label>Admin Feedback</label>
              <p className="comment-box">{ticket.adminComment}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
