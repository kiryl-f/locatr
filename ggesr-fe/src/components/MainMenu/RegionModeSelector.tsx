import styles from "./MainMenu.module.scss";

type RegionModeSelectorProps = {
  region: string;
  setRegion: (region: string) => void;
  mode: string;
  setMode: (mode: string) => void;
};

export default function RegionModeSelector({ region, setRegion, mode, setMode }: RegionModeSelectorProps) {
  return (
    <div className={styles.selectorGroup}>
      <label>🌐 Region</label>
      <select value={region} onChange={(e) => setRegion(e.target.value)}>
        <option value="europe">Europe</option>
        <option value="usa">USA</option>
      </select>

      <label>🎮 Mode</label>
      <select value={mode} onChange={(e) => setMode(e.target.value)}>
        <option value="classic">Classic</option>
        <option value="timed">Timed</option>
      </select>
    </div>
  );
} 