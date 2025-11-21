# 🚀 Deploy to Vercel - Step by Step

## ✅ **I've prepared your project for deployment!**

Your app is now ready to deploy to **Vercel** (FREE hosting for Next.js apps).

---

## 📋 **Prerequisites** (5 minutes)

You'll need:
1. **GitHub Account** (free) - https://github.com/signup
2. **Vercel Account** (free) - https://vercel.com/signup
3. **Firebase Project** (free) - https://firebase.google.com/
4. **Google Maps API Key** (free tier) - https://console.cloud.google.com/

---

## 🎯 **Deployment Steps**

### **Step 1: Push to GitHub** (5 minutes)

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `boarding-solution`
   - Make it **Public** or **Private** (your choice)
   - **DO NOT** initialize with README (we already have files)
   - Click **"Create repository"**

2. **Push your code:**
   
   Open a **NEW terminal** (not the one running npm) and run:

   ```bash
   cd c:/Users/moham/OneDrive/Desktop/Boarding-solution
   
   git add .
   
   git commit -m "Initial commit - Boarding Solution App"
   
   git branch -M main
   
   git remote add origin https://github.com/YOUR_USERNAME/boarding-solution.git
   
   git push -u origin main
   ```

   **Replace `YOUR_USERNAME` with your GitHub username!**

   If it asks for credentials:
   - Username: Your GitHub username
   - Password: Use a **Personal Access Token** (not your password)
   - Get token from: https://github.com/settings/tokens

---

### **Step 2: Deploy to Vercel** (3 minutes)

1. **Go to Vercel:**
   - Visit https://vercel.com/
   - Click **"Start Deploying"** or **"Add New Project"**
   - Sign in with GitHub

2. **Import Your Repository:**
   - Click **"Import Git Repository"**
   - Find `boarding-solution` in the list
   - Click **"Import"**

3. **Configure Project:**
   - **Project Name**: boarding-solution (or your choice)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Add Environment Variables:**
   
   Click **"Environment Variables"** and add:

   ```
   Name: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
   Value: YOUR_API_KEY_HERE
   ```

   ⚠️ **IMPORTANT:** You need to create this API key first (see Step 3 below)

5. **Deploy!**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build
   - You'll get a live URL like: `https://boarding-solution.vercel.app`

---

### **Step 3: Set Up Firebase** (15 minutes)

⚠️ **Critical:** You MUST do this or the app won't work!

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com/
   - Click **"Add project"**
   - Name: `boarding-solution`
   - Disable Google Analytics (optional)
   - Click **"Create project"**

2. **Enable Authentication:**
   - In Firebase Console: **Build** → **Authentication**
   - Click **"Get Started"**
   - Enable **"Email/Password"**
   - Click **"Save"**

3. **Create Firestore Database:**
   - Go to **Build** → **Firestore Database**
   - Click **"Create database"**
   - Select **"Start in production mode"**
   - Choose location: **asia-south1** (closest to Sri Lanka)
   - Click **"Enable"**

4. **Deploy Security Rules:**
   - In Firestore, go to **"Rules"** tab
   - Copy the entire content from your `firestore.rules` file
   - Paste it in the Firebase console
   - Click **"Publish"**

5. **Get Firebase Config:**
   - Go to **Project Settings** (gear icon) → **General**
   - Scroll to **"Your apps"**
   - Click web icon `</>`
   - Register app: `boarding-solution-web`
   - Copy the `firebaseConfig` object

6. **Update Your Code:**
   - Open `src/lib/firebase.js`
   - Replace the config with YOUR values from Firebase

7. **Redeploy:**
   - After updating `firebase.js`, commit and push:
   ```bash
   git add src/lib/firebase.js
   git commit -m "Add Firebase config"
   git push
   ```
   - Vercel will auto-deploy the update!

---

### **Step 4: Set Up Google Maps API** (10 minutes)

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Create new project: `boarding-solution`

2. **Enable Geocoding API:**
   - Go to **APIs & Services** → **Library**
   - Search "Geocoding API"
   - Click **"Enable"**

3. **Create API Key:**
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"API Key"**
   - Copy the key

4. **Restrict API Key (IMPORTANT!):**
   - Click on your API key
   - Under **"Application restrictions"**:
     - Select **"HTTP referrers"**
     - Add allowed URLs:
       ```
       localhost:3000/*
       your-vercel-app.vercel.app/*
       ```
   - Under **"API restrictions"**:
     - Select **"Restrict key"**
     - Choose only **"Geocoding API"**
   - Click **"Save"**

5. **Add to Vercel:**
   - Go to your Vercel project
   - Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = your_api_key_here
     ```
   - Redeploy

---

## ✅ **Verification Checklist**

After deployment, test these:

- [ ] Visit your Vercel URL
- [ ] Landing page loads
- [ ] Can register new account
- [ ] Can log in
- [ ] Map displays (if API key configured)
- [ ] Can create listing (as broker)
- [ ] Can favorite listing (as student)
- [ ] Can post roommate request
- [ ] Profile page works
- [ ] Reviews work

---

## 🎊 **You're Live!**

Your app is now deployed at:
```
https://your-project-name.vercel.app
```

Share this URL with anyone to test!

---

## 📱 **Custom Domain** (Optional)

Want your own domain like `boardingsolution.lk`?

1. **Buy domain** (from Namecheap, GoDaddy, etc.)
2. **In Vercel:**
   - Go to project Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions
3. **Done!** SSL certificate auto-generated

---

## 🔄 **Updating Your App**

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Vercel will **automatically redeploy** in ~2 minutes!

---

## 📊 **Monitoring**

**Vercel Dashboard:**
- View deployment logs
- See visitor analytics
- Monitor performance
- Check errors

**Firebase Console:**
- Monitor database usage
- Check authentication
- View security rules

---

## 🐛 **Troubleshooting**

### **Build Failed**
- Check Vercel deployment logs
- Usually a syntax error or missing dependency
- Fix locally, test with `npm run build`, then push

### **App Loads but Features Don't Work**
- Check browser console for errors
- Likely Firebase config issue
- Verify environment variables in Vercel

### **Map Not Loading**
- Check Google Maps API key is set
- Verify API is enabled in Google Cloud
- Check referrer restrictions

### **Can't Register/Login**
- Check Firebase Authentication is enabled
- Verify Firestore security rules are published
- Check browser console for errors

---

## 💰 **Costs**

Everything is **FREE** for your usage:

- ✅ **Vercel**: Free for personal projects
- ✅ **Firebase**: Free tier (generous limits)
- ✅ **Google Maps**: $200/month free credit

You won't pay anything unless you get HUGE traffic!

---

## 🚀 **Next Steps**

1. **Deploy now** using steps above
2. **Test thoroughly** on live site  
3. **Share with friends** for feedback
4. **Iterate and improve**
5. **Deploy to Google Play Store** (see GOOGLE_PLAY_DEPLOY.md)

---

## ⚡ **Quick Command Reference**

```bash
# Initial push to GitHub
git add .
git commit -m "Initial commit"
git push -u origin main

# Future updates
git add .
git commit -m "Added new feature"
git push

# Check what changed
git status

# View commit history
git log --oneline
```

---

## 🎉 **Congratulations!**

Your app will be **LIVE on the internet** in about 30 minutes!

**Timeline:**
- 5 min: Push to GitHub
- 3 min: Deploy to Vercel
- 15 min: Set up Firebase
- 10 min: Set up Google Maps
- 5 min: Final testing

**Total: ~40 minutes to go live!** 🚀

---

**Need help? Check the error logs in:**
- Vercel: Project → Deployments → Click deployment → View Function Logs
- Firebase: Console → Build → Firestore → Usage tab
- Browser: F12 → Console tab

**You've got this!** 💪
