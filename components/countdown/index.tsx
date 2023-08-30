import React, { useState, useEffect } from "react";
import style from "./countdown.module.css";
import { io } from "socket.io-client";

export default function CountdownTimer() {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [initialTime, setInitialTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [endTimeString, setEndTimeString] = useState<Date | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        data.status == false ? setEndTime(null) : setEndTime(Number(new Date(data.end)) / 1000);
      });
    const currentTime = Math.floor(Date.now() / 1000);
    setInitialTime(currentTime);

    // Create a WebSocket connection to the backend
    const socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`);

    // Listen for the "bettingStarted" event
    socket.on("bettingStarted", () => {
      console.log("Betting round has started");
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          data.status == false ? setEndTime(null) : setEndTime(Number(new Date(data.end)) / 1000);
        });
      const currentTime = Math.floor(Date.now() / 1000);
      setInitialTime(currentTime);
    });

    socket.on("bettingEnded", () => {
      console.log("Betting round has ended");
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-round`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          data.status == false ? setEndTime(null) : setEndTime(Number(new Date(data.end)) / 1000);
        });
      const currentTime = Math.floor(Date.now() / 1000);
      setInitialTime(currentTime);
    });

    if (initialTime !== null && endTime !== null) {
      const utcSeconds = endTime;
      const d = new Date(0);
      d.setUTCSeconds(endTime);
      setEndTimeString(d);

      const intervalId = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = endTime - currentTime;
        setRemainingTime(timeLeft > 0 ? timeLeft : 0);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }

    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, [initialTime, endTime]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, "0")} hrs ${minutes
      .toString()
      .padStart(2, "0")} min ${seconds.toString().padStart(2, "0")} sec`;
  };

  if (initialTime === null || endTime === null) {
    return (
      <div className={style.timer_container}>
        <h2>Betting hasn't started yet.</h2>
      </div>
    );
  }

  return (
    <div className={style.timer_container}>
      <h1>CURRENT ROUND</h1>
      <h2>
        Round Ending:
        <br />
        {endTimeString == null ? "Not available." : endTimeString.toLocaleString()}
      </h2>
      <p className={style.notice}>
        For bets to count enter them at least 1 hour before round end time.
      </p>
      <h2 className={style.countdown}>
        Time Remaining: <br />
        {formatTime(remainingTime || 0)}
      </h2>
    </div>
  );
}
