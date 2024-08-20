// components/MetaMaskConnect.tsx
import React, { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";

interface MetaMaskConnectProps {
  onConnect: (account: string) => void;
}

const MetaMaskConnect: React.FC<MetaMaskConnectProps> = ({ onConnect }) => {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, chainId } = useSDK();

  useEffect(() => {
    if (connected && account) {
      onConnect(account);  // Pass the connected account to the parent
    }
  }, [connected, account]);

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      const userAccount = accounts?.[0];
      setAccount(userAccount);
      onConnect(userAccount); // Immediately pass the connected account to the parent
    } catch (err) {
      console.warn("Failed to connect:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <button
        style={{ padding: 10, margin: 10 }}
        onClick={connect}
        disabled={connecting}
      >
        {connecting ? "Connecting..." : "Connect to MetaMask"}
      </button>
      {connected && (
        <div>
          <p>Connected Account: {account}</p>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;
