import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { TRADING_PAIRS, TOKENS, PRICE_FEEDS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, CheckCircle2, Droplets, ArrowDownUp } from 'lucide-react';

const LiquidityPool: React.FC = () => {
  const { isConnected, contracts, account, provider } = useWeb3();
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0].name);
  const [token1Amount, setToken1Amount] = useState('');
  const [token2Amount, setToken2Amount] = useState('');
  const [action, setAction] = useState('add');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1500); // Default fallback rate
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  // Fetch real exchange rate from Chainlink oracle
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Get the current trading pair tokens
        const currentPair = TRADING_PAIRS.find(pair => pair.name === selectedPair);
        if (!currentPair) return;
        
        const token1 = TOKENS.find(t => t.symbol === currentPair.baseToken);
        const token2 = TOKENS.find(t => t.symbol === currentPair.quoteToken);
        
        if (!token1 || !token2) return;

        // If we're in development and don't have provider or contracts, use simulated data
        if (import.meta.env.DEV && (!isConnected || !provider || !contracts.priceOracle)) {
          console.log('Development environment without provider, using simulated exchange rate');
          const simulatedRate = Math.random() * 2000 + 1000; // Random rate between 1000 and 3000
          setExchangeRate(simulatedRate);
          return;
        }
        
        if (!isConnected || !provider || !contracts.priceOracle) {
          throw new Error("Provider or price oracle not available");
        }
        
        // Get price feed addresses from constants
        const token1PriceFeed = `${token1.symbol}/USD`;
        const token2PriceFeed = `${token2.symbol}/USD`;
        
        // Get prices in USD for both tokens
        const token1Price = await contracts.priceOracle.getLatestPrice(PRICE_FEEDS[token1PriceFeed]);
        const token2Price = await contracts.priceOracle.getLatestPrice(PRICE_FEEDS[token2PriceFeed]);
        
        // Calculate exchange rate (token1 price in terms of token2)
        const rate = parseFloat(token1Price.toString()) / parseFloat(token2Price.toString());
        setExchangeRate(rate);
        
        console.log(`Using real-time Chainlink price data: 1 ${token1.symbol} = ${rate.toFixed(6)} ${token2.symbol}`);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
        
        // Fallback to simulated rate in case of error
        if (import.meta.env.DEV) {
          console.log('Error fetching real prices, falling back to simulated data');
          const simulatedRate = Math.random() * 2000 + 1000;
          setExchangeRate(simulatedRate);
        }
      }
    };
    
    fetchExchangeRate();
  }, [selectedPair, contracts, provider, isConnected]);

  const handleToken1AmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setToken1Amount(value);
      setNotification({ type: null, message: '' });
      // Calculate equivalent amount based on current exchange rate
      if (value && parseFloat(value) > 0) {
        setToken2Amount((parseFloat(value) * exchangeRate).toFixed(6));
      } else {
        setToken2Amount('');
      }
    }
  };

  const handleToken2AmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setToken2Amount(value);
      setNotification({ type: null, message: '' });
      // Calculate equivalent amount based on current exchange rate
      if (value && parseFloat(value) > 0) {
        setToken1Amount((parseFloat(value) / exchangeRate).toFixed(6));
      } else {
        setToken1Amount('');
      }
    }
  };

  const handleAddLiquidity = async () => {
    if (!isConnected || !contracts.router || !account) {
      setNotification({
        type: 'error',
        message: 'Please connect your wallet first'
      });
      return;
    }

    if (!token1Amount || !token2Amount || parseFloat(token1Amount) <= 0 || parseFloat(token2Amount) <= 0) {
      setNotification({
        type: 'error',
        message: 'Please enter valid amounts'
      });
      return;
    }

    setIsLoading(true);
    setNotification({ type: null, message: '' });
    
    try {
      // In a real implementation, this would call the router contract to add liquidity
      // For example:
      // const token1 = new Contract(token1Address, ERC20ABI, signer);
      // const token2 = new Contract(token2Address, ERC20ABI, signer);
      // 
      // // Approve tokens for router
      // await token1.approve(contracts.router.address, parseUnits(token1Amount, 18));
      // await token2.approve(contracts.router.address, parseUnits(token2Amount, 18));
      // 
      // // Add liquidity
      // const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      // await contracts.router.addLiquidity(
      //   token1.address,
      //   token2.address,
      //   parseUnits(token1Amount, 18),
      //   parseUnits(token2Amount, 18),
      //   parseUnits(token1Amount, 18).mul(95).div(100), // 5% slippage
      //   parseUnits(token2Amount, 18).mul(95).div(100), // 5% slippage
      //   account,
      //   deadline
      // );
      
      // For now, we'll just simulate a delay
      if (contracts.liquidityPool) {
        console.log('Using LiquidityPool contract:', contracts.liquidityPool.address);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful liquidity addition
      setToken1Amount('');
      setToken2Amount('');
      
      setNotification({
        type: 'success',
        message: 'Liquidity added successfully! (This is a simulation)'
      });
    } catch (error) {
      console.error('Error adding liquidity:', error);
      setNotification({
        type: 'error',
        message: 'Failed to add liquidity. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!isConnected) {
      setNotification({
        type: 'error',
        message: 'Please connect your wallet first'
      });
      return;
    }

    if (!token1Amount || parseFloat(token1Amount) <= 0) {
      setNotification({
        type: 'error',
        message: 'Please enter a valid amount'
      });
      return;
    }

    setIsLoading(true);
    setNotification({ type: null, message: '' });
    
    try {
      // In a real app, this would call the router contract to remove liquidity
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful liquidity removal
      setToken1Amount('');
      setToken2Amount('');
      
      setNotification({
        type: 'success',
        message: 'Liquidity removed successfully! (This is a simulation)'
      });
    } catch (error) {
      console.error('Error removing liquidity:', error);
      setNotification({
        type: 'error',
        message: 'Failed to remove liquidity. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the current trading pair tokens
  const currentPair = TRADING_PAIRS.find(pair => pair.name === selectedPair);
  const token1 = currentPair ? currentPair.baseToken : '';
  const token2 = currentPair ? currentPair.quoteToken : '';

  // Mock pool statistics
  const poolStats = {
    totalLiquidity: '$2,450,000',
    volume24h: '$345,678',
    fees24h: '$1,037',
    yourLiquidity: '$0',
    apr: '12.4%'
  };

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-0 bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-md dark:from-zinc-900 dark:to-zinc-800">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-700">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Droplets className="h-5 w-5 text-blue-500" />
          Liquidity Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Notification */}
          {notification.type && (
            <div className={`rounded-lg p-3 text-sm ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-green-500 dark:text-green-400" />
                ) : (
                  <AlertCircle size={16} className="text-red-500 dark:text-red-400" />
                )}
                {notification.message}
              </div>
            </div>
          )}
          
          {/* Pool Statistics */}
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
            <h3 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Pool Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Liquidity</div>
                <div className="font-medium">{poolStats.totalLiquidity}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">24h Volume</div>
                <div className="font-medium">{poolStats.volume24h}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">24h Fees</div>
                <div className="font-medium">{poolStats.fees24h}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">APR</div>
                <div className="font-medium text-green-600 dark:text-green-400">{poolStats.apr}</div>
              </div>
            </div>
          </div>
          
          {/* Trading Pair Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trading Pair</label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="border border-zinc-300 dark:border-zinc-700">
                <SelectValue placeholder="Select trading pair" />
              </SelectTrigger>
              <SelectContent>
                {TRADING_PAIRS.map((pair) => (
                  <SelectItem key={pair.name} value={pair.name}>
                    {pair.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Action Tabs */}
          <Tabs defaultValue="add" value={action} onValueChange={setAction}>
            <TabsList className="grid w-full grid-cols-2 bg-zinc-200 dark:bg-zinc-800">
              <TabsTrigger 
                value="add" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Add Liquidity
              </TabsTrigger>
              <TabsTrigger 
                value="remove"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Remove Liquidity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="add" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{token1} Amount</label>
                <Input
                  type="text"
                  placeholder={`Amount in ${token1}`}
                  value={token1Amount}
                  onChange={handleToken1AmountChange}
                  className="border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              
              <div className="relative my-2 flex justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm dark:bg-zinc-800">
                  <ArrowDownUp size={14} className="text-zinc-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{token2} Amount</label>
                <Input
                  type="text"
                  placeholder={`Amount in ${token2}`}
                  value={token2Amount}
                  onChange={handleToken2AmountChange}
                  className="border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              
              <div className="rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Rate:</span>
                  <span className="font-medium">1 {token1} = {exchangeRate.toFixed(6)} {token2}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700" 
                onClick={handleAddLiquidity}
                disabled={!isConnected || !token1Amount || !token2Amount || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Adding Liquidity...</span>
                  </div>
                ) : 'Add Liquidity'}
              </Button>
            </TabsContent>
            
            <TabsContent value="remove" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">LP Tokens to Burn</label>
                <Input
                  type="text"
                  placeholder="Amount of LP tokens"
                  value={token1Amount}
                  onChange={handleToken1AmountChange}
                  className="border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              
              <div className="rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
                <h4 className="mb-2 font-medium">You will receive:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>{token1}:</span>
                    <span className="font-medium">{token1Amount ? parseFloat(token1Amount).toFixed(6) : '0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{token2}:</span>
                    <span className="font-medium">{token2Amount ? parseFloat(token2Amount).toFixed(6) : '0'}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700" 
                onClick={handleRemoveLiquidity}
                disabled={!isConnected || !token1Amount || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Removing Liquidity...</span>
                  </div>
                ) : 'Remove Liquidity'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquidityPool;
