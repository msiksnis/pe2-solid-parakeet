import axios from "axios";

// Axios instance with base URL and timeout
const axiosInstance = axios.create({
  baseURL: "https://v2.api.noroff.dev/holidaze",
  timeout: 5000, // Set a timeout of 5 seconds
});

export default axiosInstance;
