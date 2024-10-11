import axios from "axios";

const API_URL = "https://blog.aslah.online/"; // Set your base URL here
const axiosInstance = axios.create({ baseURL: API_URL });
// Register user
export const signup = async (userData) => {
  console.log("going to singup");
  const response = await axiosInstance.post("/api/auth/signup", userData);
  console.log("get a resposne ", response);
  return response.data;
};

// Login user
export const login = async (userData) => {
  console.log(userData);
  const response = await axiosInstance.post(
    "https://blog.aslah.online/",
    userData
  );
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
