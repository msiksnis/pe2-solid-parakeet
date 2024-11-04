import {
  LoginType,
  RegisterUserResponseType,
  RegisterUserType,
} from "@/auth/UserValidation";
import { authClient } from "@/lib/axiosInstance";

export async function registerUser(
  data: RegisterUserType,
): Promise<RegisterUserResponseType> {
  const response = await authClient.post("/register", data);
  return response.data;
}

export async function loginUser(data: LoginType) {
  const response = await authClient.post("/login?_holidaze=true", data, {
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
    },
  });

  if (response.status === 200) {
    return response.data.data;
  } else {
    throw new Error("Login failed");
  }
}
