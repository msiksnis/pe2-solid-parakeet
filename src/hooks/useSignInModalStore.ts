import { create } from "zustand";

interface ModalState {
  isSignInModalOpen: boolean;
  openSignInModal: () => void;
  closeSignInModal: () => void;
}

export const useSignInModalStore = create<ModalState>((set) => ({
  isSignInModalOpen: false,
  openSignInModal: () => set({ isSignInModalOpen: true }),
  closeSignInModal: () => set({ isSignInModalOpen: false }),
}));
