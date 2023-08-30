import styles from "./betAction.module.css";
import { useEffect, useState } from "react";
import BetButton from "./betButton";

export default function BetAction() {
  const [transferAmount, setTransferAmount] = useState("");
  const [bettingAllowed, setBettingAllowed] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBettingAllowed(data.status);
      });
  });

  return (
    <div className={styles.container}>
      {!bettingAllowed && (
        <h2 className={styles.container_buttons} style={{ margin: "auto" }}>
          Betting Closed!
        </h2>
      )}
      {bettingAllowed && (
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
      )}
    </div>
  );
}
