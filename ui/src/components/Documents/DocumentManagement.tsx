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
  Hash,
  X
} from 'lucide-react';
import { pinataService } from '../../services/pinata.service';
import { validateFile, formatFileSize } from '../../utils/fileValidation';

interface Document {
  id: number;
  name: string;
  type: string;
  hash: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
  size: string;
  dealId: number;
}

const DocumentManagement: React.FC = () => {
  const { isConnected } = useAccount();
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);

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

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      event.target.value = '';
      return;
    }

    setUploadingFile(file);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Upload to Pinata IPFS
      const response = await pinataService.uploadFile(file, (progress) => {
        setUploadProgress(progress.percentage);
      });

      // Create new document entry
      const newDocument: Document = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        hash: response.IpfsHash,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'pending',
        size: formatFileSize(file.size),
        dealId: 1, // You can make this dynamic based on selected deal
      };

      // Add to uploaded documents
      setUploadedDocuments(prev => [newDocument, ...prev]);

      // Reset upload state
      setTimeout(() => {
        setUploadingFile(null);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
      setUploadingFile(null);
      setUploadProgress(0);
    }

    // Reset file input
    event.target.value = '';
  };

  const handleViewDocument = (hash: string) => {
    const url = pinataService.getGatewayUrl(hash);
    window.open(url, '_blank');
  };

  const handleDownloadDocument = async (hash: string, filename: string) => {
    try {
      const url = pinataService.getGatewayUrl(hash);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
    }
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
          {/* <w3m-button /> */}
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
            {uploadProgress === 100 && (
              <p className="text-green-400 text-sm mt-2">Upload complete!</p>
            )}
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">Upload Failed</p>
                <p className="text-red-300/70 text-sm mt-1">{uploadError}</p>
              </div>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Your Documents</h2>
        <div className="space-y-4">
          {[...uploadedDocuments, ...documents].map((doc) => (
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
                    <button 
                      onClick={() => handleViewDocument(doc.hash)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDownloadDocument(doc.hash, doc.name)}
                      className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      title="Download document"
                    >
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