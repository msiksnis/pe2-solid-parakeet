import { useAuthStore } from "@/hooks/useAuthStore";

interface AuthStatus {
  isLoggedIn: boolean;
  isVenueManager: boolean;
}

export function useAuthStatus(): AuthStatus {
  const { token, venueManager } = useAuthStore();

  return {
    isLoggedIn: Boolean(token),
    isVenueManager: venueManager,
  };
}

export type AuthContext = ReturnType<typeof useAuthStatus>;
