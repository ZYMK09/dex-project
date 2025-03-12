import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { TOKENS } from '../constants';
import { useWeb3 } from '../context/Web3Context';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';

interface TokenMarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  logoURI: string;
}

const MarketData: React.FC = () => {
  const { contracts, provider, isConnected } = useWeb3();
  const [marketData, setMarketData] = useState<TokenMarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TokenMarketData;
    direction: 'ascending' | 'descending';
  }>({ key: 'marketCap', direction: 'descending' });

  useEffect(() => {
    fetchMarketData();
    // Refresh market data every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, [contracts, provider, isConnected]);

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      // If we have a provider and contracts, fetch real data from Chainlink
      if (isConnected && provider && contracts?.priceOracle) {
        const realMarketData: TokenMarketData[] = [];
        
        for (const token of TOKENS) {
          try {
            // Get price directly from the PriceOracle contract using token address
            const price = await contracts.priceOracle.getPrice(token.address);
            const priceNumber = parseFloat(price.toString()) / (10 ** 8); // Chainlink prices are 8 decimals
            
            // Generate simulated data for other metrics
            const change24h = (Math.random() * 20) - 10; // Random between -10% and +10%
            const volume24h = Math.random() * 1000000 + 100000; // Random volume
            const marketCap = priceNumber * (Math.random() * 1000000000 + 10000000); // Random market cap
            
            realMarketData.push({
              symbol: token.symbol,
              name: token.name,
              price: priceNumber,
              change24h,
              volume24h,
              marketCap,
              logoURI: token.logoURI
            });
          } catch (error) {
            console.error(`Error fetching data for ${token.symbol}:`, error);
          }
        }
        
        setMarketData(realMarketData);
      } else {
        // Generate simulated market data for development
        const simulatedData: TokenMarketData[] = TOKENS.map(token => {
          const basePrice = token.symbol === 'USDT' || token.symbol === 'USDC' ? 1 : 
                           token.symbol === 'ETH' ? 3000 + (Math.random() * 200) :
                           token.symbol === 'BTC' ? 50000 + (Math.random() * 2000) :
                           token.symbol === 'XRP' ? 0.5 + (Math.random() * 0.1) :
                           token.symbol === 'ADA' ? 0.4 + (Math.random() * 0.05) :
                           token.symbol === 'DOT' ? 6 + (Math.random() * 0.5) :
                           token.symbol === 'UNI' ? 5 + (Math.random() * 0.3) :
                           token.symbol === 'ATOM' ? 10 + (Math.random() * 0.8) :
                           token.symbol === 'LTC' ? 70 + (Math.random() * 5) :
                           Math.random() * 100 + 1;
          
          const change24h = (Math.random() * 20) - 10; // Random between -10% and +10%
          const volume24h = Math.random() * 1000000 + 100000; // Random volume
          const marketCap = basePrice * (Math.random() * 1000000000 + 10000000); // Random market cap
          
          return {
            symbol: token.symbol,
            name: token.name,
            price: basePrice,
            change24h,
            volume24h,
            marketCap,
            logoURI: token.logoURI
          };
        });
        
        setMarketData(simulatedData);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to simulated data on error
      const fallbackData: TokenMarketData[] = TOKENS.map(token => ({
        symbol: token.symbol,
        name: token.name,
        price: token.symbol === 'USDT' || token.symbol === 'USDC' ? 1 : Math.random() * 1000 + 1,
        change24h: (Math.random() * 20) - 10,
        volume24h: Math.random() * 1000000 + 100000,
        marketCap: Math.random() * 10000000000 + 100000000,
        logoURI: token.logoURI
      }));
      
      setMarketData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const requestSort = (key: keyof TokenMarketData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    const sortableData = [...marketData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [marketData, sortConfig]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card className="w-full overflow-hidden border-0 bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-md dark:from-zinc-900 dark:to-zinc-800">
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Market Overview</CardTitle>
          <button 
            onClick={fetchMarketData} 
            className="rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Asset
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'ascending' ? 
                        <ArrowUp size={14} className="ml-1" /> : 
                        <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => requestSort('price')}
                >
                  <div className="flex items-center justify-end">
                    Price
                    {sortConfig.key === 'price' && (
                      sortConfig.direction === 'ascending' ? 
                        <ArrowUp size={14} className="ml-1" /> : 
                        <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => requestSort('change24h')}
                >
                  <div className="flex items-center justify-end">
                    24h Change
                    {sortConfig.key === 'change24h' && (
                      sortConfig.direction === 'ascending' ? 
                        <ArrowUp size={14} className="ml-1" /> : 
                        <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right hidden md:table-cell"
                  onClick={() => requestSort('volume24h')}
                >
                  <div className="flex items-center justify-end">
                    24h Volume
                    {sortConfig.key === 'volume24h' && (
                      sortConfig.direction === 'ascending' ? 
                        <ArrowUp size={14} className="ml-1" /> : 
                        <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right hidden lg:table-cell"
                  onClick={() => requestSort('marketCap')}
                >
                  <div className="flex items-center justify-end">
                    Market Cap
                    {sortConfig.key === 'marketCap' && (
                      sortConfig.direction === 'ascending' ? 
                        <ArrowUp size={14} className="ml-1" /> : 
                        <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <TableRow key={index} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                    <TableCell className="w-[50px]">
                      <div className="h-8 w-8 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto h-5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="ml-auto h-5 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      <div className="ml-auto h-5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    </TableCell>
                    <TableCell className="text-right hidden lg:table-cell">
                      <div className="ml-auto h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                sortedData.map((token) => (
                  <TableRow key={token.symbol} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
                    <TableCell className="w-[50px]">
                      <img 
                        src={token.logoURI} 
                        alt={token.symbol} 
                        className="h-8 w-8 rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://cryptologos.cc/logos/question-mark.png';
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(token.price)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      token.change24h > 0 
                        ? 'text-green-600 dark:text-green-500' 
                        : token.change24h < 0 
                          ? 'text-red-600 dark:text-red-500' 
                          : ''
                    }`}>
                      {token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">
                      {formatLargeNumber(token.volume24h)}
                    </TableCell>
                    <TableCell className="text-right hidden lg:table-cell">
                      {formatLargeNumber(token.marketCap)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketData;
