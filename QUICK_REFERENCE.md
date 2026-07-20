# Partechnology CRM - Quick Reference

## 🚀 30-Second Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Add your Firebase credentials to .env.local
# (Get from Firebase Console → Project Settings)

# 4. Run locally
npm run dev

# 5. Open http://localhost:3000
```

---

## 📊 CRM Core Features

| Feature | How to Use | Notes |
|---------|-----------|-------|
| **Add Lead** | Click "Add Lead" button | Fills in all current columns |
| **Edit Lead** | Click edit icon in Actions | Opens form modal |
| **Delete Lead** | Click trash icon in Actions | Permanent deletion |
| **Add Column** | Settings → Columns → Type name | Auto-added to all leads |
| **Remove Column** | Settings → Columns → Trash icon | Data lost (can't undo) |
| **Import CSV** | Click "Import" button | Must have headers |
| **Export CSV** | Click "Export" button | Downloads immediately |

---

## 🔥 Firebase Setup (Copy-Paste)

1. Go to https://console.firebase.google.com
2. Create project named `partechnology-crm`
3. Enable Realtime Database (test mode)
4. Copy these from Settings → Project Settings:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

5. Paste into `.env.local` file

---

## 🌐 Deploy to Vercel

### Option A: GitHub + Vercel (Recommended)
```bash
git init
git add .
git commit -m "Initial"
git remote add origin https://github.com/YOUR_USERNAME/partechnology-crm.git
git push origin main
```
Then: Visit vercel.com → Import repo → Add env vars → Deploy

### Option B: Vercel CLI
```bash
npm i -g vercel
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... repeat for all 6 vars
vercel --prod
```

---

## 📝 CSV Format (for import)

**Correct:**
```
name,phone,email,company,status
John Smith,555-1234,john@example.com,HVAC Co,Hot
Jane Doe,555-5678,jane@example.com,Plumbing Inc,Warm
```

**Headers must match your current columns!**  
Or they'll be created as new columns.

---

## ⚙️ Common Customizations

### Change startup columns
Edit `pages/index.js` line ~12:
```js
const [columns, setColumns] = useState(['name', 'phone', 'email', 'company', 'status']);
```

### Change primary color (blue → red)
Edit `styles/Home.module.css` line ~48:
```css
.btnPrimary {
  background: #dc3545;  /* Changed from #0066cc */
}
```

### Add phone number validation
Edit `pages/index.js` in saveLead function:
```js
if (!/^\d{10}$/.test(formData.phone)) {
  alert('Phone must be 10 digits');
  return;
}
```

---

## 🔒 Firebase Security

**For test mode (development):** ✅ Safe  
**For production:** ⚠️ Change rules!

Go to Firebase Console → Realtime Database → Rules:
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

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find module 'firebase'" | `npm install firebase` |
| Env vars undefined | Check `.env.local` has all 6 vars |
| Data not saving | Check Firebase rules allow writes |
| Build fails on Vercel | Check all `NEXT_PUBLIC_*` in Vercel dashboard |
| Columns don't show | Refresh browser (F5) |

---

## 📱 Mobile Optimization

The CRM is **fully responsive** - works on:
- ✅ iPhone / iPad
- ✅ Android phones
- ✅ Tablets
- ✅ Desktop

Everything auto-stacks on small screens.

---

## 🔗 Important Links

- **Firebase Console**: https://console.firebase.google.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/YOUR_USERNAME/partechnology-crm
- **Live CRM**: https://partechnology-crm.vercel.app

---

## 💡 Pro Tips

1. **Bulk edit** - Export CSV → Edit in Excel → Import back
2. **Backup data** - Export CSV regularly to local drive
3. **Add filters** - Create new column called "campaign" to track source
4. **Integration** - Add webhook in `/pages/api/` to sync with Stacy
5. **Search** - Add `<input>` at top to filter leads by name/phone

---

## 🎯 Next Sprint Ideas

- [ ] Add user authentication (Google/Email login)
- [ ] Add search/filter by column
- [ ] Add pagination for 1000+ leads
- [ ] Add duplicate detection
- [ ] Add lead status pipeline (New → Called → Quoted → Won)
- [ ] Add date pickers for follow-up scheduling
- [ ] Add notes/comments per lead
- [ ] Integrate with Stacy API for auto-calling

---

## 📞 Need Help?

1. Check DEPLOYMENT_GUIDE.md for detailed steps
2. Check README.md for full documentation
3. Check browser console (F12) for errors
4. Check Vercel deployment logs
5. Check Firebase Console for data issues

**You've got this!** 🚀
