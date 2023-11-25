import axios from "axios";

export const url = import.meta.env.VITE_API_URL;

const BASE_URL = url;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
