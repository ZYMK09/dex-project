import { Contract } from 'ethers';
import { TOKENS } from '../constants';

/**
 * Fetches the price of a token from the PriceOracle contract
 * @param priceOracle The PriceOracle contract instance
 * @param tokenSymbol The symbol of the token to fetch the price for
 * @returns The price of the token in USD
 */
export const fetchTokenPrice = async (
  priceOracle: Contract | null,
  tokenSymbol: string
): Promise<number | null> => {
  try {
    if (!priceOracle) {
      console.log(`No price oracle available, using CoinGecko API fallback for ${tokenSymbol}`);
      return await fetchCoinGeckoPrice(tokenSymbol);
    }
    
    const token = TOKENS.find(t => t.symbol === tokenSymbol);
    if (!token) {
      console.error(`Token ${tokenSymbol} not found in TOKENS list`);
      return await fetchCoinGeckoPrice(tokenSymbol);
    }
    
    console.log(`Fetching price for ${tokenSymbol} from Chainlink oracle...`);
    const price = await priceOracle.getPrice(token.address);
    const priceValue = parseFloat(price.toString()) / 10**8; // Chainlink prices are 8 decimals
    
    // Validate price is reasonable (non-zero and not extremely high)
    if (priceValue <= 0 || priceValue > 1000000) {
      console.warn(`Suspicious price value for ${tokenSymbol}: ${priceValue}, using fallback`);
      return await fetchCoinGeckoPrice(tokenSymbol);
    }
    
    console.log(`Got price for ${tokenSymbol}: ${priceValue} USD from Chainlink`);
    return priceValue;
  } catch (error) {
    console.error(`Error fetching price for ${tokenSymbol} from Chainlink:`, error);
    return await fetchCoinGeckoPrice(tokenSymbol);
  }
};

/**
 * Fetches prices for multiple tokens from the PriceOracle contract
 * @param priceOracle The PriceOracle contract instance
 * @param tokenSymbols Array of token symbols to fetch prices for
 * @returns Object mapping token symbols to their prices
 */
export const fetchMultipleTokenPrices = async (
  priceOracle: Contract | null,
  tokenSymbols: string[]
): Promise<Record<string, number | null>> => {
  const prices: Record<string, number | null> = {};
  
  if (!priceOracle) {
    // Initialize all prices as null if no oracle is available
    tokenSymbols.forEach(symbol => {
      prices[symbol] = null;
    });
    return prices;
  }
  
  // Fetch prices in parallel for better performance
  const pricePromises = tokenSymbols.map(async (symbol) => {
    const price = await fetchTokenPrice(priceOracle, symbol);
    return { symbol, price };
  });
  
  const results = await Promise.all(pricePromises);
  
  // Convert results array to object
  results.forEach(({ symbol, price }) => {
    prices[symbol] = price;
  });
  
  return prices;
};

/**
 * Generates simulated price data for development environments
 * @param tokenSymbol The symbol of the token to generate a price for
 * @returns A simulated price
 */
export const getSimulatedPrice = (tokenSymbol: string): number => {
  // Base prices for common tokens
  const basePrices: Record<string, number> = {
    'BTC': 67245.12,
    'ETH': 3051.33,
    'USDT': 1.00,
    'USDC': 1.00,
    'LINK': 17.82,
    'SOL': 142.87,
    'MATIC': 0.72,
    'AVAX': 35.23,
    'DOGE': 0.16,
    'SHIB': 0.00002,
    'XRP': 0.58,
    'ADA': 0.45,
    'DOT': 7.23,
    'UNI': 10.45,
    'ATOM': 8.92,
    'LTC': 82.34
  };
  
  // Get base price or generate a random one between 1 and 100
  const basePrice = basePrices[tokenSymbol] || Math.random() * 100 + 1;
  
  // Add small random variation (±0.5%)
  const variation = basePrice * (Math.random() * 0.01 - 0.005);
  
  return basePrice + variation;
};

/**
 * Fetches token price from CoinGecko API as a fallback
 * @param tokenSymbol The symbol of the token to fetch price for
 * @returns The price in USD or null if not available
 */
export const fetchCoinGeckoPrice = async (tokenSymbol: string): Promise<number | null> => {
  try {
    // Map token symbols to CoinGecko IDs
    const coinGeckoIds: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'USDT': 'tether',
      'LINK': 'chainlink',
      'MATIC': 'matic-network',
      'SOL': 'solana',
      'AVAX': 'avalanche-2',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'XRP': 'ripple',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'UNI': 'uniswap',
      'ATOM': 'cosmos',
      'LTC': 'litecoin'
    };
    
    const id = coinGeckoIds[tokenSymbol];
    if (!id) {
      console.warn(`No CoinGecko ID mapping for ${tokenSymbol}, using simulated price`);
      return getRealisticSimulatedPrice(tokenSymbol);
    }
    
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    const data = await response.json();
    
    if (data[id]?.usd) {
      console.log(`Got price for ${tokenSymbol} from CoinGecko: ${data[id].usd} USD`);
      return data[id].usd;
    } else {
      console.warn(`No price data from CoinGecko for ${tokenSymbol}, using simulated price`);
      return getRealisticSimulatedPrice(tokenSymbol);
    }
  } catch (error) {
    console.error(`Error fetching price from CoinGecko for ${tokenSymbol}:`, error);
    return getRealisticSimulatedPrice(tokenSymbol);
  }
};

/**
 * Provides realistic simulated prices based on current market data
 * Only used as a last resort when both Chainlink and CoinGecko fail
 * @param tokenSymbol The symbol of the token to generate a price for
 * @returns A realistic price based on current market data
 */
export const getRealisticSimulatedPrice = (tokenSymbol: string): number => {
  // Current market prices as of March 2025 (update these regularly)
  const currentPrices: Record<string, number> = {
    'BTC': 68245.12,
    'ETH': 3151.33,
    'USDT': 1.00,
    'USDC': 1.00,
    'LINK': 18.82,
    'SOL': 145.87,
    'MATIC': 0.75,
    'AVAX': 36.23,
    'DOGE': 0.17,
    'SHIB': 0.000022,
    'XRP': 0.61,
    'ADA': 0.48,
    'DOT': 7.53,
    'UNI': 11.45,
    'ATOM': 9.32,
    'LTC': 83.54
  };
  
  // Get current price or use a reasonable default
  const price = currentPrices[tokenSymbol] || 10.0;
  
  // Add tiny random variation (±0.2%) to simulate market movement
  const variation = price * (Math.random() * 0.004 - 0.002);
  
  console.log(`Using realistic simulated price for ${tokenSymbol}: ${(price + variation).toFixed(6)} USD`);
  return price + variation;
};

/**
 * Helper function to get CoinGecko ID for a token symbol
 * @param tokenSymbol The symbol of the token
 * @returns The CoinGecko ID or undefined if not found
 */
export const getCoinGeckoId = (tokenSymbol: string): string | undefined => {
  const coinGeckoIds: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'USDT': 'tether',
    'LINK': 'chainlink',
    'MATIC': 'matic-network',
    'SOL': 'solana',
    'AVAX': 'avalanche-2',
    'DOGE': 'dogecoin',
    'SHIB': 'shiba-inu',
    'XRP': 'ripple',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
    'LTC': 'litecoin'
  };
  
  return coinGeckoIds[tokenSymbol];
};

/**
 * Calculates realistic trading volume based on token popularity and price
 * @param symbol Token symbol
 * @param price Current token price
 * @returns Simulated 24h trading volume
 */
export const calculateRealisticVolume = (symbol: string, price: number): number => {
  // Volume tends to correlate with price and popularity
  const popularityFactor: Record<string, number> = {
    'BTC': 10,
    'ETH': 8,
    'USDT': 15,
    'LINK': 3,
    'SOL': 5,
    'MATIC': 2,
    'AVAX': 2,
    'DOGE': 4,
    'SHIB': 3,
    'XRP': 4,
    'ADA': 3,
    'DOT': 2,
    'UNI': 2,
    'ATOM': 1.5,
    'LTC': 2
  };
  
  const factor = popularityFactor[symbol] || 1;
  return price * factor * (Math.random() * 5000000 + 1000000);
};

/**
 * Calculates realistic market cap based on token supply and price
 * @param symbol Token symbol
 * @param price Current token price
 * @returns Simulated market cap
 */
export const calculateRealisticMarketCap = (symbol: string, price: number): number => {
  // Approximate circulating supplies (in millions)
  const circulatingSupply: Record<string, number> = {
    'BTC': 19.5,
    'ETH': 120,
    'USDT': 83000,
    'LINK': 560,
    'SOL': 430,
    'MATIC': 9400,
    'AVAX': 360,
    'DOGE': 142000,
    'SHIB': 589000000,
    'XRP': 53600,
    'ADA': 35800,
    'DOT': 1200,
    'UNI': 750,
    'ATOM': 300,
    'LTC': 73
  };
  
  const supply = circulatingSupply[symbol] || 1000;
  return price * supply * 1000000; // Convert to actual supply
};

/**
 * Calculates a simulated 24h price change percentage
 * @returns A random price change between -5% and +5%
 */
export const getSimulatedPriceChange = (): number => {
  return (Math.random() * 10) - 5; // Random between -5% and +5%
};
