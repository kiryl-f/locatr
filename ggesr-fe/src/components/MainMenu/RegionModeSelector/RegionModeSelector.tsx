import styles from "./RegionModeSelector.module.scss";
import CustomSelect from "../../common/CustomSelect/CustomSelect";

type RegionModeSelectorProps = {
  region: string;
  setRegion: (region: string) => void;
  mode: string;
  setMode: (mode: string) => void;
};

export default function RegionModeSelector({ region, setRegion, mode, setMode }: RegionModeSelectorProps) {
  const regionOptions = [
    { value: "europe", label: "Europe" },
    { value: "usa", label: "USA" },
  ];
  const modeOptions = [
    { value: "classic", label: "Classic" },
    { value: "timed", label: "Timed" },
  ];
  return (
    <div className={styles.selectorGroup}>
      <CustomSelect
        value={region}
        onChange={setRegion}
        options={regionOptions}
        label="🌐 Region"
      />
      <CustomSelect
        value={mode}
        onChange={setMode}
        options={modeOptions}
        label="🎮 Mode"
      />
    </div>
  );
} 