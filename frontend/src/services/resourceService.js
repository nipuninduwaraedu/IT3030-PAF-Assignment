import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

export const getResources = async (filters = {}) => {
  const response = await api.get("/resources", { params: filters });
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (data) => {
  const response = await api.post("/resources", data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await api.put(`/resources/${id}`, data);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};
