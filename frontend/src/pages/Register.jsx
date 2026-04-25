import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authService.register(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      );
      setMessage("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.response?.data || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'white' }}>
      <div className="form-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid var(--border)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2.5rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem', fontWeight: 800 }}>
          Create an Account
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-h)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.9rem 1.2rem', border: '1px solid var(--border)', borderRadius: '0.8rem', boxSizing: 'border-box' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-h)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.9rem 1.2rem', border: '1px solid var(--border)', borderRadius: '0.8rem', boxSizing: 'border-box' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-h)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.9rem 1.2rem', border: '1px solid var(--border)', borderRadius: '0.8rem', boxSizing: 'border-box' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-h)', marginBottom: '0.6rem', textTransform: 'uppercase' }}>Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.9rem 1.2rem', border: '1px solid var(--border)', borderRadius: '0.8rem', background: 'white' }}
            >
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-submit" 
            style={{ 
              width: '100%', 
              padding: '1rem', 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.8rem', 
              fontWeight: 700, 
              fontSize: '1rem', 
              cursor: 'pointer' 
            }}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        {message && <p className={`message ${message.includes("successfully") ? "success" : "error"}`} style={{ textAlign: 'center', marginTop: '1.5rem', fontWeight: 600, color: message.includes("successfully") ? 'var(--success)' : 'var(--error)' }}>{message}</p>}
        <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
