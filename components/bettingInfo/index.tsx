import styles from "./bettingInfo.module.css";

import { tokenABI } from "../../assets/TokenABI";
import { useContractReads } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { useEffect, useState } from "react";

const TOKEN_CONTRACT = "0x855DA24d2Fc7Ef7AaCF29B3d027eC70Ab11947DF";
const UP_ADDRESS = "0x582b25a263c46004B0A476A78ECFf7aE7E2034a0";
const DOWN_ADDRESS = "0x6652c1F62F8a1907f4F2a9b5f557ec62e7978050";
const NETWORK_SCAN = "https://goerli.etherscan.io/tx";

export default function BettingInfo() {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: TOKEN_CONTRACT,
        abi: tokenABI,
        functionName: "balanceOf",
        args: [UP_ADDRESS],
      },
      {
        address: TOKEN_CONTRACT,
        abi: tokenABI,
        functionName: "balanceOf",
        args: [DOWN_ADDRESS],
      },
    ],
  });

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const balanceUp =
    typeof data?.[0]?.result === "bigint" ? Number(formatUnits(data?.[0]?.result, 18)) : 0;
  const balanceDown =
    typeof data?.[1]?.result === "bigint" ? Number(formatUnits(data?.[1]?.result, 18)) : 0;

  const total = balanceDown + balanceUp;
  const down = (balanceDown / total) * 100;
  const up = (balanceUp / total) * 100;

  // const percent_up = getComputedStyle(document.documentElement).getPropertyValue("--percent-up");
  document.documentElement.style.setProperty("--percent-up", `${up.toString()}%`);
  document.documentElement.style.setProperty("--percent-down", `${down.toString()}%`);

  if (isLoading) return <div className={styles.message}>Fetching results…</div>;
  if (isError) return <div className={styles.error_message}>Error fetching contract data</div>;
  return (
    <div className={styles.container}>
      <div className={styles.result_container}>
        <div className={styles.progressbar}>
          <span className={styles.progressbar_up}></span>
        </div>
        <div className={styles.progress_count}>{`Up: ${balanceUp}`}</div>
      </div>

      <div className={styles.result_container}>
        <div className={styles.progressbar}>
          <span className={styles.progressbar_down}></span>
        </div>
        <div className={styles.progress_count}>{`Down: ${balanceDown}`}</div>
      </div>
    </div>
  );
}
