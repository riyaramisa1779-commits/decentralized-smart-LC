import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { User, Building, Truck, CheckCircle, AlertCircle } from 'lucide-react';

const UserRegistration: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    role: 'importer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'registerNewUser',
        args: [formData.name, formData.role],
      });
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    {
      value: 'importer',
      label: 'Importer',
      description: 'Import goods from international markets',
      icon: Building
    },
    {
      value: 'exporter',
      label: 'Exporter',
      description: 'Export goods to international markets',
      icon: Truck
    },
    {
      value: 'bank',
      label: 'Financial Institution',
      description: 'Provide financial services and verification',
      icon: User
    }
  ];

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">Please connect your wallet to register</p>
          {/* <w3m-button /> */}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Registration</h1>
          <p className="text-white/70">Join the decentralized LC ecosystem</p>
        </div>

        {isConfirmed && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium">Registration Successful!</p>
              <p className="text-green-300 text-sm">Your account is pending admin verification.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-red-400 font-medium">Registration Failed</p>
              <p className="text-red-300 text-sm">{error.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-white font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-white font-medium mb-4">Select Your Role</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                      formData.role === option.value
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={formData.role === option.value}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <Icon className="h-8 w-8 text-white mx-auto mb-2" />
                      <h3 className="text-white font-medium">{option.label}</h3>
                      <p className="text-white/60 text-sm mt-1">{option.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Wallet Address Display */}
          <div>
            <label className="block text-white font-medium mb-2">Wallet Address</label>
            <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white/70">
              {address}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || isConfirming || isSubmitting || !formData.name.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming || isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>
                  {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Submitting...'}
                </span>
              </div>
            ) : (
              'Register Account'
            )}
          </button>
        </form>

        {/* Information */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-blue-300 font-medium mb-2">Next Steps</h3>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Your registration will be reviewed by our admin team</li>
            <li>• You'll need to complete KYC verification</li>
            <li>• Upload required documents for your role</li>
            <li>• Once verified, you can start creating deals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;