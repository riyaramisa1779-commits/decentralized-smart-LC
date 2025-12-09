import React, { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../../config/contract";
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Ban,
  UserCheck,
  Info,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAdminData } from "../../hooks/useAdminData";

const AdminPanel: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"users" | "deals" | "payments">(
    "users"
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Utility function to truncate addresses
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const { writeContract, isPending } = useWriteContract();
  const {
    pendingUsers,
    flaggedUsers,
    pendingDeals,
    pendingPayments,
    loading,
    usersLoading,
    dealsLoading,
    paymentsLoading,
    error,
    refetchUsers,
    refetchDeals,
    refetchPayments,
    refetchAll,
    stats,
  } = useAdminData();

  // Check if current user is admin
  const { data: adminAddress } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "admin",
  });

  const isAdmin = adminAddress === address;

  const handleVerifyUser = async (userAddress: string) => {
    if (!isAdmin) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "verifyRegisteredUser",
        args: [userAddress as `0x${string}`],
      });
      showSuccess("User verification transaction submitted");
      // Refresh users data after successful verification
      setTimeout(() => refetchUsers(), 2000);
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const handleFlagUser = async (userAddress: string) => {
    if (!isAdmin) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "flagSuspiciousUser",
        args: [userAddress as `0x${string}`],
      });
      showSuccess("User flagging transaction submitted");
      // Refresh users data after successful flagging
      setTimeout(() => refetchUsers(), 2000);
    } catch (error) {
      console.error("Error flagging user:", error);
    }
  };

  const handleVerifyDelivery = async (dealId: number) => {
    if (!isAdmin) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "verifyDealDelivery",
        args: [BigInt(dealId)],
      });
      showSuccess("Deal verification transaction submitted");
      // Refresh deals data after successful verification
      setTimeout(() => refetchDeals(), 2000);
    } catch (error) {
      console.error("Error verifying delivery:", error);
    }
  };

  const handleUnflagUser = async (userAddress: string) => {
    if (!isAdmin) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "unflagSuspiciousUser",
        args: [userAddress as `0x${string}`],
      });
      showSuccess("User unflagging transaction submitted");
      setTimeout(() => refetchUsers(), 2000);
    } catch (error) {
      console.error("Error unflagging user:", error);
    }
  };

  const handleFinalizePayment = async (dealId: number, goodsDelivered: boolean) => {
    if (!isAdmin) return;

    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "finalizeDealPayment",
        args: [BigInt(dealId), goodsDelivered],
      });
      showSuccess(
        `Payment ${goodsDelivered ? "release" : "refund"} transaction submitted`
      );
      setTimeout(() => refetchAll(), 2000);
    } catch (error) {
      console.error("Error finalizing payment:", error);
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
            Please connect your wallet to access admin panel
          </p>
          {/* <w3m-button /> */}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md mx-auto">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">
            You don't have admin privileges to access this panel
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left">
            <p className="text-white/70 text-sm mb-2">Your Wallet:</p>
            <p className="text-white font-mono text-xs break-all mb-4">{address}</p>
            
            <p className="text-white/70 text-sm mb-2">Admin Wallet:</p>
            <p className="text-yellow-400 font-mono text-xs break-all">
              {adminAddress as string}
            </p>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-left">
            <p className="text-blue-300 text-sm font-medium mb-2">How to Access Admin Panel:</p>
            <ul className="text-blue-200 text-xs space-y-1">
              <li>• Connect with the wallet that deployed the contract</li>
              <li>• Admin is set during contract deployment (msg.sender)</li>
              <li>• Only the deployer address has admin privileges</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/70 mt-1">
              Manage users, deals, and system operations
            </p>
          </div>
        </div>
        <button
          onClick={refetchAll}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
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

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
          <div>
            <p className="text-red-300 font-medium">Error Loading Data</p>
            <p className="text-red-200 text-sm mt-1">{error}</p>
            <button
              onClick={refetchAll}
              className="mt-2 text-red-300 hover:text-red-200 text-sm underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending Users</p>
              <p className="text-2xl font-bold text-white">
                {stats.pendingUsersCount}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending Deals</p>
              <p className="text-2xl font-bold text-white">
                {stats.pendingDealsCount}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Locked Payments</p>
              <p className="text-2xl font-bold text-white">
                {stats.pendingPaymentsCount}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Verified Users</p>
              <p className="text-2xl font-bold text-white">
                {stats.verifiedUsersCount}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Flagged Users</p>
              <p className="text-2xl font-bold text-white">
                {stats.flaggedUsersCount}
              </p>
            </div>
            <Ban className="h-8 w-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex space-x-1 mb-6">
          {[
            { id: "users", label: "User Verification", icon: Users },
            { id: "deals", label: "Deal Management", icon: CheckCircle },
            { id: "payments", label: "Payment Control", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Verification Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Pending User Verifications
              </h3>
              <button
                onClick={refetchUsers}
                disabled={usersLoading}
                className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                <RefreshCw
                  className={`h-3 w-3 ${usersLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh Users</span>
              </button>
            </div>

            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium">
                  Real-time Data Integration
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  Admin panel connects to the smart contract. User
                  registrations and verifications appear here automatically.
                  You can verify users or flag suspicious accounts using the buttons below.
                </p>
              </div>
            </div>

            {usersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading pending users...</p>
              </div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No pending user verifications</p>
                <p className="text-white/50 text-sm mt-2">
                  Users will appear here when they register through the system
                </p>
              </div>
            ) : (
              pendingUsers.map((user) => (
                <div
                  key={user.address}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-semibold">
                          {user.name}
                        </h4>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs capitalize">
                          {user.role}
                        </span>
                        {user.verified && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center space-x-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                      <p
                        className="text-white/70 text-sm font-mono"
                        title={user.address}
                      >
                        {truncateAddress(user.address)}
                      </p>
                      <p className="text-white/50 text-xs">
                        Registered:{" "}
                        {new Date(user.registeredAt).toLocaleDateString()} at{" "}
                        {new Date(user.registeredAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleVerifyUser(user.address)}
                        disabled={isPending || user.verified}
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

            {/* Flagged Users Section */}
            {flaggedUsers.length > 0 && (
              <>
                <div className="border-t border-white/10 my-6"></div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Ban className="h-5 w-5 text-red-400" />
                  <span>Flagged Users ({flaggedUsers.length})</span>
                </h3>
                {flaggedUsers.map((user) => (
                  <div
                    key={user.address}
                    className="bg-red-500/5 rounded-lg p-4 border border-red-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-white font-semibold">
                            {user.name}
                          </h4>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs capitalize">
                            {user.role}
                          </span>
                          <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs flex items-center space-x-1">
                            <Ban className="h-3 w-3" />
                            <span>Flagged</span>
                          </span>
                        </div>
                        <p
                          className="text-white/70 text-sm font-mono"
                          title={user.address}
                        >
                          {truncateAddress(user.address)}
                        </p>
                        <p className="text-white/50 text-xs">
                          Registered:{" "}
                          {new Date(user.registeredAt).toLocaleDateString()} at{" "}
                          {new Date(user.registeredAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUnflagUser(user.address)}
                          disabled={isPending}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Unflag</span>
                        </button>
                        <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Deal Management Tab */}
        {activeTab === "deals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Pending Deal Verifications
              </h3>
              <button
                onClick={refetchDeals}
                disabled={dealsLoading}
                className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                <RefreshCw
                  className={`h-3 w-3 ${dealsLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh Deals</span>
              </button>
            </div>

            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium">
                  Real-time Deal Monitoring
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  Deal management connects to the smart contract. As admin, you
                  can verify deliveries and manage deal disputes. Exporters must
                  approve their own deals.
                </p>
              </div>
            </div>

            {dealsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading pending deals...</p>
              </div>
            ) : pendingDeals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No pending deal verifications</p>
                <p className="text-white/50 text-sm mt-2">
                  Deals requiring admin approval will appear here
                </p>
              </div>
            ) : (
              pendingDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-semibold">
                          Deal #{deal.id}
                        </h4>
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                          {deal.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-white/70 mb-1">{deal.goods}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                        <div>
                          <p className="text-white/50">Importer</p>
                          <p
                            className="text-white font-mono"
                            title={deal.importer}
                          >
                            {truncateAddress(deal.importer)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Exporter</p>
                          <p
                            className="text-white font-mono"
                            title={deal.exporter}
                          >
                            {truncateAddress(deal.exporter)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Amount</p>
                          <p className="text-white font-semibold">
                            {deal.amount} ETH
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <span className="text-white/50">Document:</span>
                          {deal.documentHash ? (
                            <span className="text-green-400 font-mono" title={deal.documentHash}>
                              {truncateAddress(deal.documentHash)}
                            </span>
                          ) : (
                            <span className="text-red-400">Not uploaded</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white/50">Delivery:</span>
                          {deal.deliveryVerified ? (
                            <span className="text-green-400">✓ Verified</span>
                          ) : (
                            <span className="text-yellow-400">Pending</span>
                          )}
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
                        <span>Verify Delivery</span>
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
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Locked Escrow Payments
              </h3>
              <button
                onClick={refetchPayments}
                disabled={paymentsLoading}
                className="flex items-center space-x-1 px-3 py-1 bg-white/10 hover:bg-white/20 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                <RefreshCw
                  className={`h-3 w-3 ${paymentsLoading ? "animate-spin" : ""}`}
                />
                <span>Refresh Payments</span>
              </button>
            </div>

            {/* Info Message */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium">
                  Escrow Payment Management
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  As admin, you can finalize locked payments by either releasing funds to the exporter (if goods delivered) or refunding to the importer (if dispute/issue). This action is irreversible.
                </p>
              </div>
            </div>

            {paymentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/70">Loading locked payments...</p>
              </div>
            ) : pendingPayments.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70">No locked payments requiring action</p>
                <p className="text-white/50 text-sm mt-2">
                  Payments in escrow will appear here when they need admin resolution
                </p>
              </div>
            ) : (
              pendingPayments.map((payment) => (
                <div
                  key={payment.dealId}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-semibold">
                          Deal #{payment.dealId} - Escrow Payment
                        </h4>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          Locked
                        </span>
                      </div>
                      <p className="text-white/70 mb-2">
                        {payment.dealInfo?.goods || "N/A"}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-white/50">Payer (Importer)</p>
                          <p
                            className="text-white font-mono"
                            title={payment.payer}
                          >
                            {truncateAddress(payment.payer)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Payee (Exporter)</p>
                          <p
                            className="text-white font-mono"
                            title={payment.payee}
                          >
                            {truncateAddress(payment.payee)}
                          </p>
                        </div>
                        <div>
                          <p className="text-white/50">Amount</p>
                          <p className="text-white font-semibold">
                            {payment.amount} ETH
                          </p>
                        </div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 text-xs text-yellow-200">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        This payment is locked in escrow. Choose to release to exporter or refund to importer.
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <button
                        onClick={() => handleFinalizePayment(payment.dealId, true)}
                        disabled={isPending}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors whitespace-nowrap"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Release to Exporter</span>
                      </button>
                      <button
                        onClick={() => handleFinalizePayment(payment.dealId, false)}
                        disabled={isPending}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors whitespace-nowrap"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Refund to Importer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
