import styles from "./MainMenu.module.scss";

type StartGameButtonProps = {
  onClick: () => void;
};

export default function StartGameButton({ onClick }: StartGameButtonProps) {
  return (
    <button onClick={onClick} className={styles.startButton}>
      ▶ Start Game
    </button>
  );
} 