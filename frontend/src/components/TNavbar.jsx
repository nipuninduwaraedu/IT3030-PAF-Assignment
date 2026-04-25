import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const TNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = authService.getCurrentUser() || { role: "STUDENT" }; 

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar main-navbar">
      <h2>{user.role === "ADMIN" ? "Campus Admin Hub" : "Smart Campus Hub"}</h2>
      <div className="nav-links">
        {user.role === "STUDENT" ? (
          <>
            <Link to="/student-dashboard" className={isActive("/student-dashboard") ? "active" : ""}>Dashboard</Link>
            <Link to="/my-tickets" className={isActive("/my-tickets") ? "active" : ""}>Incident Tracking</Link>
            <Link to="/create-ticket" className={isActive("/create-ticket") ? "active" : ""}>Report Issue</Link>
            <Link to="#" className="placeholder-link">Other Services</Link>
          </>
        ) : (
          <>
            <Link to="/admin" className={isActive("/admin") ? "active" : ""}>Overview</Link>
            <Link to="/admin/tickets" className={isActive("/admin/tickets") ? "active" : ""}>Management</Link>
          </>
        )}
        <button onClick={handleLogout} className="btn-logout-nav">
          Logout
        </button>
      </div>

      <style jsx>{`
        .main-navbar {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
          padding: 1rem 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }
        .main-navbar h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-links a {
          color: var(--text-muted);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
          font-size: 0.95rem;
        }
        .nav-links a:hover, .nav-links a.active {
          color: var(--primary);
        }
        .placeholder-link {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-logout-nav {
          margin-left: 1rem;
          background: #fee2e2;
          color: #ef4444;
          border: 1px solid #fecaca;
          padding: 0.4rem 1.2rem;
          border-radius: 0.6rem;
          cursor: pointer;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .btn-logout-nav:hover {
          background: #fecaca;
        }
      `}</style>
    </nav>
  );
};

export default TNavbar;
