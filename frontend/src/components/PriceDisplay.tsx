import React, { useState, useEffect } from 'react';
import { TOKENS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  logoURI: string;
  source: 'chainlink' | 'simulated';
}

const PriceDisplay: React.FC = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      
      // Tokens to fetch prices for
      const tokensToFetch = TOKENS.slice(0, 8); // Limit to first 8 tokens for performance
      
      // Simulate prices for now
      const simulatedPrices = tokensToFetch.map(token => {
        const basePrice = token.symbol === 'USDT' ? 1 : Math.random() * 50000 + 100;
        const change24h = (Math.random() * 10) - 5;
        
        return {
          symbol: token.symbol,
          name: token.name,
          price: basePrice,
          change24h: change24h,
          logoURI: token.logoURI,
          source: 'simulated' as const
        };
      });
      
      setPrices(simulatedPrices);
      setIsLoading(false);
    };
    
    fetchPrices();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p>Loading prices...</p>
          ) : (
            <div>
              {prices.map(price => (
                <div key={price.symbol}>
                  {price.symbol}: ${price.price.toFixed(2)}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceDisplay;
