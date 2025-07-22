import { create } from 'zustand';
import type { ModalState } from '../types/modalProps';

const useModalStore = create<ModalState>((set) => ({
  modals: {},
  
  openModal: (modalID, modalProps = {}) => set((state) => ({
    modals: {
      ...state.modals,
      [modalID]: {
        ...modalProps,
        isOpen: true,
      }
    }
  })),
  
  closeModal: (modalID) => set((state) => {
    const currentModal = state.modals[modalID];
    if (!currentModal) return state;
    
    currentModal.onClose?.();
    
    return {
      modals: {
        ...state.modals,
        [modalID]: {
          ...currentModal,
          isOpen: false
        }
      }
    };
  }),
  
  closeAllModals: () => set((state) => {
    Object.values(state.modals).forEach(modal => {
      if (modal.isOpen) modal.onClose?.();
    });
    return { modals: {} };
  }),
}));

export default useModalStore;