import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import style from "./tokenPrice.module.css";

export default function TokenPrice() {
  const document = useRef();
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [initialPrice, setInitialPrice] = useState<number | null>(null);

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`);

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
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`)
        .then((res) => res.json())
        .then((data) => {
          data.status == false ? setInitialPrice(null) : setInitialPrice(data.initialPrice);
        });
    });

    // Listen for the "bettingStarted" event
    socket.on("bettingEnded", () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`)
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

  const getArrowStyle = () => {
    if (currentPrice != null && initialPrice != null) {
      if (currentPrice > initialPrice) {
        return {
          borderBottom: `15px solid green`,
          borderTop: `0px`,
        };
      } else if (currentPrice === initialPrice) {
        return {
          borderBottom: `10px`,
          borderTop: `10px`,
        };
      } else {
        return {
          borderBottom: `0px`,
          borderTop: `15px solid red`,
        };
      }
    } else {
      return {
        borderBottom: `10px`,
        borderTop: `10px`,
      };
    }
  };

  const getPriceColorStyle = () => {
    if (currentPrice != null && initialPrice != null) {
      if (currentPrice > initialPrice) {
        return { color: "green" };
      } else if (currentPrice === initialPrice) {
        return { color: "black" };
      } else {
        return { color: "red" };
      }
    } else {
      return { color: "black" };
    }
  };

  return (
    <div className={style.container}>
      <h1>$LICK Price</h1>
      {currentPrice !== null ? (
        <p className={style.current_price} style={getPriceColorStyle()}>
          Current price of LICK is ${currentPrice.toFixed(8)}
        </p>
      ) : (
        <p>Loading token price...</p>
      )}
      {initialPrice !== null ? (
        <p>Initial price of LICK is ${initialPrice.toFixed(8)}</p>
      ) : (
        <p>Initial price of LICK not set.</p>
      )}
      <div className={style.arrow} style={getArrowStyle()}></div>
    </div>
  );
}
