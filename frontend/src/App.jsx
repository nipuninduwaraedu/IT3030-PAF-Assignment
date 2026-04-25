import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TCreateTicket from "./pages/TCreateTicket";
import TEditTicket from "./pages/TEditTicket";
import TMyTickets from "./pages/TMyTickets";
import TTicketDetails from "./pages/TTicketDetails";
import TAdminDashboard from "./pages/TAdminDashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/create-ticket" />} />
          <Route path="/create-ticket" element={<TCreateTicket />} />
          <Route path="/edit-ticket/:id" element={<TEditTicket />} />
          <Route path="/my-tickets" element={<TMyTickets />} />
          <Route path="/ticket/:id" element={<TTicketDetails />} />
          <Route path="/admin" element={<TAdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;