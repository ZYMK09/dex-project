import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { TOKENS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { ArrowDownUp, AlertCircle, Info } from 'lucide-react';
import { fetchTokenPrice } from '../utils/priceUtils';

interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI: string;
}

const TokenSwap: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[2]); // Default to USDT
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState<number>(0.5); // Default 0.5% slippage
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get real exchange rate from price oracle or fallback sources
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0) {
        setErrorMessage(null);
        
        try {
          // Get the Web3 context
          const { contracts, isConnected } = useWeb3();
          
          // Fetch prices using the utility functions (handles all fallbacks)
          const fromTokenPrice = await fetchTokenPrice(contracts?.priceOracle, fromToken.symbol);
          const toTokenPrice = await fetchTokenPrice(contracts?.priceOracle, toToken.symbol);
          
          if (fromTokenPrice !== null && toTokenPrice !== null) {
            // Calculate exchange rate (fromToken price in terms of toToken)
            const rate = fromTokenPrice / toTokenPrice;
            setExchangeRate(rate);
            
            // Calculate output amount
            const calculatedAmount = parseFloat(fromAmount) * rate;
            setToAmount(calculatedAmount.toFixed(6));
            
            console.log(`Exchange rate: 1 ${fromToken.symbol} = ${rate.toFixed(6)} ${toToken.symbol}`);
            console.log(`Price source: ${isConnected && contracts?.priceOracle ? 'Chainlink' : 'CoinGecko/Fallback'}`);
          } else {
            throw new Error("Could not fetch token prices");
          }
        } catch (error) {
          console.error("Error calculating exchange rate:", error);
          setErrorMessage("Could not fetch real-time price. Please try again later.");
          
          // Clear output amount on error
          setToAmount('');
          setExchangeRate(null);
        }
      } else {
        setToAmount('');
        setExchangeRate(null);
      }
    };
    
    fetchExchangeRate();
  }, [fromToken, toToken, fromAmount]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) { // Only allow numbers and decimal point
      setFromAmount(value);
    }
  };

  const handleFromTokenChange = (value: string) => {
    const token = TOKENS.find(t => t.symbol === value);
    if (token) {
      setFromToken(token);
      // If both tokens are the same, switch to a different token
      if (token.symbol === toToken.symbol) {
        const otherToken = TOKENS.find(t => t.symbol !== value);
        if (otherToken) setToToken(otherToken);
      }
    }
  };

  const handleToTokenChange = (value: string) => {
    const token = TOKENS.find(t => t.symbol === value);
    if (token) {
      setToToken(token);
      // If both tokens are the same, switch to a different token
      if (token.symbol === fromToken.symbol) {
        const otherToken = TOKENS.find(t => t.symbol !== value);
        if (otherToken) setFromToken(otherToken);
      }
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
  };

  const handleSlippageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0.1 && numValue <= 5) {
      setSlippage(numValue);
    }
  };

  const handleSwap = async () => {
    if (!isConnected || !account) {
      setErrorMessage('Please connect your wallet first');
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // In a real implementation, this would call the router contract to execute the swap
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful swap
      setFromAmount('');
      setToAmount('');
      
      // Show success message
      setErrorMessage('Swap successful! (This is a simulation)');
    } catch (error) {
      console.error('Error executing swap:', error);
      setErrorMessage('Swap failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-0 bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-md dark:from-zinc-900 dark:to-zinc-800">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-700">
        <CardTitle className="text-xl font-bold">Swap Tokens</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Error Message */}
          {errorMessage && (
            <div className={`rounded-lg p-3 text-sm ${errorMessage.includes('successful') ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
              <div className="flex items-center gap-2">
                {errorMessage.includes('successful') ? (
                  <Info size={16} className="text-green-500 dark:text-green-400" />
                ) : (
                  <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
                )}
                {errorMessage}
              </div>
            </div>
          )}
          
          {/* From Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <div className="flex gap-2">
              <Select
                className="w-[140px] border border-zinc-300 dark:border-zinc-700"
                value={fromToken.symbol}
                onChange={(e) => handleFromTokenChange(e.target.value)}
              >
                {TOKENS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </Select>
              <Input
                type="text"
                placeholder="0.0"
                value={fromAmount}
                onChange={handleFromAmountChange}
                className="flex-1 border border-zinc-300 dark:border-zinc-700"
              />
            </div>
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSwapTokens}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-2 text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            >
              <ArrowDownUp size={20} />
            </Button>
          </div>
          
          {/* To Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <div className="flex gap-2">
              <Select
                className="w-[140px] border border-zinc-300 dark:border-zinc-700"
                value={toToken.symbol}
                onChange={(e) => handleToTokenChange(e.target.value)}
              >
                {TOKENS.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </Select>
              <Input
                type="text"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="flex-1 border border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          </div>
          
          {/* Exchange Rate & Slippage */}
          <div className="flex flex-col space-y-2 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
            {exchangeRate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate:</span>
                <span>1 {fromToken.symbol} = {exchangeRate.toFixed(6)} {toToken.symbol}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slippage Tolerance:</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={slippage.toString()}
                  onChange={(e) => handleSlippageChange(e.target.value)}
                  className="w-16 border border-zinc-300 p-1 text-right dark:border-zinc-700"
                />
                <span>%</span>
              </div>
            </div>
          </div>
          
          {/* Swap Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700"
            onClick={handleSwap}
            disabled={!isConnected || !fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Swapping...</span>
              </div>
            ) : isConnected ? 'Swap' : 'Connect Wallet to Swap'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenSwap;
