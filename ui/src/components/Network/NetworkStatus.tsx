import React from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { GANACHE_CHAIN_ID } from '../../utils/network';

export const NetworkStatus: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isOnGanache = chainId === GANACHE_CHAIN_ID;
  const isWrongNetwork = isConnected && !isOnGanache;

  const handleSwitchToGanache = () => {
    switchChain({ chainId: GANACHE_CHAIN_ID });
  };

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
        <WifiOff className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Not Connected</span>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <span className="text-sm text-yellow-700">Wrong Network</span>
        <button
          onClick={handleSwitchToGanache}
          className="ml-2 px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Switch to Ganache
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
      <Wifi className="w-4 h-4 text-green-600" />
      <span className="text-sm text-green-700">
        Connected to Ganache (Chain ID: {chainId})
      </span>
    </div>
  );
};