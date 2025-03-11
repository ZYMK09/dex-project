// No need for useState as we're showing all components at once
import { Web3Provider } from './context/Web3Context';
import TokenSwap from './components/TokenSwap';
import LiquidityPool from './components/LiquidityPool';
import LimitOrderForm from './components/LimitOrderForm';
import PriceDisplay from './components/PriceDisplay';
import WalletConnect from './components/WalletConnect';
import ThemeToggle from './components/ThemeToggle';
import MarketData from './components/MarketData';
import './index.css';

function App() {
  // No need for tabs as we're showing all components at once

  return (
    <Web3Provider>
      <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Base DEX</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <WalletConnect />
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 space-y-6">
            <PriceDisplay />
            <MarketData />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <TokenSwap />
              <LiquidityPool />
            </div>
            <div>
              <LimitOrderForm />
            </div>
          </div>
        </main>
        
        <footer className="border-t mt-12 bg-white/50 backdrop-blur-sm dark:bg-zinc-900/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Base DEX</h2>
              <p className="text-sm text-muted-foreground text-center">
                Decentralized Exchange on Base Network
              </p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <a href="#" className="hover:text-blue-600 transition-colors">Docs</a>
                <a href="#" className="hover:text-blue-600 transition-colors">GitHub</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Discord</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Web3Provider>
  );
}

export default App;
