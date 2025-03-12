import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true, // Allow all hosts to access the dev server
    cors: true, // Allow all CORS
    proxy: {
      '/api/coingecko': {
        target: 'https://api.coingecko.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, ''),
      },
      '/api/coinmarketcap': {
        target: 'https://pro-api.coinmarketcap.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coinmarketcap/, ''),
      }
    },
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
    fs: {
      strict: false,
    },
  },
})
