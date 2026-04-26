import React from "react";

const GoogleAccountModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const mockAccounts = [
    { email: "damitha.dev@gmail.com", name: "Damitha Dev", avatar: "D" },
    { email: "campus.student@gmail.com", name: "Campus Student", avatar: "C" },
    { email: "guest.user@gmail.com", name: "Guest User", avatar: "G" },
  ];

  return (
    <div className="google-modal-overlay">
      <div className="google-modal-card">
        <div className="modal-header">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-logo" />
          <h3>Choose an account</h3>
          <p>to continue to Smart Campus Hub</p>
        </div>

        <div className="account-list">
          {mockAccounts.map((account, index) => (
            <div key={index} className="account-item" onClick={() => onSelect(account)}>
              <div className="avatar-circle">{account.avatar}</div>
              <div className="account-info">
                <span className="account-name">{account.name}</span>
                <span className="account-email">{account.email}</span>
              </div>
            </div>
          ))}
          
          <div className="account-item use-another">
            <div className="avatar-circle small">+</div>
            <span className="account-name">Use another account</span>
          </div>
        </div>

        <div className="modal-footer">
          <p>To continue, Google will share your name, email address, language preference, and profile picture with Smart Campus Hub.</p>
        </div>
      </div>

      <style jsx>{`
        .google-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .google-modal-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 8px;
          padding: 2.5rem 0;
          box-shadow: 0 12px 24px rgba(0,0,0,0.2);
          font-family: 'Roboto', sans-serif;
        }
        .modal-header {
          text-align: center;
          padding: 0 2.5rem;
          margin-bottom: 2rem;
        }
        .google-logo { width: 24px; margin-bottom: 1rem; }
        .modal-header h3 { font-size: 1.5rem; margin: 0; font-weight: 400; color: #202124; }
        .modal-header p { margin: 0.5rem 0 0; color: #3c4043; font-size: 1rem; }

        .account-list {
          border-top: 1px solid #dadce0;
          border-bottom: 1px solid #dadce0;
          margin-bottom: 1.5rem;
        }
        .account-item {
          display: flex;
          align-items: center;
          padding: 12px 2.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .account-item:hover { background: #f8f9fa; }
        
        .avatar-circle {
          width: 32px;
          height: 32px;
          background: #1a73e8;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 12px;
          font-size: 0.9rem;
        }
        .account-info { display: flex; flex-direction: column; }
        .account-name { font-size: 0.9rem; font-weight: 500; color: #3c4043; }
        .account-email { font-size: 0.8rem; color: #70757a; }

        .use-another { padding-top: 16px; padding-bottom: 16px; }
        .avatar-circle.small { background: none; border: 1px solid #dadce0; color: #3c4043; font-size: 1.2rem; font-weight: 300; }

        .modal-footer { padding: 0 2.5rem; }
        .modal-footer p { font-size: 0.75rem; color: #70757a; line-height: 1.4; }
      `}</style>
    </div>
  );
};

export default GoogleAccountModal;
