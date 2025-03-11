import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { TRADING_PAIRS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const LimitOrderForm: React.FC = () => {
  const { isConnected } = useWeb3();
  const [selectedPair] = useState(TRADING_PAIRS[0].name);

  // Get token symbols from the selected pair
  const currentPair = TRADING_PAIRS.find(pair => pair.name === selectedPair);
  const baseToken = currentPair ? currentPair.baseToken : 'ETH';
  const quoteToken = currentPair ? currentPair.quoteToken : 'USDT';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limit Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Trading pair: {selectedPair}</p>
          <p>Base token: {baseToken}</p>
          <p>Quote token: {quoteToken}</p>
          {isConnected ? (
            <p>Ready to place orders</p>
          ) : (
            <p>Please connect your wallet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LimitOrderForm;
