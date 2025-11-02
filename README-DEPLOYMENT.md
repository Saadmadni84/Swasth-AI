# 🚀 SwasthAI - Complete Deployment Guide

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Platform Setup](#platform-setup)
3. [Deployment Steps](#deployment-steps)
4. [Environment Variables](#environment-variables)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

**Total Time: ~20 minutes**

### Prerequisites
- GitHub account (connected)
- Node.js installed
- Your code pushed to GitHub

### Three Platforms, Three Services
| Platform | Service | Time |
|----------|---------|------|
| **Vercel** | Frontend (Next.js) | 5 min |
| **Railway** | Backend (Flask/ML) | 5 min |
| **Render** | Backend (Node/OCR) | 5 min |

---

## 🔧 Platform Setup

### 1. Create Accounts (2 minutes)
- [Vercel](https://vercel.com/signup) - Sign up with GitHub
- [Railway](https://railway.app/login) - Sign up with GitHub
- [Render](https://render.com/register) - Sign up with GitHub
- [Supabase](https://supabase.com/dashboard) - Sign up with GitHub

### 2. Get API Keys (3 minutes)
- **Google Gemini:** https://makersuite.google.com/app/apikey
- **Google Maps:** https://console.cloud.google.com/apis/credentials

---

## 📦 Deployment Steps

### STEP 1: Deploy Frontend to Vercel

#### Option A: Dashboard (Recommended)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Click **Deploy**
5. Add environment variables (see below)

#### Option B: CLI
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

**Result:** Your frontend will be live at `https://your-app.vercel.app`

---

### STEP 2: Deploy Flask Backend to Railway

#### Option A: Dashboard (Recommended)
1. Go to https://railway.app/new
2. Select **Deploy from GitHub repo**
3. Choose your repository
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `python app.py`
5. Add environment variables:
   ```
   PORT=5003
   FLASK_ENV=production
   PYTHONUNBUFFERED=1
   ```
6. Generate domain

#### Option B: CLI
```bash
cd backend
npm install -g @railway/cli
railway login
railway up
railway domain
```

**Result:** Copy your Railway URL (e.g., `https://swasthai-ml.railway.app`)

---

### STEP 3: Deploy Node Backend to Render

#### Dashboard Only
1. Go to https://render.com/create
2. Select **Web Service**
3. Connect GitHub repository
4. Configure:
   - **Name:** `swasthai-node-backend`
   - **Root Directory:** `backend-node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables:
   ```
   PORT=5001
   NODE_ENV=production
   GEMINI_API_KEY=your-key
   ```
6. Click **Create Web Service**

**Result:** Copy your Render URL (e.g., `https://swasthai-node.onrender.com`)

---

### STEP 4: Update Frontend with Backend URLs

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_ML_BACKEND_URL=https://your-railway-app.railway.app
   NEXT_PUBLIC_NODE_BACKEND_URL=https://your-app.onrender.com
   ```
3. Go to Deployments → Click ⋯ → Redeploy

---

### STEP 5: Setup Supabase Database

1. Create project at https://supabase.com/dashboard
2. Go to **SQL Editor**
3. Copy and run SQL from `database/schema.sql`
4. Go to **Settings** → **API**
5. Copy:
   - Project URL
   - Anon/Public Key
6. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
7. Configure authentication:
   - Go to **Authentication** → **URL Configuration**
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

---

## 🔑 Environment Variables

### Complete List for Vercel (Frontend)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Gemini AI
GEMINI_API_KEY=AIzaSy...
TEAM_API_KEY=AIzaSy...

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSy...

# Model IDs
DOC_MODEL_ID=gemini-1.5-flash
SUMM_MODEL_ID=gemini-1.5-flash
NEWS_MODEL_ID=gemini-1.5-flash
AGENT_MODEL_ID=gemini-1.5-pro

# Backend URLs (Add after deploying backends)
NEXT_PUBLIC_ML_BACKEND_URL=https://your-app.railway.app
NEXT_PUBLIC_NODE_BACKEND_URL=https://your-app.onrender.com
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
GEMINI_API_KEY=AIzaSy...
MAX_FILE_SIZE=10485760
```

---

## ✅ Testing

### Test Each Service

```bash
# Test Frontend
curl https://your-app.vercel.app

# Test Flask Backend
curl https://your-railway-app.railway.app/

# Test Node Backend
curl https://your-render-app.onrender.com/

# Test Complete Flow
# 1. Visit your Vercel URL
# 2. Sign up / Login
# 3. Try Health Check feature
# 4. Upload document
# 5. Chat with MediBot
```

---

## 🚨 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| **Build Fails on Vercel** | Check `frontend/package.json` dependencies |
| **Railway Timeout** | Increase timeout in `railway.toml` |
| **Render Cold Start** | First request may be slow (free tier) |
| **CORS Errors** | Add Vercel URL to backend CORS config |
| **404 on API** | Verify backend URLs in environment variables |
| **Database Errors** | Check Supabase credentials and RLS policies |
| **Maps Not Loading** | Verify Google Maps API key restrictions |

### Check Logs

**Vercel:**
```bash
vercel logs
```
Or: Dashboard → Project → Logs

**Railway:**
```bash
railway logs
```
Or: Dashboard → Deployments → View Logs

**Render:**
Dashboard → Service → Logs (real-time)

---

## 🔒 Security Checklist

- [ ] All API keys added to platform dashboards (not in code)
- [ ] Google Maps API key restricted to your domain
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] HTTPS enforced on all endpoints
- [ ] CORS configured for production only
- [ ] Environment variables verified
- [ ] `.env` files in `.gitignore`

---

## 📊 Monitoring

### Platform Dashboards
- **Vercel:** https://vercel.com/dashboard
- **Railway:** https://railway.app/dashboard
- **Render:** https://render.com/dashboard
- **Supabase:** https://supabase.com/dashboard

### What to Monitor
- Response times
- Error rates
- Build times
- Resource usage
- API quotas
- Database size

---

## 🔄 Continuous Deployment

All platforms support auto-deploy on push to `main`:

```
Push to GitHub → Auto Deploy on All Platforms
```

**Vercel** also creates preview deployments for pull requests!

---

## 📱 Your Live URLs

After deployment, save these:

```
Frontend:      https://____________.vercel.app
ML Backend:    https://____________.railway.app
Node Backend:  https://____________.onrender.com
Database:      https://____________.supabase.co
```

---

## 🎯 Next Steps

1. ✅ Test all features
2. ✅ Add custom domain (optional)
3. ✅ Enable analytics
4. ✅ Set up monitoring alerts
5. ✅ Share with team
6. ✅ Gather feedback

---

## 📚 Additional Resources

- **Full Guide:** `DEPLOYMENT-COMPLETE-GUIDE.md`
- **Quick Reference:** `QUICK-DEPLOY.md`
- **Checklist:** `DEPLOYMENT-CHECKLIST.md`
- **Environment Setup:** `ENVIRONMENT-VARIABLES-GUIDE.md`

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs
- **Supabase Docs:** https://supabase.com/docs

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review platform logs
3. Consult platform documentation
4. Check GitHub issues

---

## 🎉 Success!

Your SwasthAI platform is now live and ready to help users! 

**Share your deployment:**
```
🏥 Check out SwasthAI: https://your-app.vercel.app
AI-powered healthcare platform with disease prediction, 
doctor finder, and health management tools!
```

---

**Happy Deploying! 🚀**

Made with ❤️ by the SwasthAI Team
