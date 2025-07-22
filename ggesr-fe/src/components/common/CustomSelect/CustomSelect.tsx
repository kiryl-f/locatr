import { useCallback, useRef } from 'react';
import styles from './CustomSelect.module.scss';
import { useDropdown } from '../../../hooks/useDropdown';
import { useHighlightedIndex } from '../../../hooks/useHighlightedIndex';
import { useKeyboardNavigation } from '../../../hooks/useKeyboardNavigation';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
}

export default function CustomSelect({ value, onChange, options, label }: CustomSelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOpen, toggle, close } = useDropdown(containerRef);
  
  const { highlightedIndex, setHighlightedIndex } = useHighlightedIndex({
    isOpen,
    items: options,
    value,
    getItemValue: (option) => option.value
  });

  const handleSelectIndex = useCallback((index: number) => {
    setHighlightedIndex(index);
    onChange(options[index].value);
  }, [onChange, options, setHighlightedIndex]);

  const handleKeyDown = useKeyboardNavigation({
    isOpen,
    itemCount: options.length,
    highlightedIndex,
    onSelect: handleSelectIndex,
    onOpen: toggle,
    onClose: close
  });

  const handleSelect = useCallback((option: Option) => {
    onChange(option.value);
    close();
  }, [onChange, close]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div 
      className={styles.customSelectContainer} 
      ref={containerRef} 
      tabIndex={0} 
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-label={label || 'Select an option'}
    >
      {label && <label className={styles.customSelectLabel}>{label}</label>}
      
      <div
        className={`${styles.customSelect} ${isOpen ? styles.customSelectOpen : ''}`}
        onClick={toggle}
        tabIndex={-1}
      >
        <span className={styles.customSelectValue}>
          {selectedOption?.label || ''}
        </span>
        <span className={styles.customSelectArrow}>
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {isOpen && (
        <ul className={`${styles.customSelectDropdown} ${isOpen ? styles.open : ''}`} role="listbox">
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`
                ${styles.customSelectOption}
                ${option.value === value ? styles.selected : ''}
                ${index === highlightedIndex ? styles.highlighted : ''}
              `}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(option);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}