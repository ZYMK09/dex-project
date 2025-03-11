import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { TOKENS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const TokenSwap: React.FC = () => {
  const { isConnected } = useWeb3();
  const fromToken = TOKENS[0];
  const toToken = TOKENS[1];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Connect wallet to swap {fromToken.symbol} to {toToken.symbol}</p>
          {isConnected ? 
            <p>Ready to swap</p> : 
            <p>Please connect your wallet</p>
          }
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenSwap;
