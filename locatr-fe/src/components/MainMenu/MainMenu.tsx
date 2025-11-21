import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useAuthStore } from "../../stores/authStore";
import { LOGOUT } from "../../graphql/mutations/auth";
import styles from "./MainMenu.module.scss";
import MainMenuTitle from "./MainMenuTitle/MainMenuTitle";
import StartGameButton from "./StartGameButton/StartGameButton";
import RegionModeSelector from "./RegionModeSelector/RegionModeSelector";
import MenuFooter from "./MenuFooter/MenuFooter";
import MainMenuFooter from "./MainMenuFooter/MainMenuFooter";

export default function MainMenu() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: logoutStore } = useAuthStore();
  const [region, setRegion] = React.useState("europe");
  const [mode, setMode] = React.useState("classic");

  const [logoutMutation] = useMutation(LOGOUT, {
    onCompleted: () => {
      logoutStore();
    },
  });

  const handleStart = () => {
    navigate(`/game?region=${region}&mode=${mode}`);
  };

  const handleHowToPlay = () => {
    alert("WASD to move, guess the place!");
  };

  const handleHighScores = () => {
    alert("Coming soon!");
  };

  const handleLogout = async () => {
    await logoutMutation();
  };

  return (
    <div className={styles.container}>
      {isAuthenticated && user && (
        <div className={styles.userMenu}>
          <span className={styles.username}>👤 {user.username}</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      )}
      {!isAuthenticated && (
        <div className={styles.authButtons}>
          <button onClick={() => navigate('/login')} className={styles.authButton}>
            Login
          </button>
          <button onClick={() => navigate('/register')} className={styles.authButton}>
            Sign Up
          </button>
        </div>
      )}
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
