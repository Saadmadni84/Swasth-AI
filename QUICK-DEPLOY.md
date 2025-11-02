# 🚀 SwasthAI Quick Deploy - TL;DR

> **Super Fast Deployment Guide** - For when you just want to get it done!

---

## 🎯 What You Need (5 minutes)

1. **GitHub Account** ✅ (You have it)
2. **3 Platform Accounts:**
   - Vercel.com (Frontend)
   - Railway.app (Flask Backend)
   - Render.com (Node Backend)
3. **API Keys:**
   - Supabase (Database)
   - Google Gemini (AI)
   - Google Maps (Maps)

---

## ⚡ Speed Deploy (3 Steps)

### Step 1: Deploy Frontend (Vercel)
```bash
# Option A: Use Dashboard (Recommended)
1. Go to: https://vercel.com/new
2. Import: Your GitHub repo
3. Root Directory: frontend
4. Click: Deploy
5. Add Environment Variables (from ENVIRONMENT-VARIABLES-GUIDE.md)

# Option B: Use CLI
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Step 2: Deploy Flask Backend (Railway)
```bash
# Option A: Use Dashboard (Recommended)
1. Go to: https://railway.app/new
2. Deploy from GitHub repo
3. Root Directory: backend
4. Add Variables: PORT=5003
5. Generate Domain

# Option B: Use CLI
cd backend
npm install -g @railway/cli
railway login
railway up
railway domain
```

### Step 3: Deploy Node Backend (Render)
```bash
# Dashboard Only (No CLI needed)
1. Go to: https://render.com/create
2. Select: Web Service
3. Connect: GitHub repo
4. Settings:
   - Root Dir: backend-node
   - Build: npm install
   - Start: node server.js
5. Create Service
```

---

## 🔑 Environment Variables (Copy-Paste)

### For Vercel (Frontend)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
GEMINI_API_KEY=AIzaSy...
GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_ML_BACKEND_URL=https://your-app.railway.app
NEXT_PUBLIC_NODE_BACKEND_URL=https://your-app.onrender.com
```

### For Railway (Flask)
```
PORT=5003
FLASK_ENV=production
PYTHONUNBUFFERED=1
```

### For Render (Node)
```
PORT=5001
NODE_ENV=production
GEMINI_API_KEY=AIzaSy...
```

---

## 📝 Post-Deploy (2 Steps)

1. **Copy Backend URLs** → Add to Vercel → Redeploy
2. **Setup Supabase:**
   - Create project
   - Run SQL from: `database/schema.sql`
   - Add credentials to Vercel

---

## ✅ Quick Test

```bash
# Test Frontend
curl https://your-app.vercel.app

# Test Flask Backend
curl https://your-app.railway.app/

# Test Node Backend
curl https://your-app.onrender.com/
```

---

## 🚨 Troubleshooting One-Liners

| Problem | Solution |
|---------|----------|
| Build fails | Check logs in platform dashboard |
| 404 errors | Verify root directory is correct |
| CORS errors | Update backend CORS with Vercel URL |
| API not working | Check environment variables |
| Database error | Run schema in Supabase SQL editor |

---

## 📱 Your URLs After Deploy

Fill these in:
```
Frontend:  https://____________.vercel.app
Backend 1: https://____________.railway.app
Backend 2: https://____________.onrender.com
Database:  https://____________.supabase.co
```

---

## 🎯 Automated Deploy (Easiest!)

Use the deployment script:
```bash
cd /path/to/SwasthAI
./deploy-quick.sh
```

Follow the prompts - it does everything!

---

## 📚 Need More Details?

- **Full Guide:** `DEPLOYMENT-COMPLETE-GUIDE.md`
- **Checklist:** `DEPLOYMENT-CHECKLIST.md`
- **Environment:** `ENVIRONMENT-VARIABLES-GUIDE.md`

---

## ⏱️ Time Estimates

- Vercel Deploy: 3-5 minutes
- Railway Deploy: 3-5 minutes
- Render Deploy: 5-7 minutes
- Supabase Setup: 5 minutes
- Total: ~20 minutes

---

## 🎉 Done!

Your app is live! Share it:
```
Check out SwasthAI: https://your-app.vercel.app
```

---

**Questions?** Check the full guides or platform documentation.

**Good luck! 🚀**
