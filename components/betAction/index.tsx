import styles from "./betAction.module.css";

import { tokenABI } from "../../assets/TokenABI";
import { useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { parseUnits } from "viem";

const TOKEN_CONTRACT = "0x855DA24d2Fc7Ef7AaCF29B3d027eC70Ab11947DF";
const UP_ADDRESS = "0x582b25a263c46004B0A476A78ECFf7aE7E2034a0";
const DOWN_ADDRESS = "0x6652c1F62F8a1907f4F2a9b5f557ec62e7978050";
const NETWORK_SCAN = "https://goerli.etherscan.io/tx";

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
      {isError && (
        <div className={styles.error_message}>Error: {error?.message} Error occured.</div>
      )}
    </div>
  );
}
