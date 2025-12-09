import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useLocation } from "react-router-dom";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../config/contract";
import {
  DollarSign,
  Lock,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { parseEther } from "viem";
import { usePayments } from "../../hooks/usePayments";

const EscrowManagement: React.FC = () => {
  const { isConnected } = useAccount();
  const location = useLocation();
  const dealData = location.state as { dealId?: string; dealAmount?: string; exporter?: string } | null;
  
  const [depositForm, setDepositForm] = useState({
    dealId: "",
    amount: "",
    payee: "",
  });
  const [showDepositForm, setShowDepositForm] = useState(false);

  // Pre-fill form if coming from a deal
  useEffect(() => {
    if (dealData?.dealId) {
      setDepositForm({
        dealId: dealData.dealId,
        amount: dealData.dealAmount || "",
        payee: dealData.exporter || "",
      });
      setShowDepositForm(true);
    }
  }, [dealData]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { writeContract, isPending, isSuccess } = useWriteContract();
  const {
    payments: escrowPayments,
    loading,
    totalLocked,
    totalReleased,
    totalRefunded,
    activeEscrows,
    refetch,
  } = usePayments();

  // Show success message when payment is deposited
  useEffect(() => {
    if (isSuccess) {
      setSuccessMessage("Payment successfully deposited to escrow!");
      setTimeout(() => {
        setSuccessMessage(null);
        refetch(); // Refresh payment data
      }, 3000);
    }
  }, [isSuccess, refetch]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !isConnected ||
      !depositForm.dealId ||
      !depositForm.amount ||
      !depositForm.payee
    )
      return;

    try {
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "depositToEscrow",
        args: [BigInt(depositForm.dealId), depositForm.payee as `0x${string}`],
        value: parseEther(depositForm.amount),
      });

      setDepositForm({ dealId: "", amount: "", payee: "" });
      setShowDepositForm(false);
    } catch (error) {
      console.error("Error depositing to escrow:", error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "locked":
        return <Lock className="h-4 w-4 text-yellow-400" />;
      case "released":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "refunded":
        return <ArrowDownCircle className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "locked":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "released":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "refunded":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-red-500/20 text-red-300 border-red-500/30";
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
            Please connect your wallet to manage escrow
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
          <h1 className="text-3xl font-bold text-white">Escrow Management</h1>
          <p className="text-white/70 mt-1">
            Secure payment management for your deals
          </p>
        </div>
        <button
          onClick={() => setShowDepositForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
        >
          <ArrowUpCircle className="h-5 w-5" />
          <span>Deposit to Escrow</span>
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
          <div>
            <p className="text-green-300 font-medium">Success</p>
            <p className="text-green-200 text-sm mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Locked</p>
              <p className="text-2xl font-bold text-white">
                {totalLocked.toFixed(2)} ETH
              </p>
            </div>
            <Lock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Released</p>
              <p className="text-2xl font-bold text-white">
                {totalReleased.toFixed(2)} ETH
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Refunded</p>
              <p className="text-2xl font-bold text-white">
                {totalRefunded.toFixed(2)} ETH
              </p>
            </div>
            <ArrowDownCircle className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Active Escrows</p>
              <p className="text-2xl font-bold text-white">{activeEscrows}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Deposit Form Modal */}
      {showDepositForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-effect rounded-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">
              Deposit to Escrow
            </h2>
            
            {dealData?.dealId && (
              <div className="mb-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-blue-300 font-medium text-sm">Deal Information Loaded</p>
                  <p className="text-blue-200 text-xs mt-1">
                    Payment details have been pre-filled from Deal #{dealData.dealId}
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Deal ID
                </label>
                <input
                  type="number"
                  value={depositForm.dealId}
                  onChange={(e) =>
                    setDepositForm({ ...depositForm, dealId: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter deal ID"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Payee Address
                </label>
                <input
                  type="text"
                  value={depositForm.payee}
                  onChange={(e) =>
                    setDepositForm({ ...depositForm, payee: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
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
                  value={depositForm.amount}
                  onChange={(e) =>
                    setDepositForm({ ...depositForm, amount: e.target.value })
                  }
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
                  {isPending ? "Depositing..." : "Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Box - Escrow Process */}
      <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
        <div className="flex items-start space-x-3">
          <Lock className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-purple-300 font-medium mb-2">Secure Escrow System</h3>
            <div className="text-purple-200 text-sm space-y-1">
              <p>• <strong>Locked Status:</strong> Payment is held in a secure blockchain escrow account</p>
              <p>• <strong>No one can withdraw</strong> funds until admin verifies delivery</p>
              <p>• <strong>Admin Decision:</strong> Release to exporter (if delivered) or refund to importer (if not delivered)</p>
              <p>• <strong>Transparent:</strong> All parties can see the payment status in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Payments List */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Escrow Payments</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Loading payments...</p>
          </div>
        ) : escrowPayments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">
              No escrow payments found. Create a deal and deposit funds to get
              started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {escrowPayments.map((payment) => (
              <div
                key={payment.dealId}
                className="bg-white/5 rounded-lg p-6 border border-white/10"
              >
                <div className="space-y-4">
                  {/* Header with Status */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Deal #{payment.dealId}
                    </h3>
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs border ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </div>

                  {/* Payment Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Payer */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/50 text-xs mb-1">Payer (Importer)</p>
                      <p className="text-white font-mono text-xs break-all">
                        {payment.payer}
                      </p>
                    </div>

                    {/* Payee */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/50 text-xs mb-1">Payee (Exporter)</p>
                      <p className="text-white font-mono text-xs break-all">
                        {payment.payee}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/50 text-xs mb-1">Amount</p>
                      <p className="text-white text-lg font-semibold flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {payment.amount} ETH
                      </p>
                    </div>

                    {/* Created Date */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/50 text-xs mb-1">Created</p>
                      <p className="text-white text-sm">{payment.createdAt}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {payment.status === "locked" && (
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
        )}
      </div>
    </div>
  );
};

export default EscrowManagement;
