# Troubleshooting Guide - Pinata KYC Upload

## Common Issues and Solutions

### 1. Authentication Error: "INVALID_CREDENTIALS"

**Error Message:**
```
AuthenticationError: Authentication failed: {"error":{"reason":"INVALID_CREDENTIALS"}}
```

**Cause:** Your Pinata API credentials are missing or incorrect.

**Solution:**

1. **Check your `.env` file** has the correct credentials:
   ```env
   VITE_PINATA_API_KEY=your_actual_api_key
   VITE_PINATA_SECRET_KEY=your_actual_secret_key
   VITE_PINATA_GATEWAY=gateway.pinata.cloud
   ```

2. **Get new credentials from Pinata:**
   - Go to https://app.pinata.cloud
   - Navigate to **API Keys** section
   - Click **New Key**
   - Enable permissions: `pinFileToIPFS` and `pinJSONToIPFS`
   - Copy the API Key and Secret (you won't see them again!)

3. **Update your `.env` file** with the new credentials

4. **Restart your dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### 2. Token Malformed Error

**Error Message:**
```
token contains an invalid number of segments
```

**Cause:** This was from the old JWT-based implementation.

**Solution:** We now use API Key/Secret instead of JWT. Make sure you have:
- `VITE_PINATA_API_KEY` set
- `VITE_PINATA_SECRET_KEY` set
- Remove or ignore `VITE_PINATA_JWT` (not needed)

### 3. Upload Fails Silently

**Symptoms:** No error message, but files don't upload.

**Solution:**

1. **Open browser console** (F12) to see detailed errors
2. **Check network tab** to see if requests are being made
3. **Verify API key permissions** include upload rights
4. **Check file size** - must be under 100MB (free tier)

### 4. CORS Error

**Error Message:**
```
Access to fetch at 'https://api.pinata.cloud/...' has been blocked by CORS policy
```

**Cause:** Pinata API should allow browser requests, but sometimes there are issues.

**Solution:**

1. **Check your API key** is valid and active
2. **Verify you're using HTTPS** (not HTTP) for your dev server
3. **Try a different browser** to rule out extension issues
4. If persistent, consider using a backend proxy

### 5. Files Not Appearing in Pinata Dashboard

**Symptoms:** Upload succeeds but files not visible in dashboard.

**Solution:**

1. **Wait 30-60 seconds** for indexing
2. **Refresh the dashboard** page
3. **Check the IPFS hash directly:**
   - Copy the hash from console
   - Visit: `https://gateway.pinata.cloud/ipfs/{hash}`
4. **Verify in Files section** of Pinata dashboard

### 6. Slow Upload Speed

**Symptoms:** Upload takes a very long time.

**Solution:**

1. **Reduce file sizes:**
   - Compress images before upload
   - Use PDF compression tools
   - Optimize file formats

2. **Upload fewer files at once:**
   - Try uploading 1-2 files first
   - Then add more if needed

3. **Check your internet connection:**
   - Run a speed test
   - Try a different network

### 7. Environment Variables Not Loading

**Symptoms:** `undefined` errors for API keys.

**Solution:**

1. **Verify `.env` file location:**
   - Must be in `ui/` folder (not root)
   - File must be named exactly `.env`

2. **Check variable names:**
   - Must start with `VITE_`
   - Example: `VITE_PINATA_API_KEY`

3. **Restart dev server:**
   - Environment variables only load on startup
   - Stop server (Ctrl+C) and run `npm run dev` again

4. **Check for typos:**
   - No spaces around `=`
   - No quotes needed for values
   - Example: `VITE_PINATA_API_KEY=abc123`

### 8. File Size Limit Exceeded

**Error Message:**
```
File size exceeds maximum allowed
```

**Solution:**

1. **Check file sizes:**
   - Free tier: 100MB per file
   - Paid plans: Higher limits

2. **Compress large files:**
   - Use online compression tools
   - Reduce image quality/resolution
   - Split large documents

3. **Upgrade Pinata plan** if needed

### 9. Rate Limit Exceeded

**Error Message:**
```
Rate limit exceeded
```

**Solution:**

1. **Wait a few minutes** before trying again
2. **Reduce upload frequency** during testing
3. **Check your Pinata plan limits:**
   - Free tier: Limited requests per minute
   - Upgrade if needed for production

### 10. Network Error

**Error Message:**
```
Failed to fetch
```

**Solution:**

1. **Check internet connection**
2. **Verify Pinata API is up:**
   - Visit https://status.pinata.cloud
3. **Try again in a few minutes**
4. **Check firewall/antivirus** isn't blocking requests

## Debugging Tips

### Enable Detailed Logging

Open browser console (F12) and check for:
- Red error messages
- Network requests in Network tab
- Console.log outputs from the upload functions

### Test API Credentials Manually

Use this curl command to test your credentials:

```bash
curl -X GET \
  https://api.pinata.cloud/data/testAuthentication \
  -H "pinata_api_key: YOUR_API_KEY" \
  -H "pinata_secret_api_key: YOUR_SECRET_KEY"
```

Expected response:
```json
{
  "message": "Congratulations! You are communicating with the Pinata API!"
}
```

### Check Environment Variables in Browser

Add this temporarily to your component:

```typescript
console.log('API Key:', import.meta.env.VITE_PINATA_API_KEY);
console.log('Secret Key:', import.meta.env.VITE_PINATA_SECRET_KEY);
```

If they show `undefined`, your `.env` file isn't being loaded.

### Verify File Upload

After successful upload, test the IPFS hash:

1. Copy the hash from console
2. Visit: `https://gateway.pinata.cloud/ipfs/{hash}`
3. File should display/download

## Still Having Issues?

1. **Check the documentation:**
   - `PINATA_SETUP.md` - Setup guide
   - `KYC_UPLOAD_GUIDE.md` - Usage guide
   - `IMPLEMENTATION_SUMMARY.md` - Technical details

2. **Review the code:**
   - `ui/src/services/pinata.ts` - Upload logic
   - `ui/src/components/Registration/UserRegistration.tsx` - UI component

3. **Contact support:**
   - Pinata Support: https://pinata.cloud/support
   - Check Pinata Status: https://status.pinata.cloud

## Quick Checklist

Before asking for help, verify:

- [ ] `.env` file exists in `ui/` folder
- [ ] API Key and Secret are correct
- [ ] Variables start with `VITE_`
- [ ] Dev server was restarted after changing `.env`
- [ ] Browser console shows no errors
- [ ] Internet connection is working
- [ ] Pinata API is operational (check status page)
- [ ] File size is under 100MB
- [ ] API key has upload permissions enabled

## Example Working Configuration

**File: `ui/.env`**
```env
VITE_PINATA_API_KEY=abc123def456ghi789
VITE_PINATA_SECRET_KEY=xyz789uvw456rst123abc456def789ghi123jkl456mno789pqr123
VITE_PINATA_GATEWAY=gateway.pinata.cloud
```

**Console Output (Success):**
```
KYC Documents uploaded to IPFS: {
  files: [
    {
      IpfsHash: "QmX7Kd9fJ3mN2pQ8rT5vW6yZ1aB4cD7eF9gH2iJ5kL8mN0o",
      url: "https://gateway.pinata.cloud/ipfs/QmX7Kd9..."
    }
  ],
  metadataHash: "QmY8Le0gK4nO3qR9sU6wA7bC5eE8fF0hH3jJ6lL9mM1nN2p"
}
```
