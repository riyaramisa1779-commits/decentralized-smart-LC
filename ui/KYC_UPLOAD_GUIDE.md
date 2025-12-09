# KYC Document Upload Feature

## Overview

The User Registration component now includes secure KYC (Know Your Customer) document upload functionality using Pinata IPFS storage.

## Features

✅ **Secure IPFS Storage** - Documents stored on decentralized IPFS network
✅ **Multiple File Upload** - Upload multiple documents at once
✅ **File Preview** - See uploaded files before submission
✅ **Progress Indicators** - Real-time upload status
✅ **Metadata Tracking** - All uploads tracked with timestamps and user info
✅ **Error Handling** - Clear error messages for failed uploads

## User Flow

### 1. Registration Form
- Enter your full name
- Select your role (Importer/Exporter/Bank)
- Your wallet address is automatically detected

### 2. Upload KYC Documents
- Click the upload area or drag & drop files
- Supported formats: PDF, JPG, PNG, DOC, DOCX
- Max file size: 10MB per file (Pinata free tier: 100MB)
- Upload multiple documents (ID, passport, business license, etc.)

### 3. Review Uploaded Files
- See list of uploaded files with names and sizes
- Remove any file by clicking the X button
- Add more files if needed

### 4. Submit Registration
- Click "Register Account"
- Files are uploaded to IPFS (progress shown)
- IPFS hashes are generated for each file
- Metadata JSON is created and uploaded
- User registration is submitted to blockchain

### 5. Confirmation
- Success message shows upload completion
- IPFS metadata hash is displayed
- Registration pending admin verification

## Technical Details

### What Gets Uploaded

1. **Individual Documents**
   - Each file uploaded separately to IPFS
   - Unique IPFS hash for each document
   - Accessible via Pinata gateway

2. **Metadata JSON**
   - Contains all document information
   - Links to individual file hashes
   - Includes user info and timestamp
   - Single metadata hash for easy reference

### IPFS Hash Example

```
Metadata Hash: QmX7Kd9fJ3mN2pQ8rT5vW6yZ1aB4cD7eF9gH2iJ5kL8mN0o
```

This hash can be used to:
- Retrieve all KYC documents
- Verify document authenticity
- Share with admin for verification
- Store on-chain for permanent record

## For Administrators

### Verifying KYC Documents

1. Get the metadata hash from user registration
2. Access via: `https://gateway.pinata.cloud/ipfs/{metadataHash}`
3. View the JSON metadata with all document links
4. Click individual document URLs to view files
5. Verify authenticity and approve/reject user

### Metadata Structure

```json
{
  "userAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "userName": "John Doe",
  "uploadDate": "2024-12-10T10:30:00.000Z",
  "documents": [
    {
      "fileName": "passport.pdf",
      "fileSize": 245678,
      "fileType": "application/pdf",
      "ipfsHash": "QmAbc123...",
      "url": "https://gateway.pinata.cloud/ipfs/QmAbc123..."
    },
    {
      "fileName": "business_license.jpg",
      "fileSize": 189234,
      "fileType": "image/jpeg",
      "ipfsHash": "QmDef456...",
      "url": "https://gateway.pinata.cloud/ipfs/QmDef456..."
    }
  ]
}
```

## Security & Privacy

### Important Notes

⚠️ **Public Access**: Files on IPFS are publicly accessible to anyone with the hash
⚠️ **Permanent Storage**: Files cannot be deleted from IPFS (only unpinned from Pinata)
⚠️ **No Encryption**: Files are stored as-is without encryption

### Recommendations for Production

1. **Client-Side Encryption**
   - Encrypt files before upload
   - Store decryption keys securely
   - Only authorized parties can decrypt

2. **Access Control**
   - Implement backend verification
   - Restrict hash distribution
   - Use private IPFS networks

3. **Data Minimization**
   - Only upload necessary documents
   - Redact sensitive information
   - Use document verification services

## Troubleshooting

### Upload Fails

**Problem**: "Failed to upload file to IPFS"

**Solutions**:
- Check internet connection
- Verify Pinata JWT token in .env
- Ensure file size under limit
- Try uploading fewer files at once

### Slow Upload

**Problem**: Upload takes too long

**Solutions**:
- Reduce file sizes (compress images/PDFs)
- Upload fewer files at once
- Check network speed
- Try different time (Pinata server load)

### File Not Accessible

**Problem**: Can't access file via IPFS hash

**Solutions**:
- Wait a few minutes for IPFS propagation
- Try different gateway (ipfs.io, cloudflare-ipfs.com)
- Check hash is correct
- Verify file was pinned in Pinata dashboard

## Future Enhancements

Potential improvements for production:

- [ ] Client-side file encryption
- [ ] Document type validation
- [ ] OCR for automatic data extraction
- [ ] Integration with identity verification services
- [ ] Store metadata hash on-chain
- [ ] Admin dashboard for document review
- [ ] Document expiration tracking
- [ ] Multi-signature approval workflow

## API Reference

### `uploadKYCDocuments(files, userAddress, userName)`

Uploads KYC documents to Pinata IPFS.

**Parameters**:
- `files`: Array of File objects
- `userAddress`: User's wallet address
- `userName`: User's full name

**Returns**:
```typescript
{
  files: UploadResult[],
  metadataHash: string
}
```

**Example**:
```typescript
const result = await uploadKYCDocuments(
  [file1, file2],
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "John Doe"
);

console.log(result.metadataHash); // QmX7Kd9...
```

## Support

For technical issues or questions:
- Check `ui/src/services/pinata.ts` for implementation
- Review `ui/PINATA_SETUP.md` for setup instructions
- Contact development team for assistance
