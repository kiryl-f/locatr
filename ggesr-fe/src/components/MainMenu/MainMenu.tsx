import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainMenu.module.scss";
import MainMenuTitle from "./MainMenuTitle";
import StartGameButton from "./StartGameButton";
import RegionModeSelector from "./RegionModeSelector";
import MenuFooter from "./MenuFooter";
import MainMenuFooter from "./MainMenuFooter";

export default function MainMenu() {
  const navigate = useNavigate();
  const [region, setRegion] = React.useState("world");
  const [mode, setMode] = React.useState("classic");

  const handleStart = () => {
    navigate(`/game?region=${region}&mode=${mode}`);
  };

  const handleHowToPlay = () => {
    alert("WASD to move, guess the place!");
  };

  const handleHighScores = () => {
    alert("Coming soon!");
  };

  return (
    <div className={styles.container}>
      <MainMenuTitle />
      <div className={styles.menuBox}>
        <StartGameButton onClick={handleStart} />
        <RegionModeSelector
          region={region}
          setRegion={setRegion}
          mode={mode}
          setMode={setMode}
        />
        <MenuFooter onHowToPlay={handleHowToPlay} onHighScores={handleHighScores} />
      </div>
      <MainMenuFooter />
    </div>
  );
}
