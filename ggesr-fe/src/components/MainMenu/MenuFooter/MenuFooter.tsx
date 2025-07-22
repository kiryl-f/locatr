import { MODALS } from "../../../consts/modals";
import useModal from "../../../hooks/useModal";
import { HowToPlayModal } from "../../common/modals/HowToPlayModal/HowToPlayModal";
import styles from "./MenuFooter.module.scss";

type MenuFooterProps = {
  onHighScores: () => void;
};

export default function MenuFooter({ onHighScores }: MenuFooterProps) {
  const { open } = useModal(MODALS.HOW_TO_PLAY);
  return (
    <>
      <div className={styles.menuFooter}>
        <button onClick={() => open()}>How to Play</button>
        <button onClick={onHighScores}>High Scores</button>
      </div>

      <HowToPlayModal/>
    </>
  );
} 