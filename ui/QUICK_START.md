# Quick Start - Pinata KYC Upload

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd ui
npm install
```

### Step 2: Get Pinata API Credentials

1. Go to [https://pinata.cloud](https://pinata.cloud) and sign up
2. Navigate to **API Keys** → **New Key**
3. Enable permissions: `pinFileToIPFS` and `pinJSONToIPFS`
4. Copy the **API Key** and **API Secret**

### Step 3: Configure Environment

Edit `ui/.env` and add your credentials:

```env
VITE_PINATA_API_KEY=your_api_key_here
VITE_PINATA_SECRET_KEY=your_secret_key_here
VITE_PINATA_GATEWAY=gateway.pinata.cloud
```

### Step 4: Start Development Server

```bash
npm run dev
```

### Step 5: Test Upload

1. Open http://localhost:5173 (or your dev URL)
2. Navigate to **User Registration**
3. Connect your wallet
4. Fill in the form
5. Upload a test document (any PDF or image)
6. Click **Register Account**
7. Watch the upload progress!

## ✅ Success Indicators

You'll see:
- 🔵 "Uploading KYC Documents to IPFS..." (blue box)
- ✅ "Documents Uploaded Successfully!" (green box)
- 📝 Metadata Hash displayed (e.g., `QmX7Kd9...`)

## 🔍 Verify Upload

1. Copy the metadata hash from success message
2. Visit: `https://gateway.pinata.cloud/ipfs/{your-hash}`
3. You'll see JSON with all document info
4. Click document URLs to view uploaded files

## 🎉 That's It!

Your KYC documents are now stored on IPFS via Pinata!

## 📚 Need More Info?

- **Setup Details**: See `PINATA_SETUP.md`
- **User Guide**: See `KYC_UPLOAD_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`

## ⚠️ Troubleshooting

**Upload fails?**
- Check API Key and Secret are correct in `.env`
- Verify API key has upload permissions
- Verify file size < 100MB
- Check internet connection
- Look at browser console (F12) for errors

**Can't access file?**
- Wait 30 seconds for IPFS propagation
- Try: `https://ipfs.io/ipfs/{hash}`
- Check Pinata dashboard for file

## 🆘 Need Help?

Check the console (F12) for detailed error messages!
