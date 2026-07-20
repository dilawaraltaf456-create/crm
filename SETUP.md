# Quick Setup Guide

## Step 1: Clone & Install
```bash
git clone YOUR_REPO_URL
cd partechnology-crm
npm install
```

## Step 2: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Create new project
3. Enable "Realtime Database" (in test mode)
4. Copy your config

## Step 3: Add Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

## Step 4: Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

## Step 5: Deploy to Vercel

### Via GitHub (Easiest):
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/partechnology-crm
git push -u origin main
```

Then:
1. Go to vercel.com
2. Import from GitHub
3. Add env vars from step 3
4. Deploy!

### Via CLI:
```bash
npm i -g vercel
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add remaining vars
vercel --prod
```

Your CRM is now live! 🚀

## Key Features to Try

1. **Add columns** - Settings → Columns
2. **Import CSV** - Click Import button
3. **Export leads** - Click Export button
4. **Edit/Delete** - Right side action buttons

## Firebase Rules (for production)

Replace default rules with:
```json
{
  "rules": {
    "crm": {
      ".read": "auth.uid != null",
      ".write": "auth.uid != null"
    }
  }
}
```

Then add authentication to the app for security.
