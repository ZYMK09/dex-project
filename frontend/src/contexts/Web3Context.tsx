import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Signer, Contract, InterfaceAbi } from 'ethers';
import { CONTRACT_ADDRESSES } from '../constants';

// Import ABIs
import FactoryABI from '../abis/Factory.json';
import RouterABI from '../abis/Router.json';
import WETHABI from '../abis/WETH.json';
import PriceOracleABI from '../abis/PriceOracle.json';
import LimitOrderABI from '../abis/LimitOrder.json';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  provider: BrowserProvider | null;
  signer: Signer | null;
  contracts: {
    factory: Contract | null;
    router: Contract | null;
    weth: Contract | null;
    priceOracle: Contract | null;
    limitOrder: Contract | null;
  };
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  isConnected: false,
  account: null,
  provider: null,
  signer: null,
  contracts: {
    factory: null,
    router: null,
    weth: null,
    priceOracle: null,
    limitOrder: null,
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contracts, setContracts] = useState<{
    factory: Contract | null;
    router: Contract | null;
    weth: Contract | null;
    priceOracle: Contract | null;
    limitOrder: Contract | null;
  }>({
    factory: null,
    router: null,
    weth: null,
    priceOracle: null,
    limitOrder: null,
  });

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        
        setProvider(provider);
        setAccount(accounts[0]);
        setSigner(signer);
        setIsConnected(true);
        
        // Initialize contracts
        const factory = new Contract(CONTRACT_ADDRESSES.factory, FactoryABI.abi as InterfaceAbi, signer);
        const router = new Contract(CONTRACT_ADDRESSES.router, RouterABI.abi as InterfaceAbi, signer);
        const weth = new Contract(CONTRACT_ADDRESSES.weth, WETHABI.abi as InterfaceAbi, signer);
        const priceOracle = new Contract(CONTRACT_ADDRESSES.priceOracle, PriceOracleABI.abi as InterfaceAbi, signer);
        const limitOrder = new Contract(CONTRACT_ADDRESSES.limitOrder, LimitOrderABI.abi as InterfaceAbi, signer);
        
        setContracts({
          factory,
          router,
          weth,
          priceOracle,
          limitOrder,
        });
        
        console.log('Wallet connected:', accounts[0]);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      console.error('Ethereum provider not found. Install MetaMask or another wallet.');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContracts({
      factory: null,
      router: null,
      weth: null,
      priceOracle: null,
      limitOrder: null,
    });
    console.log('Wallet disconnected');
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [account]);

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        account,
        provider,
        signer,
        contracts,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
