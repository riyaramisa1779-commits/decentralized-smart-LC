import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [userRole, setUserRole] = useState<string>('');

  // Read user details
  const { data: userData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'checkUserDetails',
    args: [address as `0x${string}`],
  });

  // Read deal count
  const { data: dealCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'dealCount',
  });

  useEffect(() => {
    if (userData) {
      setUserRole(userData.role);
    }
  }, [userData]);

  const stats = [
    {
      title: 'Total Deals',
      value: dealCount?.toString() || '0',
      icon: FileText,
      color: 'bg-blue-500',
      change: dealCount && dealCount > 0 ? '+' + dealCount.toString() : '0'
    },
    {
      title: 'Your Role',
      value: userRole || 'Not Registered',
      icon: Users,
      color: 'bg-green-500',
      change: userData?.verified ? 'Verified' : 'Pending'
    },
    {
      title: 'Wallet Connected',
      value: address ? 'Yes' : 'No',
      icon: DollarSign,
      color: 'bg-purple-500',
      change: address ? 'Active' : 'Disconnected'
    },
    {
      title: 'Account Status',
      value: userData?.verified ? 'Verified' : 'Pending',
      icon: TrendingUp,
      color: userData?.verified ? 'bg-green-500' : 'bg-orange-500',
      change: userData?.name ? 'Registered' : 'Not Registered'
    }
  ];

  // For now, show a simple message about real-time activity
  const recentActivity = [
    {
      id: 1,
      type: 'info',
      message: 'Connect your wallet and register to see activity',
      time: 'Now',
      status: 'info'
    }
  ];

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">Please connect your wallet to access the dashboard</p>
          <w3m-button />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-effect rounded-xl p-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {userData?.name || 'User'}!
        </h1>
        <p className="text-white/70">
          Role: <span className="capitalize font-semibold text-white">{userRole}</span>
          {userData?.verified ? (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </span>
          ) : (
            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300">
              <Clock className="h-3 w-3 mr-1" />
              Pending Verification
            </span>
          )}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-effect rounded-xl p-6 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500/20' :
                activity.status === 'warning' ? 'bg-yellow-500/20' :
                'bg-blue-500/20'
              }`}>
                {activity.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : activity.status === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.message}</p>
                <p className="text-white/50 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;