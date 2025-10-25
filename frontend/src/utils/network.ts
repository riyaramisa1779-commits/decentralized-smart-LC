import { switchChain } from '@wagmi/core'
import { config } from '../config/wagmi'

export const GANACHE_CHAIN_ID = 1337

export const switchToGanache = async () => {
  try {
    await switchChain(config, { chainId: GANACHE_CHAIN_ID })
    return true
  } catch (error) {
    console.error('Failed to switch to Ganache network:', error)
    return false
  }
}

export const addGanacheToWallet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x539', // 1337 in hex
          chainName: 'Ganache',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['http://127.0.0.1:8545'],
          blockExplorerUrls: null
        }]
      })
      return true
    } catch (error) {
      console.error('Failed to add Ganache network to wallet:', error)
      return false
    }
  }
  return false
}