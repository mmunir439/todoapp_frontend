import axios from "axios";
import { getToken } from "./token";
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Ensure NEXT_PUBLIC_ prefix is used
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;