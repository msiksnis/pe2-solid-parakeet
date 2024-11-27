import { useAuthStore } from "@/hooks/useAuthStore";
import axios from "axios";

export const authClient = axios.create({
  baseURL: "https://v2.api.noroff.dev/auth",
  timeout: 5000,
});

// For unauthenticated requests
const axiosInstance = axios.create({
  baseURL: "https://v2.api.noroff.dev/holidaze",
  timeout: 5000,
});

// For authenticated requests
const authenticatedAxiosInstance = axios.create({
  baseURL: "https://v2.api.noroff.dev/holidaze",
  timeout: 5000,
});

authenticatedAxiosInstance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();

    const apiKey = import.meta.env.VITE_API_KEY;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (apiKey) {
      config.headers["X-Noroff-API-Key"] = apiKey;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { axiosInstance, authenticatedAxiosInstance };
