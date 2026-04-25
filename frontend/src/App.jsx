import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Default route to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/create-ticket" element={<TCreateTicket />} />
          <Route path="/edit-ticket/:id" element={<TEditTicket />} />
          <Route path="/my-tickets" element={<TMyTickets />} />
          <Route path="/ticket/:id" element={<TTicketDetails />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tickets" element={<AdminAllTickets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;