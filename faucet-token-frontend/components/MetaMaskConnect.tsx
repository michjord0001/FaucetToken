// components/MetaMaskConnect.tsx
import React from "react";
import { useSDK } from "@metamask/sdk-react";

interface MetaMaskConnectProps {
  onConnect: (account: string) => void;
  onError: (error: string) => void;
}

const MetaMaskConnect: React.FC<MetaMaskConnectProps> = ({ onConnect, onError }) => {
  const { sdk } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      if (accounts && accounts.length > 0) {
        const userAccount = accounts[0];
        onConnect(userAccount); // Pass the connected account to the parent
      } else {
        onError("No accounts found");
      }
    } catch (error: any) {
      console.warn("Failed to connect:", error);
      onError("Failed to connect");
    }
  };

  return <button onClick={connect}>Connect to MetaMask</button>;
};

export default MetaMaskConnect;
