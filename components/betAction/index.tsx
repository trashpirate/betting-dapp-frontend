import styles from "./betAction.module.css";

import { tokenABI } from "../../assets/LICK_polygon";
import { useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { parseUnits } from "viem";
import BetButton from "./betButton";

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`;
const UP_ADDRESS = process.env.NEXT_PUBLIC_UP_ADDRESS as `0x${string}`;
const DOWN_ADDRESS = process.env.NEXT_PUBLIC_DOWN_ADDRESS as `0x${string}`;
const NETWORK_SCAN = process.env.NEXT_PUBLIC_NETWORK_SCAN;

export default function BetAction() {
  const [transferAmount, setTransferAmount] = useState("");
  return (
    <div className={styles.container}>
      <div className={styles.container_entry}>
        <form className={styles.form}>
          <label>
            Enter Amount:
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
