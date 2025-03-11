import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Button } from './ui/button';
import { Wallet, LogOut } from 'lucide-react';

const WalletConnect: React.FC = () => {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected && account ? (
        <>
          <div className="flex h-8 items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-3 text-sm font-medium text-blue-800 dark:from-blue-900/20 dark:to-purple-900/20 dark:text-blue-300">
            <span className="hidden md:inline-block">
              {formatAddress(account)}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnectWallet}
            className="flex h-8 items-center gap-1 rounded-full border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <LogOut size={14} />
            <span className="hidden md:inline-block">Disconnect</span>
          </Button>
        </>
      ) : (
        <Button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex h-9 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-70"
        >
          <Wallet size={16} />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
