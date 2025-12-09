import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet, sepolia, hardhat } from 'wagmi/chains'
import { defineChain } from 'viem'

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID'

// Define local Ganache network
export const ganache = defineChain({
  id: 1337,
  name: 'Ganache',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:7545'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: '' },
  },
})

// 2. Create wagmiConfig
const metadata = {
  name: 'Smart LC System',
  description: 'Decentralized Letter of Credit System',
  url: 'http://localhost:5173', // Update to match your dev server
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Include Ganache as the first chain for development
const chains = [ganache, hardhat, sepolia, mainnet, arbitrum] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})

export { projectId }