import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const register = async (username, email, password, role) => {
  return await axios.post(`${API_URL}/register`, {
    username,
    email,
    password,
    role,
  });
};

const login = async (username, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });
  if (response.data.id) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const socialLogin = async (email, name) => {
  // In a real app, this would send the Google ID token to the backend
  const response = await axios.post(`${API_URL}/social-login`, {
    email,
    name,
  });
  if (response.data.id) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export default {
  register,
  login,
  socialLogin,
  logout,
  getCurrentUser,
};
