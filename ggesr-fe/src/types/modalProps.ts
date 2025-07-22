import type { ReactNode } from "react";

export type ModalProps = {
  modalID: string;
  title?: string;
  onClose?: () => void;
  children?: ReactNode;
};

export type ModalComponent = React.ComponentType<ModalProps>;

export type ModalState = {
  modals: Record<string, Omit<ModalProps, 'modalID'> & { isOpen: boolean }>;
  openModal: (modalID: string, modalProps?: Omit<ModalProps, 'modalID'>) => void;
  closeModal: (modalID: string) => void;
  closeAllModals: () => void;
};

export type UseModalReturn = {
  open: (props?: Omit<ModalProps, 'modalID'>) => void;
  close: () => void;
  isOpen: boolean;
};