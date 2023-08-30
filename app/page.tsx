"use client";
import styles from "./page.module.css";
import "./globals.css";
import Betting from "@/components/betting";
import TokenPrice from "@/components/tokenPrice";
import CountdownTimer from "@/components/countdown";

export default function Home() {
  return (
    <main className={styles.main}>
      <h3 className={styles.notice}>V1.1 BETA</h3>

      <CountdownTimer />
      <Betting></Betting>
    </main>
  );
}
