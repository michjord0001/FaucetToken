// pages/api/faucet.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { ethereumAddress, cosmosHubAddress } = req.body;

  try {
    const response = await axios.post('http://localhost:3000/faucet', {
      ethereumAddress,
      cosmosHubAddress,
    });

    return res.status(200).json({ transactionHash: response.data.transactionHash });
  } catch (error) {
    console.error('Failed to claim tokens:', error);
    return res.status(500).json({ error: 'Failed to claim tokens' });
  }
}
