// pages/index.tsx
import React, { useState } from "react";
import MetaMaskConnect from "../components/MetaMaskConnect";
import ClaimForm from "../components/ClaimForm";

const Home: React.FC = () => {
  const [connectedAccount, setConnectedAccount] = useState<string>();

  const handleConnect = (account: string) => {
    console.log("Connected account:", account); // Debugging
    setConnectedAccount(account);
  };

  return (
      <div style={{ padding: 20 }}>
        <h1>Welcome to Your Dapp</h1>
        <MetaMaskConnect onConnect={handleConnect} />
        {connectedAccount && (
          <ClaimForm ethereumAddress={connectedAccount} />
        )}
        {!connectedAccount && <p>Please connect your MetaMask wallet.</p>}
      </div>
  );
};

export default Home;
