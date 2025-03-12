// Contract addresses
export const CONTRACT_ADDRESSES = {
  factory: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  router: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  weth: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  priceOracle: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  limitOrder: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  liquidityPool: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
  usdt: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
  link: "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968"
};

// Token definitions
export const TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: CONTRACT_ADDRESSES.weth, // Using WETH address for ETH
    logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: CONTRACT_ADDRESSES.usdt,
    logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    decimals: 8,
    address: "0x0000000000000000000000000000000000000001", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    decimals: 18,
    address: CONTRACT_ADDRESSES.link,
    logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png"
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000002", // Placeholder address
    logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png"
  },
  {
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    address: "0x0000000000000000000000000000000000000003", // Placeholder address
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000004", // Placeholder address
    logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/avalanchec/assets/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png"
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    decimals: 8,
    address: "0x0000000000000000000000000000000000000005", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png"
  },
  {
    symbol: "SHIB",
    name: "Shiba Inu",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000006", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/11939/large/shiba.png"
  },
  // New tokens added
  {
    symbol: "XRP",
    name: "XRP",
    decimals: 6,
    address: "0x0000000000000000000000000000000000000007", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"
  },
  {
    symbol: "ADA",
    name: "Cardano",
    decimals: 6,
    address: "0x0000000000000000000000000000000000000008", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/975/large/cardano.png"
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    decimals: 10,
    address: "0x0000000000000000000000000000000000000009", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png"
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000010", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png"
  },
  {
    symbol: "ATOM",
    name: "Cosmos",
    decimals: 6,
    address: "0x0000000000000000000000000000000000000011", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png"
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    decimals: 8,
    address: "0x0000000000000000000000000000000000000012", // Placeholder address
    logoURI: "https://assets.coingecko.com/coins/images/2/large/litecoin.png"
  }
];

// Trading pairs
export const TRADING_PAIRS = [
  // ETH pairs
  {
    name: "ETH/USDT",
    baseToken: "ETH",
    quoteToken: "USDT"
  },
  {
    name: "ETH/BTC",
    baseToken: "ETH",
    quoteToken: "BTC"
  },
  // BTC pairs
  {
    name: "BTC/USDT",
    baseToken: "BTC",
    quoteToken: "USDT"
  },
  // LINK pairs
  {
    name: "LINK/USDT",
    baseToken: "LINK",
    quoteToken: "USDT"
  },
  {
    name: "LINK/ETH",
    baseToken: "LINK",
    quoteToken: "ETH"
  },
  // MATIC pairs
  {
    name: "MATIC/USDT",
    baseToken: "MATIC",
    quoteToken: "USDT"
  },
  {
    name: "MATIC/ETH",
    baseToken: "MATIC",
    quoteToken: "ETH"
  },
  // SOL pairs
  {
    name: "SOL/USDT",
    baseToken: "SOL",
    quoteToken: "USDT"
  },
  {
    name: "SOL/ETH",
    baseToken: "SOL",
    quoteToken: "ETH"
  },
  // AVAX pairs
  {
    name: "AVAX/USDT",
    baseToken: "AVAX",
    quoteToken: "USDT"
  },
  {
    name: "AVAX/ETH",
    baseToken: "AVAX",
    quoteToken: "ETH"
  },
  // DOGE pairs
  {
    name: "DOGE/USDT",
    baseToken: "DOGE",
    quoteToken: "USDT"
  },
  {
    name: "DOGE/ETH",
    baseToken: "DOGE",
    quoteToken: "ETH"
  },
  // SHIB pairs
  {
    name: "SHIB/USDT",
    baseToken: "SHIB",
    quoteToken: "USDT"
  },
  {
    name: "SHIB/ETH",
    baseToken: "SHIB",
    quoteToken: "ETH"
  },
  // XRP pairs
  {
    name: "XRP/USDT",
    baseToken: "XRP",
    quoteToken: "USDT"
  },
  {
    name: "XRP/ETH",
    baseToken: "XRP",
    quoteToken: "ETH"
  },
  // ADA pairs
  {
    name: "ADA/USDT",
    baseToken: "ADA",
    quoteToken: "USDT"
  },
  {
    name: "ADA/ETH",
    baseToken: "ADA",
    quoteToken: "ETH"
  },
  // DOT pairs
  {
    name: "DOT/USDT",
    baseToken: "DOT",
    quoteToken: "USDT"
  },
  {
    name: "DOT/ETH",
    baseToken: "DOT",
    quoteToken: "ETH"
  },
  // UNI pairs
  {
    name: "UNI/USDT",
    baseToken: "UNI",
    quoteToken: "USDT"
  },
  {
    name: "UNI/ETH",
    baseToken: "UNI",
    quoteToken: "ETH"
  },
  // ATOM pairs
  {
    name: "ATOM/USDT",
    baseToken: "ATOM",
    quoteToken: "USDT"
  },
  {
    name: "ATOM/ETH",
    baseToken: "ATOM",
    quoteToken: "ETH"
  },
  // LTC pairs
  {
    name: "LTC/USDT",
    baseToken: "LTC",
    quoteToken: "USDT"
  },
  {
    name: "LTC/ETH",
    baseToken: "LTC",
    quoteToken: "ETH"
  }
];

// Chainlink Price Feed Addresses (Base Testnet)
export const PRICE_FEEDS: Record<string, string> = {
  'ETH/USD': '0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1',
  'USDT/USD': '0x0a023a3423D9b27A0BE48c768CCF2dD9F3e27B3c',
  'LINK/ETH': '0x5C6F3A0df6a46E7B1788F962Fbe9CBA93B7c2D17',
  'BTC/USD': '0xCeE686F89bc0dABAd95AEAAC980aE1d97A075FAD',
  'MATIC/USD': '0xb82aA5E9E2f1D3A9b1BC5fE064f90E6CeB7D8e93',
  'SOL/USD': '0xC5F1F69e11D4aE9A2D470C1d9FE2BF0B49348E29',
  'AVAX/USD': '0x5087Dc69Fd3907a016BD42B38022F7f024140727',
  'DOGE/USD': '0xD1e56e7657C6347B4D3B9607Ec345429F6C2bF1B',
  'SHIB/USD': '0x0B7A0EAA7c9e0F01F4eDe6C1C31F9a7D3e1C3D48',
  // New price feeds
  'XRP/USD': '0x8A6A2e7e91FaFa9357a2D6D6B561d4D9D5b9Cf0C',
  'ADA/USD': '0x2D1AB79D059e21aE519d88F978cAF39d74E31AEb',
  'DOT/USD': '0x7F8E7703D9fD08D494Ee1748A1f4b9d5F4C3e2D2',
  'UNI/USD': '0x9a1372f9b1B71B3A5a72E092AE67E172dBd7Daaa',
  'ATOM/USD': '0x4a8D8A75b275F9e65d1e2E10d5335c5c55734C4A',
  'LTC/USD': '0x9c6c7817A34Cde4FbBD286E8388809edA562Aa9C'
};
