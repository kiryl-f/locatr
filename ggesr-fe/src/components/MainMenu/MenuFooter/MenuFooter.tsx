import styles from "./MenuFooter.module.scss";

type MenuFooterProps = {
  onHowToPlay: () => void;
  onHighScores: () => void;
};

export default function MenuFooter({ onHowToPlay, onHighScores }: MenuFooterProps) {
  return (
    <div className={styles.menuFooter}>
      <button onClick={onHowToPlay}>How to Play</button>
      <button onClick={onHighScores}>High Scores</button>
    </div>
  );
} 