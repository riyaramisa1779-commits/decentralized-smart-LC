import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { Plus, FileText, Clock, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { formatEther, parseEther } from 'viem';

const DealManagement: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('list');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newDeal, setNewDeal] = useState({
    exporter: '',
    goods: '',
    amount: ''
  });

  const { writeContract, isPending } = useWriteContract();

  // Read deal count
  const { data: dealCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'dealCount',
  });

  // Mock deals data (in real app, you'd fetch this from the contract)
  const deals = [
    {
      id: 1,
      importer: '0x1234...5678',
      exporter: '0x8765...4321',
      goods: 'Electronics Components',
      amount: '50000',
      status: 'pending',
      approved: false,
      deliveryVerified: false,
      documentHash: ''
    },
    {
      id: 2,
      importer: '0x2345...6789',
      exporter: '0x9876...5432',
      goods: 'Textile Products',
      amount: '75000',
      status: 'approved',
      approved: true,
      deliveryVerified: false,
      documentHash: 'QmX...'
    },
    {
      id: 3,
      importer: '0x3456...7890',
      exporter: '0x0987...6543',
      goods: 'Agricultural Products',
      amount: '30000',
      status: 'completed',
      approved: true,
      deliveryVerified: true,
      documentHash: 'QmY...'
    }
  ];

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !newDeal.exporter || !newDeal.goods || !newDeal.amount) return;

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'createNewDeal',
        args: [
          newDeal.exporter as `0x${string}`,
          newDeal.goods,
          parseEther(newDeal.amount)
        ],
      });
      
      // Reset form
      setNewDeal({ exporter: '', goods: '', amount: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating deal:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">Please connect your wallet to manage deals</p>
          <w3m-button />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Deal Management</h1>
          <p className="text-white/70 mt-1">Create and manage your trade deals</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Create Deal</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Deals</p>
              <p className="text-2xl font-bold text-white">{dealCount?.toString() || '0'}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(d => d.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Create Deal Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Deal</h2>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Exporter Address</label>
                <input
                  type="text"
                  value={newDeal.exporter}
                  onChange={(e) => setNewDeal({ ...newDeal, exporter: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Goods Description</label>
                <textarea
                  value={newDeal.goods}
                  onChange={(e) => setNewDeal({ ...newDeal, goods: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the goods..."
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={newDeal.amount}
                  onChange={(e) => setNewDeal({ ...newDeal, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {isPending ? 'Creating...' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deals List */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Your Deals</h2>
        <div className="space-y-4">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">Deal #{deal.id}</h3>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(deal.status)}`}>
                      {getStatusIcon(deal.status)}
                      <span className="capitalize">{deal.status}</span>
                    </span>
                  </div>
                  <p className="text-white/70 mb-3">{deal.goods}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                      <p className="text-white font-semibold flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {deal.amount} ETH
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                  {deal.status === 'pending' && (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealManagement;