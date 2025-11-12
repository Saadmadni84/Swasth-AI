# SwasthAI - Project Status

## ✅ System Status: FULLY OPERATIONAL

Last Updated: November 12, 2025

---

## 🚀 Running Services

| Service | Port | Status | PID | URL |
|---------|------|--------|-----|-----|
| **Ollama AI** | 11434 | ✅ Running | Auto | http://localhost:11434 |
| **n8n Workflow** | 5678 | ✅ Running | Docker | http://localhost:5678 |
| **Flask ML Backend** | 5001 | ✅ Running | Auto | http://localhost:5001 |
| **Node Backend (Mental Health)** | 5002 | ✅ Running | Auto | http://localhost:5002 |
| **Next.js Frontend** | 3000 | ✅ Running | Auto | http://localhost:3000 |

---

## 🔗 Data Flow

```
User → Frontend (3000) → Backend (5001) → n8n (5678) → Ollama (11434) → Response
```

---

## 🎯 Quick Links

- **Main App**: http://localhost:3000
- **AI Chatbot**: http://localhost:3000/test-ai
- **n8n Dashboard**: http://localhost:5678
- **Backend API**: http://localhost:5001

---

## 🛠️ Quick Commands

### Start All Services
```bash
# Backend
cd "/Users/saadmadni/Downloads/3rd year/project/SwasthAI 2/SwasThAI/backend"
source .venv/bin/activate
python app.py > ../backend.log 2>&1 &

# Frontend
cd "/Users/saadmadni/Downloads/3rd year/project/SwasthAI 2/SwasThAI/frontend"
npm run dev > ../frontend.log 2>&1 &
```

### Check Status
```bash
lsof -i :3000 -i :5001 -i :5678 -i :11434
```

### View Logs
```bash
# Backend
tail -f "/Users/saadmadni/Downloads/3rd year/project/SwasthAI 2/SwasThAI/backend.log"

# Frontend
tail -f "/Users/saadmadni/Downloads/3rd year/project/SwasthAI 2/SwasThAI/frontend.log"
```

### Stop Services
```bash
kill 38930  # Backend
kill 39385  # Frontend
```

---

## 📝 Configuration Files

### Frontend Environment
**Location**: `frontend/.env.local`
```bash
NEXT_PUBLIC_ML_API_URL=http://localhost:5001
NEXT_PUBLIC_ML_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_N8N_URL=http://localhost:5678
```

### Backend Environment
**Location**: `backend/.env`
```bash
PORT=5001
N8N_URL=http://localhost:5678
N8N_WEBHOOK_PATH=chat/swasth-ai
USE_N8N=true
```

---

## 🤖 AI Models

### Ollama
- Model: llama3.2:latest
- Parameters: 3.2B
- Quantization: Q4_K_M

### ML Models (Loaded)
- ✅ Diabetes Prediction
- ✅ Heart Disease Prediction
- ✅ Parkinsons Detection

---

## ✨ Features Working

- ✅ AI Chatbot with Ollama LLaMA 3.2
- ✅ n8n Workflow Integration
- ✅ Voice Assistant (11 languages)
- ✅ Text-to-Speech
- ✅ PDF Medical Report Analysis
- ✅ Disease Prediction
- ✅ Health Dashboard
- ✅ Family Vault
- ✅ Doctor Finder

---

## 🎉 Test Results

**Latest Test**: Successfully connected to Ollama via n8n
- Query: "I have fever and headache"
- Response: 1,939 characters
- Time: ~20 seconds
- Source: n8n → Ollama
- Status: ✅ SUCCESS

---

Made with ❤️ for SwasthAI Healthcare Platform
