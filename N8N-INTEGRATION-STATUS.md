# n8n MediChatBot Integration - Quick Reference

## ✅ Status: CONNECTED & WORKING

The n8n workflow is successfully integrated with your MediChatBot backend!

## 🏗️ Architecture

```
Frontend (Next.js) → Backend (Flask:5003) → n8n (5678) → Ollama (11434)
```

## 🚀 Quick Start Commands

### Start the Backend
```bash
# Option 1: Use the startup script
./start-backend.sh

# Option 2: Manual start
cd backend
source ../.venv/bin/activate
PORT=5003 python3 app.py
```

### Test the Connection
```bash
# Run comprehensive tests
./test-n8n-connection.sh
```

### View Backend Logs
```bash
tail -f backend/backend.log
```

### Stop the Backend
```bash
pkill -f 'python3.*app.py'
```

## 🔧 Configuration

### Backend (app.py)
- **Port**: 5003 (set via PORT environment variable)
- **n8n URL**: http://localhost:5678 (configured via N8N_URL env var)
- **Webhook Path**: `webhook/chat/swasth-ai` (configured via N8N_WEBHOOK_PATH)
- **Timeout**: 60 seconds for n8n/Ollama processing

### Frontend (.env.local)
```bash
NEXT_PUBLIC_ML_API_URL=http://localhost:5003
NEXT_PUBLIC_ML_BACKEND_URL=http://localhost:5003
NEXT_PUBLIC_N8N_URL=http://localhost:5678
```

### MediBot Component
File: `frontend/components/MediBot.tsx`
- Uses `NEXT_PUBLIC_ML_API_URL` environment variable
- Sends requests to `/analyze/text` endpoint
- Parameter: `use_n8n: true` to enable n8n integration

## 📡 API Endpoints

### Health Check
```bash
curl http://localhost:5003/
# Response: "ML Backend is running 🚀"
```

### Analyze Text (Local Mode)
```bash
curl -X POST http://localhost:5003/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a fever", "use_n8n": false}'
```

### Analyze Text (n8n Mode)
```bash
curl -X POST http://localhost:5003/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a fever", "use_n8n": true}'
```

## 🧪 Test Results

All integration tests are passing:
- ✅ Backend health check (port 5003)
- ✅ n8n availability (port 5678)
- ✅ Ollama availability (port 11434)
- ✅ Backend analyze endpoint (local mode)
- ✅ Backend → n8n integration (with Ollama)

## 🔄 Response Format

```json
{
  "input_excerpt": "I have a fever",
  "prediction": "AI-generated medical advice with home remedies...",
  "source": "n8n",
  "status": "success"
}
```

The n8n response includes:
- (A) Possible Cause
- (B) Normal Case
- (C) High Alert conditions
- (D) Home Remedies (3 desi remedies with ingredients)
- (E) Preventive Measures
- Disclaimer

## 🐛 Troubleshooting

### Backend not responding
1. Check if backend is running: `lsof -i :5003`
2. Kill and restart: `./start-backend.sh`
3. Check logs: `tail -f backend/backend.log`

### n8n timeout
1. Check n8n: `curl http://localhost:5678/`
2. Check Ollama: `curl http://localhost:11434/`
3. Increase timeout in `app.py` if needed

### Frontend not connecting
1. Verify `.env.local` has correct URLs
2. Restart Next.js dev server
3. Clear browser cache

## 🎯 Next Steps

1. **Restart your Next.js frontend** to pick up environment variables:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test in the browser** at http://localhost:3000

3. **Use the MediBot** and type symptoms like:
   - "I have a fever and cough"
   - "I have a headache"
   - "My stomach hurts"

The bot should now respond with AI-generated home remedies powered by n8n and Ollama!

## 📝 Files Modified

- ✅ `backend/app.py` - Disabled Flask reloader to prevent hang
- ✅ `frontend/.env.local` - Added ML_API_URL configuration
- ✅ `start-backend.sh` - Created startup script
- ✅ `test-n8n-connection.sh` - Created comprehensive test script

## 🔐 Security Notes

- Current setup is for development only
- Use proper authentication for production
- Add rate limiting for API endpoints
- Validate and sanitize all user inputs
- Consider using HTTPS for production

---

**Status**: ✅ All systems operational
**Last Updated**: November 2, 2025
**Integration**: n8n → Ollama → Flask Backend → Next.js Frontend
