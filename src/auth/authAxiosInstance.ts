import axios from "axios";

export const authClient = axios.create({
  baseURL: "https://v2.api.noroff.dev/auth",
  timeout: 5000,
});
