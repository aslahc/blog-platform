import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Change to your backend URL

// Register user
export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};
