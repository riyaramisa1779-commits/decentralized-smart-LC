import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Ban,
  UserCheck,
  Info
} from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';

const AdminPanel: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'users' | 'deals' | 'payments'>('users');
  
  const { writeContract, isPending } = useWriteContract();
  const { pendingUsers, pendingDeals, loading, stats } = useAdminData();

  // Check if current user is admin
  const { data: adminAddress } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'admin',
  });

  const isAdmin = adminAddress === address;

  const handleVerifyUser = async (userAddress: string) => {
    if (!isAdmin) return;
    
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'verifyRegisteredUser',
        args: [userAddress as `0x${string}`],
      });
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleFlagUser = async (userAddress: string) => {
    if (!isAdmin) return;
    
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'flagSuspiciousUser',
        args: [userAddress as `0x${string}`],
      });
    } catch (error) {
      console.error('Error flagging user:', error);
    }
  };

  const handleVerifyDelivery = async (dealId: number) => {
    if (!isAdmin) return;
    
    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'verifyDealDelivery',
        args: [BigInt(dealId)],
      });
    } catch (error) {
      console.error('Error verifying delivery:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">Please connect your wallet to access admin panel</p>
          {/* <w3m-button /> */}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/70">You don't have admin privileges to access this panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/70 mt-1">Manage users, deals, and system operations</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending Users</p>
              <p className="text-2xl font-bold text-white">{stats.pendingUsersCount}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending Deals</p>
              <p className="text-2xl font-bold text-white">{stats.pendingDealsCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Verified Users</p>
              <p className="text-2xl font-bold text-white">{stats.verifiedUsersCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Flagged Users</p>
              <p className="text-2xl font-bold text-white">{stats.flaggedUsersCount}</p>
            </div>
            <Ban className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'users', label: 'User Verification', icon: Users },
            { id: 'deals', label: 'Deal Management', icon: CheckCircle },
            { id: 'payments', label: 'Payment Control', icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Verification Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Pending User Verifications</h3>
            
            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium">Real-time Data Integration</p>
                <p className="text-blue-200 text-sm mt-1">
                  Admin panel now connects to the smart contract. User registrations and verifications will appear here automatically when users register through the system.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading pending users...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No pending user verifications</p>
                <p className="text-white/50 text-sm mt-2">Users will appear here when they register through the system</p>
              </div>
            ) : (
              pendingUsers.map((user) => (
              <div key={user.address} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-semibold">{user.name}</h4>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs capitalize">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm font-mono">{user.address}</p>
                    <p className="text-white/50 text-xs">Registered: {user.registeredAt}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVerifyUser(user.address)}
                      disabled={isPending}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => handleFlagUser(user.address)}
                      disabled={isPending}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Flag</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        )}

        {/* Deal Management Tab */}
        {activeTab === 'deals' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Pending Deal Verifications</h3>
            
            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium">Real-time Deal Monitoring</p>
                <p className="text-blue-200 text-sm mt-1">
                  Deal management now connects to the smart contract. New deals and delivery verifications will appear here automatically.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading pending deals...</p>
              </div>
            ) : pendingDeals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No pending deal verifications</p>
                <p className="text-white/50 text-sm mt-2">Deals requiring admin approval will appear here</p>
              </div>
            ) : (
              pendingDeals.map((deal) => (
              <div key={deal.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-semibold">Deal #{deal.id}</h4>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                        {deal.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-white/70 mb-1">{deal.goods}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-white/50">Importer</p>
                        <p className="text-white font-mono">{deal.importer}</p>
                      </div>
                      <div>
                        <p className="text-white/50">Exporter</p>
                        <p className="text-white font-mono">{deal.exporter}</p>
                      </div>
                      <div>
                        <p className="text-white/50">Amount</p>
                        <p className="text-white font-semibold">{deal.amount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVerifyDelivery(deal.id)}
                      disabled={isPending}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        )}

        {/* Payment Control Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Management</h3>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Payment Control Center</h4>
              <p className="text-white/70 text-sm">
                Manage escrow releases, refunds, and payment disputes
              </p>
              <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                View All Payments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;