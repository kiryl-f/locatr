import type React from "react";
import Modal from "../Modal";
import { MODALS } from "../../../../consts/modals";

export const HowToPlayModal: React.FC = () => {

    return (
        <Modal modalID={MODALS.HOW_TO_PLAY} title="How to play">
            <div>
                Here's how to play
            </div>
        </Modal>
    )
}