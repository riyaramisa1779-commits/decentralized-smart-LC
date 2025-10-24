import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Eye,
  ThumbsUp,
  AlertCircle,
  RefreshCw,
  Info
} from 'lucide-react';
import { formatEther, parseEventLogs } from 'viem';

interface ExporterDeal {
  id: number;
  importer: string;
  goods: string;
  amount: string;
  status: 'pending' | 'approved' | 'delivered';
  documentHash: string;
}

const ExporterDashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [deals, setDeals] = useState<ExporterDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { writeContract, isPending } = useWriteContract();
  const publicClient = usePublicClient();

  // Get deal count
  const { data: dealCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'dealCount',
  });

  // Utility function to truncate addresses
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Fetch deals where current user is the exporter
  const fetchExporterDeals = async () => {
    if (!publicClient || !dealCount || !address) return;
    
    setLoading(true);
    try {
      const exporterDeals: ExporterDeal[] = [];
      const totalDeals = Number(dealCount);

      // Check each deal to see if current user is the exporter
      for (let i = 1; i <= totalDeals; i++) {
        try {
          const dealDetails = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'getDealDetails',
            args: [BigInt(i)]
          }) as any;

          // Only include deals where current user is the exporter
          if (dealDetails.exporter.toLowerCase() === address.toLowerCase()) {
            let status: 'pending' | 'approved' | 'delivered' = 'pending';
            
            if (dealDetails.deliveryVerified) {
              status = 'delivered';
            } else if (dealDetails.approved) {
              status = 'approved';
            }

            exporterDeals.push({
              id: i,
              importer: dealDetails.importer,
              goods: dealDetails.goodsDescription,
              amount: formatEther(dealDetails.amount),
              status,
              documentHash: dealDetails.documentHash
            });
          }
        } catch (error) {
          console.error(`Error fetching deal ${i}:`, error);
        }
      }

      setDeals(exporterDeals);
    } catch (error) {
      console.error('Error fetching exporter deals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deal approval
  const handleApproveDeal = async (dealId: number) => {
    try {
      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'approveDealByExporter',
        args: [BigInt(dealId)],
      });
      showSuccess('Deal approval transaction submitted');
      // Refresh deals data after successful approval
      setTimeout(() => fetchExporterDeals(), 2000);
    } catch (error) {
      console.error('Error approving deal:', error);
    }
  };

  useEffect(() => {
    fetchExporterDeals();
  }, [publicClient, dealCount, address]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">Please connect your wallet to access exporter dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Exporter Dashboard</h1>
            <p className="text-white/70 mt-1">Manage your export deals and approvals</p>
          </div>
        </div>
        <button
          onClick={fetchExporterDeals}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Deals</p>
              <p className="text-2xl font-bold text-white">{deals.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Pending Approval</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(deal => deal.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">
                {deals.filter(deal => deal.status === 'delivered').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Your Export Deals</h3>
        </div>

        {/* Info Message */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start space-x-3 mb-6">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Deal Management</p>
            <p className="text-blue-200 text-sm mt-1">
              Review and approve deals where you are the exporter. Once approved, importers can proceed with payments.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/70">Loading your deals...</p>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/70">No export deals found</p>
            <p className="text-white/50 text-sm mt-2">Deals where you are the exporter will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deals.map((deal) => (
              <div key={deal.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-semibold">Deal #{deal.id}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        deal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        deal.status === 'approved' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {deal.status === 'pending' ? 'Pending Approval' :
                         deal.status === 'approved' ? 'Approved' : 'Delivered'}
                      </span>
                    </div>
                    <p className="text-white/70 mb-2">{deal.goods}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/50">Importer</p>
                        <p className="text-white font-mono" title={deal.importer}>
                          {truncateAddress(deal.importer)}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/50">Amount</p>
                        <p className="text-white font-semibold">{deal.amount} ETH</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {deal.status === 'pending' && (
                      <button
                        onClick={() => handleApproveDeal(deal.id)}
                        disabled={isPending}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                    )}
                    <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>Details</span>
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

export default ExporterDashboard;