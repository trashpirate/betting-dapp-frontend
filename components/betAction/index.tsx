import styles from "./betAction.module.css";
import { useState } from "react";
import BetButton from "./betButton";

export default function BetAction() {
  const [transferAmount, setTransferAmount] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.container_entry}>
        <form className={styles.form}>
          <label>
            Enter LICK Amount:
            <input
              type="number"
              value={transferAmount}
              placeholder="0"
              onChange={(e) => setTransferAmount(e.target.value)}
            />
          </label>
        </form>

        <div className={styles.container_buttons}>
          <BetButton action="UP" transferAmount={transferAmount}></BetButton>
          <BetButton action="DOWN" transferAmount={transferAmount}></BetButton>
        </div>
      </div>
    </div>
  );
}
