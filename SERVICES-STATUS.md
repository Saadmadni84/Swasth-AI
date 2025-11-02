# 🚀 SwasthAI Services Status

## Current Running Services

### ✅ Backend (Flask ML API)
- **Status**: Running
- **Port**: 5001
- **URL**: http://localhost:5001
- **Health Check**: `curl http://localhost:5001/`
- **API Endpoints**:
  - `GET /` - Health check
  - `POST /analyze/text` - Chatbot text analysis (connects to n8n)
  - `GET /analyze?file_url=...` - File URL analysis
  - `POST /predict/diabetes` - ML diabetes prediction
  - `POST /predict/heart` - ML heart disease prediction
  - `POST /predict/parkinsons` - ML Parkinsons prediction

### ✅ Frontend (Next.js)
- **Status**: Running
- **Port**: 3000
- **URL**: http://localhost:3000
- **Chatbot Pages**:
  - http://localhost:3000/medibot - MediBot component
  - Other chatbot pages as configured

### ✅ n8n (Workflow Automation)
- **Status**: Running (via Docker)
- **Port**: 5678
- **URL**: http://localhost:5678
- **Credentials**: admin / strongpassword123
- **Webhook**: http://localhost:5678/webhook/chat/swasth-ai

## 🔄 Complete Integration Flow

```
User Input (Chatbot UI)
    ↓
Frontend Component
    ↓
POST http://localhost:5001/analyze/text
    ↓
Flask Backend calls n8n
    ↓
POST http://localhost:5678/webhook/chat/swasth-ai
    ↓
n8n Workflow Processes
    ↓
Ollama LLM (llama3.2) Generates Response
    ↓
Response Returns to Chatbot UI
```

## 📋 Quick Commands

### Check Service Status

```bash
# Check Flask Backend
curl http://localhost:5001/

# Check Frontend
curl http://localhost:3000

# Check n8n
curl http://localhost:5678/healthz

# Check all services
./check-services.sh  # if script exists
```

### Restart Services

**Backend:**
```bash
cd backend
source .venv/bin/activate
python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**n8n:**
```bash
cd n8n-setup
docker compose restart
```

### Test Full Integration

```bash
# Test Flask → n8n integration
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache and fatigue"}'
```

## 🧪 Testing Checklist

- [ ] Backend responds at http://localhost:5001/
- [ ] Frontend loads at http://localhost:3000
- [ ] n8n accessible at http://localhost:5678
- [ ] n8n workflow is **Active** (green toggle)
- [ ] Ollama running on port 11434
- [ ] Chatbot can send messages
- [ ] Chatbot receives AI responses
- [ ] All services logging correctly

## 🐛 Troubleshooting

### Port Conflicts

If port 5001 is in use:
```bash
lsof -ti:5001 | xargs kill -9
```

If port 3000 is in use:
```bash
lsof -ti:3000 | xargs kill -9
```

### Backend Not Starting

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

### n8n Not Responding

```bash
cd n8n-setup
docker compose logs n8n
docker compose restart
```

### Chatbot Not Getting Responses

1. Check Flask backend logs
2. Check n8n execution logs in n8n UI
3. Verify workflow is Active
4. Check Ollama is running: `curl http://localhost:11434/health`

## 📝 Next Steps

1. **Test Chatbot**: Open http://localhost:3000/medibot
2. **Send Test Message**: "I have a headache"
3. **Verify Response**: Should see AI-generated home remedies
4. **Check Logs**: Monitor backend and n8n logs for errors

---

**All services are configured and ready!** 🎉



