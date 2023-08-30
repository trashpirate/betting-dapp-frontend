"use client";
import { WagmiConfig, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import Head from "next/head";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
    walletConnectProjectId: "709b868768299cf075eb120164a46225",

    chains: [polygon],
    // Required
    appName: "Betting Dapp",

    // Optional
    appDescription:
      "The PetLFG Betting Platform allows $LICK holders to use their tokens to place bets on future price movements.",
    appUrl: "https://petlfg.vercel.app", // your app's url
    appIcon: "https://family.co/logo.png", // your app's logo,no bigger than 1024x1024px (max. 1MB)
  })
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>PetLFG Apps</title>
      <meta
        name="description"
        content="The LICK Betting Platform allows $LICK holders to use their tokens to place bets on future price movements."
        key="desc"
      />

      <meta name="twitter:card" content="summary_large_image" key="twcard" />
      <meta name="twitter:creator" content="PetLFG" key="twhandle" />

      <meta property="og:title" content="LICK Betting Platform" key="ogtitle" />
      <meta property="og:site_name" content="PetLFG Apps" key="ogsitename" />
      <meta
        property="og:description"
        content="The LICK Betting Platform allows $LICK holders to use their tokens to place bets on future price movements."
        key="ogdesc"
      />
      <meta property="og:url" content="https://petlfg.vercel.app" key="ogurl" />
      <meta
        property="og:image"
        content="http://petlfg.com/wp-content/uploads/2023/08/petlfg_betting_wide.png"
        key="ogimage"
      />
      <WagmiConfig config={config}>
        <ConnectKitProvider mode="dark">
          <body>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "105vh",
                backgroundImage: "url(petlfg_betting_bg_2.jpg)",
                backgroundSize: "cover",
                backgroundPositionX: "center",
              }}
            >
              <Navbar />
              <div style={{ flexGrow: 1 }}>{children}</div>
              <Footer />
            </div>
          </body>
        </ConnectKitProvider>
      </WagmiConfig>
    </html>
  );
}
