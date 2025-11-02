# MediChat Bot n8n Connection - Fix Summary

## ✅ Issue Fixed

The MediChat bot was unable to connect to n8n because it was pointing to the **wrong backend port**.

### Problem
- Frontend (MediBot.tsx, medical-chatbot.tsx) was trying to connect to **port 5001**
- But n8n integration is in the **Flask backend on port 5003**
- The Node.js backend on port 5000/5001 only handles PDF OCR, not n8n workflows

### Solution Applied
Updated the following files to connect to port **5003** instead of **5001**:

1. **`frontend/components/MediBot.tsx`**
   - Changed: `http://localhost:5001` → `http://localhost:5003`

2. **`frontend/components/medical-chatbot.tsx`**
   - Changed: `http://localhost:5001` → `http://localhost:5003`
   - Updated error message to reflect correct port

## 🔧 Current Setup

### Backend Services
| Service | Port | Status | Purpose |
|---------|------|--------|---------|
| **Flask ML Backend** | 5003 | ✅ Running | n8n integration, disease prediction, health analysis |
| **n8n Workflow** | 5678 | ✅ Running | AI health assistant with Ollama |
| Node.js Backend | 5000 | Not needed for MediChat | PDF OCR analysis only |

### Connection Flow
```
Frontend (Port 3001)
    ↓
Flask Backend (Port 5003)  ← /analyze/text endpoint with use_n8n: true
    ↓
n8n Workflow (Port 5678)   ← /webhook/chat/swasth-ai
    ↓
Ollama AI
    ↓
Response back to user
```

## 🧪 Testing

### Test n8n Direct Webhook
```bash
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message":"I have headache"}'
```

Expected: AI-generated health advice response ✅

### Test Flask Backend with n8n
```bash
curl -X POST http://localhost:5003/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text":"I have headache","use_n8n":true}'
```

Expected: `{"status":"success","prediction":"AI response..."}` ✅

### Test from Frontend
1. Open browser: `http://localhost:3001/test-ai` or `http://localhost:3001/medibot`
2. Type a health question: "I have a headache"
3. Bot should respond with AI-generated advice from n8n/Ollama

## 📝 Environment Variables

The backends use environment variable `NEXT_PUBLIC_ML_API_URL` or default to:
- **Production**: Set `NEXT_PUBLIC_ML_API_URL=https://your-flask-backend.com`
- **Development**: Defaults to `http://localhost:5003`

### Flask Backend Environment
```bash
# In backend/.env or set before running
N8N_URL=http://localhost:5678
N8N_WEBHOOK_PATH=chat/swasth-ai
PORT=5003
```

## 🚀 Quick Start

### Start All Services
```bash
# Terminal 1: Start n8n (if not running)
n8n start

# Terminal 2: Start Flask ML Backend
cd backend
source .venv/bin/activate
PORT=5003 python app.py

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

### Verify Everything Works
1. **n8n**: http://localhost:5678 (should show n8n interface)
2. **Flask Backend**: http://localhost:5003 (should return JSON status)
3. **Frontend**: http://localhost:3001/test-ai (MediBot chat interface)

## ✅ What's Working Now

✅ MediChat bot can connect to Flask backend (port 5003)  
✅ Flask backend can call n8n workflow (port 5678)  
✅ n8n workflow can process queries with Ollama  
✅ AI responses return to the chatbot  
✅ Frontend displays AI-generated health advice

## 📄 Files Modified

- `frontend/components/MediBot.tsx`
- `frontend/components/medical-chatbot.tsx`
- Created: `test-n8n-connection.js` (testing script)
- Created: `MEDICHAT-N8N-FIX-SUMMARY.md` (this file)

## 🎯 Next Steps

1. Test the chatbot in your browser at http://localhost:3001/test-ai
2. Try asking health questions like:
   - "I have a headache"
   - "What home remedies for fever?"
   - "I feel dizzy and nauseous"
3. Verify the AI responses are coming through
4. If needed, check Flask logs for any n8n connection issues

## 🔍 Troubleshooting

### If MediChat still doesn't work:

1. **Check Flask is running on 5003:**
   ```bash
   curl http://localhost:5003/
   # Should return: {"status": "OK", ...}
   ```

2. **Check n8n is running on 5678:**
   ```bash
   curl http://localhost:5678/
   # Should return HTML (n8n interface)
   ```

3. **Check n8n webhook is configured:**
   - Open n8n: http://localhost:5678
   - Find "Swasth AI" workflow
   - Verify webhook path: `/webhook/chat/swasth-ai`
   - Make sure workflow is **Active**

4. **Check browser console:**
   - Open DevTools (F12)
   - Look for fetch errors to port 5003
   - Network tab should show requests to `localhost:5003/analyze/text`

5. **Check Flask logs:**
   - Terminal running Flask should show incoming requests
   - Should log "Calling n8n workflow at: ..."
   - Should show n8n response

## 💡 Key Points

- **MediChat ALWAYS uses Flask backend on port 5003** (not 5001)
- **n8n integration is ONLY in Flask backend** (not Node.js backend)
- **Port 5001/5000 is for PDF OCR only** (different feature)
- **All AI health chat goes through**: Frontend → Flask (5003) → n8n (5678) → Ollama

---

**Status**: ✅ **FIXED** - MediChat bot now correctly connects to Flask backend (port 5003) with n8n integration
