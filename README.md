# 🏠 Boarding Solution

> The ultimate platform to find boarding accommodations and roommates in Sri Lanka

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Latest-orange)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## ✨ Features

### 🎓 For Students
- 📍 **Interactive Map View** - Browse all available listings on an interactive map
- 🔍 **Advanced Filtering** - Filter by price range, gender preference, and amenities
- ❤️ **Favorites System** - Save and manage your favorite listings
- ⭐ **Reviews & Ratings** - Read reviews from other students and share your experience
- 🤝 **Roommate Finder** - Find compatible roommates to share accommodations
- 📱 **WhatsApp Integration** - Contact brokers instantly via WhatsApp
- 🗺️ **Navigation** - Get directions to any property using Google Maps
- 🔐 **Secure Authentication** - Login with email/password
- 👤 **User Profile** - Manage your profile with photo upload
- 📧 **Email Verification** - Verify your account for added security

### 🏢 For Brokers
- 📸 **Image Upload** - Add multiple photos to your listings (Base64 storage)
- 📝 **Listing Management** - Create, edit, and manage all your properties
- 💰 **Dynamic Pricing** - Set monthly rent in LKR
- ✅ **Amenities** - Highlight features like WiFi, AC, Food, Attached Bathroom
- 📊 **Dashboard** - View and manage all your listings in one place
- ✓ **Status Management** - Mark properties as Available or Sold Out
- 🗺️ **Auto-Geocoding** - Addresses are automatically converted to GPS coordinates

### 👨‍💼 For Admins
- 📊 **Real-time Analytics** - Monitor users, listings, and platform activity
- 🚩 **Report Management** - Review and handle user reports
- ✅ **Content Moderation** - Approve or remove inappropriate content
- 📈 **Revenue Tracking** - View total platform value
- 👥 **User Management** - Monitor registered users

## 🚀 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Base64 (for images) - No paid plan required!
- **Maps**: React Leaflet + OpenStreetMap
- **Geocoding**: Google Maps Geocoding API
- **Mobile**: Capacitor (for Android app)
- **Styling**: Custom CSS with Glassmorphism

## 📦 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd Boarding-solution

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Full Setup Guide

For complete setup instructions including Firebase, Google Maps API, and Android build, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🏗️ Project Structure

```
Boarding-solution/
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   └── forgot-password/ # Password reset
│   │   ├── student/
│   │   │   └── dashboard/      # Student dashboard with map
│   │   ├── broker/
│   │   │   └── dashboard/      # Broker dashboard
│   │   ├── admin/
│   │   │   └── dashboard/      # Admin panel
│   │   ├── profile/            # User profile page
│   │   ├── favorites/          # Saved listings
│   │   ├── roommates/          # Roommate finder
│   │   └── page.js             # Landing page
│   ├── components/
│   │   ├── Map.js              # Interactive map component
│   │   └── BottomNav.js        # Bottom navigation
│   └── lib/
│       ├── firebase.js         # Firebase configuration
│       └── utils.js            # Utility functions
├── public/                     # Static assets
├── android/                    # Capacitor Android project
├── firestore.rules            # Firebase security rules
├── SETUP_GUIDE.md             # Complete setup instructions
└── ANDROID_BUILD.md           # Android build guide
```

## 🎨 Key Features Explained

### Base64 Image Storage
We use Base64 encoding for images to:
- ✅ Avoid Firebase Storage costs
- ✅ Simplify setup (no storage bucket needed)
- ✅ Work on free tier
- ⚡ Images are auto-compressed to ~500KB

### Real Geocoding
Addresses are automatically converted to GPS coordinates using Google Maps Geocoding API:
- Accurate map markers
- Proper location-based search
- Distance calculations

### Security
- Firebase Authentication for user management
- Firestore Security Rules for data protection
- Role-based access control
- Email verification
- Password reset functionality

## 📱 Building for Android

```bash
# Build the web app
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

See [ANDROID_BUILD.md](./ANDROID_BUILD.md) for detailed instructions.

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub, then deploy on Vercel
# Add environment variables:
# - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: out
```

## 🔐 Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📝 Firebase Configuration

Update `src/lib/firebase.js` with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};
```

## 🎯 Use Cases

- 🎓 **University Students** - Find affordable boarding near campus
- 👥 **Roommate Matching** - Connect with compatible roommates
- 🏢 **Property Brokers** - List and manage rental properties
- 🔍 **Smart Search** - Filter by budget, location, and preferences

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for backend services
- OpenStreetMap for map tiles
- React Leaflet for map integration
- Lucide React for beautiful icons

---

**Made with ❤️ for students in Sri Lanka**

For questions or support, please check the [SETUP_GUIDE.md](./SETUP_GUIDE.md)
