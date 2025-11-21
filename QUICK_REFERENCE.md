# 🚀 Quick Reference Card

## 📱 User Roles & Access

### Student Account
- **Registration**: Email + Password
- **Access To**:
  - 🗺️ Map view with all listings
  - ❤️ Favorites page
  - 🤝 Roommate Finder
  - 👤 Profile settings
  - ⭐ Write reviews
  
### Broker Account
- **Registration**: Email + Password (with "broker" in email)
- **Access To**:
  - 📊 Broker Dashboard
  - ➕ Add new listings
  - 📝 Manage listings
  - 👤 Profile settings

### Admin Account
- **Access To**:
  - 📊 Analytics Dashboard
  - 🚩 Report management
  - ✅ Content moderation

---

## 🔥 Firebase Collections Structure

### `users`
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  phone: string,
  bio: string,
  photoURL: string (Base64),
  role: "student" | "broker" | "admin",
  createdAt: timestamp
}
```

### `listings`
```javascript
{
  id: string (auto-generated),
  brokerId: string,
  brokerEmail: string,
  name: string,
  price: number,
  address: string,
  contact: string,
  gender: "Any" | "Boys" | "Girls",
  amenities: ["WiFi", "AC", "Food", "Attached Bathroom"],
  images: [Base64 strings],
  lat: number,
  lng: number,
  status: "Available" | "Sold Out",
  verified: boolean,
  viewCount: number,
  favoriteCount: number,
  createdAt: timestamp
}
```

### `reviews`
```javascript
{
  id: string,
  listingId: string,
  userId: string,
  userName: string,
  text: string,
  rating: number (1-5),
  createdAt: timestamp
}
```

### `favorites`
```javascript
{
  id: string,
  userId: string,
  listingId: string,
  createdAt: timestamp
}
```

### `roommates`
```javascript
{
  id: string,
  userId: string,
  userName: string,
  userEmail: string,
  title: string,
  location: string,
  budget: number,
  moveInDate: date,
  roommates: number,
  gender: string,
  description: string,
  createdAt: timestamp
}
```

### `reports`
```javascript
{
  id: string,
  reporterId: string,
  targetId: string (listing or user),
  reason: string,
  description: string,
  status: "pending" | "resolved",
  createdAt: timestamp
}
```

---

## 🎨 Key CSS Classes

```css
.glass                 /* Glassmorphism card effect */
.btn                   /* Base button style */
.btn-primary          /* Primary button (gradient) */
.input-field          /* Form input style */
.flex-center          /* Flexbox center alignment */
.text-gradient        /* Gradient text effect */
.container            /* Max-width container */
.animate-fade-in      /* Fade in animation */
```

---

## 🛠️ Utility Functions (`src/lib/utils.js`)

### `compressImage(file)`
- Compresses image to max 500KB
- Returns: Compressed Blob

### `fileToBase64(file)`
- Converts file to Base64 string
- Returns: Promise<string>

### `geocodeAddress(address)`
- Converts address to lat/lng
- Returns: `{ lat, lng, formattedAddress }`

### `formatCurrency(amount)`
- Formats number as LKR currency
- Returns: "Rs. 15,000"

### `calculateDistance(lat1, lon1, lat2, lon2)`
- Calculates distance in kilometers
- Returns: number

### `timeAgo(timestamp)`
- Converts timestamp to relative time
- Returns: "2h ago", "5d ago", etc.

---

## 📍 Map Component Props

```javascript
<Map boardings={filteredListings} />
```

**Features**:
- GPS location marker
- Interactive markers for each listing
- Popup with:
  - Image
  - Price
  - Amenities
  - Favorite button
  - Contact & Navigate buttons
  - Reviews section

---

## 🔐 Security Rules Highlights

```javascript
// Users can only edit their own data
allow write: if request.auth.uid == userId;

// Anyone can read available listings
allow read: if true;

// Only listing owner can update
allow update: if resource.data.brokerId == request.auth.uid;

// Only authenticated users can favorite
allow create: if request.auth != null;
```

---

## 🎯 Common Tasks

### Add a New Listing (Broker)
1. Login as broker
2. Go to Broker Dashboard
3. Fill form with property details
4. Upload images (auto-compressed)
5. Address is auto-geocoded
6. Click "Post Listing"

### Save a Favorite (Student)
1. Browse map
2. Click on a listing marker
3. Click the heart icon in popup
4. View saved listings in Favorites page

### Find a Roommate
1. Go to Roommates page
2. Click "Create Post"
3. Fill in preferences
4. View other posts
5. Click "Contact" to email

### Leave a Review
1. Click on a listing in the map
2. Scroll to Reviews section
3. Click "Write Review"
4. Select star rating
5. Write your experience
6. Click "Post"

---

## 🚨 Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npx kill-port 3000` |
| Firebase config error | Check `src/lib/firebase.js` |
| Geocoding not working | Add Google Maps API key |
| Images too large | Auto-compression handles this |
| Can't login | Check Firebase Auth is enabled |
| Map not loading | Check internet connection |
| Bottom nav not showing | Clear cache and reload |

---

## 📞 API Endpoints Used

### Google Maps Geocoding API
```
https://maps.googleapis.com/maps/api/geocode/json
?address={address}
&key={API_KEY}
```

### WhatsApp Deep Link
```
https://wa.me/{phone_number}
```

### Google Maps Navigation
```
https://www.google.com/maps/dir/
?api=1
&destination={lat},{lng}
```

---

## ⚡ Performance Tips

1. **Images**: Always under 500KB (auto-compressed)
2. **Firestore**: Use where() queries for filtering
3. **Real-time**: Use onSnapshot() for live updates
4. **Caching**: Listings are cached in state
5. **Lazy Loading**: Map component is dynamically imported

---

## 📊 Analytics Metrics

Track these in Admin Dashboard:
- Total listings
- Total users
- Combined property value
- Pending reports
- Recent activity

---

## 🎉 Feature Completion Checklist

- [x] User Authentication (Login/Register)
- [x] Student Dashboard with Map
- [x] Broker Dashboard
- [x] Admin Dashboard
- [x] Profile Page
- [x] Favorites System
- [x] Roommate Finder
- [x] Reviews & Ratings
- [x] Image Upload (Base64)
- [x] Real Geocoding
- [x] Firebase Security Rules
- [x] Password Reset
- [x] Email Verification
- [x] Bottom Navigation
- [x] WhatsApp Integration
- [x] Google Maps Navigation
- [x] Advanced Filtering
- [x] Report System
- [x] Android App (Capacitor)
- [x] Comprehensive Documentation

---

**All features are production-ready! 🚀**
