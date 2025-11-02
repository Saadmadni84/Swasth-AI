# 🤖 MediChatBot n8n Integration Guide

## ✅ Current Status

Your MediChatBot is **already connected** to n8n! Here's what's set up:

### Services Running:
- ✅ **Ollama** - Running on `http://localhost:11434` with `llama3.2:latest`
- ✅ **n8n** - Running on `http://localhost:5678` (Docker container)
- ✅ **Flask Backend** - Should run on `http://localhost:5003`
- ✅ **Frontend** - Running on `http://localhost:3000`

### Integration Flow:
```
User Types Message in MediBot
    ↓
Frontend (MediBot.tsx) sends to Flask Backend
    ↓
Flask Backend (/analyze/text endpoint) calls n8n webhook
    ↓
n8n workflow calls Ollama (llama3.2:latest)
    ↓
Response flows back: Ollama → n8n → Flask → Frontend → User
```

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
PORT=5003 python3 app.py
```

### 2. Test n8n Connection
```bash
# Test n8n directly
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache"}'

# Test via Flask backend
curl -X POST http://localhost:5003/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache", "use_n8n": true}'
```

### 3. Use the Frontend
Open http://localhost:3000 and chat with MediBot. It will automatically use n8n!

## 📋 Configuration Details

### Frontend Configuration (.env.local)
```bash
NEXT_PUBLIC_ML_API_URL=http://localhost:5003
NEXT_PUBLIC_ML_BACKEND_URL=http://localhost:5003
NEXT_PUBLIC_NODE_BACKEND_URL=http://localhost:5001
NEXT_PUBLIC_N8N_URL=http://localhost:5678
```

### Backend Configuration
The Flask backend (`backend/app.py`) is configured to:
- Accept POST requests at `/analyze/text`
- Call n8n webhook at `http://localhost:5678/webhook/chat/swasth-ai`
- Use `use_n8n: true` parameter to enable n8n integration
- Fallback to local responses if n8n is unavailable

### n8n Configuration
- **URL**: http://localhost:5678
- **Webhook Path**: `/webhook/chat/swasth-ai`
- **Ollama Connection**: `http://host.docker.internal:11434`
- **Model**: `llama3.2:latest`

## 🔧 Troubleshooting

### Issue: "Failed to fetch" in Frontend

**Solution 1**: Make sure backend is running
```bash
# Check if backend is running
lsof -i :5003

# If not, start it
cd backend
PORT=5003 python3 app.py
```

**Solution 2**: Restart Next.js to pick up .env.local changes
```bash
# In your frontend terminal, press Ctrl+C and restart
npm run dev
```

### Issue: n8n webhook not responding

**Check n8n status:**
```bash
cd n8n-setup
docker compose ps
```

**Check n8n logs:**
```bash
cd n8n-setup
docker compose logs -f n8n
```

**Restart n8n:**
```bash
cd n8n-setup
docker compose restart
```

### Issue: Ollama not responding

**Check Ollama:**
```bash
# Check if running
curl http://localhost:11434/api/tags

# If not, start it
ollama serve
```

**Test from n8n container:**
```bash
docker exec -it n8n-setup-n8n-1 curl http://host.docker.internal:11434/health
```

### Issue: Slow responses

This is normal! The workflow chain is:
1. Frontend → Backend (fast)
2. Backend → n8n (fast)
3. n8n → Ollama (slow - AI processing)
4. Response chain back (fast)

**Ollama typically takes 10-30 seconds** to generate responses, especially on first use.

## 🎯 Testing the Complete Flow

### Step 1: Test Each Component

```bash
# 1. Test Ollama
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{"model": "llama3.2:latest", "prompt": "Hello", "stream": false}'

# 2. Test n8n webhook
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# 3. Test Flask backend (without n8n)
curl -X POST http://localhost:5003/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "test", "use_n8n": false}'

# 4. Test Flask backend (with n8n)
curl -X POST http://localhost:5003/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache", "use_n8n": true}'
```

### Step 2: Test via Frontend

1. Open http://localhost:3000
2. Navigate to MediBot
3. Type: "I have a headache and feel tired"
4. Wait for response (may take 10-30 seconds first time)
5. You should see a detailed AI response with remedies!

## 📊 n8n Workflow Management

### Access n8n UI
1. Go to http://localhost:5678
2. Login:
   - **Username**: admin
   - **Password**: strongpassword123

### Import/Update Workflow

If you need to import or update the workflow:

1. In n8n UI, click "Workflows" → "Import from File" or "Import from URL"
2. The workflow should have:
   - **Webhook** node listening on `/webhook/chat/swasth-ai`
   - **Ollama Chat Model** node configured to use `http://host.docker.internal:11434`
   - **Code** node to format responses
   - **Respond to Webhook** node to send back the response
3. Make sure workflow is **Active** (toggle switch on)

### Workflow Structure

```
Webhook (POST /webhook/chat/swasth-ai)
    ↓
Ollama Chat Model (llama3.2:latest)
    ↓
Code Node (format response as medical advice)
    ↓
Respond to Webhook (send finalResponse back)
```

## 🎓 How It Works

### MediBot Component (`frontend/components/MediBot.tsx`)

When you send a message:
```typescript
const response = await fetch(`${backendUrl}/analyze/text`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: userInput,
    use_n8n: true  // This enables n8n integration!
  }),
});
```

### Flask Backend (`backend/app.py`)

The `/analyze/text` endpoint:
```python
@app.route("/analyze/text", methods=["POST"])
def analyze_text():
    text = data.get("text")
    use_n8n = data.get("use_n8n", True)
    
    if use_n8n:
        prediction = call_n8n_workflow(text)
    else:
        prediction = analyze_medical_text(text)
    
    return jsonify({"prediction": prediction, "status": "success"})
```

### n8n Workflow

The workflow processes the message through Ollama and returns structured medical advice with:
- Possible causes
- Home remedies
- Preventive measures
- When to seek medical attention

## 📝 Logs & Monitoring

### View Backend Logs
```bash
# If started in background
tail -f /tmp/swasthai-backend.log

# If running in terminal, you'll see logs directly
```

### View n8n Logs
```bash
cd n8n-setup
docker compose logs -f n8n
```

### View Frontend Logs
Check the browser console (F12) for any errors or network issues.

## ✅ Verification Checklist

- [ ] Ollama is running and has `llama3.2:latest` model
- [ ] n8n Docker container is running and healthy
- [ ] Flask backend is running on port 5003
- [ ] Frontend `.env.local` has correct backend URL
- [ ] Can access n8n UI at http://localhost:5678
- [ ] Workflow is imported and active in n8n
- [ ] Test curl commands work
- [ ] MediBot responds with AI-generated advice

## 🎉 You're All Set!

Your MediChatBot is now powered by:
- 🤖 **Ollama** - Local AI model (llama3.2)
- 🔄 **n8n** - Workflow automation
- 🏥 **Medical Knowledge** - Structured health advice
- 💬 **Chat Interface** - User-friendly interaction

Start chatting and get instant medical advice! Remember, this is for informational purposes only and should not replace professional medical consultation.

## 🛑 Stopping Services

```bash
# Stop Flask backend
pkill -f "python3 app.py"
# or if you have the PID
kill $(cat /tmp/swasthai-backend.pid)

# Stop n8n
cd n8n-setup
docker compose down

# Ollama will keep running in background (normal)
```

## 📚 Additional Resources

- **n8n Documentation**: https://docs.n8n.io
- **Ollama Documentation**: https://ollama.ai/docs
- **Flask Documentation**: https://flask.palletsprojects.com

---

**Need Help?** Check the logs first, then verify each service is running individually before testing the full integration.
