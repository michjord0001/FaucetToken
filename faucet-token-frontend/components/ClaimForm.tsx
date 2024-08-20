// components/ClaimForm.tsx
import React, { useState } from "react";
import axios from "axios";

interface ClaimFormProps {
  ethereumAddress: string;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ ethereumAddress }) => {
  const [cosmosHubAddress, setCosmosHubAddress] = useState<string>("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTransactionHash(null);
    console.log("Submitting: ", {
      ethereumAddress,
      cosmosHubAddress,
    });

    try {
      const response = await axios.post("http://localhost:3000/faucet", {
        ethereumAddress,
        cosmosHubAddress,
      });
      console.log("Response data:", response.data);
      setTransactionHash(response.data.transactionHash);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data?.error;
        if (serverError === "The provided CosmosHub address is not a Simply Staking delegator.") {
            setError("The provided CosmosHub address is not a Simply Staking delegator.");
        }
        else if (serverError === "Faucet claim already made for this CosmosHub address") {
            setError("Faucet claim already made for this CosmosHub address.");
        } else {
            setError("Failed to claim tokens. Please verify the CosmosHub address provided is a Simply Staking delegator.");
        }
    } else {
        setError("An unexpected error occurred. Please try again.");
    }
    console.error("Failed to submit:", error);    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter CosmosHub Address"
          value={cosmosHubAddress}
          onChange={(e) => setCosmosHubAddress(e.target.value)}
          required
          style={{ padding: 10, margin: 10 }}
        />
        <button type="submit" style={{ padding: 10, margin: 10 }}>
          Submit
        </button>
      </form>
      {transactionHash && (
        <div>
          
          <p>Transaction successful! Hash: {" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </p>
        </div>
      )}
      {error && (
        <div style={{ color: "red" }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ClaimForm;
