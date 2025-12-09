import { useState, useEffect, useCallback } from "react";
import { useReadContract, usePublicClient } from "wagmi";
import { formatEther, parseEventLogs } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";

export interface PendingUser {
  address: string;
  name: string;
  role: string;
  registeredAt: string;
  verified: boolean;
}

export interface PendingDeal {
  id: number;
  importer: string;
  exporter: string;
  goods: string;
  amount: string;
  status: string;
  documentHash?: string;
  deliveryVerified: boolean;
}

export interface PendingPayment {
  dealId: number;
  payer: string;
  payee: string;
  amount: string;
  released: boolean;
  locked: boolean;
  dealInfo?: {
    goods: string;
    importer: string;
    exporter: string;
  };
}

export const useAdminData = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [flaggedUsers, setFlaggedUsers] = useState<PendingUser[]>([]);
  const [pendingDeals, setPendingDeals] = useState<PendingDeal[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [verifiedUsersCount, setVerifiedUsersCount] = useState(0);
  const [flaggedUsersCount, setFlaggedUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const publicClient = usePublicClient();

  // Get deal count to know how many deals to check
  const { data: dealCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "dealCount",
  });

  // Fetch pending users from UserRegistered events
  const fetchPendingUsers = useCallback(async () => {
    if (!publicClient) return;

    setUsersLoading(true);
    setError(null);
    try {
      // Get all logs from the contract
      const logs = await publicClient.getLogs({
        address: CONTRACT_ADDRESS as `0x${string}`,
        fromBlock: "earliest",
        toBlock: "latest",
      });

      // Parse the logs to get structured event data
      const parsedLogs = parseEventLogs({
        abi: CONTRACT_ABI,
        logs,
      });

      // Filter for UserRegistered and UserVerified events
      const userRegisteredLogs = parsedLogs.filter(
        (log) => log.eventName === "UserRegistered"
      );
      const userVerifiedLogs = parsedLogs.filter(
        (log) => log.eventName === "UserVerified"
      );

      const verifiedAddresses = new Set(
        userVerifiedLogs.map((log) => (log.args as any).user?.toLowerCase())
      );

      const pendingUsersList: PendingUser[] = [];
      const flaggedUsersList: PendingUser[] = [];
      let verifiedCount = 0;
      let flaggedCount = 0;

      // Process each registered user
      for (const log of userRegisteredLogs) {
        const args = log.args as any;
        const userAddress = args.user as string;
        const userRole = args.role as string;

        try {
          // Get user details from contract
          const userDetails = (await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: "checkUserDetails",
            args: [userAddress as `0x${string}`],
          })) as any;

          // Check if user is flagged
          const isFlagged = (await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: "flaggedUsers",
            args: [userAddress as `0x${string}`],
          })) as boolean;

          const isVerified = verifiedAddresses.has(userAddress.toLowerCase());

          // Get block timestamp for more accurate registration time
          const block = await publicClient.getBlock({
            blockNumber: log.blockNumber,
          });

          const userInfo: PendingUser = {
            address: userAddress,
            name: userDetails.name || "Unknown",
            role: userRole,
            registeredAt: new Date(
              Number(block.timestamp) * 1000
            ).toISOString(),
            verified: isVerified,
          };

          if (isFlagged) {
            flaggedCount++;
            flaggedUsersList.push(userInfo);
          }

          if (isVerified) {
            verifiedCount++;
          } else {
            // Only add to pending if not verified
            pendingUsersList.push(userInfo);
          }
        } catch (error) {
          console.error(
            `Error fetching details for user ${userAddress}:`,
            error
          );
        }
      }

      setPendingUsers(pendingUsersList);
      setFlaggedUsers(flaggedUsersList);
      setVerifiedUsersCount(verifiedCount);
      setFlaggedUsersCount(flaggedCount);
    } catch (error) {
      console.error("Error fetching pending users:", error);
      setError("Failed to fetch pending users");
      setPendingUsers([]);
      setVerifiedUsersCount(0);
      setFlaggedUsersCount(0);
    } finally {
      setUsersLoading(false);
    }
  }, [publicClient]);

  // Fetch pending deals
  const fetchPendingDeals = useCallback(async () => {
    if (!publicClient || !dealCount) return;

    setDealsLoading(true);
    try {
      const pendingDealsList: PendingDeal[] = [];
      const totalDeals = Number(dealCount);

      // Check each deal to see if it's pending approval
      for (let i = 1; i <= totalDeals; i++) {
        try {
          const dealDetails = (await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: "getDealDetails",
            args: [BigInt(i)],
          })) as any;

          // Only include deals that are not approved yet
          if (!dealDetails.approved) {
            let status = "Pending Approval";

            // Check if payment has been deposited
            try {
              const paymentDetails = (await publicClient.readContract({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: CONTRACT_ABI,
                functionName: "getPaymentDetails",
                args: [BigInt(i)],
              })) as any;

              if (paymentDetails.amount > 0) {
                if (paymentDetails.locked) {
                  status = "Payment Locked - Awaiting Resolution";
                } else {
                  status = "Payment Deposited - Awaiting Approval";
                }
              }
            } catch {
              // Payment might not exist yet, keep default status
            }

            pendingDealsList.push({
              id: i,
              importer: dealDetails.importer,
              exporter: dealDetails.exporter,
              goods: dealDetails.goodsDescription,
              amount: formatEther(dealDetails.amount),
              status,
              documentHash: dealDetails.documentHash,
              deliveryVerified: dealDetails.deliveryVerified,
            });
          }
        } catch (error) {
          console.error(`Error fetching deal ${i}:`, error);
        }
      }

      setPendingDeals(pendingDealsList);
    } catch (error) {
      console.error("Error fetching pending deals:", error);
      setError("Failed to fetch pending deals");
      setPendingDeals([]);
    } finally {
      setDealsLoading(false);
    }
  }, [publicClient, dealCount]);

  // Effect for fetching users
  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  // Effect for fetching deals
  useEffect(() => {
    fetchPendingDeals();
  }, [fetchPendingDeals]);

  // Fetch pending payments (locked escrow payments)
  const fetchPendingPayments = useCallback(async () => {
    if (!publicClient || !dealCount) return;

    setPaymentsLoading(true);
    try {
      const pendingPaymentsList: PendingPayment[] = [];
      const totalDeals = Number(dealCount);

      for (let i = 1; i <= totalDeals; i++) {
        try {
          const paymentDetails = (await publicClient.readContract({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: "getPaymentDetails",
            args: [BigInt(i)],
          })) as any;

          // Only include payments that are locked (awaiting admin action)
          if (paymentDetails.locked && !paymentDetails.released) {
            const dealDetails = (await publicClient.readContract({
              address: CONTRACT_ADDRESS as `0x${string}`,
              abi: CONTRACT_ABI,
              functionName: "getDealDetails",
              args: [BigInt(i)],
            })) as any;

            pendingPaymentsList.push({
              dealId: i,
              payer: paymentDetails.payer,
              payee: paymentDetails.payee,
              amount: formatEther(paymentDetails.amount),
              released: paymentDetails.released,
              locked: paymentDetails.locked,
              dealInfo: {
                goods: dealDetails.goodsDescription,
                importer: dealDetails.importer,
                exporter: dealDetails.exporter,
              },
            });
          }
        } catch (error) {
          // Payment might not exist for this deal
        }
      }

      setPendingPayments(pendingPaymentsList);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      setPendingPayments([]);
    } finally {
      setPaymentsLoading(false);
    }
  }, [publicClient, dealCount]);

  // Effect for fetching payments
  useEffect(() => {
    fetchPendingPayments();
  }, [fetchPendingPayments]);

  // Update overall loading state
  useEffect(() => {
    setLoading(usersLoading || dealsLoading || paymentsLoading);
  }, [usersLoading, dealsLoading, paymentsLoading]);

  // Helper function to refresh all data
  const refetchAll = useCallback(async () => {
    await Promise.all([fetchPendingUsers(), fetchPendingDeals(), fetchPendingPayments()]);
  }, [fetchPendingUsers, fetchPendingDeals, fetchPendingPayments]);

  return {
    pendingUsers,
    flaggedUsers,
    pendingDeals,
    pendingPayments,
    loading,
    usersLoading,
    dealsLoading,
    paymentsLoading,
    error,
    refetchUsers: fetchPendingUsers,
    refetchDeals: fetchPendingDeals,
    refetchPayments: fetchPendingPayments,
    refetchAll,
    stats: {
      pendingUsersCount: pendingUsers.length,
      pendingDealsCount: pendingDeals.length,
      pendingPaymentsCount: pendingPayments.length,
      verifiedUsersCount,
      flaggedUsersCount,
    },
  };
};
