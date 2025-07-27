import { create } from 'zustand';

type ModalState = {
  // Just track open/closed status
  openModals: Record<string, boolean>;
  
  openModal: (modalID: string) => void;
  closeModal: (modalID: string) => void;
  closeAllModals: () => void;
  isModalOpen: (modalID: string) => boolean;
};

const useModalStore = create<ModalState>((set, get) => ({
  openModals: {},
  
  openModal: (modalID) => set((state) => ({
    openModals: {
      ...state.openModals,
      [modalID]: true
    }
  })),
  
  closeModal: (modalID) => set((state) => ({
    openModals: {
      ...state.openModals,
      [modalID]: false
    }
  })),
  
  closeAllModals: () => set({ openModals: {} }),
  
  isModalOpen: (modalID) => get().openModals[modalID] || false
}));

export default useModalStore;