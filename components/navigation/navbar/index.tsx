"use client";

import { ConnectKitButton } from "connectkit";
import styles from "./navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="https://petlfg.com/" target={"_blank"}>
        <img style={{ width: "48px", height: "48px" }} src="./petlfg.svg" alt="PetLFG LICK" />
      </a>
      <ConnectKitButton />
    </nav>
  );
}
