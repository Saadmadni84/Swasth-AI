# 🔐 Environment Variables for Deployment

## VERCEL (Frontend) Environment Variables
# Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...
TEAM_API_KEY=AIzaSy...

# Google Maps
GOOGLE_MAPS_API_KEY=AIzaSy...

# Model IDs (Default values)
DOC_MODEL_ID=gemini-1.5-flash
SUMM_MODEL_ID=gemini-1.5-flash
NEWS_MODEL_ID=gemini-1.5-flash
AGENT_MODEL_ID=gemini-1.5-pro

# Backend URLs (Add after deploying backends)
NEXT_PUBLIC_ML_BACKEND_URL=https://swasthai-ml-backend.railway.app
NEXT_PUBLIC_NODE_BACKEND_URL=https://swasthai-node-backend.onrender.com

---

## RAILWAY (Flask ML Backend) Environment Variables
# Go to: https://railway.app/dashboard → Your Project → Variables

PORT=5003
FLASK_ENV=production
PYTHONUNBUFFERED=1
PYTHONPATH=/app

# Optional: If your ML backend needs Gemini
GEMINI_API_KEY=AIzaSy...

---

## RENDER (Node.js Backend) Environment Variables
# Go to: https://render.com/dashboard → Your Service → Environment

PORT=5001
NODE_ENV=production
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Gemini API for document analysis
GEMINI_API_KEY=AIzaSy...

---

## SUPABASE Configuration

### 1. Create Supabase Project
- Go to: https://supabase.com/dashboard
- Create new project
- Copy URL and Anon Key

### 2. Run Database Schema
- Go to SQL Editor
- Run the schema from: database/schema.sql

### 3. Configure Authentication
- Go to Authentication → Settings
- Site URL: https://your-app.vercel.app
- Redirect URLs: 
  - https://your-app.vercel.app/auth/callback
  - https://your-app.vercel.app/**

### 4. Enable Row Level Security (RLS)
- Go to Database → Tables
- Enable RLS for all tables
- Add policies as needed

---

## API Keys Setup Guide

### Google Gemini API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy and add to environment variables

### Google Maps API Key
1. Go to: https://console.cloud.google.com/apis/credentials
2. Create credentials → API Key
3. Restrict to your domain: your-app.vercel.app
4. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

---

## Quick Copy Format for Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
TEAM_API_KEY=
GOOGLE_MAPS_API_KEY=
DOC_MODEL_ID=gemini-1.5-flash
SUMM_MODEL_ID=gemini-1.5-flash
NEWS_MODEL_ID=gemini-1.5-flash
AGENT_MODEL_ID=gemini-1.5-pro
NEXT_PUBLIC_ML_BACKEND_URL=
NEXT_PUBLIC_NODE_BACKEND_URL=
```

---

## Quick Copy Format for Railway

```env
PORT=5003
FLASK_ENV=production
PYTHONUNBUFFERED=1
PYTHONPATH=/app
```

---

## Quick Copy Format for Render

```env
PORT=5001
NODE_ENV=production
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
GEMINI_API_KEY=
```

---

## Security Notes

⚠️ IMPORTANT:
- Never commit .env files to Git
- Use different API keys for development and production
- Restrict API keys to your production domains
- Enable rate limiting on all APIs
- Keep Supabase service_role key secret (never expose in frontend)

---

## Verification Checklist

After adding all environment variables:

- [ ] Vercel environment variables added
- [ ] Railway environment variables added
- [ ] Render environment variables added
- [ ] Supabase project configured
- [ ] Google Gemini API key tested
- [ ] Google Maps API key tested and restricted
- [ ] Backend URLs added to frontend
- [ ] Frontend redeployed with backend URLs
- [ ] All services tested and working

---

## Testing Environment Variables

### Test Vercel Variables
```bash
vercel env ls
```

### Test Railway Variables
```bash
railway variables
```

### Test Render Variables
Check in Render Dashboard → Environment tab

---

## Common Issues

### "Environment variable not found"
- Solution: Add the variable in the platform dashboard
- Redeploy after adding variables

### "Invalid API key"
- Solution: Verify the key is correct
- Check if API is enabled in Google Cloud Console

### "CORS error"
- Solution: Add your Vercel URL to backend CORS config
- Redeploy backend after changes

---

## Need Help?

Refer to:
- DEPLOYMENT-COMPLETE-GUIDE.md - Full deployment instructions
- DEPLOYMENT-GUIDE.md - Original deployment guide
- Platform documentation for specific issues
