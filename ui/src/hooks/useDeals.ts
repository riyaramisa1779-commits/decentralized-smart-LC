import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { formatEther } from 'viem';
import { readDealDetails, readDealCount } from '../utils/contractUtils';

export interface Deal {
  id: number;
  importer: string;
  exporter: string;
  goodsDescription: string;
  amount: string;
  documentHash: string;
  approved: boolean;
  deliveryVerified: boolean;
  status: 'pending' | 'approved' | 'completed' | 'loading';
}

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Get total deal count
  const { data: dealCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'dealCount',
  });

  // Fetch individual deal details
  const fetchDealDetails = async (dealId: number) => {
    try {
      // Note: We'll need to implement this with a direct contract call
      // since useReadContract doesn't work well in loops
      return null;
    } catch (error) {
      console.error(`Error fetching deal ${dealId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllDeals = async () => {
      if (!dealCount || dealCount === 0n) {
        setDeals([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const dealsData: Deal[] = [];

      try {
        // Fetch each deal individually
        for (let i = 1; i <= Number(dealCount); i++) {
          const dealDetails = await readDealDetails(i);
          
          if (dealDetails) {
            dealsData.push({
              id: Number(dealDetails.id),
              importer: dealDetails.importer,
              exporter: dealDetails.exporter,
              goodsDescription: dealDetails.goodsDescription,
              amount: formatEther(dealDetails.amount),
              documentHash: dealDetails.documentHash,
              approved: dealDetails.approved,
              deliveryVerified: dealDetails.deliveryVerified,
              status: 'loading' // Will be calculated by getStatusFromDeal
            });
          } else {
            // Fallback for failed reads
            dealsData.push({
              id: i,
              importer: '0x0000000000000000000000000000000000000000',
              exporter: '0x0000000000000000000000000000000000000000',
              goodsDescription: `Deal #${i} - Failed to load`,
              amount: '0',
              documentHash: '',
              approved: false,
              deliveryVerified: false,
              status: 'loading'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Create placeholder deals on error
        for (let i = 1; i <= Number(dealCount); i++) {
          dealsData.push({
            id: i,
            importer: '0x0000000000000000000000000000000000000000',
            exporter: '0x0000000000000000000000000000000000000000',
            goodsDescription: `Deal #${i} - Connection error`,
            amount: '0',
            documentHash: '',
            approved: false,
            deliveryVerified: false,
            status: 'loading'
          });
        }
      }

      setDeals(dealsData);
      setLoading(false);
    };

    fetchAllDeals();
  }, [dealCount]);

  const getStatusFromDeal = (deal: Deal): Deal['status'] => {
    if (deal.status === 'loading') return 'loading';
    if (deal.deliveryVerified) return 'completed';
    if (deal.approved) return 'approved';
    return 'pending';
  };

  const dealsWithStatus = deals.map(deal => ({
    ...deal,
    status: getStatusFromDeal(deal)
  }));

  return {
    deals: dealsWithStatus,
    loading,
    dealCount: dealCount ? Number(dealCount) : 0,
    refetch: () => {
      // Trigger refetch logic here
    }
  };
};