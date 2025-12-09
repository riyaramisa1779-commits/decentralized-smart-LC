interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

class PinataService {
  private apiKey: string;
  private apiSecret: string;
  private pinataApiUrl = 'https://api.pinata.cloud';

  constructor() {
    this.apiKey = import.meta.env.VITE_PINATA_API_KEY || '';
    this.apiSecret = import.meta.env.VITE_PINATA_SECRET_KEY || '';

    if (!this.apiKey || !this.apiSecret) {
      console.warn('Pinata API credentials not found in environment variables');
    }
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PinataUploadResponse> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Pinata API credentials are not configured');
    }

    const formData = new FormData();
    formData.append('file', file);

    // Optional metadata
    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        fileType: file.type,
        fileSize: file.size.toString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    // Optional pinning options
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            onProgress({
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100),
            });
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${this.pinataApiUrl}/pinning/pinFileToIPFS`);
      xhr.setRequestHeader('pinata_api_key', this.apiKey);
      xhr.setRequestHeader('pinata_secret_api_key', this.apiSecret);
      xhr.send(formData);
    });
  }

  async unpinFile(ipfsHash: string): Promise<void> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('Pinata API credentials are not configured');
    }

    const response = await fetch(
      `${this.pinataApiUrl}/pinning/unpin/${ipfsHash}`,
      {
        method: 'DELETE',
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to unpin file: ${response.statusText}`);
    }
  }

  getGatewayUrl(ipfsHash: string): string {
    const gateway = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
    return `${gateway}${ipfsHash}`;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.pinataApiUrl}/data/testAuthentication`, {
        method: 'GET',
        headers: {
          pinata_api_key: this.apiKey,
          pinata_secret_api_key: this.apiSecret,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const pinataService = new PinataService();
export type { PinataUploadResponse, UploadProgress };
