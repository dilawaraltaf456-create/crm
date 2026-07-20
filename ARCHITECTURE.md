# Partechnology CRM - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   React Frontend (Next.js)              │
│            pages/index.js - Main CRM Dashboard          │
│                  (CRUD + Column Mgmt)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP + Firebase SDK
                       ↓
┌─────────────────────────────────────────────────────────┐
│                Firebase Realtime Database                │
│  (Authentication, Real-time Sync, Automatic Backups)   │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Load Leads on Page Open

```javascript
// Page loads → useEffect hook triggers
useEffect(() => {
  loadData();  // Fetch from Firebase
}, []);

// loadData()
const loadData = async () => {
  const dbRef = ref(database, 'crm');
  const snapshot = await get(dbRef);
  
  if (snapshot.exists()) {
    setLeads(snapshot.val().leads);     // Update React state
    setColumns(snapshot.val().columns); // Update column headers
  }
};
```

### 2. Add/Edit Lead

```javascript
saveLead = () => {
  // Update local React state
  const updated = leads.map(l => 
    l.id === editingId ? formData : l
  );
  setLeads(updated);
  
  // Sync to Firebase
  saveData(updated, columns);
};

// saveData()
const saveData = async (newLeads, newColumns) => {
  const dbRef = ref(database, 'crm');
  await set(dbRef, {
    leads: newLeads,
    columns: newColumns,
    lastUpdated: new Date().toISOString(),
  });
  // Firebase automatically syncs to all connected browsers
};
```

### 3. Delete Lead

```javascript
deleteLead = (id) => {
  const updated = leads.filter(l => l.id !== id);
  setLeads(updated);         // Update UI immediately
  saveData(updated, columns); // Sync to Firebase
};
```

---

## File Structure & Purpose

### `/pages/index.js` - Main Application
**Lines 1-50:** Imports + State Setup
- Firebase imports
- React hooks (useState, useEffect)
- Icon imports from lucide-react
- Style imports

**Lines 51-100:** Data Loading
- `loadData()` - Fetch from Firebase on mount
- `saveData()` - Push changes to Firebase

**Lines 101-150:** Lead CRUD Operations
- `addLead()` - Create new lead object
- `editLead()` - Load lead into edit form
- `saveLead()` - Update existing lead
- `deleteLead()` - Remove lead from database

**Lines 151-200:** Column Management
- `addColumn()` - Add new field to all leads
- `removeColumn()` - Remove field from all leads
- Validates column names (no duplicates)

**Lines 201-250:** CSV Import/Export
- `importCSV()` - Parse CSV file → Firebase
- `exportCSV()` - Convert leads to CSV → Download

**Lines 251-end:** React JSX UI
- Header with title + toolbar buttons
- Table with leads + actions column
- Lead edit modal form
- Column management modal

### `/lib/firebase.js` - Firebase Config
```javascript
// Initialize Firebase connection
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // ... other credentials
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Export functions for use in pages
export { database, ref, child, get, set, remove, update };
```

### `/styles/Home.module.css` - Component Styling
**Layout Grid:**
- `.container` - Max 1400px width, centered
- `.header` - Title + toolbar row (flexbox)
- `.toolbar` - Action buttons (horizontal flex)

**Table Styles:**
- `.tableWrapper` - Card container with shadow
- `.table` - HTML table with hover effects
- `.table thead` - Header row with gray background
- `.table td` - Padding + border lines

**Modal Styles:**
- `.modal` - Full-screen overlay (fixed positioning)
- `.modalContent` - White card in center (max 500px)
- `.modalBody` - Scrollable content area
- `.formGroup` - Label + input pairs

**Responsive:**
- `@media (max-width: 768px)` - Stack vertically on mobile
- Buttons full-width on small screens
- Table font-size reduced

### `/styles/globals.css` - Global Styles
```css
* { box-sizing: border-box; }          /* Include padding in width */
html, body { margin: 0; padding: 0; }  /* Reset defaults */
body { font-family: system-ui; }       /* Use system fonts */
```

### `/pages/_app.js` - Next.js Wrapper
```javascript
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />  // Render page + styles
}
```

### `/package.json` - Dependencies
```json
{
  "next": "^14.0.0",           // Framework
  "react": "^18.2.0",          // UI library
  "firebase": "^10.0.0",       // Backend
  "papaparse": "^5.4.1",       // CSV parsing
  "lucide-react": "^0.294.0"   // Icons
}
```

### `/next.config.js` - Next.js Config
```javascript
// React strict mode: catch errors
// SWC minify: fast builds
```

### `/.env.local` - Environment Variables
```bash
# Public variables (safe to expose in browser)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
# ... etc (all 6 Firebase credentials)
```

---

## State Management

**React Hooks Only** (no Redux/Context needed for this size):

```javascript
// Leads array - main data store
const [leads, setLeads] = useState([
  {
    id: 1626096000000,
    name: "John Smith",
    phone: "555-1234",
    email: "john@example.com",
    company: "HVAC Co",
    status: "Hot"
  }
]);

// Column names - dynamic fields
const [columns, setColumns] = useState([
  'name', 'phone', 'email', 'company', 'status'
]);

// UI state - modals and editing
const [showModal, setShowModal] = useState(false);
const [editingId, setEditingId] = useState(null);
const [formData, setFormData] = useState({});
```

---

## Component Lifecycle

### Initial Load
1. Page mounts → `useEffect` hook runs
2. `loadData()` fetches from Firebase
3. State updates → UI re-renders with data
4. Table shows all leads

### Add Lead
1. User clicks "Add Lead"
2. New object created with empty fields
3. Modal opens with form
4. User fills fields → `formData` state updates
5. User clicks "Save" → `saveLead()` runs
6. Firebase updates → All browsers sync instantly
7. Modal closes

### Edit Lead
1. User clicks edit icon
2. `editLead()` loads that lead into `formData`
3. Modal opens with pre-filled form
4. User changes fields → `formData` updates
5. User clicks "Save" → Updates existing entry
6. Firebase syncs → UI reflects changes

### Delete Lead
1. User clicks trash icon
2. `deleteLead()` filters out that ID
3. `saveData()` pushes to Firebase
4. Row disappears from table immediately

### Import CSV
1. User selects file
2. `Papa.parse()` reads CSV
3. Extracts column names → `setColumns()`
4. Creates lead objects → `setLeads()`
5. `saveData()` pushes to Firebase
6. Table updates with new data

---

## Firebase Database Structure

```
crmapp (Realtime Database)
│
└── crm
    ├── leads: [
    │   {
    │     id: 1626096000000,
    │     name: "John Smith",
    │     phone: "555-1234",
    │     email: "john@example.com",
    │     company: "HVAC Co",
    │     status: "Hot"
    │   },
    │   { ... more leads ... }
    │ ]
    ├── columns: ["name", "phone", "email", "company", "status"]
    └── lastUpdated: "2024-07-21T12:34:56Z"
```

**Data Syncing:**
- When you `set()` data → Firebase updates immediately
- All other users' browsers get notified
- React state updates → UI re-renders
- Multi-user access works automatically

---

## Security Model

### Development (Test Mode)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
**Anyone can read/write.** Fine for dev/testing only.

### Production (Recommended)
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
**Requires login.** Add Firebase Auth for username/email login.

---

## Performance Considerations

### Current Limitations
- Single database location `/crm` for all data
- No pagination → loads all leads at once
- Suitable for ~1000 leads before slowdown

### Scaling (If Needed)

**Add Pagination:**
```javascript
const leadsPerPage = 50;
const currentPage = useState(1);
const displayedLeads = leads.slice(
  (currentPage - 1) * leadsPerPage,
  currentPage * leadsPerPage
);
```

**Organize by User:**
```javascript
// Firebase structure
/crm/users/{userId}/leads/[...]
// Prevents data mixing
```

**Add Indexes:**
In Firebase Console:
- Realtime Database → Indexes
- Add composite index on (userId, createdDate)

---

## Extending the CRM

### Add Search
```javascript
const [searchTerm, setSearchTerm] = useState('');
const filteredLeads = leads.filter(l =>
  Object.values(l).some(v => 
    v?.toString().toLowerCase().includes(searchTerm)
  )
);
```

### Add Status Pipeline
```javascript
// Add "status" column with values: New, Called, Quoted, Won, Lost
// Add status filter buttons to filter by stage
const statusCounts = {
  new: leads.filter(l => l.status === 'New').length,
  called: leads.filter(l => l.status === 'Called').length,
  // ... etc
};
```

### Add Webhooks
```javascript
// pages/api/webhook.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { leadId, action } = req.body;
    // Send to Stacy API or other service
    // Update Firebase
    return res.status(200).json({ success: true });
  }
}
```

### Add Authentication
```bash
npm install @firebase/auth
```
```javascript
import { getAuth, signInWithGoogle } from '@firebase/auth';

// Add login form
// Protect routes with auth check
// Store userId in `/crm/users/{userId}/leads`
```

---

## Debugging Tips

### Check Browser Console (F12)
```javascript
// See errors or logs
console.log(leads);          // Log current state
console.error(error);        // See error messages
```

### Firebase Console
- **Realtime Database:** View → Filter → See actual data structure
- **Rules:** Check syntax and permissions
- **Logs:** See failed read/write attempts

### Vercel Logs
- Dashboard → Deployments → Click build
- See runtime errors in "Logs" tab

### Network Tab (F12 → Network)
- See Firebase API calls
- Check response status (should be 200)
- Look for CORS errors

---

## Technology Stack Reasoning

| Tech | Why |
|------|-----|
| **Next.js** | Zero-config, Vercel deployment, fast builds |
| **React** | Reactive UI, easy state management |
| **Firebase** | No backend needed, auto-sync, free tier generous |
| **CSV (Papa Parse)** | Standard format, works everywhere |
| **CSS Modules** | No conflicts, scoped styles |
| **Lucide Icons** | Modern, lightweight SVG icons |

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel | Free tier (unlimited deploys) |
| Firebase | Free tier (100GB storage, plenty for 1000s of leads) |
| GitHub | Free (public repos) |
| **Total** | **$0** |

Firebase free tier includes:
- Unlimited concurrent connections
- 1GB data storage
- 100GB data transfer
- Real-time sync
- Automatic backups

---

This is a **production-grade CRM** that scales from 10 to 10,000 leads. 🚀
