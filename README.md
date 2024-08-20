# Task Overview
This task consists of 3 interconnected parts:
1. **Smart Contract:** Deployed on an Ethereum testnet, the smart contract governs the distribution of tokens. It ensures that each CosmosHub address can only claim tokens once and associates it with an Ethereum address.
2. **Backend:** The Express.js server acts as an intermediary between the frontend and the smart contract. It validates the CosmosHub address to ensure it is a Simply Staking delegator, checks if it has already claimed tokens, and then triggers the smart contract to distribute tokens to the corresponding Ethereum address.
3. **Frontend:** The Next.js-based frontend provides a user-friendly interface for users to connect their Ethereum wallet, enter a CosmosHub address, and claim tokens. It interacts with the backend service to complete the process.

## Prerequisites
Before you begin, ensure you have the following installed on your system:
* Node.js (v14 or higher)
* npm (Node Package Manager) 
* Solidity Compiler (Remix)
* Metamask Wallet (for testnet deployment)
* Testnet ETH (from a Sepolia faucet)
* Infura Account for Ethereum network access

### Part 1 - Smart Contract
1. You can use the Remix IDE to compile the contract.
   * Open Remix IDE.
   * Load the EnhancedFaucetToken.sol file into Remix.
   * Ensure the Solidity compiler version is set to 0.8.x.
   * Click "Compile EnhancedFaucetToken.sol".

2. Deploy the Smart Contract to a Testnet
   * Connect Metamask
     * Ensure Metamask is installed and connected to the Sepolia testnet.
     * Fund your wallet with testnet E TH or tokens from a Sepolia faucet.
   * Deploy to Testnet
  
3. Interact with the Contract
   * After deployment, you can interact with the contract using Remix or a web3-enabled frontend.
   * The contract owner can distribute tokens to a CosmosHub address: `faucet(address _ethereumAddress, string memory _cosmosAddress)`
   * Ensure tokens are only transferred to authorized addresses: `transfer(address recipient, uint256 amount)`


### Part 2 - Backend
1. Install dependencies:
   
   `$ cd faucet-token-backend` 

   `$ npm install`

2. Create a .env file:
   * Replace these fields with your actual credentials. I have excluded mine for safety purposes.
   ```
    PRIVATE_KEY=your_private_key_here
    CONTRACT_ADDRESS=your_smart_contract_address_here
    INFURA_PROJECT_ID=your_infura_project_id_here
   ```

3. Start the server:
   * The server will run on http://localhost:3000 by default.

   `$ npm start`

4. API Endpoints
   * POST /faucet: Claims tokens by providing an Ethereum address and a CosmosHub address.
   * Request body:
   `{
  "ethereumAddress": "0xYourEthereumAddress",
  "cosmosHubAddress": "cosmos1YourCosmosHubAddress"
    }`


5. Test with curl:
   * On success: Returns the transaction hash.
   * On failure: Returns appropriate error message.
  
    `curl -X POST http://localhost:3000/faucet -H "Content-Type: application/json" -d ' "ethereumAddress":"0xYourEthereumAddress", "cosmosHubAddress":"cosmos1YourCosmosHubAddress"}'`

### Part 3 - Frontend
1. Install dependencies:
   
   `$ cd faucet-token-frontend` 

   `$ npm install`

2. Configure Environment Variables:
   * Create a .env.local file in the root of the project and add the following environment variable:
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
    ```

3. Start the development server:
   * The application will be accessible at http://localhost:3001 (or another port if specified).
  
    `npm run dev`

4. Interface Instructions
   * Connect MetaMask: Upon loading the application, click the "Connect" button to connect your Ethereum wallet via MetaMask.
   * Enter CosmosHub Address: Input a valid CosmosHub address delegated to Simply Staking in the provided form.
   * Submit Claim: Click "Submit" to claim your tokens. The application will display the transaction hash upon success or an error message if something goes wrong.