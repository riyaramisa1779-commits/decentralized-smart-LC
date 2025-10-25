import React from "react";
import { useAccount, useDisconnect } from "wagmi";
import { Shield, LogOut, User } from "lucide-react";
import { NetworkStatus } from "../Network/NetworkStatus";

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white">Smart LC System</h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <NetworkStatus />
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                  <User className="h-4 w-4 text-white" />
                  <span className="text-white text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </div>
            ) : (
              React.createElement("w3m-connect-button")
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
