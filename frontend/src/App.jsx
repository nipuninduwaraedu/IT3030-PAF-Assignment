import FacilitiesPage from "./pages/FacilitiesPage";

function App() {
  // Read role from URL: ?role=admin or ?role=student
  const params = new URLSearchParams(window.location.search);
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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <nav style={navStyle}>
        <h1 style={navTitleStyle}>
          <span>🏫</span>
          Smart Campus Hub
        </h1>
        <span style={badgeStyle}>
          <span>{role === "ADMIN" ? "🔧" : "🎓"}</span>
          {role === "ADMIN" ? "Administrator" : "Student Portal"}
        </span>
      </nav>
      <main>
        <FacilitiesPage role={role} />
      </main>
    </div>
  );
}

export default App;
