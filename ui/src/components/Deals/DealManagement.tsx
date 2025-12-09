import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useNavigate } from "react-router-dom";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../config/contract";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { parseEther } from "viem";
import { useDeals } from "../../hooks/useDeals";

const DealManagement: React.FC = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [newDeal, setNewDeal] = useState({
    exporter: "",
    productName: "",
    productQuantity: "",
    amount: "",
  });

  const { writeContract, isPending, isSuccess } = useWriteContract();
  const { deals, loading, dealCount, refetch } = useDeals();

  // Calculate stats from deals array
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0
  });

  // Update stats whenever deals change
  useEffect(() => {
    setStats({
      total: dealCount,
      pending: deals.filter((d) => d.status === "pending").length,
      approved: deals.filter((d) => 
        d.status === "approved" || 
        d.status === "payment_pending" || 
        d.status === "payment_locked"
      ).length,
      completed: deals.filter((d) => d.status === "completed").length
    });
  }, [deals, dealCount]);

  // Auto-refresh deals every 5 seconds to catch status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      refetch();
      setTimeout(() => setIsRefreshing(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Refetch immediately after successful transaction
  useEffect(() => {
    if (isSuccess) {
      // Wait a bit for blockchain to update, then refetch
      setTimeout(() => {
        setIsRefreshing(true);
        refetch();
        setTimeout(() => setIsRefreshing(false), 500);
      }, 2000);
    }
  }, [isSuccess, refetch]);

  // Manual refresh function
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !newDeal.exporter || !newDeal.productName || !newDeal.productQuantity || !newDeal.amount)
      return;

    try {
      // Format goods description from product name and quantity
      const goodsDescription = `${newDeal.productName} (Quantity: ${newDeal.productQuantity})`;
      
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "createNewDeal",
        args: [
          newDeal.exporter as `0x${string}`,
          goodsDescription,
          parseEther(newDeal.amount),
        ],
      });

      // Reset form and close modal
      setNewDeal({ exporter: "", productName: "", productQuantity: "", amount: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating deal:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      case "payment_pending":
        return <DollarSign className="h-4 w-4 text-purple-400" />;
      case "payment_locked":
        return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "approved":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "payment_pending":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "payment_locked":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-red-500/20 text-red-300 border-red-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Approval";
      case "approved":
        return "Approved - Ready for Payment";
      case "payment_pending":
        return "Payment Deposited";
      case "payment_locked":
        return "Payment Locked - Awaiting Admin";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-white/70 mb-6">
            Please connect your wallet to manage deals
          </p>
          {/* <w3m-button /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center space-x-3">
            <span>Deal Management</span>
            {isRefreshing && (
              <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
            )}
          </h1>
          <p className="text-white/70 mt-1">
            Create and manage your trade deals
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white px-4 py-3 rounded-lg transition-all duration-200 border border-white/20"
            title="Refresh deals"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Create Deal</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Deals</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Approved</p>
              <p className="text-2xl font-bold text-white">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Create Deal Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Create New Deal
            </h2>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Exporter Address
                </label>
                <input
                  type="text"
                  value={newDeal.exporter}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, exporter: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newDeal.productName}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, productName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Cotton T-Shirts, Electronics, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Product Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={newDeal.productQuantity}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, productQuantity: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={newDeal.amount}
                  onChange={(e) =>
                    setNewDeal({ ...newDeal, amount: e.target.value })
                  }
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
                  {isPending ? "Creating..." : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Deal Details Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-effect rounded-xl p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Deal #{selectedDeal.id} Details
              </h2>
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm border ${getStatusColor(
                  selectedDeal.status
                )}`}
              >
                {getStatusIcon(selectedDeal.status)}
                <span>{getStatusLabel(selectedDeal.status)}</span>
              </span>
            </div>

            <div className="space-y-6">
              {/* Goods Description */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <label className="block text-white/70 text-sm mb-2">
                  Goods Description
                </label>
                <p className="text-white text-lg">{selectedDeal.goodsDescription}</p>
              </div>

              {/* Deal Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <label className="block text-white/70 text-sm mb-2">
                    Importer Address
                  </label>
                  <p className="text-white font-mono text-sm break-all">
                    {selectedDeal.importer}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <label className="block text-white/70 text-sm mb-2">
                    Exporter Address
                  </label>
                  <p className="text-white font-mono text-sm break-all">
                    {selectedDeal.exporter}
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <label className="block text-white/70 text-sm mb-2">
                    Deal Amount
                  </label>
                  <p className="text-white text-xl font-semibold flex items-center">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {selectedDeal.amount} ETH
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <label className="block text-white/70 text-sm mb-2">
                    Deal Status
                  </label>
                  <p className="text-white text-lg capitalize">
                    {selectedDeal.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setSelectedDeal(null)}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              {selectedDeal.status === "pending" && (
                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  Approve Deal
                </button>
              )}
              {selectedDeal.status === "approved" && selectedDeal.importer.toLowerCase() === address?.toLowerCase() && (
                <button 
                  onClick={() => navigate('/escrow', { state: { dealId: selectedDeal.id, dealAmount: selectedDeal.amount, exporter: selectedDeal.exporter } })}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
              {(selectedDeal.status === "payment_pending" || selectedDeal.status === "payment_locked") && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-300 text-sm">
                    {selectedDeal.status === "payment_locked" 
                      ? "Payment locked - Awaiting admin resolution" 
                      : "Payment deposited in escrow"}
                  </span>
                </div>
              )}
              {selectedDeal.status === "completed" && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-300 text-sm">Deal completed successfully</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box - Deal Flow */}
      <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-300 font-medium mb-2">Deal Flow Process</h3>
            <div className="text-blue-200 text-sm space-y-1">
              <p>1. <strong>Importer creates deal</strong> → Status: Pending</p>
              <p>2. <strong>Exporter approves deal</strong> → Status: Approved (Ready for Payment)</p>
              <p>3. <strong>Importer deposits payment</strong> → Status: Payment in Escrow (Funds locked in secure account)</p>
              <p>4. <strong>Admin verifies delivery</strong> → Status: Payment Locked (Awaiting admin decision)</p>
              <p>5. <strong>Admin releases/refunds</strong> → Status: Completed (Funds sent to exporter or refunded to importer)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Your Deals</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Loading deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">
              No deals found. Create your first deal to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white/5 rounded-lg p-6 border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        Deal #{deal.id}
                      </h3>
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(
                          deal.status
                        )}`}
                      >
                        {getStatusIcon(deal.status)}
                        <span>{getStatusLabel(deal.status)}</span>
                      </span>
                    </div>
                    <p className="text-white/70 mb-3">
                      {deal.goodsDescription}
                    </p>
                    <div className="grid grid-cols-1  gap-4 text-sm">
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
                  <div className="flex flex-col space-y-2">
                    <button 
                      onClick={() => setSelectedDeal(deal)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      View Details
                    </button>
                    {deal.status === "pending" && (
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors">
                        Approve
                      </button>
                    )}
                    {deal.status === "approved" && deal.importer.toLowerCase() === address?.toLowerCase() && (
                      <button 
                        onClick={() => navigate('/escrow', { state: { dealId: deal.id, dealAmount: deal.amount, exporter: deal.exporter } })}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>Pay Now</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                    {deal.status === "payment_pending" && (
                      <div className="px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-300 text-center">
                        Payment in Escrow
                      </div>
                    )}
                    {deal.status === "payment_locked" && (
                      <div className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs text-orange-300 text-center">
                        Awaiting Admin
                      </div>
                    )}
                    {deal.status === "completed" && (
                      <div className="px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-300 text-center flex items-center justify-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealManagement;
