import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Hash
} from 'lucide-react';

const DocumentManagement: React.FC = () => {
  const { isConnected } = useAccount();
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: 'Trade License',
      type: 'license',
      hash: 'QmX1234567890abcdef',
      uploadedAt: '2024-01-15',
      status: 'verified',
      size: '2.4 MB',
      dealId: 1
    },
    {
      id: 2,
      name: 'Shipping Invoice',
      type: 'invoice',
      hash: 'QmY0987654321fedcba',
      uploadedAt: '2024-01-14',
      status: 'pending',
      size: '1.8 MB',
      dealId: 1
    },
    {
      id: 3,
      name: 'Certificate of Origin',
      type: 'certificate',
      hash: 'QmZ5555666677778888',
      uploadedAt: '2024-01-13',
      status: 'rejected',
      size: '3.1 MB',
      dealId: 2
    }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(file);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadingFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">Please connect your wallet to manage documents</p>
          <w3m-button />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Document Management</h1>
          <p className="text-white/70 mt-1">Secure document storage on IPFS</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Upload Documents</h2>
        <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">Upload your documents</h3>
          <p className="text-white/70 text-sm mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Choose Files</span>
          </label>
        </div>

        {/* Upload Progress */}
        {uploadingFile && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">{uploadingFile.name}</span>
              <span className="text-white/70 text-sm">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Your Documents</h2>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{doc.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-white/70">
                      <span>Deal #{doc.dealId}</span>
                      <span>{doc.size}</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Hash className="h-3 w-3 text-white/50" />
                      <span className="text-xs text-white/50 font-mono">{doc.hash}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    <span className="capitalize">{doc.status}</span>
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Types Info */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Required Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Trade License', required: true, description: 'Valid business license' },
            { name: 'Export/Import License', required: true, description: 'Government issued license' },
            { name: 'Certificate of Origin', required: true, description: 'Product origin certificate' },
            { name: 'Commercial Invoice', required: true, description: 'Detailed invoice' },
            { name: 'Packing List', required: false, description: 'Goods packing details' },
            { name: 'Insurance Certificate', required: false, description: 'Cargo insurance' }
          ].map((docType, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-blue-400" />
                <h3 className="text-white font-medium text-sm">{docType.name}</h3>
                {docType.required && (
                  <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                    Required
                  </span>
                )}
              </div>
              <p className="text-white/70 text-xs">{docType.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;