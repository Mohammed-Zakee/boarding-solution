# 💳 Payment Integration - Complete Guide

## 🎯 What You'll Get:
- 💰 Booking payments
- 🏦 Security deposits
- 📅 Monthly rent collection
- 💸 Commission system

## ⏱️ Time: 1 week | Revenue: 5-10% commission on each booking!

---

## 🇱🇰 **For Sri Lanka: Use PayHere**

### **Step 1: Create PayHere Account**
1. Go to https://www.payhere.lk/
2. Sign up as merchant
3. Complete KYC verification
4. Get Merchant ID & Secret

### **Step 2: Install PayHere SDK**

```bash
npm install payhere-js-sdk
```

### **Step 3: Create Payment Component**

**File:** `src/components/PaymentButton.js`

```javascript
'use client';
import { useState } from 'react';

export default function PaymentButton({ listing, amount, type = 'booking' }) {
  const [processing, setProcessing] = useState(false);

  const initiatePayment = () => {
    setProcessing(true);

    const payment = {
      sandbox: true, // false for production
      merchant_id: 'YOUR_MERCHANT_ID',
      return_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      notify_url: 'YOUR_SERVER_NOTIFY_URL',
      order_id: `ORDER_${Date.now()}`,
      items: listing.name,
      amount: amount,
      currency: 'LKR',
      first_name: auth.currentUser.displayName || 'User',
      last_name: '',
      email: auth.currentUser.email,
      phone: '',
      address: '',
      city: '',
      country: 'Sri Lanka',
    };

    // Initialize PayHere
   payhere.onCompleted = function (orderId) {
      console.log('Payment completed. OrderID:' + orderId);
      // Save booking to Firestore
      handlePaymentSuccess(orderId);
    };

    payhere.onDismissed = function () {
      setProcessing(false);
    };

    payhere.onError = function (error) {
      console.error('Payment error:', error);
      setProcessing(false);
    };

    payhere.startPayment(payment);
  };

  const handlePaymentSuccess = async (orderId) => {
    await addDoc(collection(db, 'bookings'), {
      userId: auth.currentUser.uid,
      listingId: listing.id,
      amount,
      orderId,
      status: 'paid',
      type,
      createdAt: new Date().toISOString()
    });

    // Update listing availability
    //... your logic
  };

  return (
    <button 
      onClick={initiatePayment}
      disabled={processing}
      className="btn btn-primary"
    >
      {processing ? 'Processing...' : `Pay Rs. ${amount.toLocaleString()}`}
    </button>
  );
}
```

---

## 🌍 **For International: Use Stripe**

### **Step 1: Create Stripe Account**
1. Go to https://stripe.com
2. Sign up
3. Get API keys

### **Step 2: Install Stripe**

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### **Step 3: Set Up Backend (Next.js API Route)**

**File:** `src/app/api/create-payment-intent/route.js`

```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { amount } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'lkr',
  });

  return Response.json({ clientSecret: paymentIntent.client_secret });
}
```

### **Step 4: Create Checkout Component**

```javascript
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY');

function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" disabled={!stripe}>Pay</button>
    </form>
  );
}

export default function PaymentPage({ amount }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}
```

---

## 📊 **Step 5: Set Up Booking Flow**

1. User selects listing
2. Clicks "Book Now"
3. Selects dates
4. Reviews priceing (rent + deposit)
5. Proceeds to payment
6. Payment processed
7. Booking confirmed
8. Broker notified
9. Commission deducted

---

## 💰 **Revenue Model:**

**Option 1: Commission on Bookings**
- 5-10% on each booking
- Example: Rs. 12,000 rent → You earn Rs. 600-1,200

**Option 2: Premium Broker Listings**
- Brokers pay for featured listings
- Rs. 500-1,000 per listing per month

**Option 3: Student Premium**
- Premium features for students
- Rs. 200-500/month
- Unlimited messaging, priority support, etc.

---

## ✅ Done! You're making money! 💰
