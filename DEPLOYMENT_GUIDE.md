# Partechnology CRM - Complete Deployment Guide

**Your production-ready CRM is ready to deploy!** Here's exactly how to get it live on Vercel in 15 minutes.

## What You Get

✅ **Fully customizable CRM** - Add/remove columns dynamically  
✅ **Real-time Firebase sync** - All data synced instantly  
✅ **CSV import/export** - Bulk lead management  
✅ **Mobile-optimized UI** - Works perfectly on phones  
✅ **Vercel-ready** - Deploy in one click  
✅ **GitHub integration** - Auto-deploy on push  

---

## Files Structure

```
partechnology-crm/
├── pages/
│   ├── _app.js              # App wrapper
│   └── index.js             # Main CRM dashboard
├── styles/
│   ├── globals.css          # Global styles
│   └── Home.module.css      # Component styles
├── lib/
│   └── firebase.js          # Firebase config
├── .github/
│   └── workflows/
│       └── deploy.yml       # Auto-deploy workflow
├── package.json             # Dependencies
├── next.config.js           # Next.js config
├── jsconfig.json            # JS config
├── vercel.json              # Vercel config
├── .env.example             # Example env vars
├── .gitignore               # Git ignore rules
├── README.md                # Full documentation
└── SETUP.md                 # Quick setup
```

---

## 15-Minute Deployment

### Phase 1: Firebase Setup (5 mins)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Create Project"
   - Name it `partechnology-crm` (or anything)
   - Click Create

2. **Enable Realtime Database**
   - In Firebase Console, click "Realtime Database"
   - Click "Create Database"
   - Choose location nearest to you (USA: us-central1)
   - Start in "Test Mode" (we'll secure later)
   - Click Enable

3. **Get Your Credentials**
   - Click ⚙️ (Settings) → Project Settings
   - Scroll to "Your apps" section
   - You'll see your API keys and IDs displayed
   - Copy these exactly:
     - API Key
     - Auth Domain
     - Project ID
     - Storage Bucket
     - Messaging Sender ID
     - App ID

### Phase 2: GitHub Setup (3 mins)

1. **Initialize Git Repository**
   ```bash
   cd partechnology-crm
   git init
   git add .
   git commit -m "Initial CRM commit"
   ```

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `partechnology-crm`
   - Click "Create repository"
   - Copy the commands shown and run:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/partechnology-crm.git
   git push -u origin main
   ```

### Phase 3: Vercel Deployment (7 mins)

1. **Connect Vercel to GitHub**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repo: `partechnology-crm`
   - Click "Import"

2. **Add Environment Variables**
   - You'll see "Environment Variables" section
   - Add these 6 variables (from Firebase):
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_auth_domain.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_bucket.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
   ```

3. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your CRM is live! 🎉
   - Vercel shows your URL: `https://partechnology-crm.vercel.app`

---

## Using Your CRM

### Adding a Lead
1. Click **"Add Lead"** (top right)
2. Fill in all visible fields
3. Click **"Save"**

### Managing Columns
1. Click **"Settings"** → **"Columns"**
2. Type new column name (e.g., "source", "budget", "date_added")
3. Click **"Add"**
4. Remove columns with trash icon
5. Click **"Done"**

### Bulk Import (CSV)
1. Prepare CSV file with headers
2. Click **"Import"** (top right)
3. Select your file
4. All rows imported instantly

### Export to CSV
1. Click **"Export"** (top right)
2. Downloads as `leads_TIMESTAMP.csv`
3. Open in Excel or Google Sheets

---

## Firebase Security (For Production)

**⚠️ Test Mode is NOT secure for production!**

1. Go to Firebase Console
2. Realtime Database → Rules
3. Replace with:
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
4. Click "Publish"

Then add authentication to the CRM (Google/Email login).

---

## Automatic GitHub Deployments

**Every time you push to GitHub, Vercel auto-deploys!**

```bash
# Make changes locally
git add .
git commit -m "Added new columns"
git push origin main

# Automatically deploys within 1 minute
```

To check deployment status:
- Go to your Vercel project dashboard
- Click "Deployments" tab
- See live build logs

---

## Customization Ideas

### Change Default Columns
Edit `pages/index.js`:
```js
const [columns, setColumns] = useState([
  'business_name', 
  'phone', 
  'email', 
  'niche', 
  'priority',
  'pain_signals'
]);
```

### Change Colors
Edit `styles/Home.module.css`:
```css
.btnPrimary {
  background: #0066cc;  /* Change this hex */
  color: white;
}
```

### Import Your Existing Leads

**Format your CSV like this:**
```
business_name,phone,email,niche,priority
A&E NYC Plumbing,646-392-7164,info@ae.com,Plumbing,Hot
Brody HVAC,310-896-4911,brody@hvac.com,HVAC,Warm
```

Then click Import and select the file.

---

## Troubleshooting

### "NEXT_PUBLIC_FIREBASE_PROJECT_ID is undefined"
**Solution:** Check all 6 env variables are set in Vercel dashboard. Then redeploy.

### "Firebase permission denied" error
**Solution:** Your database rules don't allow writes. Go to Firebase Console → Realtime Database → Rules and ensure they allow access.

### CSV import says "No data to convert"
**Solution:** Make sure CSV has headers in first row.

### Changes aren't saving
**Solution:** 
1. Check browser console (F12) for errors
2. Verify Firebase Realtime Database is enabled
3. Check network tab to see if API calls succeed

---

## Next Steps

### Add User Authentication
```bash
npm install @firebase/auth
```
Then wrap CRM in login screen.

### Add Search/Filter
Add `<input type="text">` to filter leads by name/phone/email.

### Add PDF Export
Install `jsPDF` and add export button to download as PDF.

### Add API Integration
Create `/pages/api/webhook.js` to integrate with Stacy or other services.

---

## Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **CRM README**: See README.md in repo

---

## Quick Command Reference

```bash
# Local development
npm run dev                 # Start dev server at localhost:3000
npm run build             # Build for production

# Git/GitHub
git add .                 # Stage all changes
git commit -m "message"   # Commit changes
git push origin main      # Push to GitHub (auto-deploys to Vercel)

# Clean up
rm -rf node_modules       # Delete dependencies
npm install               # Reinstall dependencies
```

---

## Success Checklist

- [x] Created Firebase project
- [x] Enabled Realtime Database
- [x] Copied Firebase credentials
- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Connected Vercel to GitHub
- [ ] Added environment variables to Vercel
- [ ] Deployed to Vercel
- [ ] Tested at your live URL
- [ ] Imported first leads

**You're done!** 🚀 Your CRM is live and ready to capture leads for Partechnology.
