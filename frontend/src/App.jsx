import { useState } from 'react';
import FacilitiesPage from './pages/FacilitiesPage';

function App() {
  const [activePage, setActivePage] = useState('facilities');

  const navStyle = {
    backgroundColor: '#1a237e',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };

  const navTitleStyle = {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '16px 0',
    marginRight: '24px'
  };

  const navBtnStyle = (page) => ({
    backgroundColor: activePage === page ? 'rgba(255,255,255,0.2)' : 'transparent',
    color: 'white',
    border: 'none',
    padding: '16px 16px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: activePage === page ? 'bold' : 'normal',
    borderBottom: activePage === page ? '3px solid white' : '3px solid transparent'
  });

  const renderPage = () => {
    switch (activePage) {
      case 'facilities':
        return <FacilitiesPage />;
      default:
        return <FacilitiesPage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={navStyle}>
        <span style={navTitleStyle}>🏫 Smart Campus Operations Hub</span>
        <button style={navBtnStyle('facilities')} onClick={() => setActivePage('facilities')}>
          Facilities & Assets
        </button>
      </nav>

      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;