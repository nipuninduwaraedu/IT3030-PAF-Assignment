import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import GoogleAccountModal from "../components/GoogleAccountModal";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await authService.login(formData.username, formData.password);
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSelect = async (account) => {
    setShowGoogleModal(false);
    setLoading(true);
    setError("");
    try {
      const user = await authService.socialLogin(account.email, account.name);
      navigate("/student-dashboard");
    } catch (error) {
      setError("Google authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container login-page">
      <div className="login-card">
        <h2 className="login-title">Register/Sign in</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Enter your username"
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} className="btn-login">
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button onClick={() => setShowGoogleModal(true)} disabled={loading} className="btn-google">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Sign in with Google
        </button>

        {error && <p className="error-text">{error}</p>}

        <p className="register-text">
          New to the campus hub? <Link to="/register">Create an account</Link>
        </p>
      </div>

      <GoogleAccountModal 
        isOpen={showGoogleModal} 
        onClose={() => setShowGoogleModal(false)} 
        onSelect={handleGoogleSelect} 
      />

      <style jsx>{`
        .login-page { display: flex; align-items: center; justify-content: center; background-color: #ffffff; }
        .login-card { width: 100%; max-width: 420px; padding: 3rem; background: white; border-radius: 2rem; box-shadow: 0 20px 40px rgba(0,0,0,0.05); border: 1px solid var(--border); text-align: center; }
        .login-title { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .login-subtitle { color: var(--text-muted); margin-bottom: 2.5rem; font-size: 1rem; }
        .form-group { text-align: left; margin-bottom: 1.5rem; }
        .form-group label { display: block; font-weight: 700; font-size: 0.85rem; color: var(--text-h); margin-bottom: 0.6rem; text-transform: uppercase; }
        .form-group input { width: 100%; padding: 0.9rem 1.2rem; border: 1px solid var(--border); border-radius: 0.8rem; font-size: 1rem; box-sizing: border-box; transition: border-color 0.3s; }
        .form-group input:focus { outline: none; border-color: var(--primary); }
        .btn-login { width: 100%; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 0.8rem; font-weight: 700; font-size: 1rem; cursor: pointer; margin-top: 1rem; transition: all 0.3s; }
        .btn-login:hover { background: #2563eb; transform: translateY(-2px); }
        .divider { margin: 2rem 0; position: relative; border-top: 1px solid var(--border); }
        .divider span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 0 1rem; color: var(--text-muted); font-size: 0.85rem; }
        .btn-google { width: 100%; padding: 0.9rem; background: white; color: var(--text-h); border: 1px solid var(--border); border-radius: 0.8rem; font-weight: 600; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.8rem; transition: all 0.3s; }
        .btn-google:hover { background: #f8fafc; border-color: #cbd5e1; }
        .btn-google img { width: 20px; }
        .error-text { color: var(--error); font-size: 0.9rem; margin-top: 1.5rem; font-weight: 600; }
        .register-text { margin-top: 2.5rem; color: var(--text-muted); font-size: 0.95rem; }
        .register-text a { color: var(--primary); font-weight: 700; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default Login;
