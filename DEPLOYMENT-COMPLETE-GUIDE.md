# 🚀 Complete Deployment Guide for SwasthAI
**Deploy Frontend on Vercel | Backend on Railway & Render**

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ GitHub account connected
- ✅ Your repository pushed to GitHub
- ✅ Supabase account set up
- ✅ Google Gemini API key
- ✅ Google Maps API key

---

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     YOUR APPLICATION                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Next.js)          →    VERCEL               │
│  ├── Port 3000                                          │
│  └── Static + API Routes                                │
│                                                          │
│  Backend - Node.js           →    RENDER               │
│  ├── Port 5001                                          │
│  └── OCR & Document Analysis                            │
│                                                          │
│  Backend - Flask (ML)        →    RAILWAY              │
│  ├── Port 5003                                          │
│  └── ML Predictions                                     │
│                                                          │
│  Database                    →    SUPABASE             │
│  └── PostgreSQL + Auth                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 1️⃣ VERCEL - Frontend Deployment

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via GitHub (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import GitHub Repository**
   - Select "Import Git Repository"
   - Choose your `Swasth-AI` repository
   - Click "Import"

3. **Configure Project Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   Go to "Environment Variables" and add:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Google Gemini AI
   GEMINI_API_KEY=your-gemini-api-key
   TEAM_API_KEY=your-team-api-key
   
   # Google Maps
   GOOGLE_MAPS_API_KEY=your-maps-api-key
   
   # Model IDs
   DOC_MODEL_ID=gemini-1.5-flash
   SUMM_MODEL_ID=gemini-1.5-flash
   NEWS_MODEL_ID=gemini-1.5-flash
   AGENT_MODEL_ID=gemini-1.5-pro
   
   # Backend URLs (Add after deploying backends)
   NEXT_PUBLIC_ML_BACKEND_URL=https://your-railway-app.railway.app
   NEXT_PUBLIC_NODE_BACKEND_URL=https://your-render-app.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your frontend will be live at: `https://your-app.vercel.app`

### Alternative: CLI Deployment
```bash
cd frontend
vercel login
vercel --prod
```

---

## 2️⃣ RAILWAY - Flask ML Backend Deployment

### Step 1: Install Railway CLI (Optional)
```bash
npm install -g @railway/cli
```

### Step 2: Deploy via GitHub (Recommended)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Click "New Project" → "Deploy from GitHub repo"

2. **Select Repository**
   - Choose your `Swasth-AI` repository
   - Click "Deploy Now"

3. **Configure Service**
   - Click on the deployed service
   - Go to "Settings"
   ```
   Name: swasthai-ml-backend
   Root Directory: backend
   Start Command: python app.py
   ```

4. **Add Environment Variables**
   Go to "Variables" tab:
   ```env
   PORT=5003
   FLASK_ENV=production
   PYTHONUNBUFFERED=1
   PYTHONPATH=/app
   
   # If you need any API keys for the backend
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Generate Domain**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://swasthai-ml-backend.railway.app`)

6. **Update Vercel Environment**
   - Go back to Vercel dashboard
   - Add/Update: `NEXT_PUBLIC_ML_BACKEND_URL=https://your-railway-app.railway.app`
   - Redeploy frontend

### Alternative: CLI Deployment
```bash
cd backend
railway login
railway init
railway up
railway domain
```

---

## 3️⃣ RENDER - Node.js Backend Deployment

### Step 1: Go to Render Dashboard
- Visit: https://render.com/dashboard
- Click "New +" → "Web Service"

### Step 2: Connect GitHub Repository
1. Click "Connect account" to link GitHub
2. Select your `Swasth-AI` repository
3. Click "Connect"

### Step 3: Configure Web Service
```
Name: swasthai-node-backend
Region: Oregon (or closest to you)
Branch: main
Root Directory: backend-node
Runtime: Node
Build Command: npm install
Start Command: node server.js
```

### Step 4: Add Environment Variables
Go to "Environment" section:
```env
PORT=5001
NODE_ENV=production

# Gemini API (if needed)
GEMINI_API_KEY=your-gemini-api-key

# Other configs
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Step 5: Choose Plan
- Select "Free" plan to start
- Click "Create Web Service"

### Step 6: Get Service URL
- Once deployed, copy the URL (e.g., `https://swasthai-node-backend.onrender.com`)
- Update Vercel environment variables:
  ```env
  NEXT_PUBLIC_NODE_BACKEND_URL=https://your-render-app.onrender.com
  ```

---

## 4️⃣ SUPABASE - Database Setup

### Step 1: Create Supabase Project
1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   ```
   Name: SwasthAI
   Database Password: [Strong password]
   Region: [Closest to you]
   ```

### Step 2: Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy content from `database/schema.sql`
3. Run the SQL script

### Step 3: Configure Authentication
1. Go to "Authentication" → "Providers"
2. Enable "Email"
3. Configure email templates (optional)
4. Set up redirect URLs:
   ```
   Site URL: https://your-app.vercel.app
   Redirect URLs: https://your-app.vercel.app/auth/callback
   ```

### Step 4: Get API Keys
1. Go to "Settings" → "API"
2. Copy:
   - Project URL
   - Anon/Public key
3. Add to Vercel environment variables

---

## 5️⃣ Post-Deployment Configuration

### Update CORS in Backend Files

**backend/app.py** (Flask):
```python
from flask_cors import CORS

CORS(app, origins=[
    "https://your-app.vercel.app",
    "http://localhost:3000"  # For local development
])
```

**backend-node/server.js** (Node):
```javascript
const cors = require('cors');

app.use(cors({
    origin: [
        'https://your-app.vercel.app',
        'http://localhost:3000'  // For local development
    ]
}));
```

### Test All Services

1. **Test Flask Backend**
   ```bash
   curl https://your-railway-app.railway.app/
   ```

2. **Test Node Backend**
   ```bash
   curl https://your-render-app.onrender.com/
   ```

3. **Test Frontend**
   - Visit: `https://your-app.vercel.app`
   - Test authentication
   - Test disease prediction
   - Test document upload

---

## 6️⃣ Environment Variables Summary

### Vercel (Frontend)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Gemini AI
GEMINI_API_KEY=
TEAM_API_KEY=

# Google Maps
GOOGLE_MAPS_API_KEY=

# Model IDs
DOC_MODEL_ID=gemini-1.5-flash
SUMM_MODEL_ID=gemini-1.5-flash
NEWS_MODEL_ID=gemini-1.5-flash
AGENT_MODEL_ID=gemini-1.5-pro

# Backend URLs
NEXT_PUBLIC_ML_BACKEND_URL=
NEXT_PUBLIC_NODE_BACKEND_URL=
```

### Railway (Flask Backend)
```env
PORT=5003
FLASK_ENV=production
PYTHONUNBUFFERED=1
PYTHONPATH=/app
```

### Render (Node Backend)
```env
PORT=5001
NODE_ENV=production
MAX_FILE_SIZE=10485760
```

---

## 7️⃣ Monitoring & Logs

### Vercel Logs
```bash
vercel logs [deployment-url]
```
Or view in Vercel Dashboard → Project → Logs

### Railway Logs
- Dashboard → Project → Deployments → View Logs
- Or use CLI: `railway logs`

### Render Logs
- Dashboard → Service → Logs tab
- Real-time log streaming available

---

## 8️⃣ Custom Domains (Optional)

### Vercel Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Railway Custom Domain
1. Go to Service Settings → Networking
2. Add custom domain
3. Configure DNS CNAME record

### Render Custom Domain
1. Go to Service → Settings → Custom Domain
2. Add domain
3. Configure DNS

---

## 🔒 Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use different API keys for production
- ✅ Enable Supabase Row Level Security (RLS)
- ✅ Restrict Google Maps API key to your domain
- ✅ Use HTTPS only in production
- ✅ Set up rate limiting on backends
- ✅ Enable CORS only for your domains

---

## 🚨 Troubleshooting

### Frontend Issues
```bash
# Check build logs in Vercel
# Verify all environment variables are set
# Check if API endpoints are correct
```

### Backend Not Responding
```bash
# Check Railway/Render logs
# Verify PORT environment variable
# Check if build succeeded
# Test health endpoint: curl https://your-backend.com/
```

### Database Connection Issues
```bash
# Verify Supabase credentials
# Check if RLS policies allow access
# Test connection from local first
```

### CORS Errors
```javascript
// Update CORS configuration in both backends
// Add Vercel URL to allowed origins
// Redeploy backends after changes
```

---

## 📱 Quick Deployment Commands

### Complete Fresh Deployment
```bash
# 1. Deploy Frontend to Vercel
cd frontend
vercel --prod

# 2. Deploy Flask Backend to Railway
cd ../backend
railway up

# 3. Deploy Node Backend to Render
# Use Render dashboard (no CLI needed)

# 4. Update environment variables
# Add backend URLs to Vercel
vercel env add NEXT_PUBLIC_ML_BACKEND_URL
vercel env add NEXT_PUBLIC_NODE_BACKEND_URL

# 5. Redeploy frontend
vercel --prod
```

---

## ✅ Deployment Checklist

- [ ] GitHub repository is up to date
- [ ] Supabase project created and configured
- [ ] Database schema applied
- [ ] Frontend deployed to Vercel
- [ ] Flask backend deployed to Railway
- [ ] Node backend deployed to Render
- [ ] All environment variables set correctly
- [ ] Backend URLs added to frontend
- [ ] CORS configured for production domains
- [ ] Authentication working
- [ ] All features tested
- [ ] Custom domains configured (optional)

---

## 🎉 Your Live URLs

After deployment, your app will be accessible at:

- **Frontend**: `https://your-app.vercel.app`
- **Flask ML Backend**: `https://your-app.railway.app`
- **Node Backend**: `https://your-app.onrender.com`
- **Database**: `https://your-project.supabase.co`

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs

---

## 🔄 Continuous Deployment

All three platforms support automatic deployment:
- Push to `main` branch → Auto-deploy
- Create PR → Preview deployment (Vercel)
- Rollback available in all platforms

---

**Happy Deploying! 🚀**
