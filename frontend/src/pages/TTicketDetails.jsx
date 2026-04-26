import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ticketService from "../services/ticketService";
import authService from "../services/authService";
import TNavbar from "../components/TNavbar";
import AdminNavbar from "../components/AdminNavbar";

const TTicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = authService.getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

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
    <div className="page-container white-theme">
      {isAdmin ? <AdminNavbar /> : <TNavbar />}

      <div className="content-area">
        <div className="details-card">
          <Link to={isAdmin ? "/admin/tickets" : "/my-tickets"} className="back-link">
            ← Back to {isAdmin ? 'All Tickets' : 'My List'}
          </Link>
          
          <div className="details-header">
            <h1>{ticket.category} Incident</h1>
            <div className={`status-pill ${ticket.status.toLowerCase()}`}>{ticket.status}</div>
          </div>

          <div className="details-body">
            <section className="description-section">
              <label>Description</label>
              <div className="description-text">
                {ticket.description}
              </div>
            </section>

            <div className="details-grid">
              <div className="detail-item">
                <label>Priority</label>
                <p className={`priority-text ${ticket.priority.toLowerCase()}`}>{ticket.priority}</p>
              </div>
              <div className="detail-item">
                <label>Reported On</label>
                <p className="date-val">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              <div className="detail-item">
                <label>Contact Info</label>
                <p className="contact-val">{ticket.contactDetails}</p>
              </div>
            </div>

            {ticket.imageUrls && ticket.imageUrls.length > 0 && (
              <section className="image-section">
                <label>Attached Evidence</label>
                <div className="image-gallery">
                  {ticket.imageUrls.map((url, index) => (
                    <img 
                      key={index} 
                      src={`http://localhost:8080${url}`} 
                      alt={`Incident attachment ${index + 1}`} 
                      className="gallery-img"
                      onClick={() => window.open(`http://localhost:8080${url}`, '_blank')}
                    />
                  ))}
                </div>
              </section>
            )}

            {ticket.adminComment && (
              <section className="admin-feedback">
                <label>Administrative Resolution</label>
                <p className="comment-box">{ticket.adminComment}</p>
              </section>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .white-theme { background: white; color: var(--text); }
        .content-area { max-width: 900px; margin: 0 auto; padding: 3rem 5%; }
        
        .details-card { 
          background: white; 
          padding: 3.5rem; 
          border-radius: 2rem; 
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        
        .back-link { color: var(--primary); text-decoration: none; display: inline-block; margin-bottom: 2.5rem; font-weight: 700; transition: transform 0.2s; }
        .back-link:hover { transform: translateX(-5px); }
        
        .details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid #f1f5f9; }
        .details-header h1 { font-size: 2.2rem; font-weight: 800; color: var(--text-h); margin: 0; }
        
        .status-pill { padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 800; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em; }
        .status-pill.pending { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
        .status-pill.accepted { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
        .status-pill.rejected { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }

        .details-body label { display: block; color: var(--text-muted); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.1em; }
        .description-text { background: #f8fafc; padding: 2rem; border-radius: 1.2rem; line-height: 1.8; margin-bottom: 3rem; color: #334155; border: 1px solid #f1f5f9; }

        .details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; margin-bottom: 4rem; }
        .detail-item p { margin: 0; font-weight: 600; color: var(--text-h); font-size: 1.05rem; }
        
        .priority-text.high { color: #ef4444; }
        .priority-text.medium { color: #f59e0b; }
        .priority-text.low { color: #10b981; }

        .image-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
        .gallery-img { width: 100%; height: 180px; object-fit: cover; border-radius: 1.2rem; cursor: pointer; transition: all 0.3s; border: 1px solid var(--border); }
        .gallery-img:hover { transform: translateY(-5px); box-shadow: var(--shadow); }

        .admin-feedback { margin-top: 4rem; padding-top: 2.5rem; border-top: 2px dashed #f1f5f9; }
        .comment-box { background: #f0f9ff; color: #0369a1; padding: 2rem; border-radius: 1.2rem; font-style: italic; font-weight: 500; border: 1px solid #e0f2fe; }
      `}</style>
    </div>
  );
};

export default TTicketDetails;
