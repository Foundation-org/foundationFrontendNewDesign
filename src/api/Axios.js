import axios from "axios";

export const url = import.meta.env.VITE_API_URL;

const BASE_URL = url;

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
