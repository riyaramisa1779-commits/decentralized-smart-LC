import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { 
  DollarSign, 
  Lock, 
  Unlock, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { formatEther, parseEther } from 'viem';

const EscrowManagement: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [depositForm, setDepositForm] = useState({
    dealId: '',
    amount: '',
    payee: ''
  });
  const [showDepositForm, setShowDepositForm] = useState(false);

  const { writeContract, isPending } = useWriteContract();

  // Mock escrow data (in real app, you'd fetch this from the contract)
  const escrowPayments = [
    {
      dealId: 1,
      payer: '0x1234...5678',
      payee: '0x8765...4321',
      amount: '50',
      locked: true,
      released: false,
      status: 'locked',
      createdAt: '2024-01-15'
    },
    {
      dealId: 2,
      payer: '0x2345...6789',
      payee: '0x9876...5432',
      amount: '75',
      locked: false,
      released: true,
      status: 'released',
      createdAt: '2024-01-10'
    },
    {
      dealId: 3,
      payer: '0x3456...7890',
      payee: '0x0987...6543',
      amount: '30',
      locked: false,
      released: false,
      status: 'refunded',
      createdAt: '2024-01-08'
    }
  ];

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !depositForm.dealId || !depositForm.amount || !depositForm.payee) return;

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'depositToEscrow',
        args: [
          BigInt(depositForm.dealId),
          depositForm.payee as `0x${string}`
        ],
        value: parseEther(depositForm.amount)
      });
      
      setDepositForm({ dealId: '', amount: '', payee: '' });
      setShowDepositForm(false);
    } catch (error) {
      console.error('Error depositing to escrow:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'locked':
        return <Lock className="h-4 w-4 text-yellow-400" />;
      case 'released':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'refunded':
        return <ArrowDownCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'released':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'refunded':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  const totalLocked = escrowPayments
    .filter(p => p.status === 'locked')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const totalReleased = escrowPayments
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const totalRefunded = escrowPayments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">Please connect your wallet to manage escrow</p>
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
          <h1 className="text-3xl font-bold text-white">Escrow Management</h1>
          <p className="text-white/70 mt-1">Secure payment management for your deals</p>
        </div>
        <button
          onClick={() => setShowDepositForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
        >
          <ArrowUpCircle className="h-5 w-5" />
          <span>Deposit to Escrow</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Locked</p>
              <p className="text-2xl font-bold text-white">{totalLocked.toFixed(2)} ETH</p>
            </div>
            <Lock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Released</p>
              <p className="text-2xl font-bold text-white">{totalReleased.toFixed(2)} ETH</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Refunded</p>
              <p className="text-2xl font-bold text-white">{totalRefunded.toFixed(2)} ETH</p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Active Escrows</p>
              <p className="text-2xl font-bold text-white">
                {escrowPayments.filter(p => p.status === 'locked').length}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Deposit Form Modal */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Deposit to Escrow</h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Deal ID</label>
                <input
                  type="number"
                  value={depositForm.dealId}
                  onChange={(e) => setDepositForm({ ...depositForm, dealId: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter deal ID"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Payee Address</label>
                <input
                  type="text"
                  value={depositForm.payee}
                  onChange={(e) => setDepositForm({ ...depositForm, payee: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDepositForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {isPending ? 'Depositing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escrow Payments List */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Escrow Payments</h2>
        <div className="space-y-4">
          {escrowPayments.map((payment) => (
            <div key={payment.dealId} className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-white">Deal #{payment.dealId}</h3>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-white/50">Payer</p>
                      <p className="text-white font-mono">{payment.payer}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Payee</p>
                      <p className="text-white font-mono">{payment.payee}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Amount</p>
                      <p className="text-white font-semibold flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {payment.amount} ETH
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50">Created</p>
                      <p className="text-white">{payment.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {payment.status === 'locked' && (
                    <>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                        Release
                      </button>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                        Refund
                      </button>
                    </>
                  )}
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EscrowManagement;