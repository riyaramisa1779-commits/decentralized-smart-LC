# Pinata IPFS Setup Guide

This guide will help you configure Pinata IPFS for document storage in your Smart LC System.

## Prerequisites

- A Pinata account (free tier available)
- Node.js and npm installed
- Your project environment set up

## Step 1: Create a Pinata Account

1. Go to [https://www.pinata.cloud/](https://www.pinata.cloud/)
2. Click "Sign Up" and create a free account
3. Verify your email address
4. Log in to your Pinata dashboard

## Step 2: Generate API Keys

1. Once logged in, navigate to the **API Keys** section in your Pinata dashboard
2. Click **"New Key"** or **"Generate New Key"**
3. Configure your API key:
   - **Key Name**: Give it a descriptive name (e.g., "Smart LC System")
   - **Permissions**: Enable the following:
     - ✅ `pinFileToIPFS` (required for uploading)
     - ✅ `pinJSONToIPFS` (optional, for metadata)
     - ✅ `unpin` (optional, for removing files)
     - ✅ `pinList` (optional, for listing files)
4. Click **"Generate Key"**
5. **IMPORTANT**: Copy both the **API Key** and **API Secret** immediately
   - You won't be able to see the secret again!
   - Store them securely

## Step 3: Configure Environment Variables

1. Navigate to your `ui` directory:
   ```bash
   cd ui
   ```

2. Copy the `.env.example` file to create your `.env` file:
   ```bash
   copy .env.example .env
   ```
   (On Linux/Mac use `cp .env.example .env`)

3. Open the `.env` file and update the Pinata configuration:
   ```env
   # IPFS Configuration (for document storage)
   VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
   VITE_PINATA_API_KEY=your_actual_api_key_here
   VITE_PINATA_SECRET_KEY=your_actual_secret_key_here
   ```

4. Replace `your_actual_api_key_here` and `your_actual_secret_key_here` with the keys you copied from Pinata

## Step 4: Test the Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Document Management page in your application

3. Try uploading a test file:
   - Click "Choose Files" or drag and drop a document
   - Supported formats: PDF, JPG, JPEG, PNG, DOC, DOCX
   - Watch the upload progress bar
   - Once complete, you should see the document in your list with an IPFS hash

4. Verify in Pinata Dashboard:
   - Go to your Pinata dashboard
   - Navigate to the **"Files"** section
   - You should see your uploaded file listed there

## Step 5: View and Download Documents

- **View**: Click the eye icon to open the document in a new tab via IPFS gateway
- **Download**: Click the download icon to save the file locally
- **IPFS Hash**: Each document has a unique hash (starting with "Qm" or "bafy")

## Troubleshooting

### Upload fails with "Pinata API credentials are not configured"
- Make sure your `.env` file exists in the `ui` directory
- Verify that the environment variables are correctly named (with `VITE_` prefix)
- Restart your development server after changing `.env` file

### Upload fails with authentication error
- Double-check your API Key and Secret in the `.env` file
- Ensure there are no extra spaces or quotes around the values
- Verify the API key is still active in your Pinata dashboard

### Files upload but can't be viewed
- Check that `VITE_IPFS_GATEWAY` is set correctly
- Try using the default: `https://gateway.pinata.cloud/ipfs/`
- Some files may take a few seconds to propagate to the gateway

### CORS errors
- Pinata's API should work from localhost by default
- If you encounter CORS issues, check your Pinata dashboard settings
- Consider using a dedicated gateway URL from your Pinata account

## Security Best Practices

1. **Never commit your `.env` file** to version control
   - The `.env` file is already in `.gitignore`
   - Only commit `.env.example` with placeholder values

2. **Rotate API keys regularly**
   - Generate new keys periodically
   - Delete old keys from Pinata dashboard

3. **Use different keys for development and production**
   - Create separate API keys for each environment
   - Limit permissions based on environment needs

4. **Monitor your usage**
   - Check your Pinata dashboard regularly
   - Free tier has limits on storage and bandwidth
   - Upgrade if needed for production use

## Pinata Free Tier Limits

- **Storage**: 1 GB
- **Bandwidth**: 100 GB/month
- **Requests**: Unlimited
- **Files**: Unlimited

For production applications with higher requirements, consider upgrading to a paid plan.

## Additional Resources

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Pinata API Reference](https://docs.pinata.cloud/api-reference)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API credentials in Pinata dashboard
3. Review the Pinata service logs in your application
4. Contact Pinata support if the issue persists
