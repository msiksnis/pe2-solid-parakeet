import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://v2.api.noroff.dev/holidaze",
  timeout: 5000,
});

export default axiosInstance;

export const authClient = axios.create({
  baseURL: "https://v2.api.noroff.dev/auth",
  timeout: 5000,
});
