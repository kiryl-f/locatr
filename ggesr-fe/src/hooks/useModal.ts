import { useCallback } from 'react';
import type { ModalProps, UseModalReturn } from '../types/modalProps';
import useModalStore from '../zustand/modalStore';

const useModal = (modalID: string): UseModalReturn => {
  const { modals, openModal, closeModal } = useModalStore();
  
  const open = useCallback((props?: Omit<ModalProps, 'modalID'>) => {
    openModal(modalID, props);
  }, [modalID, openModal]);
  
  const close = useCallback(() => {
    closeModal(modalID);
  }, [modalID, closeModal]);
  
  const isOpen = modals[modalID]?.isOpen ?? false;
  
  return { open, close, isOpen };
};

export default useModal;