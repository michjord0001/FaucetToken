import React, { useState, useEffect } from "react";
import { useSDK } from "@metamask/sdk-react";
import ClaimForm from "../components/ClaimForm";

const Home: React.FC = () => {
  const [connectedAccount, setConnectedAccount] = useState<string | undefined>();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { sdk } = useSDK();

  const connectToMetaMask = async () => {
    setIsConnecting(true);
    setErrorMessage(null); // Clear any previous errors
    try {
      const accounts = await sdk?.connect();
      if (accounts && accounts.length > 0) {
        setConnectedAccount(accounts[0]);
      } else {
        throw new Error("No accounts found");
      }
    } catch (error: any) {
      setErrorMessage("Failed to connect to MetaMask");
      console.warn("Failed to connect:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to shorten Ethereum address
  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Apply the background gradient
  useEffect(() => {
    document.body.style.setProperty('height', '100vh');
    document.body.style.setProperty('margin', '0');
    document.body.style.setProperty('padding', '0');
    document.body.style.setProperty('background', 'linear-gradient(135deg, #F6783F 30%, #FFD1A9 100%)');
    document.body.style.setProperty('overflow', 'hidden'); // Optional: Prevent scrolling

    const html = document.documentElement;
    html.style.setProperty('height', '100vh');
    html.style.setProperty('margin', '0');
    html.style.setProperty('padding', '0');
    html.style.setProperty('background', 'linear-gradient(135deg, #F6783F 30%, #FFD1A9 100%)');

    return () => {
      // Clean up styles when the component unmounts
      document.body.style.removeProperty('height');
      document.body.style.removeProperty('margin');
      document.body.style.removeProperty('padding');
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('overflow');

      html.style.removeProperty('height');
      html.style.removeProperty('margin');
      html.style.removeProperty('padding');
      html.style.removeProperty('background');
    };
  }, []);

  return (
    <div style={styles.outerContainer}>
      <div style={styles.innerContainer}>
      <img src="https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://simplystaking.com/wp-content/uploads/2024/03/Simply_logo_black.png" alt="Simply Staking Logo" style={styles.logo} />
        <h1 style={styles.header}>Faucet Token Task</h1>
        {connectedAccount ? (
          <div style={styles.button}>
            {"Connected: " + shortenAddress(connectedAccount)}
          </div>
        ) : (
          <button style={styles.button} onClick={connectToMetaMask} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect to MetaMask"}
          </button>
        )}
        <ClaimForm ethereumAddress={connectedAccount || ""} />
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </div>
    </div>
  );
};

// Define modern, responsive styles with a gradient background
const styles: { [key: string]: React.CSSProperties } = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', 
    width: '100vw',  
  },
  innerContainer: {
    width: '75vw',  
    height: '75vh',
    maxWidth: '600px',
    maxHeight: '600px',
    padding: '30px',
    backgroundColor: '#ffffff', 
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', 
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#00153F', // Oxford Blue
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  button: {
    backgroundColor: '#F6783F', // Crayola Orange
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '1rem',
    fontWeight: '500',
    wordWrap: 'break-word',       
    overflowWrap: 'break-word',    
    width: '250px',
    textAlign: 'center',
  },
  transactionHash: {
    backgroundColor: '#F6783F', // Crayola Orange
    color: '#ffffff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    fontSize: '1rem',
    fontWeight: '500',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    width: '100%',  // Match the fixed width
    textAlign: 'center',
  },
};

export default Home;
