# Admin Setup Guide

## Understanding Admin Access

In your Smart LC System, the **admin is NOT a role that users register for**. Instead, the admin is automatically set during contract deployment.

### How Admin Works

1. **Contract Deployment**: When you deploy the `SmartLCSystem` contract, the deployer's wallet address becomes the admin
2. **Immutable Admin**: The admin address is set in the constructor: `constructor() Adminable(msg.sender) {}`
3. **No Registration Needed**: The admin does not need to register through the User Registration UI

### Admin Privileges

The admin has exclusive access to:
- ✓ Verify registered users (`verifyRegisteredUser`)
- ✓ Flag suspicious users (`flagSuspiciousUser`)
- ✓ Unflag users (`unflagSuspiciousUser`)
- ✓ Verify deal deliveries (`verifyDealDelivery`)
- ✓ Finalize escrow payments (`finalizeDealPayment`)

## How to Access Admin Panel

### Option 1: Use the Deployer Wallet
1. Connect with the wallet that deployed the contract
2. Navigate to the Admin Panel
3. You'll have full admin access

### Option 2: Check Current Admin Address
1. Go to User Registration page
2. Scroll to the bottom to see the current admin address
3. Connect with that wallet address

### Option 3: Query the Contract
You can check the admin address by calling the `admin()` view function on the contract.

## Troubleshooting "Access Denied"

If you see "Access Denied" on the Admin Panel:

1. **Check Your Connected Wallet**
   - The Admin Panel shows both your wallet and the admin wallet
   - They must match exactly

2. **Verify Contract Deployment**
   - The admin is the address that deployed the contract
   - Check your deployment logs to find the deployer address

3. **Connect Correct Wallet**
   - Switch to the wallet that deployed the contract
   - Refresh the page after switching wallets

## User Roles vs Admin

### User Roles (Register through UI):
- **Importer**: Import goods from international markets
- **Exporter**: Export goods to international markets  
- **Bank**: Provide financial services and verification

### Admin (Set at Deployment):
- **Admin**: System administrator with special privileges
- Does NOT register through the UI
- Set automatically during contract deployment

## UI Updates Made

### User Registration Page
- Now detects if connected wallet is the admin
- Shows special admin info screen instead of registration form
- Displays admin wallet address at the bottom for reference
- Provides direct link to Admin Panel for admin users

### Admin Panel
- Enhanced "Access Denied" message
- Shows both your wallet and the admin wallet for comparison
- Provides clear instructions on how to gain admin access

## Example Deployment Flow

```solidity
// When you deploy the contract:
SmartLCSystem contract = new SmartLCSystem();
// msg.sender (your deployer wallet) becomes the admin
```

```javascript
// In your deployment script:
const SmartLCSystem = await ethers.getContractFactory("SmartLCSystem");
const contract = await SmartLCSystem.deploy();
// The deployer's address is now the admin
console.log("Admin address:", await contract.admin());
```

## Security Note

The admin role is immutable and cannot be changed after deployment. This is by design for security. If you need to change the admin, you would need to:
1. Deploy a new contract
2. Update the contract address in your UI configuration
3. Migrate any necessary data

## Need Help?

If you're still having issues:
1. Check the contract address in `ui/src/config/contract.ts`
2. Verify you're connected to the correct network
3. Ensure the contract is properly deployed
4. Check browser console for any error messages
