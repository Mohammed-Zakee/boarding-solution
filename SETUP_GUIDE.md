# 🏠 Boarding Solution - Complete Setup Guide

## 📋 **Table of Contents**
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Firebase Setup](#firebase-setup)
5. [Google Maps API Setup](#google-maps-api-setup)
6. [Running the App](#running-the-app)
7. [Building for Android](#building-for-android)
8. [Deployment](#deployment)
9. [Security](#security)

---

## ✨ **Features**

### For Students:
- 📍 **Interactive Map** - Browse listings with real-time GPS location
- 🔍 **Advanced Filters** - Filter by price, gender, amenities
- ❤️ **Favorites** - Save and manage favorite listings
- ⭐ **Reviews & Ratings** - Read and write reviews
- 🤝 **Roommate Finder** - Find compatible roommates
- 📱 **WhatsApp Integration** - Contact brokers instantly
- 🗺️ **Google Maps Navigation** - Get directions to properties

### For Brokers:
- 📸 **Image Upload** - Add photos to listings (Base64storage)
- 📝 **Listing Management** - Create and manage properties
- 💰 **Price in LKR** - Set monthly rent
- ✅ **Amenities Checklist** - WiFi, AC, Food, Attached Bathroom
- 📊 **My Listings** - View all your properties

### For Admins:
- 📊 **Real Analytics** - User stats, listings, revenue
- 🚩 **Report Management** - Handle user reports
- ✅ **Verification System** - Approve listings

### Security & Authentication:
- 🔐 **Firebase Authentication** - Secure login/registration
- 🛡️ **Firestore Security Rules** - Role-based access control
- ✉️ **Email Verification** - Verify user accounts
- 🔑 **Password Reset** - Forgot password functionality
- 👤 **User Profiles** - Editable profile with photo upload

---

## 🔧 **Prerequisites**

Before you begin, make sure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **Firebase Account** (free) - [Sign up](https://firebase.google.com/)
- **Google Cloud Account** (free tier) - [Sign up](https://console.cloud.google.com/)
- **Android Studio** (for mobile app) - [Download](https://developer.android.com/studio)

---

## 📦 **Installation**

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd Boarding-solution
```

2. **Install dependencies:**
```bash
npm install
```

---

## 🔥 **Firebase Setup**

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `boarding-solution`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication
1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get Started"**
3. Enable **"Email/Password"** sign-in method
4. Click **"Save"**

### Step 3: Create Firestore Database
1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules later)
4. Choose your location (closest to Sri Lanka: `asia-south1`)
5. Click **"Enable"**

### Step 4: Add Security Rules
1. In Firestore, go to **"Rules"** tab
2. Copy the contents from `firestore.rules` in your project
3. Paste into the Firebase console
4. Click **"Publish"**

### Step 5: Get Firebase Config
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`)
4. Register app name: `boarding-solution-web`
5. Copy the `firebaseConfig` object

### Step 6: Update Firebase Config in Your Project
1. Open `src/lib/firebase.js`
2. Replace the config with your values:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 🗺️ **Google Maps API Setup**

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: `boarding-solution`

### Step 2: Enable Geocoding API
1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Geocoding API"**
3. Click **"Enable"**

### Step 3: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **"Create Credentials"** → **"API Key"**
3. Copy the API key

### Step 4: Restrict API Key (Important for Security!)
1. Click on your API key
2. Under **"Application restrictions"**, select **"HTTP referrers (web sites)"**
3. Add your domains:
   - `localhost:3000/*`
   - `yourdomain.com/*`
4. Under **"API restrictions"**, select **"Restrict key"**
5. Select only **"Geocoding API"**
6. Click **"Save"**

### Step 5: Add API Key to Project
1. Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

2. **OR** Update `src/lib/utils.js`:
```javascript
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';
```

---

## 🚀 **Running the App**

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

---

## 📱 **Building for Android**

### Step 1: Build the Web App
```bash
npm run build
```

### Step 2: Sync with Capacitor
```bash
npx cap sync android
```

### Step 3: Open in Android Studio
```bash
npx cap open android
```

### Step 4: Build APK
1. In Android Studio, wait for Gradle sync to complete
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete (~5 minutes)
4. Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 5: Install on Phone
1. Transfer `app-debug.apk` to your Android phone
2. Enable **"Install from Unknown Sources"** in phone settings
3. Tap the APK file to install
4. Open **"Boarding Solution"** app

---

## 🌐 **Deployment**

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click **"Import Project"**
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
6. Click **"Deploy"**

### Deploy to Netlify
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com/)
3. Click **"New site from Git"**
4. Select repository
5. Build command: `npm run build`
6. Publish directory: `out`
7. Add environment variables
8. Click **"Deploy"**

---

## 🛡️ **Security**

### Important Security Steps:

1. **Never commit API keys to Git**
   - Add `.env.local` to `.gitignore`
   - Use environment variables

2. **Update Firestore Rules**
   - The rules in `firestore.rules` are already production-ready
   - Make sure to publish them in Firebase Console

3. **Add Admin Users**
   - In `firestore.rules`, find the reports section
   - Replace `'YOUR_ADMIN_UID_HERE'` with your Firebase user UID
   - You can find your UID in Firebase Console → Authentication

4. **Restrict Google Maps API**
   - Always restrict API keys to specific domains
   - Monitor usage in Google Cloud Console

5. **Enable Firebase App Check** (Optional but Recommended)
   - Go to Firebase Console → Build → App Check
   - Enable for web and Android
   - Helps prevent abuse

---

## 📝 **User Guide**

### For Students:
1. **Register** as a student
2. **Browse** listings on the map
3. **Filter** by price, gender, amenities
4. **Save** favorites by clicking the heart icon
5. **Contact** brokers via WhatsApp
6. **Leave reviews** to help other students
7. **Find roommates** in the Roommates section

### For Brokers:
1. **Register** as a broker
2. **Add listings** with photos and details
3. **Mark as sold** when property is rented
4. **Manage** all your listings in one place

### For Admins:
1. Login with admin account
2. View analytics and user reports
3. Resolve or delete inappropriate content

---

## 🐛 **Troubleshooting**

### "Port 3000 is already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### "Firebase: Error (auth/configuration-not-found)"
- Make sure you've enabled Email/Password in Firebase Authentication
- Check that your `firebaseConfig` is correct

### "Geocoding API failed"
- Verify your Google Maps API key is correct
- Make sure Geocoding API is enabled
- Check API key restrictions

### Images not loading
- Images are stored as Base64 in Firestore
- Make sure images are under 500KB
- Compression happens automatically

---

## 📞 **Support**

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review Firebase and Google Cloud Console for errors
- Check browser console for JavaScript errors

---

## 🎉 **Congratulations!**

Your Boarding Solution app is now fully functional! 🚀

**Next Steps:**
- Deploy to production
- Build the Android app
- Share with users
- Collect feedback and iterate

---

**Made with ❤️ for students in Sri Lanka**
