import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { TRADING_PAIRS, TOKENS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';
import { fetchTokenPrice } from '../utils/priceUtils';

const LimitOrderForm: React.FC = () => {
  const { isConnected, contracts, account } = useWeb3();
  const [selectedPair, setSelectedPair] = useState(TRADING_PAIRS[0].name);
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number | null>(null);

  // Fetch current market price for the selected pair
  useEffect(() => {
    const fetchMarketPrice = async () => {
      try {
        // Get the current trading pair tokens
        const currentPair = TRADING_PAIRS.find(pair => pair.name === selectedPair);
        if (!currentPair) return;
        
        const baseToken = TOKENS.find(t => t.symbol === currentPair.baseToken);
        const quoteToken = TOKENS.find(t => t.symbol === currentPair.quoteToken);
        
        if (!baseToken || !quoteToken) return;

        // Fetch prices using the utility functions (handles all fallbacks)
        const baseTokenPrice = await fetchTokenPrice(contracts?.priceOracle, baseToken.symbol);
        const quoteTokenPrice = await fetchTokenPrice(contracts?.priceOracle, quoteToken.symbol);
        
        if (baseTokenPrice !== null && quoteTokenPrice !== null) {
          // Calculate market price (baseToken price in terms of quoteToken)
          const marketPrice = baseTokenPrice / quoteTokenPrice;
          setCurrentMarketPrice(marketPrice);
          
          // Set the price input to the market price if empty
          if (!price) {
            setPrice(marketPrice.toFixed(6));
          }
          
          console.log(`Exchange rate: 1 ${baseToken.symbol} = ${marketPrice.toFixed(6)} ${quoteToken.symbol}`);
          console.log(`Price source: ${isConnected && contracts?.priceOracle ? 'Chainlink' : 'CoinGecko/Fallback'}`);
        } else {
          throw new Error("Could not fetch token prices");
        }
      } catch (error) {
        console.error("Error calculating market price:", error);
        
        // Fallback to simulated price in case of error
        console.log('Error fetching real prices, falling back to simulated data');
        const simulatedPrice = Math.random() * 2000 + 1000;
        setCurrentMarketPrice(simulatedPrice);
        
        // Set the price input to the simulated market price if empty
        if (!price) {
          setPrice(simulatedPrice.toFixed(6));
        }
      }
    };
    
    fetchMarketPrice();
  }, [selectedPair, contracts, isConnected, price]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
      setNotification({ type: null, message: '' });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setNotification({ type: null, message: '' });
    }
  };

  const handleCreateOrder = async () => {
    if (!isConnected || !contracts.limitOrder || !account) {
      setNotification({
        type: 'error',
        message: 'Please connect your wallet first'
      });
      return;
    }

    if (!price || !amount || parseFloat(price) <= 0 || parseFloat(amount) <= 0) {
      setNotification({
        type: 'error',
        message: 'Please enter valid price and amount'
      });
      return;
    }

    setIsLoading(true);
    setNotification({ type: null, message: '' });
    
    try {
      // In a real implementation, this would call the limit order contract
      // For now, we'll just simulate a delay
      if (contracts.limitOrder) {
        console.log('Using LimitOrder contract:', contracts.limitOrder.address);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful order creation
      setPrice('');
      setAmount('');
      
      setNotification({
        type: 'success',
        message: `${orderType.toUpperCase()} limit order created successfully! (This is a simulation)`
      });
    } catch (error) {
      console.error('Error creating limit order:', error);
      setNotification({
        type: 'error',
        message: 'Failed to create limit order. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get the current trading pair tokens
  const currentPair = TRADING_PAIRS.find(pair => pair.name === selectedPair);
  const baseToken = currentPair ? currentPair.baseToken : '';
  const quoteToken = currentPair ? currentPair.quoteToken : '';

  return (
    <Card className="w-full overflow-hidden border-0 bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-md dark:from-zinc-900 dark:to-zinc-800">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-700">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Limit Orders
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
          
          {/* Trading Pair Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Trading Pair</label>
            <Select
              className="border border-zinc-300 dark:border-zinc-700"
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
            >
              {TRADING_PAIRS.map((pair) => (
                <option key={pair.name} value={pair.name}>
                  {pair.name}
                </option>
              ))}
            </Select>
          </div>
          
          {/* Order Type Tabs */}
          <Tabs defaultValue="buy" value={orderType} onValueChange={setOrderType}>
            <TabsList className="grid w-full grid-cols-2 bg-zinc-200 dark:bg-zinc-800">
              <TabsTrigger 
                value="buy" 
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger 
                value="sell"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                Sell
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="buy" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ({quoteToken})</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={`Price in ${quoteToken}`}
                    value={price}
                    onChange={handlePriceChange}
                    className="border border-zinc-300 pl-8 dark:border-zinc-700"
                  />
                  <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ({baseToken})</label>
                <Input
                  type="text"
                  placeholder={`Amount in ${baseToken}`}
                  value={amount}
                  onChange={handleAmountChange}
                  className="border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              
              <div className="rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Market Price:</span>
                    <span className="font-medium">
                      {currentMarketPrice ? currentMarketPrice.toFixed(6) : 'Loading...'} {quoteToken}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">
                      {price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(6) : '0'} {quoteToken}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700" 
                onClick={handleCreateOrder}
                disabled={!isConnected || !price || !amount || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Creating Order...</span>
                  </div>
                ) : `Buy ${baseToken}`}
              </Button>
            </TabsContent>
            
            <TabsContent value="sell" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price ({quoteToken})</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={`Price in ${quoteToken}`}
                    value={price}
                    onChange={handlePriceChange}
                    className="border border-zinc-300 pl-8 dark:border-zinc-700"
                  />
                  <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount ({baseToken})</label>
                <Input
                  type="text"
                  placeholder={`Amount in ${baseToken}`}
                  value={amount}
                  onChange={handleAmountChange}
                  className="border border-zinc-300 dark:border-zinc-700"
                />
              </div>
              
              <div className="rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Market Price:</span>
                    <span className="font-medium">
                      {currentMarketPrice ? currentMarketPrice.toFixed(6) : 'Loading...'} {quoteToken}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">
                      {price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(6) : '0'} {quoteToken}
                    </span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-red-500 to-red-600 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700" 
                onClick={handleCreateOrder}
                disabled={!isConnected || !price || !amount || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Creating Order...</span>
                  </div>
                ) : `Sell ${baseToken}`}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default LimitOrderForm;
