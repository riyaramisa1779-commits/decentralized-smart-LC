# Deployment Guide - Smart LC System

## Prerequisites

1. **Smart Contract Deployment**
   - Deploy the SmartLCSystem contract to your chosen network
   - Note the contract address for frontend configuration

2. **WalletConnect Project**
   - Create a project at [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Get your project ID

3. **IPFS Setup (Optional)**
   - Set up Pinata account for document storage
   - Get API keys for IPFS integration

## Configuration Steps

### 1. Environment Variables
Copy `.env.example` to `.env.local` and update:

```bash
cp .env.example .env.local
```

Update the values:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 2. Contract Configuration
Update `src/config/contract.ts`:
- Replace `CONTRACT_ADDRESS` with your deployed contract address
- Verify the ABI matches your deployed contract

### 3. Network Configuration
Update `src/config/wagmi.ts`:
- Add your target networks to the chains array
- Configure RPC endpoints if needed

## Build Process

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build:prod
```

This will:
1. Run TypeScript type checking
2. Build the optimized production bundle
3. Output files to `dist/` directory

## Deployment Options

### 1. IPFS Deployment (Recommended for Web3)

```bash
# Install IPFS CLI
npm install -g @ipfs/http-client

# Build the project
npm run build

# Deploy to IPFS
ipfs add -r dist/

# Pin to Pinata (optional)
# Use Pinata web interface or API to pin the hash
```

### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 3. Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### 4. AWS S3 + CloudFront

```bash
# Build the project
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 5. GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist/` folder to `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Post-Deployment Checklist

### 1. Verify Contract Integration
- [ ] Wallet connection works
- [ ] Contract functions can be called
- [ ] Events are being received
- [ ] Transaction confirmations work

### 2. Test Core Features
- [ ] User registration
- [ ] Deal creation
- [ ] Escrow deposits
- [ ] Admin functions (if applicable)
- [ ] Document uploads

### 3. Security Checks
- [ ] HTTPS enabled
- [ ] Content Security Policy configured
- [ ] No sensitive data in client-side code
- [ ] Proper error handling

### 4. Performance Optimization
- [ ] Bundle size optimization
- [ ] Image optimization
- [ ] Caching headers configured
- [ ] CDN setup (if applicable)

## Environment-Specific Configurations

### Mainnet Deployment
```env
VITE_CONTRACT_ADDRESS=0x... # Mainnet contract address
VITE_CHAIN_ID=1
```

### Testnet Deployment (Sepolia)
```env
VITE_CONTRACT_ADDRESS=0x... # Sepolia contract address
VITE_CHAIN_ID=11155111
```

### Local Development
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_CHAIN_ID=31337
```

## Monitoring and Maintenance

### 1. Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage metrics

### 2. Performance Monitoring
- Web Vitals tracking
- Bundle analyzer for optimization
- Lighthouse CI for performance regression

### 3. Security Updates
- Regular dependency updates
- Security audit of smart contracts
- Monitor for Web3 security best practices

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Check WalletConnect project ID
   - Verify network configuration
   - Ensure HTTPS in production

2. **Contract Calls Fail**
   - Verify contract address
   - Check ABI compatibility
   - Ensure sufficient gas limits

3. **Build Errors**
   - Run `npm run type-check` for TypeScript errors
   - Check for missing dependencies
   - Verify environment variables

### Support Resources
- [Wagmi Documentation](https://wagmi.sh/)
- [Web3Modal Documentation](https://docs.walletconnect.com/web3modal/about)
- [Vite Documentation](https://vitejs.dev/)

## Rollback Procedure

If issues occur after deployment:

1. **Immediate Rollback**
   ```bash
   # Revert to previous IPFS hash or deployment
   # Update DNS/CDN to point to previous version
   ```

2. **Fix and Redeploy**
   ```bash
   # Fix the issue
   # Test thoroughly
   # Deploy with new version
   ```

3. **Communication**
   - Notify users of any downtime
   - Update status page if available
   - Document the incident for future reference