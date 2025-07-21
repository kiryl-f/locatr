import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.scss';

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
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && highlighted === -1) {
      const idx = options.findIndex(opt => opt.value === value);
      setHighlighted(idx);
    }
  }, [open, value, options, highlighted]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleSelect(option: Option) {
    onChange(option.value);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!open && (e.key === 'Enter' || e.key === ' ')) {
      setOpen(true);
      e.preventDefault();
    } else if (open) {
      if (e.key === 'ArrowDown') {
        setHighlighted(h => Math.min(options.length - 1, h + 1));
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        setHighlighted(h => Math.max(0, h - 1));
        e.preventDefault();
      } else if (e.key === 'Enter' && highlighted >= 0) {
        handleSelect(options[highlighted]);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setOpen(false);
        e.preventDefault();
      }
    }
  }

  return (
    <div className={styles.customSelectContainer} ref={containerRef} tabIndex={0} onKeyDown={handleKeyDown}>
      {label && <label className={styles.customSelectLabel}>{label}</label>}
      <div
        className={styles.customSelect}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
      >
        <span className={styles.customSelectValue}>
          {options.find(opt => opt.value === value)?.label || ''}
        </span>
        <span className={styles.customSelectArrow}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <ul className={styles.customSelectDropdown} role="listbox">
          {options.map((option, idx) => (
            <li
              key={option.value}
              className={
                styles.customSelectOption +
                (option.value === value ? ' ' + styles.selected : '') +
                (idx === highlighted ? ' ' + styles.highlighted : '')
              }
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setHighlighted(idx)}
              onMouseDown={e => { e.preventDefault(); handleSelect(option); }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 