import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../../config/contract';
import { User, Building, Truck, CheckCircle, AlertCircle, Shield, Upload, FileText, X, Loader2 } from 'lucide-react';
import { uploadKYCDocuments } from '../../services/pinata';

const UserRegistration: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: '',
    role: 'importer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycFiles, setKycFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    uploading: boolean;
    success: boolean;
    error: string | null;
    ipfsHashes: string[];
    metadataHash: string | null;
  }>({
    uploading: false,
    success: false,
    error: null,
    ipfsHashes: [],
    metadataHash: null,
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Get admin address from contract
  const { data: adminAddress } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'admin',
  });

  const isAdmin = adminAddress?.toLowerCase() === address?.toLowerCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setKycFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setKycFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !formData.name.trim()) return;

    try {
      setIsSubmitting(true);
      setUploadStatus({ uploading: false, success: false, error: null, ipfsHashes: [], metadataHash: null });

      // Upload KYC documents to Pinata if files are present
      let kycMetadataHash = '';
      if (kycFiles.length > 0) {
        setUploadStatus(prev => ({ ...prev, uploading: true }));
        
        try {
          const uploadResult = await uploadKYCDocuments(
            kycFiles,
            address as string,
            formData.name
          );
          
          kycMetadataHash = uploadResult.metadataHash;
          
          setUploadStatus({
            uploading: false,
            success: true,
            error: null,
            ipfsHashes: uploadResult.files.map(f => f.IpfsHash),
            metadataHash: uploadResult.metadataHash,
          });
          
          console.log('KYC Documents uploaded to IPFS:', {
            files: uploadResult.files,
            metadataHash: uploadResult.metadataHash,
          });
        } catch (uploadError) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload documents';
          setUploadStatus(prev => ({ ...prev, uploading: false, error: errorMessage }));
          console.error('Upload error:', uploadError);
          return; // Don't proceed with registration if upload fails
        }
      }

      // Register user on blockchain
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'registerNewUser',
        args: [formData.name, formData.role],
      });

      // Note: In a production system, you would also store the kycMetadataHash
      // either in the smart contract or in a backend database linked to the user's address
      if (kycMetadataHash) {
        console.log('Store this metadata hash for user verification:', kycMetadataHash);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setUploadStatus(prev => ({ ...prev, error: 'Registration failed' }));
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

  // If user is admin, show admin info instead of registration form
  if (isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-effect rounded-xl p-8">
          <div className="text-center mb-6">
            <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Account Detected</h1>
            <p className="text-white/70">You are connected as the system administrator</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
            <h3 className="text-yellow-300 font-medium mb-3 flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Admin Privileges</span>
            </h3>
            <ul className="text-yellow-200 text-sm space-y-2">
              <li>✓ Verify registered users</li>
              <li>✓ Flag/unflag suspicious accounts</li>
              <li>✓ Verify deal deliveries</li>
              <li>✓ Finalize escrow payments (release or refund)</li>
              <li>✓ Monitor all system activities</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <p className="text-white/70 text-sm mb-2">Admin Wallet Address:</p>
            <p className="text-white font-mono text-sm break-all">{address}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-blue-300 font-medium mb-2">Important Notes</h3>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Admin accounts do not need to register</li>
              <li>• You have full access to the Admin Panel</li>
              <li>• Navigate to the Admin Panel to manage the system</li>
              <li>• Admin privileges were assigned during contract deployment</li>
            </ul>
          </div>

          <a
            href="/admin"
            className="mt-6 w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Shield className="h-5 w-5" />
            <span>Go to Admin Panel</span>
          </a>
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

        {uploadStatus.uploading && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center space-x-3">
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
            <div>
              <p className="text-blue-400 font-medium">Uploading KYC Documents to IPFS...</p>
              <p className="text-blue-300 text-sm">Please wait while we securely store your documents.</p>
            </div>
          </div>
        )}

        {uploadStatus.success && uploadStatus.metadataHash && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="text-green-400 font-medium">Documents Uploaded Successfully!</p>
            </div>
            <p className="text-green-300 text-sm mb-2">Your KYC documents are securely stored on IPFS.</p>
            <div className="bg-green-500/10 rounded p-2 mt-2">
              <p className="text-green-200 text-xs font-mono break-all">
                Metadata Hash: {uploadStatus.metadataHash}
              </p>
            </div>
          </div>
        )}

        {uploadStatus.error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div>
              <p className="text-red-400 font-medium">Upload Failed</p>
              <p className="text-red-300 text-sm">{uploadStatus.error}</p>
            </div>
          </div>
        )}

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

          {/* KYC Documents Upload */}
          <div>
            <label className="block text-white font-medium mb-2">KYC Documents</label>
            <p className="text-white/60 text-sm mb-3">Upload identity verification documents (ID, passport, business license, etc.)</p>
            
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors">
              <input
                type="file"
                id="kyc-upload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="kyc-upload" className="cursor-pointer">
                <Upload className="h-10 w-10 text-white/50 mx-auto mb-3" />
                <p className="text-white/70 mb-1">Click to upload or drag and drop</p>
                <p className="text-white/50 text-sm">PDF, JPG, PNG, DOC (Max 10MB per file)</p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {kycFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {kycFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-white text-sm font-medium">{file.name}</p>
                        <p className="text-white/50 text-xs">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-xs font-medium mb-1">🔒 Secure IPFS Storage via Pinata</p>
              <p className="text-blue-200 text-xs">
                Your documents will be encrypted and stored on IPFS (InterPlanetary File System) 
                using Pinata, ensuring decentralized and tamper-proof storage.
              </p>
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

        {/* Admin Info */}
        {adminAddress && (
          <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-yellow-400" />
              <h3 className="text-white/70 font-medium text-sm">System Administrator</h3>
            </div>
            <p className="text-white/50 text-xs font-mono break-all">
              {adminAddress as string}
            </p>
            <p className="text-white/40 text-xs mt-2">
              Note: Admin accounts are set during contract deployment and don't require registration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRegistration;