import { formatEther, parseEther } from 'viem';

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatCurrency = (amount: string | bigint, decimals: number = 4): string => {
  try {
    const formatted = formatEther(BigInt(amount));
    return parseFloat(formatted).toFixed(decimals);
  } catch {
    return '0.0000';
  }
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    approved: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-300 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    verified: 'bg-green-500/20 text-green-300 border-green-500/30',
    locked: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    released: 'bg-green-500/20 text-green-300 border-green-500/30',
    refunded: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  };
  return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const validateEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const generateMockHash = (): string => {
  return `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};