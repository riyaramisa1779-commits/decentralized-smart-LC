const pinataJWT = import.meta.env.VITE_PINATA_JWT;
const pinataApiKey = import.meta.env.VITE_PINATA_API_KEY;
const pinataSecretKey = import.meta.env.VITE_PINATA_SECRET_KEY;
const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY || "gateway.pinata.cloud";

// Pinata API endpoint
const PINATA_API_URL = "https://api.pinata.cloud";

// Use JWT if available, otherwise fall back to API Key/Secret
const useJWT = pinataJWT && pinataJWT !== 'your_pinata_jwt_token_here';

export interface UploadResult {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  url: string;
}

/**
 * Upload a single file to Pinata IPFS using REST API
 */
export const uploadFileToPinata = async (file: File): Promise<UploadResult> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Build headers based on authentication method
    const headers: Record<string, string> = useJWT
      ? { Authorization: `Bearer ${pinataJWT}` }
      : {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretKey,
        };

    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to upload file");
    }

    const data = await response.json();
    
    return {
      IpfsHash: data.IpfsHash,
      PinSize: data.PinSize,
      Timestamp: data.Timestamp,
      url: `https://${pinataGateway}/ipfs/${data.IpfsHash}`,
    };
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Failed to upload file to IPFS");
  }
};

/**
 * Upload multiple files to Pinata IPFS
 */
export const uploadMultipleFilesToPinata = async (
  files: File[]
): Promise<UploadResult[]> => {
  try {
    const uploadPromises = files.map((file) => uploadFileToPinata(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files to Pinata:", error);
    throw new Error("Failed to upload files to IPFS");
  }
};

/**
 * Upload JSON data to Pinata IPFS
 */
export const uploadJSONToPinata = async (jsonData: object): Promise<UploadResult> => {
  try {
    // Build headers based on authentication method
    const headers: Record<string, string> = useJWT
      ? {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pinataJWT}`,
        }
      : {
          "Content-Type": "application/json",
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretKey,
        };

    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        pinataContent: jsonData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to upload JSON");
    }

    const data = await response.json();
    
    return {
      IpfsHash: data.IpfsHash,
      PinSize: data.PinSize,
      Timestamp: data.Timestamp,
      url: `https://${pinataGateway}/ipfs/${data.IpfsHash}`,
    };
  } catch (error) {
    console.error("Error uploading JSON to Pinata:", error);
    throw new Error("Failed to upload JSON to IPFS");
  }
};

/**
 * Upload KYC documents with metadata
 */
export const uploadKYCDocuments = async (
  files: File[],
  userAddress: string,
  userName: string
): Promise<{ files: UploadResult[]; metadataHash: string }> => {
  try {
    // Upload all files
    const uploadedFiles = await uploadMultipleFilesToPinata(files);

    // Create metadata object
    const metadata = {
      userAddress,
      userName,
      uploadDate: new Date().toISOString(),
      documents: uploadedFiles.map((file, index) => ({
        fileName: files[index].name,
        fileSize: files[index].size,
        fileType: files[index].type,
        ipfsHash: file.IpfsHash,
        url: file.url,
      })),
    };

    // Upload metadata as JSON
    const metadataUpload = await uploadJSONToPinata(metadata);

    return {
      files: uploadedFiles,
      metadataHash: metadataUpload.IpfsHash,
    };
  } catch (error) {
    console.error("Error uploading KYC documents:", error);
    throw new Error("Failed to upload KYC documents");
  }
};
