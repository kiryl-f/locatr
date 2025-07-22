import { useEffect } from 'react';
import styles from './Modal.module.scss';
import type { ModalProps } from '../../../types/modalProps';
import useModal from '../../../hooks/useModal';

const Modal = ({
    modalID,
    title,
    onClose,
    children,
}: ModalProps) => {
    const { isOpen, close } = useModal(modalID)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, close]);

    const handleClose = () => {
        onClose?.();
        close();
    }

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.modalContent}>
                    {title && <h2 className={styles.title}>{title}</h2>}
                    <button className={styles.closeButton} onClick={handleClose}>
                        ×
                    </button>
                    <div className={styles.modalBody}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;