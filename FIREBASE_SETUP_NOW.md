# 🔥 **FIREBASE SETUP - COMPLETE GUIDE**

## ✅ **Firebase Console is Open!**

I've opened Firebase Console for you. Now follow these exact steps:

---

## **STEP 1: Sign In to Firebase** (30 seconds)

**You should see a Google Sign-In page.**

1. **Sign in** with your Google account
   - Use the same Google account you use for Gmail
   - If you don't have one, create a free Google account first

2. **After signing in**, you'll see the Firebase Console welcome screen

---

## **STEP 2: Create Firebase Project** (2 minutes)

### **A. Click "Add Project" or "Create a Project"**

### **B. Enter Project Details:**

**Page 1 - Project Name:**
- **Enter name:** `Boarding Solution` (or `boarding-solution`)
- Click **"Continue"**

**Page 2 - Google Analytics:**
- **Toggle OFF** "Enable Google Analytics" (we don't need it yet)
- **OR** keep it ON if you want analytics (optional)
- Click **"Create project"**

**Wait ~30 seconds** for Firebase to create your project

### **C. Click "Continue"** when done

You're now in your Firebase project! 🎉

---

## **STEP 3: Enable Authentication** (1 minute)

### **A. In left sidebar, click "Build" → "Authentication"**

### **B. Click "Get started" button**

### **C. Enable Email/Password:**
1. Click **"Email/Password"** from the list
2. **Toggle ON** the first switch (Email/Password)
3. Leave "Email link" OFF
4. Click **"Save"**

✅ **Authentication enabled!**

---

## **STEP 4: Create Firestore Database** (1 minute)

### **A. In left sidebar, click "Build" → "Firestore Database"**

### **B. Click "Create database" button**

### **C. Choose Security Rules:**
- Select **"Start in production mode"** (we'll add rules later)
- Click **"Next"**

### **D. Choose Location:**
- Select **"asia-south1 (Mumbai)"** - closest to Sri Lanka!
- Click **"Enable"**

**Wait ~30 seconds** for Firestore to be created

✅ **Database created!**

---

## **STEP 5: Enable Storage** (1 minute)

### **A. In left sidebar, click "Build" → "Storage"**

### **B. Click "Get started" button**

### **C. Accept default rules:**
- Click **"Next"**

### **D. Choose Location:**
- Should be **"asia-south1 (Mumbai)"** (same as Firestore)
- Click **"Done"**

✅ **Storage enabled!**

---

## **STEP 6: Get Firebase Configuration** (2 minutes) ⭐ MOST IMPORTANT!

### **A. Go to Project Settings:**
1. Click the **⚙️ gear icon** (top left, next to "Project Overview")
2. Click **"Project settings"**

### **B. Scroll down to "Your apps" section**

### **C. Add Web App:**
1. Click the **Web icon** `</>`
2. **App nickname:** `Boarding Solution Web`
3. **DON'T** check "Also set up Firebase Hosting"
4. Click **"Register app"**

### **D. Copy Your Config:**

You'll see code like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // Copy this!
  authDomain: "boarding-solution-xxx.firebaseapp.com",  // Copy this!
  projectId: "boarding-solution-xxx",  // Copy this!
  storageBucket: "boarding-solution-xxx.appspot.com",  // Copy this!
  messagingSenderId: "123456789",  // Copy this!
  appId: "1:123456789:web:..."  // Copy this!
};
```

### **E. SAVE THESE VALUES!**
- Copy them to a text file
- **You'll need them for Vercel!**

### **F. Click "Continue to console"**

---

## **STEP 7: Deploy Firestore Rules** (1 minute)

### **A. Go back to Firestore:**
1. Click **"Firestore Database"** in left sidebar
2. Click **"Rules"** tab

### **B. Replace the rules with these:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Listings collection
    match /listings/{listingId} {
      allow read: if true;  // Public read
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.brokerId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Roommates collection
    match /roommates/{roommateId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Favorites collection
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Reports collection  
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null;
    }
  }
}
```

### **C. Click "Publish" button**

✅ **Security rules deployed!**

---

## **STEP 8: Deploy Storage Rules** (30 seconds)

### **A. Click "Storage" in left sidebar**

### **B. Click "Rules" tab**

### **C. Replace with these rules:**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /listings/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /roommates/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### **D. Click "Publish"**

✅ **Storage rules deployed!**

---

## 🎊 **FIREBASE SETUP COMPLETE!**

### **✅ What You've Done:**
1. ✅ Created Firebase project
2. ✅ Enabled Authentication (Email/Password)
3. ✅ Created Firestore Database
4. ✅ Enabled Storage
5. ✅ Got Firebase config values
6. ✅ Deployed Firestore security rules
7. ✅ Deployed Storage security rules

---

## 📋 **YOUR FIREBASE CONFIG (SAVE THIS!):**

```
apiKey: "AIzaSyC..."
authDomain: "boarding-solution-xxx.firebaseapp.com"
projectId: "boarding-solution-xxx"
storageBucket: "boarding-solution-xxx.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:..."
```

**⚠️ IMPORTANT:** Save these values! You'll add them to Vercel next!

---

## 🚀 **NEXT STEP: Add to Vercel**

Now I'll help you add these to Vercel and deploy successfully!

**Tell me when you have your Firebase config values and I'll guide you through adding them to Vercel!** 

---

**Total Time:** ~7-10 minutes  
**Cost:** $0 (completely free!)  
**Result:** Firebase ready for your app! 🎉
