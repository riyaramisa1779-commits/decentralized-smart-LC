# Pinata IPFS Integration Setup Guide

This guide explains how to set up Pinata for KYC document storage in the Smart LC System.

## What is Pinata?

Pinata is a pinning service for IPFS (InterPlanetary File System) that makes it easy to upload and manage files on the decentralized web. It ensures your files remain accessible and persistent on IPFS.

## Setup Steps

### 1. Create a Pinata Account

1. Go to [https://pinata.cloud](https://pinata.cloud)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Credentials

1. Log in to your Pinata dashboard
2. Navigate to **API Keys** section
3. Click **New Key**
4. Give it a name (e.g., "Smart LC System")
5. Enable the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
6. Click **Create Key**
7. Copy both the **API Key** and **API Secret** (you won't be able to see them again!)

### 3. Configure Environment Variables

Update your `ui/.env` file with your Pinata credentials:

```env
# Pinata Configuration
VITE_PINATA_API_KEY=your_api_key_here
VITE_PINATA_SECRET_KEY=your_secret_key_here
VITE_PINATA_GATEWAY=gateway.pinata.cloud
```

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the User Registration page
3. Fill in the registration form
4. Upload a test document (PDF, image, etc.)
5. Submit the form
6. Check the console for upload confirmation and IPFS hash

### 5. Verify Upload on Pinata

1. Go to your Pinata dashboard
2. Navigate to **Files** section
3. You should see your uploaded files listed
4. Click on any file to view it or get its IPFS hash

## How It Works

### File Upload Flow

1. **User selects files** → Files are stored in component state
2. **User submits form** → Files are uploaded to Pinata IPFS
3. **Pinata returns IPFS hashes** → Hashes are stored as metadata
4. **Metadata is uploaded** → A JSON file with all document info is created
5. **Registration proceeds** → User is registered with KYC metadata hash

### Data Structure

Each KYC upload creates:

1. **Individual file uploads** → Each document gets its own IPFS hash
2. **Metadata JSON** → Contains:
   ```json
   {
     "userAddress": "0x...",
     "userName": "John Doe",
     "uploadDate": "2024-01-01T00:00:00.000Z",
     "documents": [
       {
         "fileName": "passport.pdf",
         "fileSize": 123456,
         "fileType": "application/pdf",
         "ipfsHash": "Qm...",
         "url": "https://gateway.pinata.cloud/ipfs/Qm..."
       }
     ]
   }
   ```

## Accessing Uploaded Files

Files can be accessed via:

1. **Pinata Gateway**: `https://gateway.pinata.cloud/ipfs/{hash}`
2. **Public IPFS Gateway**: `https://ipfs.io/ipfs/{hash}`
3. **Local IPFS Node**: `http://localhost:8080/ipfs/{hash}`

## Security Considerations

### ✅ Best Practices

- Store API credentials in environment variables (never commit to git)
- Use dedicated API keys for each environment (dev, staging, prod)
- Rotate API keys periodically
- Monitor usage in Pinata dashboard
- Keep your `.env` file in `.gitignore`

### 🔒 Privacy Notes

- Files uploaded to IPFS are **publicly accessible** by default
- Anyone with the IPFS hash can view the file
- For sensitive documents, consider:
  - Client-side encryption before upload
  - Private IPFS networks
  - Access control layers

## Troubleshooting

### Upload Fails

**Error**: "Failed to upload file to IPFS"

**Solutions**:
- Check your API Key and Secret are correct in `.env`
- Verify API key permissions include `pinFileToIPFS` and `pinJSONToIPFS`
- Check file size limits (free tier: 100MB per file)
- Ensure network connectivity
- Check browser console for detailed error messages

### Files Not Appearing

**Issue**: Files uploaded but not visible in Pinata dashboard

**Solutions**:
- Wait a few seconds for indexing
- Refresh the dashboard
- Check the IPFS hash directly via gateway

### CORS Errors

**Issue**: Browser blocks requests to Pinata

**Solutions**:
- Pinata API should work from browser
- If issues persist, consider using a backend proxy
- Check browser console for specific errors

## Free Tier Limits

Pinata's free tier includes:
- 1 GB storage
- 100 GB bandwidth per month
- Unlimited pins
- 100 MB max file size

For production use, consider upgrading to a paid plan.

## Additional Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Pinata SDK GitHub](https://github.com/PinataCloud/pinata-web3)

## Support

For issues with:
- **Pinata service**: Contact [Pinata Support](https://pinata.cloud/support)
- **Integration code**: Check the `ui/src/services/pinata.ts` file
- **Smart LC System**: Refer to main project documentation
