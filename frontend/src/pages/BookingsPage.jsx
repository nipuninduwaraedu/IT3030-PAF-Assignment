import React, { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';
// Assuming resourceService exists as per instructions
import { getResources } from '../services/resourceService';
import BookingCard from '../components/bookings/BookingCard';
import BookingForm from '../components/bookings/BookingForm';
import RejectModal from '../components/bookings/RejectModal';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'all'
  const [showForm, setShowForm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingBookingId, setRejectingBookingId] = useState(null);
  const [adminStatusFilter, setAdminStatusFilter] = useState('');

  // Hardcoded for testing both tabs as requested
  const isAdmin = true;

  const fetchData = async (tab, statusFilter = '') => {
    setLoading(true);
    setError(null);
    try {
      if (tab === 'my') {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } else {
        const filters = statusFilter ? { status: statusFilter } : {};
        const data = await bookingService.getAllBookings(filters);
        setBookings(data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Fetch active resources for the form dropdown
        const resData = await getResources({ status: 'ACTIVE' });
        setResources(resData);
        
        // Initial fetch for "My Bookings"
        await fetchData('my');
      } catch (err) {
        setError('Failed to initialize page data');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAdminStatusFilter('');
    fetchData(tab);
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setAdminStatusFilter(status);
    fetchData('all', status);
  };

  const handleApprove = async (id) => {
    try {
      await bookingService.approveBooking(id);
      fetchData(activeTab, adminStatusFilter);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve booking');
    }
  };

  const handleRejectClick = (id) => {
    setRejectingBookingId(id);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (reason) => {
    try {
      await bookingService.rejectBooking(rejectingBookingId, reason);
      setShowRejectModal(false);
      setRejectingBookingId(null);
      fetchData(activeTab, adminStatusFilter);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject booking');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this booking?')) {
      try {
        await bookingService.cancelBooking(id);
        fetchData(activeTab, adminStatusFilter);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to cancel booking');
      }
    }
  };

  const handleFormSubmit = async (data) => {
    setError(null);
    try {
      await bookingService.createBooking(data);
      setShowForm(false);
      // Success: switch to "my" tab and refresh
      setActiveTab('my');
      fetchData('my');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Conflict: this resource is already booked for that time');
      } else {
        setError(err.response?.data?.error || 'Failed to create booking');
      }
    }
  };

  // Inline Styles
  const pageContainerStyle = {
    padding: '24px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    borderBottom: '1px solid #ddd',
  };

  const getTabButtonStyle = (tab) => ({
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid #333' : 'none',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    fontSize: '16px',
  });

  const newBookingButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const errorBannerStyle = {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #f5c6cb',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    padding: '20px',
  };

  const filterContainerStyle = {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  return (
    <div style={pageContainerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0 }}>Booking Management</h1>
        <button 
          style={newBookingButtonStyle} 
          onClick={() => setShowForm(true)}
        >
          New Booking
        </button>
      </div>

      <div style={tabContainerStyle}>
        <button style={getTabButtonStyle('my')} onClick={() => handleTabChange('my')}>
          My Bookings
        </button>
        <button style={getTabButtonStyle('all')} onClick={() => handleTabChange('all')}>
          All Bookings
        </button>
      </div>

      {error && (
        <div style={errorBannerStyle}>
          <span>{error}</span>
          <button 
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#721c24' }} 
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      {activeTab === 'all' && (
        <div style={filterContainerStyle}>
          <label style={{ fontWeight: 'bold' }}>Status Filter:</label>
          <select 
            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
            value={adminStatusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
          Loading...
        </div>
      ) : (
        <div>
          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#999' }}>
              No bookings found
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isAdmin={isAdmin}
                onApprove={handleApprove}
                onReject={handleRejectClick}
                onCancel={handleCancel}
              />
            ))
          )}
        </div>
      )}

      {/* Booking Form Modal */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <BookingForm 
            resources={resources} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal 
          onConfirm={handleRejectConfirm} 
          onCancel={() => {
            setShowRejectModal(false);
            setRejectingBookingId(null);
          }} 
        />
      )}
    </div>
  );
};

export default BookingsPage;
