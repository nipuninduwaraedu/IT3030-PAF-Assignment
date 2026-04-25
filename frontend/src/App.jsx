import FacilitiesPage from './pages/FacilitiesPage';

function App() {
  // Read role from URL: ?role=admin or ?role=student
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role') === 'admin' ? 'ADMIN' : 'STUDENT';

  const navStyle = {
    backgroundColor: '#1a237e',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  };

  const navTitleStyle = {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '16px 0',
  };

  const badgeStyle = {
    backgroundColor: role === 'ADMIN' ? '#ff6f00' : '#00897b',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <nav style={navStyle}>
        <span style={navTitleStyle}>🏫 Smart Campus Operations Hub</span>
        <span style={badgeStyle}>
          {role === 'ADMIN' ? '🔧 ADMIN' : '🎓 STUDENT'}
        </span>
      </nav>
      <main>
        <FacilitiesPage role={role} />
      </main>
    </div>
  );
}

export default App;