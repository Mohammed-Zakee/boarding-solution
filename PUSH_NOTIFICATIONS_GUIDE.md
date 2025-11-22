# 🔔 Push Notifications - Quick Implementation Guide

## 🎯 What You'll Get:
- 📬 New listing alerts
- 💬 Message notifications
- 💰 Price drop alerts
- 🔔 Customizable notification types

## ⏱️ Time: 4-5 hours

---

## 📦 **Step 1: Install Capacitor Push**

```bash
npm install @capacitor/push-notifications
npx cap sync
```

---

## 🔧 **Step 2: Set Up Firebase Cloud Messaging**

1. Firebase Console → Project Settings → Cloud Messaging
2. Generate Web Push Certificate (VAPID key)
3. Copy Server Key

---

## 💻 **Step 3: Create Notification Service**

**File:** `src/lib/pushNotifications.js`

```javascript
import { PushNotifications } from '@capacitor/push-notifications';

export const initPushNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== 'granted') {
    throw new Error('User denied permissions!');
  }

  await PushNotifications.register();

  // Listen for registration
  PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token: ' + token.value);
    // Save token to Firestore for this user
    saveTokenToFirestore(token.value);
  });

  // Listen for notifications
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push received: ', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    console.log('Push action performed: ', notification);
  });
};

const saveTokenToFirestore = async (token) => {
  const user = auth.currentUser;
  if (user) {
    await updateDoc(doc(db, 'users', user.uid), {
      pushToken: token
    });
  }
};
```

---

## 🔔 **Step 4: Send Notifications (Server-side)**

Create Cloud Function or use Firebase Admin SDK:

```javascript
// Firebase Cloud Function
const sendPushNotification = async (userToken, title, body, data) => {
  const message = {
    notification: {
      title,
      body
    },
    data,
    token: userToken
  };

  await admin.messaging().send(message);
};

// Example: New listing notification
await sendPushNotification(
  userToken,
  'New Boarding Near SLIIT!',
  'Rs. 12,000/month - 2 bedrooms, WiFi included',
  { listingId: 'abc123', type: 'new_listing' }
);
```

---

## 📱 **Step 5: Add to App Initialization**

```javascript
useEffect(() => {
  if (auth.currentUser) {
    initPushNotifications();
  }
}, []);
```

---

## ✅ Done! Users get real-time notifications!
