import { useCallback } from 'react';

interface KeyboardNavigationOptions {
  isOpen: boolean;
  itemCount: number;
  highlightedIndex: number;
  onSelect: (index: number) => void;
  onOpen: () => void;
  onClose: () => void;
}

export function useKeyboardNavigation({
  isOpen,
  itemCount,
  highlightedIndex,
  onSelect,
  onOpen,
  onClose
}: KeyboardNavigationOptions) {
  return useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        onOpen();
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        onSelect(Math.min(itemCount - 1, highlightedIndex + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        onSelect(Math.max(0, highlightedIndex - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) onClose();
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, itemCount, highlightedIndex, onSelect, onOpen, onClose]);
}