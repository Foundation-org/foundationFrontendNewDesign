import axios from "axios";

export const url = "http://localhost:7354";

const BASE_URL = url;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
