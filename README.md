# Partechnology CRM

A customizable, cloud-based lead management system built with Next.js and Firebase. Perfect for managing home service leads with dynamic columns and real-time sync.

## Features

✅ **Dynamic Columns** - Add/remove custom fields on the fly  
✅ **Full CRUD** - Create, read, update, delete leads  
✅ **CSV Import/Export** - Bulk import leads or export to CSV  
✅ **Real-time Sync** - All changes saved instantly to Firebase  
✅ **Mobile Optimized** - Works perfectly on phones and tablets  
✅ **Zero Backend Hassle** - Firebase Realtime Database handles all data  
✅ **Deploy to Vercel** - One-click deployment with environment variables  

## Quick Start

### Prerequisites
- Node.js 16+ 
- Firebase account (free tier works great)
- GitHub account
- Vercel account (for deployment)

### 1. Setup Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/partechnology-crm.git
cd partechnology-crm

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Realtime Database**:
   - Click "Create Database"
   - Start in test mode (for development)
   - Choose region closest to you
4. Get your credentials:
   - Project Settings → Service Accounts → Realtime Database
   - Copy the connection string or API credentials

### 3. Configure Environment

Edit `.env.local` with your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Via GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/partechnology-crm.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repo
   - Add environment variables (from `.env.local`)
   - Click Deploy

3. **Access Live**:
   Your CRM will be live at `https://your-project.vercel.app`

### Option 2: Direct Vercel CLI

```bash
npm i -g vercel
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... add all env vars
vercel --prod
```

## Usage

### Adding Leads
1. Click **"Add Lead"** button
2. Fill in all fields
3. Click **"Save"**

### Managing Columns
1. Click **"Settings"** → **"Columns"**
2. Type new column name and click **"Add"**
3. Remove columns with the trash icon
4. Click **"Done"**

### CSV Import
1. Click **"Import"**
2. Select your CSV file
3. Columns must match exactly (or new ones will be created)

### CSV Export
1. Click **"Export"**
2. File downloads as `leads_TIMESTAMP.csv`

## Project Structure

```
partechnology-crm/
├── pages/
│   ├── _app.js          # Next.js app wrapper
│   └── index.js         # Main CRM dashboard
├── styles/
│   ├── globals.css      # Global styles
│   └── Home.module.css  # Component styles
├── lib/
│   └── firebase.js      # Firebase setup
├── package.json
├── .env.example
├── .gitignore
├── next.config.js
└── vercel.json
```

## Security

- **Never commit `.env.local`** - Use `git add -f .env.local` is already in `.gitignore`
- Firebase rules should restrict access (test mode is for dev only)
- For production, add authentication to Firebase Realtime Database

## Customization

### Change Default Columns

Edit `pages/index.js`:
```js
const [columns, setColumns] = useState(['name', 'phone', 'email', 'company', 'status']);
```

### Change Styling

Edit `styles/Home.module.css` for custom colors/layout.

### Add Authentication

Install Firebase Auth:
```bash
npm install firebase
```

Then add auth guards in `pages/index.js`.

## Troubleshooting

**"Cannot find module 'firebase'"**
```bash
npm install firebase
```

**"NEXT_PUBLIC_FIREBASE_PROJECT_ID is undefined"**
- Check `.env.local` exists and has correct values
- Restart dev server with `npm run dev`

**Firebase data not saving**
- Check Realtime Database rules in Firebase Console
- Ensure rules allow write access in test mode

**Vercel deploy fails**
- Verify all `NEXT_PUBLIC_*` env vars are set in Vercel dashboard
- Check build logs for errors

## Support

For issues, check:
1. Firebase Console logs
2. Browser console (F12)
3. Vercel deployment logs

## License

MIT - feel free to use for Partechnology leads
