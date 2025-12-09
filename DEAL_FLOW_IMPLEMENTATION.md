# Deal Flow Implementation - Complete Guide

## Overview
This document explains the complete deal flow implementation with real-time status updates and escrow payment system.

## Deal Status Flow

### 1. **Pending** (Initial State)
- **Who:** Importer creates a deal with an exporter
- **Action:** Deal is created on the blockchain
- **Status:** `pending`
- **UI Display:** Yellow badge "Pending Approval"
- **Next Step:** Exporter must approve the deal

### 2. **Approved** (Ready for Payment)
- **Who:** Exporter approves the deal from their dashboard
- **Action:** `approveDealByExporter()` is called
- **Status:** `approved`
- **UI Display:** Blue badge "Approved - Ready for Payment"
- **Next Step:** Importer can now deposit payment to escrow
- **Button:** "Pay Now" button appears for the importer

### 3. **Payment Deposited** (In Escrow)
- **Who:** Importer deposits payment
- **Action:** `depositToEscrow()` is called with ETH value
- **Status:** `payment_pending`
- **UI Display:** Purple badge "Payment Deposited"
- **Escrow:** Funds are locked in the smart contract escrow account
- **Visibility:** All parties can see the payment is in escrow
- **Next Step:** Admin verifies delivery

### 4. **Payment Locked** (Awaiting Admin Decision)
- **Who:** System automatically locks payment after deposit
- **Status:** `payment_locked`
- **UI Display:** Orange badge "Payment Locked - Awaiting Admin"
- **Escrow:** Funds remain locked, no one can withdraw
- **Admin Panel:** Payment appears in "Payment Control" tab
- **Next Step:** Admin must verify delivery and make decision

### 5. **Completed** (Final State)
- **Who:** Admin finalizes the payment
- **Action:** `finalizeDealPayment(dealId, goodsDelivered)`
  - If `goodsDelivered = true`: Funds released to exporter
  - If `goodsDelivered = false`: Funds refunded to importer
- **Status:** `completed`
- **UI Display:** Green badge "Completed"
- **Result:** Deal is closed, funds transferred

## Real-Time Status Updates

### Auto-Refresh Mechanism
The DealManagement component automatically refreshes every 5 seconds to catch status updates:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 5000);
  return () => clearInterval(interval);
}, [refetch]);
```

### Status Detection Logic
The system checks multiple conditions to determine the current status:

```typescript
const getStatusFromDeal = (deal: Deal): Deal['status'] => {
  if (deal.deliveryVerified && deal.paymentReleased) return 'completed';
  if (deal.paymentLocked) return 'payment_locked';
  if (deal.paymentDeposited) return 'payment_pending';
  if (deal.approved) return 'approved';
  return 'pending';
};
```

## Escrow System

### Security Features
1. **Locked Account:** Funds are held in a smart contract that no single party controls
2. **Admin Verification:** Only admin can release or refund after verifying delivery
3. **Transparent:** All parties can view payment status in real-time
4. **Immutable:** Once finalized, the decision cannot be reversed

### Payment States
- **Locked:** Payment is in escrow, awaiting admin decision
- **Released:** Funds sent to exporter (goods delivered)
- **Refunded:** Funds returned to importer (goods not delivered)

## User Interfaces

### Importer Dashboard (DealManagement.tsx)
- View all deals created
- See real-time status updates
- "Pay Now" button appears when deal is approved
- Track payment status (in escrow, locked, completed)

### Exporter Dashboard (ExporterDashboard.tsx)
- View deals where they are the exporter
- Approve pending deals
- See when payment is deposited
- Track delivery verification

### Admin Panel (AdminPanel.tsx)
- **Users Tab:** Verify registered users
- **Deals Tab:** Verify deal deliveries
- **Payments Tab:** Finalize locked payments (release or refund)

### Escrow Management (EscrowManagement.tsx)
- Deposit payments to escrow
- View all escrow payments
- Track payment status
- See total locked, released, and refunded amounts

## Technical Implementation

### Key Hooks
1. **useDeals.ts:** Fetches deal data with payment status
2. **usePayments.ts:** Fetches escrow payment data
3. **useAdminData.ts:** Fetches admin-specific data

### Smart Contract Functions Used
- `createNewDeal()` - Create a new deal
- `approveDealByExporter()` - Exporter approves deal
- `depositToEscrow()` - Deposit payment to escrow
- `verifyDealDelivery()` - Admin verifies delivery
- `finalizeDealPayment()` - Admin releases or refunds payment

## Status Badges

| Status | Color | Icon | Label |
|--------|-------|------|-------|
| pending | Yellow | Clock | Pending Approval |
| approved | Blue | CheckCircle | Approved - Ready for Payment |
| payment_pending | Purple | DollarSign | Payment Deposited |
| payment_locked | Orange | AlertTriangle | Payment Locked - Awaiting Admin |
| completed | Green | CheckCircle | Completed |

## Flow Diagram

```
Importer Creates Deal
        ↓
    [PENDING]
        ↓
Exporter Approves Deal
        ↓
    [APPROVED]
        ↓
Importer Deposits Payment
        ↓
[PAYMENT_DEPOSITED]
        ↓
System Locks Payment
        ↓
 [PAYMENT_LOCKED]
        ↓
Admin Verifies Delivery
        ↓
    Decision?
    ↙     ↘
Delivered  Not Delivered
    ↓         ↓
Release   Refund
    ↓         ↓
[COMPLETED]
```

## Testing the Flow

1. **Create Deal:** Importer creates deal with exporter address
2. **Approve Deal:** Exporter approves from their dashboard
3. **Wait 5 seconds:** Status updates to "Approved" in importer dashboard
4. **Deposit Payment:** Importer clicks "Pay Now" and deposits to escrow
5. **Verify Status:** Payment shows as "In Escrow" for all parties
6. **Admin Action:** Admin verifies delivery and releases/refunds
7. **Final Status:** Deal shows as "Completed"

## Notes

- All status updates happen automatically through blockchain events
- The UI polls every 5 seconds for the latest data
- Escrow funds are completely secure and cannot be accessed by anyone except through admin finalization
- All transactions are recorded on the blockchain for transparency
