# Services

This directory contains service layer implementations for external APIs and integrations.

## Pinata Service (`pinata.service.ts`)

IPFS file storage service using Pinata.

### Usage

```typescript
import { pinataService } from './services/pinata.service';

// Upload a file
const response = await pinataService.uploadFile(file, (progress) => {
  console.log(`Upload progress: ${progress.percentage}%`);
});
console.log('IPFS Hash:', response.IpfsHash);

// Get gateway URL
const url = pinataService.getGatewayUrl(response.IpfsHash);

// Test connection
const isConnected = await pinataService.testConnection();

// Unpin a file
await pinataService.unpinFile(ipfsHash);
```

### Configuration

Requires environment variables in `.env`:
- `VITE_PINATA_API_KEY`
- `VITE_PINATA_SECRET_KEY`
- `VITE_IPFS_GATEWAY` (optional)

### Methods

#### `uploadFile(file: File, onProgress?: (progress: UploadProgress) => void)`
Uploads a file to IPFS via Pinata with optional progress tracking.

**Returns:** `Promise<PinataUploadResponse>`
- `IpfsHash`: The IPFS CID of the uploaded file
- `PinSize`: Size of the pinned content in bytes
- `Timestamp`: Upload timestamp

#### `unpinFile(ipfsHash: string)`
Removes a file from Pinata (unpins from IPFS).

**Returns:** `Promise<void>`

#### `getGatewayUrl(ipfsHash: string)`
Generates a public gateway URL for accessing the file.

**Returns:** `string` - Full URL to access the file

#### `testConnection()`
Tests if API credentials are valid.

**Returns:** `Promise<boolean>` - True if authenticated successfully

### Error Handling

All methods throw errors that should be caught:

```typescript
try {
  await pinataService.uploadFile(file);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

Common errors:
- "Pinata API credentials are not configured"
- "Upload failed with status XXX"
- "Network error during upload"
- "Failed to unpin file"

### Testing

Use the test utility to verify configuration:

```typescript
import { testPinataConnection } from '../utils/testPinata';
await testPinataConnection();
```

Or in browser console:
```javascript
import('./utils/testPinata').then(m => m.testPinataConnection())
```
