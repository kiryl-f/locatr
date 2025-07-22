import { useState, useEffect } from 'react';

interface HighlightedIndexOptions<T> {
  isOpen: boolean;
  items: T[];
  value: string;
  getItemValue: (item: T) => string;
}

export function useHighlightedIndex<T>({
  isOpen,
  items,
  value,
  getItemValue
}: HighlightedIndexOptions<T>) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (isOpen && highlightedIndex === -1) {
      const initialIndex = items.findIndex(item => getItemValue(item) === value);
      setHighlightedIndex(initialIndex);
    }
  }, [isOpen, items, value, getItemValue, highlightedIndex]);

  return { highlightedIndex, setHighlightedIndex };
}