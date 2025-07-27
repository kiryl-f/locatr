import React from 'react';
import styles from './RegionPicker.module.scss';
import type { AvaliableRegion } from '../../types/regions';
import CustomSelect from '../common/CustomSelect/CustomSelect';

type RegionPickerProps = {
  region: AvaliableRegion;
  onChange: (value: AvaliableRegion) => void;
};

const regionOptions = [
  { value: 'europe', label: 'Europe' },
  { value: 'usa', label: 'USA' },
];

export const RegionPicker: React.FC<RegionPickerProps> = ({ region, onChange }) => {
  const handleSelectChange = (value: string) => {
    // Wrap it in a synthetic event only if needed, or just call onChange directly
    onChange(value as AvaliableRegion);
  };

  return (
    <div className={styles.regionPickerContainer}>
      <CustomSelect
        label="Region:"
        value={region}
        onChange={handleSelectChange}
        options={regionOptions}
      />
    </div>
  );
};
