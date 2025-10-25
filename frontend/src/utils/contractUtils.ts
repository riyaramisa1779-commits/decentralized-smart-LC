import { createPublicClient, http } from 'viem';
import { ganache } from '../config/wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

// Create a public client for reading contract data
const publicClient = createPublicClient({
  chain: ganache,
  transport: http('http://127.0.0.1:8545')
});

export const readDealDetails = async (dealId: number) => {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getDealDetails',
      args: [BigInt(dealId)],
    });
    return result;
  } catch (error) {
    console.error(`Error reading deal ${dealId}:`, error);
    return null;
  }
};

export const readPaymentDetails = async (dealId: number) => {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getPaymentDetails',
      args: [BigInt(dealId)],
    });
    return result;
  } catch (error) {
    console.error(`Error reading payment for deal ${dealId}:`, error);
    return null;
  }
};

export const readUserDetails = async (address: string) => {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'checkUserDetails',
      args: [address as `0x${string}`],
    });
    return result;
  } catch (error) {
    console.error(`Error reading user details for ${address}:`, error);
    return null;
  }
};

export const readDealCount = async () => {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'dealCount',
    });
    return result;
  } catch (error) {
    console.error('Error reading deal count:', error);
    return 0n;
  }
};