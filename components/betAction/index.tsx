import styles from "./betAction.module.css";

import { tokenABI } from "../../assets/LICK_ethereum";
import { useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { parseUnits } from "viem";

const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`;
const UP_ADDRESS = process.env.NEXT_PUBLIC_UP_ADDRESS as `0x${string}`;
const DOWN_ADDRESS = process.env.NEXT_PUBLIC_DOWN_ADDRESS as `0x${string}`;
const NETWORK_SCAN = process.env.NEXT_PUBLIC_NETWORK_SCAN;

export default function BetAction(params: { action: string }) {
  const [transferAmount, setTransferAmount] = useState("");

  const walletAddress = params.action === "UP" ? UP_ADDRESS : DOWN_ADDRESS;

  const { config } = usePrepareContractWrite({
    address: TOKEN_CONTRACT as `0x${string}`,
    abi: tokenABI,
    functionName: "transfer",
    args: [walletAddress as `0x${string}`, parseUnits(`${Number(transferAmount)}`, 18)],
  });
  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    confirmations: 2,
    hash: data?.hash,
  });

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

        <button className={styles.button} disabled={!write || isLoading} onClick={() => write?.()}>
          {isLoading ? "Submitting..." : `Bet ${params.action}`}
        </button>
        <div className={styles.betting_wallet}>
          <p>or send bet amount to:</p>
          <p>{walletAddress}</p>
        </div>
      </div>
      {isSuccess && (
        <div className={styles.message}>
          Successfully Submitted!
          <a target={"_blank"} href={`${NETWORK_SCAN}/${data?.hash}`}>
            <div>
              <p>View on Etherscan</p>
            </div>
          </a>
        </div>
      )}
      {isError && <div className={styles.error_message}>Error: Transaction aborted.</div>}
    </div>
  );
}
