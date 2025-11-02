# ✅ SwasthAI Deployment Checklist

## Pre-Deployment Setup

### 1. Code Repository
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] Branch: `main` is up to date
- [ ] .env files NOT committed (check .gitignore)

### 2. API Keys & Credentials
- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Google Gemini API key obtained
- [ ] Google Maps API key obtained
- [ ] All API keys documented

---

## Platform Accounts Setup

### 3. Vercel Account
- [ ] Account created at https://vercel.com
- [ ] Connected to GitHub account
- [ ] Ready to import repository

### 4. Railway Account
- [ ] Account created at https://railway.app
- [ ] Connected to GitHub account
- [ ] Ready to deploy backend

### 5. Render Account
- [ ] Account created at https://render.com
- [ ] Connected to GitHub account
- [ ] Ready to deploy Node backend

---

## Deployment Steps

### 6. Deploy Frontend to Vercel
- [ ] Repository imported in Vercel
- [ ] Root directory set to: `frontend`
- [ ] Framework detected: Next.js
- [ ] Environment variables added (see ENVIRONMENT-VARIABLES-GUIDE.md)
- [ ] First deployment successful
- [ ] Frontend URL copied: ________________

### 7. Deploy Flask Backend to Railway
- [ ] Repository connected in Railway
- [ ] Root directory set to: `backend`
- [ ] Environment variables added
- [ ] Build successful
- [ ] Domain generated
- [ ] Railway URL copied: ________________

### 8. Deploy Node Backend to Render
- [ ] Repository connected in Render
- [ ] Root directory set to: `backend-node`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Environment variables added
- [ ] Build successful
- [ ] Render URL copied: ________________

---

## Post-Deployment Configuration

### 9. Update Frontend Environment Variables
- [ ] `NEXT_PUBLIC_ML_BACKEND_URL` added with Railway URL
- [ ] `NEXT_PUBLIC_NODE_BACKEND_URL` added with Render URL
- [ ] Frontend redeployed

### 10. Database Setup
- [ ] Supabase project configured
- [ ] Database schema applied from `database/schema.sql`
- [ ] Authentication enabled
- [ ] Site URL set to Vercel URL
- [ ] Redirect URLs configured
- [ ] RLS policies enabled

### 11. CORS Configuration
- [ ] Backend Flask app updated with Vercel URL
- [ ] Backend Node app updated with Vercel URL
- [ ] Backends redeployed

---

## Testing

### 12. Test All Services
- [ ] Frontend loads: https://your-app.vercel.app
- [ ] User registration works
- [ ] User login works
- [ ] Health Check (Disease Prediction) works
- [ ] Mental Health dashboard loads
- [ ] Find Doctor feature works
- [ ] Family Vault accessible
- [ ] Health Records upload works
- [ ] 3D Lab visualizations work
- [ ] MediBot chatbot responds
- [ ] News section loads

### 13. Test API Endpoints
- [ ] Flask backend health check: `curl https://your-railway-app.railway.app/`
- [ ] Node backend health check: `curl https://your-render-app.onrender.com/`
- [ ] Disease prediction API works
- [ ] Document analysis API works
- [ ] Doctor search API works

---

## Security & Optimization

### 14. Security Configuration
- [ ] Google Maps API key restricted to domain
- [ ] Supabase RLS policies configured
- [ ] Environment variables secure
- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured

### 15. Performance Optimization
- [ ] Vercel Analytics enabled (optional)
- [ ] Railway metrics checked
- [ ] Render logs reviewed
- [ ] No console errors in browser
- [ ] Page load times acceptable

---

## Documentation & Monitoring

### 16. Documentation
- [ ] Deployment URLs documented
- [ ] Environment variables saved securely
- [ ] Team members notified
- [ ] README updated with live URLs

### 17. Monitoring Setup
- [ ] Vercel deployment notifications enabled
- [ ] Railway alerts configured
- [ ] Render status notifications enabled
- [ ] Error tracking setup (optional)

---

## Optional Enhancements

### 18. Custom Domains (Optional)
- [ ] Custom domain purchased
- [ ] DNS configured for Vercel
- [ ] SSL certificate verified
- [ ] Domain working correctly

### 19. CI/CD Setup
- [ ] Auto-deploy on push to main enabled (Vercel)
- [ ] Auto-deploy on push to main enabled (Railway)
- [ ] Auto-deploy on push to main enabled (Render)
- [ ] Preview deployments working (Vercel)

---

## Final Verification

### 20. Complete System Test
- [ ] All features tested on production
- [ ] All integrations working
- [ ] Mobile responsiveness checked
- [ ] Different browsers tested
- [ ] Error handling verified
- [ ] User flow smooth end-to-end

---

## Troubleshooting Reference

If issues occur, check:
1. Vercel logs: Dashboard → Project → Logs
2. Railway logs: Dashboard → Service → Deployments
3. Render logs: Dashboard → Service → Logs
4. Browser console for frontend errors
5. Network tab for API call failures

---

## Live URLs Template

Fill in after deployment:

```
Production URLs
===============

Frontend (Vercel):        https://_______________.vercel.app
Flask Backend (Railway):  https://_______________.railway.app
Node Backend (Render):    https://_______________.onrender.com
Database (Supabase):      https://_______________.supabase.co

Admin Dashboards
================

Vercel:   https://vercel.com/dashboard
Railway:  https://railway.app/dashboard
Render:   https://render.com/dashboard
Supabase: https://supabase.com/dashboard
```

---

## Next Steps After Deployment

1. Monitor application for first 24 hours
2. Check error rates and logs
3. Gather user feedback
4. Plan for scaling if needed
5. Schedule regular backups
6. Set up monitoring alerts

---

## Support Resources

- Detailed Guide: DEPLOYMENT-COMPLETE-GUIDE.md
- Environment Setup: ENVIRONMENT-VARIABLES-GUIDE.md
- Quick Deploy: Run `./deploy-quick.sh`
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Status:** ☐ In Progress  ☐ Completed  ☐ Issues Found

---

🎉 **Congratulations on deploying SwasthAI!**
