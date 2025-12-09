import { useState, useEffect, useCallback } from 'react';
import { useReadContract, usePublicClient } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { formatEther } from 'viem';

export interface Payment {
  dealId: number;
  payer: string;
  payee: string;
  amount: string;
  released: boolean;
  locked: boolean;
  status: 'locked' | 'released' | 'refunded' | 'loading';
  createdAt?: string;
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const publicClient = usePublicClient();

  // Get deal count to know how many potential payments there might be
  const { data: dealCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'dealCount',
  });

  const fetchPayments = useCallback(async () => {
    if (!publicClient || !dealCount || dealCount === 0n) {
      setPayments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const paymentsData: Payment[] = [];

    try {
      // Check each deal for payment details
      for (let i = 1; i <= Number(dealCount); i++) {
        try {
          const paymentDetails = await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'getPaymentDetails',
            args: [BigInt(i)]
          }) as any;
          
          if (paymentDetails && paymentDetails.amount > 0n) {
            paymentsData.push({
              dealId: Number(paymentDetails.dealId),
              payer: paymentDetails.payer,
              payee: paymentDetails.payee,
              amount: formatEther(paymentDetails.amount),
              released: paymentDetails.released,
              locked: paymentDetails.locked,
              status: 'loading', // Will be calculated by getStatusFromPayment
              createdAt: new Date().toISOString().split('T')[0]
            });
          }
        } catch (error) {
          // Payment doesn't exist for this deal
        }
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }

    setPayments(paymentsData);
    setLoading(false);
  }, [publicClient, dealCount]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatusFromPayment = (payment: Payment): Payment['status'] => {
    if (payment.status === 'loading') return 'loading';
    if (payment.released) return 'released';
    if (payment.locked) return 'locked';
    return 'refunded';
  };

  const paymentsWithStatus = payments.map(payment => ({
    ...payment,
    status: getStatusFromPayment(payment)
  }));

  // Calculate totals
  const totalLocked = paymentsWithStatus
    .filter(p => p.status === 'locked')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  const totalReleased = paymentsWithStatus
    .filter(p => p.status === 'released')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  const totalRefunded = paymentsWithStatus
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  return {
    payments: paymentsWithStatus,
    loading,
    totalLocked,
    totalReleased,
    totalRefunded,
    activeEscrows: paymentsWithStatus.filter(p => p.status === 'locked').length,
    refetch: fetchPayments
  };
};