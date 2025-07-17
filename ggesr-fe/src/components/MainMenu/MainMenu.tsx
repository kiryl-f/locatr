import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainMenu.module.scss";

export default function MainMenu() {
  const navigate = useNavigate();
  const [region, setRegion] = React.useState("world");
  const [mode, setMode] = React.useState("classic");

  const handleStart = () => {
    navigate(`/game?region=${region}&mode=${mode}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🌍 GeoGuessR Retro</h1>

      <div className={styles.menuBox}>
        <button onClick={handleStart} className={styles.startButton}>
          ▶ Start Game
        </button>

        <div className={styles.selectorGroup}>
          <label>🌐 Region</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="world">World</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="usa">USA</option>
          </select>

          <label>🎮 Mode</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="classic">Classic</option>
            <option value="timed">Timed</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className={styles.menuFooter}>
          <button onClick={() => alert("WASD to move, guess the place!")}>
            📖 How to Play
          </button>
          <button onClick={() => alert("Coming soon!")}>🏆 High Scores</button>
        </div>
      </div>

      <footer className={styles.footer}>
        Built with ❤️ | <a href="https://github.com/kiryl-f/ggesr">GitHub</a>
      </footer>
    </div>
  );
}
