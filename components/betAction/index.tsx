import styles from "./betAction.module.css";
import { useEffect, useState } from "react";
import BetButton from "./betButton";
import { io } from "socket.io-client";

export default function BetAction() {
  const [transferAmount, setTransferAmount] = useState("");
  const [bettingAllowed, setBettingAllowed] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`);

    socket.on("connect", function () {
      console.log("Connected");
      socket.emit("events", { test: "test" });
      socket.emit("identity", 0, (response: any) => console.log("Identity:", response));
    });

    // Listen for the "bettingStarted" event
    socket.on("events", function (data) {
      setBettingAllowed(data.status);
    });

    // Listen for the "bettingStarted" event
    socket.on("bettingStarted", () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setBettingAllowed(data.status);
        });
    });

    // Listen for the "bettingStarted" event
    socket.on("bettingEnded", () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setBettingAllowed(data.status);
        });
    });

    socket.on("exception", function (data) {
      console.log("event", data);
      setBettingAllowed(data.status);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [bettingAllowed]);

  return (
    <div className={styles.container}>
      {!bettingAllowed && (
        <h2 className={styles.container_buttons} style={{ margin: "auto" }}>
          No Bets Accepted!
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
