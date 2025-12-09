# Payment Flow Guide

## How to Process Payments in the Smart LC System

### Step-by-Step Payment Process

#### 1. **Register as an Importer**
   - Navigate to **Registration** page
   - Fill in your name and select "Importer" role
   - Submit registration
   - Wait for admin verification

#### 2. **Create a Deal**
   - Go to **Deals** page
   - Click "Create Deal" button
   - Fill in:
     - Exporter's wallet address
     - Product name
     - Product quantity
     - Deal amount (in ETH)
   - Submit the deal

#### 3. **Wait for Exporter Approval**
   - The exporter will see your deal in their dashboard
   - They need to approve the deal
   - Deal status will change from "Pending" to "Approved"

#### 4. **Proceed to Payment** (This is what you were looking for!)
   - Once the deal is **Approved**, you'll see a **"Pay Now"** button on the deal card
   - OR click "View Details" and then "Proceed to Payment"
   - This will take you to the **Escrow** page with pre-filled payment information

#### 5. **Deposit to Escrow**
   - On the Escrow page, the form will be automatically filled with:
     - Deal ID
     - Payment amount
     - Exporter's address (payee)
   - Review the details
   - Click "Deposit" to send funds to escrow
   - Confirm the transaction in your wallet

#### 6. **Track Payment Status**
   - View all your escrow payments on the Escrow Management page
   - Payment statuses:
     - **Locked**: Funds are in escrow, waiting for delivery
     - **Released**: Funds released to exporter after delivery
     - **Refunded**: Funds returned to you if deal cancelled

### Navigation

You can access the Escrow page in two ways:

1. **Direct Navigation**: Click "Escrow" in the sidebar menu
2. **From Approved Deal**: Click "Pay Now" button on any approved deal

### Important Notes

- ✅ Only **approved deals** show the payment button
- ✅ Only the **importer** (deal creator) can make payments
- ✅ Payment details are automatically filled when coming from a deal
- ✅ Funds are held securely in escrow until delivery is verified
- ✅ Admin can release funds to exporter or refund to importer

### Troubleshooting

**Q: I don't see the "Pay Now" button**
- Make sure the deal status is "Approved" (not "Pending")
- Verify you're connected with the importer wallet address
- Check that the exporter has approved the deal

**Q: The Escrow page is empty**
- Click "Deposit to Escrow" button to manually create a payment
- Or navigate from an approved deal to auto-fill the form

**Q: Transaction failed**
- Ensure you have enough ETH in your wallet
- Check that you're on the correct network
- Verify the deal ID and exporter address are correct
