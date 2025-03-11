import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Signer, Contract } from 'ethers';
import { CONTRACT_ADDRESSES } from '../constants';

// Import ABIs
import FactoryABI from '../abis/Factory.json';
import RouterABI from '../abis/Router.json';
import WETHABI from '../abis/WETH.json';
import PriceOracleABI from '../abis/PriceOracle.json';
import LimitOrderABI from '../abis/LimitOrder.json';
import LiquidityPoolABI from '../abis/LiquidityPool.json';

// Add ethereum to window type
declare global {
  interface Window {
    ethereum: any;
  }
}

interface Web3ContextType {
  account: string | null;
  chainId: number | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  contracts: {
    factory: Contract | null;
    router: Contract | null;
    weth: Contract | null;
    priceOracle: Contract | null;
    limitOrder: Contract | null;
    liquidityPool: Contract | null;
  };
  priceFeedABI: string[];
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contracts, setContracts] = useState<{
    factory: Contract | null;
    router: Contract | null;
    weth: Contract | null;
    priceOracle: Contract | null;
    limitOrder: Contract | null;
    liquidityPool: Contract | null;
  }>({
    factory: null,
    router: null,
    weth: null,
    priceOracle: null,
    limitOrder: null,
    liquidityPool: null,
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      // In development environment, use mock wallet
      console.log('MetaMask not detected. Using mock wallet for development.');
      
      setIsConnecting(true);
      
      try {
        // Create mock account and provider
        const mockAccount = '0x' + '1'.repeat(40); // 0x1111...1111
        const mockChainId = 84531; // Base testnet
        
        setAccount(mockAccount);
        setChainId(mockChainId);
        
        // Create mock provider for contract interactions
        const mockProvider = new BrowserProvider(window.ethereum || {});
        setProvider(mockProvider);
        
        // Price feed ABI is defined at the component level
        // No need to define it here
        
        // Create mock contracts
        const mockContracts = {
          factory: null,
          router: null,
          weth: null,
          priceOracle: null,
          limitOrder: null,
          liquidityPool: null,
        };
        
        setContracts(mockContracts);
        
        console.log('Connected to mock wallet:', mockAccount);
        console.log('Mock chain ID:', mockChainId);
      } catch (error) {
        console.error('Error setting up mock wallet:', error);
      } finally {
        setIsConnecting(false);
      }
      
      return;
    }

    setIsConnecting(true);

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Provider = new BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setChainId(Number(network.chainId));

      // Check if we're on Base network (mainnet: 8453, testnet: 84531)
      if (Number(network.chainId) !== 8453 && Number(network.chainId) !== 84531) {
        alert('Please connect to Base network');
      }

      // Initialize contracts if addresses are available
      initializeContracts(web3Provider, web3Signer);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
  };

  const initializeContracts = async (_provider: BrowserProvider, _signer: Signer) => {
    try {
      // Initialize contracts with ABIs and addresses
      const factory = new Contract(
        CONTRACT_ADDRESSES.factory,
        FactoryABI,
        _signer
      );
      
      const router = new Contract(
        CONTRACT_ADDRESSES.router,
        RouterABI,
        _signer
      );
      
      const weth = new Contract(
        CONTRACT_ADDRESSES.weth,
        WETHABI,
        _signer
      );
      
      const priceOracle = new Contract(
        CONTRACT_ADDRESSES.priceOracle,
        PriceOracleABI,
        _signer
      );
      
      const limitOrder = new Contract(
        CONTRACT_ADDRESSES.limitOrder,
        LimitOrderABI,
        _signer
      );
      
      const liquidityPool = new Contract(
        CONTRACT_ADDRESSES.liquidityPool,
        LiquidityPoolABI,
        _signer
      );
      
      setContracts({
        factory,
        router,
        weth,
        priceOracle,
        limitOrder,
        liquidityPool,
      });
      
      console.log('Contracts initialized successfully');
      
      // Test contract connection
      try {
        const factoryOwner = await factory.owner();
        console.log('Factory owner:', factoryOwner);
        
        const wethName = await weth.name();
        console.log('WETH name:', wethName);
        
        console.log('Contract connection verified');
      } catch (testError) {
        console.warn('Contract test failed, but continuing:', testError);
      }
    } catch (error) {
      console.error('Error initializing contracts:', error);
      // Set contracts to null in case of error
      setContracts({
        factory: null,
        router: null,
        weth: null,
        priceOracle: null,
        limitOrder: null,
        liquidityPool: null,
      });
    }
  };

  useEffect(() => {
    // Handle account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    // Handle chain changes
    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      
      // Reload the page on chain change as recommended by MetaMask
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            connectWallet();
          }
        } catch (error) {
          console.error('Error auto-connecting:', error);
        }
      }
    };

    autoConnect();
  }, []);

  // Define price feed ABI for Chainlink integration
  const priceFeedABIValue = [
    "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
    "function decimals() external view returns (uint8)"
  ];

  const value = {
    account,
    chainId,
    provider,
    signer,
    isConnected: !!account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    contracts,
    priceFeedABI: priceFeedABIValue,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
