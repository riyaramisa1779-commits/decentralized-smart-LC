# Quick Start: Pinata IPFS Setup

## 🚀 5-Minute Setup

### 1. Get Pinata API Keys
- Visit: https://www.pinata.cloud/
- Sign up (free)
- Go to **API Keys** → **New Key**
- Enable: `pinFileToIPFS`, `unpin`
- Copy **API Key** and **API Secret**

### 2. Configure Environment
```bash
cd ui
copy .env.example .env
```

Edit `.env`:
```env
VITE_PINATA_API_KEY=paste_your_api_key_here
VITE_PINATA_SECRET_KEY=paste_your_secret_key_here
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Upload
- Navigate to Document Management
- Upload a test file
- Check Pinata dashboard to verify

## ✅ That's it!

For detailed instructions, see [PINATA_SETUP_GUIDE.md](./PINATA_SETUP_GUIDE.md)
