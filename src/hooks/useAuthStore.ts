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
  favorites: string[];
  setAuth: (
    token: string,
    name: string,
    avatar: Avatar,
    venueManager: boolean,
    bio?: string,
  ) => void;
  clearAuth: () => void;
  addFavorite: (venueId: string) => void;
  removeFavorite: (venueId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userName: null,
      bio: null,
      userAvatar: null,
      venueManager: false,
      favorites: [],
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
          favorites: [],
        });
      },
      addFavorite: (venueId) => {
        const { favorites } = get();
        if (!favorites.includes(venueId)) {
          set({ favorites: [...favorites, venueId] });
        }
      },
      removeFavorite: (venueId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((id) => id !== venueId) });
      },
    }),
    {
      name: "auth-object",
    },
  ),
);
