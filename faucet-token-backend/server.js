// server.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Configuration to handle CORS requests from the frontend.
const cors = require('cors');
app.use(cors());
//app.use(cors({
//    origin: 'http://localhost:3001', // Specified port number for the frontend.
//    methods: 'GET,POST',
//    allowedHeaders: 'Content-Type'
//  }));
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const { ethers } = require('ethers');
const axios = require('axios');

// Load environment variables
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

// Set up Ethereum provider
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraProjectId}`);
const wallet = new ethers.Wallet(privateKey, provider);
const contractABI = require('./contractABI.json');

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

app.post('/faucet', async (req, res) => {
    const { ethereumAddress, cosmosHubAddress } = req.body;

    // Logging to verify received data
    console.log("Received request with:", { ethereumAddress, cosmosHubAddress });

    // Validate the CosmosHub address as a Simply Staking delegator
    try {
        const isDelegator = await validateDelegator(cosmosHubAddress);
        if (!isDelegator) {
            return res.status(400).json({ error: 'This CosmosHub address is not a Simply Staking delegator.' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    // Check if the CosmosHub address has already claimed tokens
    try {
        const hasClaimed = await contract.hasClaimed(cosmosHubAddress);
        if (hasClaimed) {
            return res.status(400).json({ error: 'Faucet claim already made for this CosmosHub address' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error checking claim status' });
    }

    // Execute the faucet function on the contract
    try {
        const tx = await contract.faucet(ethereumAddress, cosmosHubAddress);
        await tx.wait();
        return res.json({ transactionHash: tx.hash });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to execute faucet function' });
    }
});


async function validateDelegator(cosmosHubAddress) {
    try {
        const baseURL = 'https://cosmoshub.api.kjnodes.com'; //Public REST Endpoint found via https://cosmos.directory/cosmoshub/nodes
        const validatorMoniker = 'Simply Staking'; 

        // Fetch delegations made by the CosmosHub address
        const response = await axios.get(`${baseURL}/cosmos/staking/v1beta1/delegations/${cosmosHubAddress}`);

        const delegations = response.data.delegation_responses;

        // Check if any delegation is made to Simply Staking
        for (const delegation of delegations) {
            const validatorAddress = delegation.delegation.validator_address;

            // Fetch validator details to compare the moniker
            const validatorResponse = await axios.get(`${baseURL}/cosmos/staking/v1beta1/validators/${validatorAddress}`);
            const validatorMonikerName = validatorResponse.data.validator.description.moniker;

            if (validatorMonikerName === validatorMoniker) {
                return true; // The address is a delegator to Simply Staking
            }
        }

        return false; // The address is not a delegator to Simply Staking
    } catch (error) {
        console.error('Error validating delegator:', error.message);
        throw new Error('Failed to validate the CosmosHub address');
    }
}
