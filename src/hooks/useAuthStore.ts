import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Avatar {
  url: string;
  alt: string;
}

interface AuthState {
  token: string | null;
  userName: string | null;
  bio: string | null;
  venueManager: boolean;
  userAvatar: Avatar | null;
  setAuth: (
    token: string,
    name: string,
    bio: string,
    avatar: Avatar,
    venueManager: boolean,
  ) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      bio: null,
      userAvatar: null,
      venueManager: false,
      setAuth: (token, name, bio, avatar, venueManager) => {
        set({ token, userName: name, bio, userAvatar: avatar, venueManager });
      },
      clearAuth: () => {
        set({
          token: null,
          userName: null,
          bio: null,
          userAvatar: null,
          venueManager: false,
        });
      },
    }),
    {
      name: "auth-object",
    },
  ),
);
