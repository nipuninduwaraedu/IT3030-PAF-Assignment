import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ticketService from "../services/ticketService";
import TNavbar from "../components/TNavbar";

const TEditTicket = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    priority: "",
    contactDetails: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await ticketService.getTicketById(id);
        const { category, description, priority, contactDetails } = response.data;
        setFormData({ category, description, priority, contactDetails });
      } catch (error) {
        console.error("Error fetching ticket:", error);
        setMessage("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const data = new FormData();
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("priority", formData.priority);
    data.append("contactDetails", formData.contactDetails);
    
    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      await ticketService.updateTicket(id, data);
      setMessage("Ticket updated successfully!");
      setTimeout(() => navigate("/my-tickets"), 2000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <TNavbar />

      <div className="form-card">
        <Link to="/my-tickets" className="back-link">← Cancel</Link>
        <h1>Edit Ticket</h1>
        <p className="subtitle">Update the details of your report.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="Electrical">Electrical</option>
              <option value="IT">IT</option>
              <option value="Furniture">Furniture</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact Details</label>
              <input
                type="text"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Add More Images (Optional)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? "Updating..." : "Update Ticket"}
          </button>
        </form>

        {message && <p className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
};

export default TEditTicket;
