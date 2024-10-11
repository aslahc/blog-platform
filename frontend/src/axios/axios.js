import axios from "axios";

const API_URL = "http://51.21.146.181"; // Set your base URL here
const axiosInstance = axios.create({ baseURL: API_URL });

// Register user
export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, userData);
  return response.data;
};

// Blog operations
export const createBlog = async (blogData) => {
  const response = await axiosInstance.post("/api/blogs", blogData);
  return response.data;
};

// Payment checkout
export const checkoutPayment = async (amount) => {
  const response = await axiosInstance.post("/api/blogs/checkout", {
    amount: amount,
  });
  return response.data;
};

// Add a request interceptor to include the JWT token in the headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      const tokenExpiry = JSON.parse(atob(token.split(".")[1])).exp * 1000;
      if (tokenExpiry < Date.now()) {
        console.error("Token has expired");
        return Promise.reject("Token has expired");
      }

      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
