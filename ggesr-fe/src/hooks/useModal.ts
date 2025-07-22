import { useCallback } from 'react';
import useModalStore from '../zustand/modalStore';

const useModal = (modalID: string) => {
  const { openModal, closeModal, isModalOpen } = useModalStore();
  
  const open = useCallback(() => {
    openModal(modalID);
  }, [modalID, openModal]);
  
  const close = useCallback(() => {
    closeModal(modalID);
  }, [modalID, closeModal]);
  
  const isOpen = isModalOpen(modalID);
  
  return { open, close, isOpen };
};

export default useModal;