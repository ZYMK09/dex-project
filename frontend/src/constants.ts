// Chainlink Price Feed Addresses on Base Network
export const PRICE_FEEDS = {
  'ETH/USD': '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
  'USDT/USD': '0xf19d560eB8d2ADf07BD6D13ed03e1d11215721F9',
  'LINK/ETH': '0xc5E65227fe3385B88468F9A01600017cDC9F3A12',
  'BTC/USD': '0xCeC52393C93CECB663Af397D6661D43B2cC1C507',
  'MATIC/USD': '0x52099D4523531f678Dfc568a7B1e5038aadcE1d6',
  'SOL/USD': '0x24ceA4b8ce57cdA5058b924B9B9987992450590c',
  'AVAX/USD': '0x5087Dc69Fd3907a016BD42B38022F7f024140727',
  'DOGE/USD': '0xC6066533917f034Cf610c08e1fe5e9c7eADe0f54',
  'SHIB/USD': '0xD1e56e7657C6347B4D3980D12F2A21D8B7508211',
  'XRP/USD': '0x8deA82641d2f6187dB0b6c296e4e81F9f6c5d841', // Base network XRP/USD feed
  'ADA/USD': '0x2fa10e467Ee4f5c5C3E0C5cD4B44Bc4d8A7d5C8E', // Base network ADA/USD feed
  'DOT/USD': '0x3c30c5c415B2410326297F0f65f5Cbb32f3aefCc', // Base network DOT/USD feed
  'UNI/USD': '0x9a1372f9b1B71B3A5a72E092AE67E172dBd7Daaa', // Base network UNI/USD feed
  'ATOM/USD': '0x4a8D8ffcB3B8Cd499E0e2bAe83368A7E952BFCe7', // Base network ATOM/USD feed
  'LTC/USD': '0x6AF09DF7563C363B5763b9102712EbeD3b9e859B', // Base network LTC/USD feed
};

// Contract addresses - updated after deployment
export const CONTRACT_ADDRESSES = {
  factory: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  router: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  weth: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  priceOracle: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  limitOrder: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
  liquidityPool: "0x0B306BF915C4d645ff596e518fAf3F9669b97016",
  usdt: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  link: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
};

// Supported tokens for the DEX
export const TOKENS = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    address: '', // Native ETH doesn't have an address
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    address: CONTRACT_ADDRESSES.weth,
    logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin (Wrapped)',
    decimals: 8,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    address: CONTRACT_ADDRESSES.usdt,
    logoURI: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    decimals: 18,
    address: CONTRACT_ADDRESSES.link,
    logoURI: 'https://cryptologos.cc/logos/chainlink-link-logo.png',
  },
  {
    symbol: 'SOL',
    name: 'Solana (Wrapped)',
    decimals: 9,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/solana-sol-logo.png',
  },
  {
    symbol: 'MATIC',
    name: 'Polygon',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.png',
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    decimals: 8,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
  },
  {
    symbol: 'SHIB',
    name: 'Shiba Inu',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png',
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
  },
  {
    symbol: 'ATOM',
    name: 'Cosmos',
    decimals: 6,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/cosmos-atom-logo.png',
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    decimals: 8,
    address: '0x0000000000000000000000000000000000000000', // Placeholder address
    logoURI: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png',
  },
];

// Trading pairs
export const TRADING_PAIRS = [
  {
    name: 'ETH/USDT',
    baseToken: 'ETH',
    quoteToken: 'USDT',
  },
  {
    name: 'BTC/USDT',
    baseToken: 'BTC',
    quoteToken: 'USDT',
  },
  {
    name: 'LINK/ETH',
    baseToken: 'LINK',
    quoteToken: 'ETH',
  },
  {
    name: 'LINK/USDT',
    baseToken: 'LINK',
    quoteToken: 'USDT',
  },
  {
    name: 'SOL/USDT',
    baseToken: 'SOL',
    quoteToken: 'USDT',
  },
  {
    name: 'MATIC/USDT',
    baseToken: 'MATIC',
    quoteToken: 'USDT',
  },
  {
    name: 'AVAX/USDT',
    baseToken: 'AVAX',
    quoteToken: 'USDT',
  },
  {
    name: 'DOGE/USDT',
    baseToken: 'DOGE',
    quoteToken: 'USDT',
  },
  {
    name: 'SHIB/USDT',
    baseToken: 'SHIB',
    quoteToken: 'USDT',
  },
  {
    name: 'XRP/USDT',
    baseToken: 'XRP',
    quoteToken: 'USDT',
  },
  {
    name: 'ADA/USDT',
    baseToken: 'ADA',
    quoteToken: 'USDT',
  },
  {
    name: 'DOT/USDT',
    baseToken: 'DOT',
    quoteToken: 'USDT',
  },
  {
    name: 'UNI/USDT',
    baseToken: 'UNI',
    quoteToken: 'USDT',
  },
  {
    name: 'ATOM/USDT',
    baseToken: 'ATOM',
    quoteToken: 'USDT',
  },
  {
    name: 'LTC/USDT',
    baseToken: 'LTC',
    quoteToken: 'USDT',
  },
];
