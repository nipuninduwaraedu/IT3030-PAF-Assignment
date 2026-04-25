import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

export const getResources = async (filters = {}) => {
  const response = await api.get('/resources', { params: filters });
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export default {
  getResources,
  getResourceById,
};
