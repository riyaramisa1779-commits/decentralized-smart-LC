# UI Status Updates Guide

## Real-Time Status Updates in Deal Management

### How It Works

The DealManagement component automatically refreshes deal data every 5 seconds to show real-time status updates when the exporter approves a deal or when payments are made.

### Status Update Mechanism

```typescript
// Auto-refresh every 5 seconds with visual indicator
useEffect(() => {
  const interval = setInterval(() => {
    setIsRefreshing(true);
    refetch(); // Fetches latest deal data from blockchain
    setTimeout(() => setIsRefreshing(false), 500);
  }, 5000);
  return () => clearInterval(interval);
}, [refetch]);

// Immediate refresh after creating a deal
useEffect(() => {
  if (isSuccess) {
    setTimeout(() => {
      setIsRefreshing(true);
      refetch();
      setTimeout(() => setIsRefreshing(false), 500);
    }, 2000);
  }
}, [isSuccess, refetch]);

// Real-time stats calculation
useEffect(() => {
  setStats({
    total: dealCount,
    pending: deals.filter((d) => d.status === "pending").length,
    approved: deals.filter((d) => 
      d.status === "approved" || 
      d.status === "payment_pending" || 
      d.status === "payment_locked"
    ).length,
    completed: deals.filter((d) => d.status === "completed").length
  });
}, [deals, dealCount]);
```

### Visual Status Indicators

#### 1. Pending (Yellow)
```
┌─────────────────────────────────────┐
│ Deal #1                             │
│ 🕐 Pending Approval                 │
│                                     │
│ Cotton T-Shirts (Quantity: 100)    │
│ Amount: 0.5 ETH                    │
│                                     │
│ [View Details] [Approve]           │
└─────────────────────────────────────┘
```

#### 2. Approved (Blue) - After Exporter Approves
```
┌─────────────────────────────────────┐
│ Deal #1                             │
│ ✓ Approved - Ready for Payment     │
│                                     │
│ Cotton T-Shirts (Quantity: 100)    │
│ Amount: 0.5 ETH                    │
│                                     │
│ [View Details] [Pay Now →]         │
└─────────────────────────────────────┘
```

#### 3. Payment Deposited (Purple)
```
┌─────────────────────────────────────┐
│ Deal #1                             │
│ 💰 Payment Deposited                │
│                                     │
│ Cotton T-Shirts (Quantity: 100)    │
│ Amount: 0.5 ETH                    │
│                                     │
│ [View Details] [Payment in Escrow] │
└─────────────────────────────────────┘
```

#### 4. Payment Locked (Orange)
```
┌─────────────────────────────────────┐
│ Deal #1                             │
│ ⚠️ Payment Locked - Awaiting Admin  │
│                                     │
│ Cotton T-Shirts (Quantity: 100)    │
│ Amount: 0.5 ETH                    │
│                                     │
│ [View Details] [Awaiting Admin]    │
└─────────────────────────────────────┘
```

#### 5. Completed (Green)
```
┌─────────────────────────────────────┐
│ Deal #1                             │
│ ✓ Completed                         │
│                                     │
│ Cotton T-Shirts (Quantity: 100)    │
│ Amount: 0.5 ETH                    │
│                                     │
│ [View Details] [✓ Completed]       │
└─────────────────────────────────────┘
```

## Deal Details Modal

When clicking "View Details", the modal shows comprehensive information:

```
┌──────────────────────────────────────────────┐
│ Deal #1 Details          [✓ Approved]        │
├──────────────────────────────────────────────┤
│                                              │
│ Goods Description:                           │
│ Cotton T-Shirts (Quantity: 100)             │
│                                              │
│ ┌────────────────┐  ┌────────────────┐     │
│ │ Importer       │  │ Exporter       │     │
│ │ 0x1234...5678  │  │ 0xabcd...ef01  │     │
│ └────────────────┘  └────────────────┘     │
│                                              │
│ ┌────────────────┐  ┌────────────────┐     │
│ │ Deal Amount    │  │ Deal Status    │     │
│ │ 💰 0.5 ETH     │  │ Approved       │     │
│ └────────────────┘  └────────────────┘     │
│                                              │
│              [Close] [Proceed to Payment →] │
└──────────────────────────────────────────────┘
```

## Stats Dashboard

The stats update automatically in real-time to reflect current deal states:

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total Deals  │ Pending      │ Approved     │ Completed    │
│     10       │      3       │      4       │      3       │
│ 📄           │ 🕐           │ ✓            │ ✓            │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**New Features:**
- Stats recalculate automatically when deals array changes
- Instant updates when new deals are created
- Approved count includes deals in payment_pending and payment_locked states
- Manual refresh button with spinning icon indicator

## Escrow Payment Flow

### Deposit Form (Pre-filled from Deal)
```
┌──────────────────────────────────────┐
│ Deposit to Escrow                    │
├──────────────────────────────────────┤
│                                      │
│ ℹ️ Deal Information Loaded           │
│ Payment details pre-filled from      │
│ Deal #1                              │
│                                      │
│ Deal ID:        [1]                  │
│ Payee Address:  [0xabcd...ef01]      │
│ Amount (ETH):   [0.5]                │
│                                      │
│        [Cancel] [Deposit]            │
└──────────────────────────────────────┘
```

### Success Message
```
┌──────────────────────────────────────┐
│ ✓ Success                            │
│ Payment successfully deposited to    │
│ escrow!                              │
└──────────────────────────────────────┘
```

## Admin Panel - Payment Control

Admin sees locked payments requiring action:

```
┌─────────────────────────────────────────────────┐
│ Locked Escrow Payments                          │
├─────────────────────────────────────────────────┤
│                                                 │
│ Deal #1 - Escrow Payment      [🔒 Locked]      │
│                                                 │
│ Cotton T-Shirts (Quantity: 100)                │
│                                                 │
│ Payer:   0x1234...5678  │  Amount: 0.5 ETH    │
│ Payee:   0xabcd...ef01  │                      │
│                                                 │
│ ⚠️ This payment is locked in escrow.            │
│ Choose to release to exporter or refund to     │
│ importer.                                       │
│                                                 │
│     [✓ Release to Exporter]                    │
│     [✗ Refund to Importer]                     │
└─────────────────────────────────────────────────┘
```

## Information Boxes

### Deal Flow Process (Shown in Deal Management)
```
┌─────────────────────────────────────────────────┐
│ ⚠️ Deal Flow Process                            │
├─────────────────────────────────────────────────┤
│ 1. Importer creates deal → Status: Pending     │
│ 2. Exporter approves deal → Status: Approved   │
│ 3. Importer deposits payment → Status: Payment │
│    in Escrow (Funds locked in secure account)  │
│ 4. Admin verifies delivery → Status: Payment   │
│    Locked (Awaiting admin decision)            │
│ 5. Admin releases/refunds → Status: Completed  │
│    (Funds sent to exporter or refunded)        │
└─────────────────────────────────────────────────┘
```

### Escrow Security (Shown in Escrow Management)
```
┌─────────────────────────────────────────────────┐
│ 🔒 Secure Escrow System                         │
├─────────────────────────────────────────────────┤
│ • Locked Status: Payment held in secure         │
│   blockchain escrow account                     │
│ • No one can withdraw funds until admin         │
│   verifies delivery                             │
│ • Admin Decision: Release to exporter (if       │
│   delivered) or refund to importer (if not)    │
│ • Transparent: All parties can see payment      │
│   status in real-time                           │
└─────────────────────────────────────────────────┘
```

## Key Features

### 1. Auto-Refresh with Visual Feedback
- Polls blockchain every 5 seconds
- Spinning refresh icon shows when data is updating
- Manual refresh button available for immediate updates
- Instant status updates visible to all parties
- Automatic refresh 2 seconds after creating a new deal

### 2. Real-Time Stats Dashboard
- Stats recalculate automatically when deals change
- No stale data - always shows current counts
- Pending, Approved, and Completed counts update instantly
- Total deals count syncs with blockchain

### 3. Conditional Buttons
- "Pay Now" only shows when deal is approved
- "Awaiting Admin" badge shows when payment is locked
- "Completed" badge shows when deal is finalized

### 4. Color-Coded Status
- Yellow = Pending action
- Blue = Approved, ready for next step
- Purple = Payment in escrow
- Orange = Awaiting admin decision
- Green = Successfully completed

### 5. Real-Time Visibility
- Importer sees when exporter approves
- Exporter sees when payment is deposited
- Admin sees when payment needs resolution
- All parties see final completion
- Stats update immediately without page refresh

## Testing Checklist

- [ ] Create deal as importer
- [ ] Verify "Pending" status shows
- [ ] Approve deal as exporter
- [ ] Wait 5 seconds, verify status changes to "Approved" in importer view
- [ ] Click "Pay Now" as importer
- [ ] Deposit payment to escrow
- [ ] Verify "Payment Deposited" status shows
- [ ] Check admin panel for locked payment
- [ ] Admin releases/refunds payment
- [ ] Verify "Completed" status shows for all parties
