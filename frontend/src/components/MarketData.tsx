import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { TOKENS } from '../constants';
import { useWeb3 } from '../context/Web3Context';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { 
  fetchTokenPrice, 
  getSimulatedPriceChange, 
  getCoinGeckoId,
  calculateRealisticVolume,
  calculateRealisticMarketCap
} from '../utils/priceUtils';

interface TokenMarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  logoURI: string;
  priceSource?: string; // 'Chainlink', 'CoinGecko', or 'Simulated'
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
      // Prepare array for market data
      const marketDataArray: TokenMarketData[] = [];
      
      // Process each token
      for (const token of TOKENS) {
        try {
          // Fetch price using the utility function (handles Chainlink, CoinGecko, and fallbacks)
          const price = await fetchTokenPrice(contracts?.priceOracle, token.symbol);
          
          if (price !== null) {
            // Fetch 24h change data (either from API or realistic simulation)
            let change24h: number;
            let priceSource = 'Simulated';
            
            try {
              // Try to get real 24h change data from CoinGecko
              const coinGeckoId = getCoinGeckoId(token.symbol);
              if (coinGeckoId) {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinGeckoId}`);
                const data = await response.json();
                change24h = data.market_data?.price_change_percentage_24h || getSimulatedPriceChange();
                
                // If we got price from Chainlink but change data from CoinGecko
                if (isConnected && contracts?.priceOracle) {
                  priceSource = 'Chainlink';
                } else {
                  priceSource = 'CoinGecko';
                }
              } else {
                change24h = getSimulatedPriceChange();
              }
            } catch (error) {
              console.error(`Error fetching 24h change for ${token.symbol}:`, error);
              change24h = getSimulatedPriceChange();
            }
            
            // Calculate realistic volume and market cap based on price
            const volume24h = calculateRealisticVolume(token.symbol, price);
            const marketCap = calculateRealisticMarketCap(token.symbol, price);
            
            marketDataArray.push({
              symbol: token.symbol,
              name: token.name,
              price,
              change24h,
              volume24h,
              marketCap,
              logoURI: token.logoURI,
              priceSource
            });
          }
        } catch (error) {
          console.error(`Error processing market data for ${token.symbol}:`, error);
        }
      }
      
      // Sort by market cap by default
      const sortedData = marketDataArray.sort((a, b) => b.marketCap - a.marketCap);
      setMarketData(sortedData);
    } catch (error) {
      console.error('Error fetching market data:', error);
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
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue !== undefined && bValue !== undefined) {
          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
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
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{token.symbol}</span>
                          {token.priceSource && (
                            <span className={`text-[10px] px-1 py-0.5 rounded ${
                              token.priceSource === 'Chainlink' 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                                : token.priceSource === 'CoinGecko'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {token.priceSource}
                            </span>
                          )}
                        </div>
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
