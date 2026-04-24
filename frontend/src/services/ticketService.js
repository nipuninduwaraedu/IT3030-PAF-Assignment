import axios from "axios";

const API_URL = "http://localhost:8080/api/tickets";

const createTicket = async (formData) => {
  return await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getStudentTickets = async (studentId) => {
  return await axios.get(`${API_URL}/student/${studentId}`);
};

const getAllTickets = async () => {
  return await axios.get(API_URL);
};

const getTicketById = async (id) => {
  return await axios.get(`${API_URL}/${id}`);
};

const updateTicket = async (id, formData) => {
  return await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteTicket = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

const updateTicketAction = async (id, status, comment) => {
  const params = new URLSearchParams();
  params.append("status", status);
  params.append("comment", comment);
  return await axios.patch(`${API_URL}/${id}/action`, params);
};

export default {
  createTicket,
  getStudentTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  updateTicketAction,
};
