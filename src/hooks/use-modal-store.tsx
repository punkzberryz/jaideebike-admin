import { create } from "zustand";

interface useModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => Promise<void>;
  setOnConfirm: (onConfirm: () => Promise<void>) => void;
}

export const useModal = create<useModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  onConfirm: async () => {},
  setOnConfirm: (onConfirm: () => Promise<void>) => set({ onConfirm }),
}));
