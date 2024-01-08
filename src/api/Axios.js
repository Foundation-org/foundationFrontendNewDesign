import axios from "axios";
import Cookies from 'js-cookie'

export const url = import.meta.env.VITE_API_URL;

const BASE_URL = url;

const api = axios.create({
  // withCredentials: true,
  baseURL: BASE_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("jwt");
    const token = Cookies.get("jwt");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
