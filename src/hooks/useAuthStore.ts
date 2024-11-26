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
    avatar: Avatar,
    venueManager: boolean,
    bio?: string,
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
      setAuth: (token, name, avatar, venueManager, bio) => {
        set((state) => ({
          token,
          userName: name,
          userAvatar: avatar,
          venueManager,
          bio: bio !== undefined ? bio : state.bio,
        }));
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
