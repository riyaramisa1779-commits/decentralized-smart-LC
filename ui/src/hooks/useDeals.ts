import { useState, useEffect, useCallback } from 'react';
import { useReadContract, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { formatEther } from 'viem';

export interface Deal {
  id: number;
  importer: string;
  exporter: string;
  goodsDescription: string;
  amount: string;
  documentHash: string;
  approved: boolean;
  deliveryVerified: boolean;
  paymentDeposited: boolean;
  paymentLocked: boolean;
  paymentReleased: boolean;
  status: 'pending' | 'approved' | 'payment_pending' | 'payment_locked' | 'completed' | 'loading';
}

export const useDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  // Get total deal count
  const { data: dealCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'dealCount',
  });

  const fetchAllDeals = useCallback(async () => {
    if (!publicClient || !dealCount || dealCount === 0n) {
      setDeals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const dealsData: Deal[] = [];

    try {
      // Fetch each deal individually
      for (let i = 1; i <= Number(dealCount); i++) {
        try {
          const dealDetails = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'getDealDetails',
            args: [BigInt(i)]
          }) as any;

          // Check payment status
          let paymentDeposited = false;
          let paymentLocked = false;
          let paymentReleased = false;

          try {
            const paymentDetails = await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: CONTRACT_ABI,
              functionName: 'getPaymentDetails',
              args: [BigInt(i)]
            }) as any;

            if (paymentDetails.amount > 0) {
              paymentDeposited = true;
              paymentLocked = paymentDetails.locked;
              paymentReleased = paymentDetails.released;
            }
          } catch {
            // Payment doesn't exist yet
          }
          
          dealsData.push({
            id: Number(dealDetails.id),
            importer: dealDetails.importer,
            exporter: dealDetails.exporter,
            goodsDescription: dealDetails.goodsDescription,
            amount: formatEther(dealDetails.amount),
            documentHash: dealDetails.documentHash,
            approved: dealDetails.approved,
            deliveryVerified: dealDetails.deliveryVerified,
            paymentDeposited,
            paymentLocked,
            paymentReleased,
            status: 'loading' // Will be calculated below
          });
        } catch (error) {
          console.error(`Error fetching deal ${i}:`, error);
        }
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    }

    setDeals(dealsData);
    setLoading(false);
  }, [publicClient, dealCount]);

  useEffect(() => {
    fetchAllDeals();
  }, [fetchAllDeals]);

  const getStatusFromDeal = (deal: Deal): Deal['status'] => {
    if (deal.status === 'loading') return 'loading';
    if (deal.deliveryVerified && deal.paymentReleased) return 'completed';
    if (deal.paymentLocked) return 'payment_locked';
    if (deal.paymentDeposited) return 'payment_pending';
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
    refetch: fetchAllDeals
  };
};