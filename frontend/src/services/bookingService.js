import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'X-User-Id': 'temp-user-id-123',
    'X-User-Email': 'testuser@example.com',
  },
});

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

export const getAllBookings = async (filters = {}) => {
  // Remove null/undefined values from filters
  const params = Object.keys(filters).reduce((acc, key) => {
    if (filters[key] !== null && filters[key] !== undefined) {
      acc[key] = filters[key];
    }
    return acc;
  }, {});

  const response = await api.get('/bookings', { params });
  return response.data;
};

export const createBooking = async (data) => {
  const response = await api.post('/bookings', data);
  return response.data;
};

export const approveBooking = async (id) => {
  const response = await api.patch(`/bookings/${id}/approve`);
  return response.data;
};

export const rejectBooking = async (id, reason) => {
  const response = await api.patch(`/bookings/${id}/reject`, { reason });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.patch(`/bookings/${id}/cancel`);
  return response.data;
};

export default {
  getMyBookings,
  getAllBookings,
  createBooking,
  approveBooking,
  rejectBooking,
  cancelBooking,
};
