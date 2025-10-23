# Smart LC System - Frontend

A modern, decentralized Letter of Credit (LC) system built with React, TypeScript, and Web3 technologies.

## Features

### 🔐 User Management
- **Wallet-based Authentication**: Connect with MetaMask and other Web3 wallets
- **Role-based Access**: Support for Importers, Exporters, and Financial Institutions
- **KYC Verification**: Admin-controlled user verification system
- **User Registration**: Seamless onboarding process

### 📋 Deal Management
- **Create Trade Deals**: Importers can create deals with exporters
- **Deal Approval**: Exporters can approve or reject deals
- **Status Tracking**: Real-time deal status updates
- **Document Integration**: Link documents to specific deals

### 💰 Escrow System
- **Secure Payments**: Funds locked in smart contract escrow
- **Automated Release**: Payments released upon delivery verification
- **Refund Protection**: Automatic refunds for failed deliveries
- **Multi-signature Control**: Admin oversight for dispute resolution

### 📄 Document Management
- **IPFS Storage**: Decentralized document storage
- **Hash Verification**: Cryptographic document integrity
- **Document Types**: Support for various trade documents
- **Upload Progress**: Real-time upload status

### 👨‍💼 Admin Panel
- **User Verification**: Approve or reject user registrations
- **Deal Oversight**: Monitor and verify trade deals
- **Payment Control**: Manage escrow releases and refunds
- **Fraud Prevention**: Flag suspicious users and activities

### 📊 Dashboard & Analytics
- **Real-time Stats**: Live system metrics and KPIs
- **Activity Feed**: Recent system activities
- **User Insights**: Personal trading statistics
- **System Health**: Monitor platform performance

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Web3**: Wagmi, Viem, Web3Modal
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS with custom glass morphism effects
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Web3Modal**
   - Get a project ID from [WalletConnect Cloud](https://cloud.walletconnect.com)
   - Update `src/config/wagmi.ts` with your project ID

4. **Update Contract Address**
   - Deploy your smart contract
   - Update `CONTRACT_ADDRESS` in `src/config/contract.ts`

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Setup

Create a `.env.local` file:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## Project Structure

```
src/
├── components/
│   ├── Layout/          # Header, Sidebar components
│   ├── Dashboard/       # Main dashboard
│   ├── Registration/    # User registration
│   ├── Deals/          # Deal management
│   ├── Escrow/         # Escrow management
│   ├── Documents/      # Document management
│   └── Admin/          # Admin panel
├── config/
│   ├── contract.ts     # Smart contract configuration
│   └── wagmi.ts        # Web3 configuration
├── utils/
│   └── helpers.ts      # Utility functions
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Key Features Explained

### Glass Morphism Design
The UI uses a modern glass morphism design with:
- Translucent backgrounds with backdrop blur
- Subtle borders and shadows
- Gradient overlays
- Smooth animations and transitions

### Responsive Layout
- Mobile-first design approach
- Adaptive sidebar navigation
- Flexible grid layouts
- Touch-friendly interactions

### Web3 Integration
- Automatic wallet connection
- Transaction status tracking
- Error handling and user feedback
- Multi-chain support ready

### Security Features
- Input validation and sanitization
- Address format verification
- Transaction confirmation flows
- Admin-only function protection

## Smart Contract Integration

The frontend integrates with the Smart LC System contract:

### Key Functions
- `registerNewUser()` - User registration
- `createNewDeal()` - Create trade deals
- `depositToEscrow()` - Deposit payments
- `verifyRegisteredUser()` - Admin user verification
- `finalizeDealPayment()` - Release/refund payments

### Event Listening
- Real-time updates via contract events
- Transaction status monitoring
- Automatic UI updates

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to IPFS
```bash
# Install IPFS CLI
npm install -g ipfs-http-client

# Build and deploy
npm run build
ipfs add -r dist/
```

### Deploy to Traditional Hosting
The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This is a demo application. Ensure proper security audits before using in production.