// pages/_app.tsx
import React from "react";
import { AppProps } from "next/app";
import { MetaMaskProvider } from "@metamask/sdk-react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "Simply Staking - Token Faucet",
          url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
      }}
    >
      <Component {...pageProps} />
    </MetaMaskProvider>
  );
}

export default MyApp;
