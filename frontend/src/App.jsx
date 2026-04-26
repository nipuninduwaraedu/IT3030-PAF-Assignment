import BookingsPage from './pages/BookingsPage';

function App() {
  return (
    <div style={{ padding: "0" }}>
      <BookingsPage />
import FacilitiesPage from "./pages/FacilitiesPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import TCreateTicket from "./pages/TCreateTicket";
import TEditTicket from "./pages/TEditTicket";
import TMyTickets from "./pages/TMyTickets";
import TTicketDetails from "./pages/TTicketDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAllTickets from "./pages/AdminAllTickets";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role") === "admin" ? "ADMIN" : "STUDENT";

  const navStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.25)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  };

  const navTitleStyle = {
    color: "white",
    fontSize: "24px",
    fontWeight: "700",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const badgeStyle = {
    backgroundColor:
      role === "ADMIN" ? "rgba(255, 255, 255, 0.2)" : "rgba(16, 185, 129, 0.2)",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <nav style={navStyle}>
        <h1 style={navTitleStyle}>Smart Campus Hub</h1>
        <span style={badgeStyle}>
          {role === "ADMIN" ? "Administrator" : "Student Portal"}
        </span>
      </nav>
      <main>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tickets" element={<AdminAllTickets />} />
            <Route
              path="/facilities"
              element={<FacilitiesPage role={role} />}
            />
            <Route path="/create-ticket" element={<TCreateTicket />} />
            <Route path="/edit-ticket/:id" element={<TEditTicket />} />
            <Route path="/my-tickets" element={<TMyTickets />} />
            <Route path="/ticket/:id" element={<TTicketDetails />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
