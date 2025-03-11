import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { TRADING_PAIRS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const LiquidityPool: React.FC = () => {
  const { isConnected } = useWeb3();
  const [selectedPair] = useState(TRADING_PAIRS[0].name);

  // Get token symbols from the selected pair
  const currentPair = TRADING_PAIRS.find(pair => pair.name === selectedPair);
  const token1 = currentPair ? currentPair.baseToken : 'ETH';
  const token2 = currentPair ? currentPair.quoteToken : 'USDT';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity Pool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Trading pair: {selectedPair}</p>
          <p>Token 1: {token1}</p>
          <p>Token 2: {token2}</p>
          {isConnected ? (
            <p>Ready to add/remove liquidity</p>
          ) : (
            <p>Please connect your wallet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquidityPool;
