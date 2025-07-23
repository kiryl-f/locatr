import type React from "react";
import Modal from "../Modal";
import { MODALS } from "../../../../consts/modals";

import styles from './HowToPlayModal.module.scss';

export const HowToPlayModal: React.FC = () => {

    return (
        <Modal modalID={MODALS.HOW_TO_PLAY} title="How to play">
            <h1 className={styles.header}>
                Here's how to play Locatr
            </h1>

            <p>
                Look around the location in Street View.

                Guess where you are by clicking on the map.

                Hit “Submit Guess” when you're ready.

                See how far off you were and earn points!

                Click “Next Image” to play again.

                Tip: The closer your guess, the more points you get!
            </p>
        </Modal>
    )
}