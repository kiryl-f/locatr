import React from 'react';
import styles from './RegionPicker.module.scss';

type RegionPickerProps = {
  region: 'europe' | 'usa';
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const RegionPicker: React.FC<RegionPickerProps> = ({ region, onChange }) => (
  <div className={styles.regionPickerContainer}>
    <label htmlFor="region-picker" className={styles.label}>Region:</label>
    <select
      id="region-picker"
      value={region}
      onChange={onChange}
      className={styles.select}
    >
      <option className={styles.select} value="europe">Europe</option>
      <option className={styles.select} value="usa">USA</option>
    </select>
  </div>
); 