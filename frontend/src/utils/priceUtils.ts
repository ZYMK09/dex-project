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
    if (!priceOracle) return null;
    
    const token = TOKENS.find(t => t.symbol === tokenSymbol);
    if (!token) return null;
    
    const price = await priceOracle.getPrice(token.address);
    return parseFloat(price.toString()) / 10**8; // Assuming 8 decimals for price feeds
  } catch (error) {
    console.error(`Error fetching price for ${tokenSymbol}:`, error);
    return null;
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
 * Calculates a simulated 24h price change percentage
 * @returns A random price change between -5% and +5%
 */
export const getSimulatedPriceChange = (): number => {
  return (Math.random() * 10) - 5; // Random between -5% and +5%
};
