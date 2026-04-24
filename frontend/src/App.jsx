import { useState } from 'react';
import FacilitiesPage from './pages/FacilitiesPage';

function App() {
  const [role, setRole] = useState('STUDENT');

  const navStyle = {
    backgroundColor: '#1a237e',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  };

  const navLeftStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '32px'
  };

  const navTitleStyle = {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '16px 0',
  };

  const navBtnStyle = {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: 'none',
    padding: '8px 18px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    borderBottom: '3px solid white',
    borderRadius: '4px'
  };

  const roleSwitcherStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const roleLabelStyle = {
    color: '#cfd8dc',
    fontSize: '13px',
    fontWeight: 'bold'
  };

  const roleSelectStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '13px',
    backgroundColor: role === 'ADMIN' ? '#ff6f00' : '#00897b',
    color: 'white',
    cursor: 'pointer'
  };

  const badgeStyle = {
    backgroundColor: role === 'ADMIN' ? '#ff6f00' : '#00897b',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold'
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <nav style={navStyle}>
        <div style={navLeftStyle}>
          <span style={navTitleStyle}>🏫 Smart Campus Operations Hub</span>
          <button style={navBtnStyle}>Facilities & Assets</button>
        </div>

        <div style={roleSwitcherStyle}>
          <span style={roleLabelStyle}>Demo Role:</span>
          <select
            style={roleSelectStyle}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="STUDENT">STUDENT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <span style={badgeStyle}>{role}</span>
        </div>
      </nav>

      <main>
        <FacilitiesPage role={role} />
      </main>
    </div>
  );
}

export default App;