import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ticketService from "../services/ticketService";
import TNavbar from "../components/TNavbar";

const TCreateTicket = () => {
  const [formData, setFormData] = useState({
    category: "Electrical",
    description: "",
    priority: "LOW",
    contactDetails: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Mock student ID - In a real app, this would come from auth context
  const studentId = "ST12345";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      alert("You can only upload a maximum of 3 images.");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("priority", formData.priority);
    data.append("contactDetails", formData.contactDetails);
    data.append("studentId", studentId);
    
    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      await ticketService.createTicket(data);
      setMessage("Ticket created successfully!");
      setTimeout(() => navigate("/my-tickets"), 2000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <TNavbar />

      <div className="form-card">
        <h1>Report a Problem</h1>
        <p className="subtitle">Fill in the details below to notify the maintenance team.</p>

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
              placeholder="Describe the issue in detail..."
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
                placeholder="Phone or Email"
                value={formData.contactDetails}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Upload Images (Max 3)</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} />
            <div className="image-preview">
              {images.map((img, index) => (
                <div key={index} className="preview-thumb">
                  {img.name}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>

        {message && <p className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
};

export default TCreateTicket;
