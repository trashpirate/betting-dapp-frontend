import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import style from "./tokenPrice.module.css";

export default function TokenPrice() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [initialPrice, setInitialPrice] = useState<number | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", function () {
      console.log("Connected");
      socket.emit("events", { test: "test" });
      socket.emit("identity", 0, (response: any) => console.log("Identity:", response));
    });

    socket.on("events", function (data) {
      console.log("current", data.currentPrice);
      console.log("initial", data.initialPrice);
      setCurrentPrice(data.currentPrice); // Update the received data
      setInitialPrice(data.initialPrice);
    });

    // Listen for the "bettingStarted" event
    socket.on("bettingStarted", () => {
      fetch("http://localhost:3001/get-round")
        .then((res) => res.json())
        .then((data) => {
          data.status == false ? setInitialPrice(null) : setInitialPrice(data.initialPrice);
        });
    });

    // Listen for the "bettingStarted" event
    socket.on("bettingEnded", () => {
      fetch("http://localhost:3001/get-round")
        .then((res) => res.json())
        .then((data) => {
          data.status == false ? setInitialPrice(null) : setInitialPrice(data.initialPrice);
        });
    });

    socket.on("exception", function (data) {
      console.log("event", data);
    });

    socket.on("disconnect", function () {
      console.log("Disconnected");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [initialPrice, currentPrice]);

  if (currentPrice != null && initialPrice != null) {
    if (currentPrice > initialPrice) {
      document.documentElement.style.setProperty("--is_up", `15px solid green`);
      document.documentElement.style.setProperty("--is_down", `0px`);
      document.documentElement.style.setProperty("--price", `green`);
    } else if (currentPrice == initialPrice) {
      document.documentElement.style.setProperty("--is_up", `10px`);
      document.documentElement.style.setProperty("--is_down", `10px`);
      document.documentElement.style.setProperty("--price", `black`);
    } else {
      document.documentElement.style.setProperty("--is_up", `0px`);
      document.documentElement.style.setProperty("--is_down", `15px solid red`);
      document.documentElement.style.setProperty("--price", `red`);
    }
  } else {
    document.documentElement.style.setProperty("--is_up", `10px`);
    document.documentElement.style.setProperty("--is_down", `10px`);
    document.documentElement.style.setProperty("--price", `black`);
  }

  return (
    <div className={style.container}>
      <h1>$LICK Price</h1>
      {currentPrice !== null ? (
        <p className={style.current_price}>Current price of LICK is ${currentPrice.toFixed(8)}</p>
      ) : (
        <p>Loading token price...</p>
      )}
      {initialPrice !== null ? (
        <p>Initial price of LICK is ${initialPrice.toFixed(8)}</p>
      ) : (
        <p>Initial price of LICK not set.</p>
      )}
      <div className={style.arrow}></div>
    </div>
  );
}
