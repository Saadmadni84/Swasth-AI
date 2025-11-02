# ✅ n8n Setup Complete!

## 🎉 What's Been Set Up

1. ✅ **Docker Compose Configuration** - n8n with PostgreSQL
2. ✅ **Environment Variables** - Authentication configured
3. ✅ **n8n Running** - Accessible at http://localhost:5678
4. ✅ **Flask Backend Integration** - `/analyze/text` endpoint ready

## 🚀 Next Steps

### Step 1: Access n8n UI

Open your browser and go to:
```
http://localhost:5678
```

Login with:
- **Username**: `admin`
- **Password**: `strongpassword123`

### Step 2: Import Your Workflow

1. In n8n UI, click "Add workflow" or "Import from File"
2. Paste your workflow JSON (from the prompt)
3. Save the workflow
4. **Important**: Toggle the workflow to **Active** (green switch)

### Step 3: Configure Ollama in Workflow

1. In your workflow, find the "Ollama Chat Model" node
2. Click on it to configure
3. Set the model URL: `http://host.docker.internal:11434`
4. Select your model (e.g., `llama3.2:latest`)
5. Save the workflow

### Step 4: Test the Integration

```bash
# Test n8n webhook directly
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache and feel tired"}'

# Test via Flask backend
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been experiencing headache and fatigue for 2 days"}'
```

## 📊 Service Status

Check if everything is running:

```bash
cd n8n-setup
docker compose ps
```

You should see:
- ✅ `n8n-setup-n8n-1` - Running
- ✅ `n8n-setup-postgres-1` - Healthy

## 🔗 Integration Points

### Flask Backend → n8n

The Flask backend (`backend/app.py`) calls n8n at:
```
POST http://localhost:5678/webhook/chat/swasth-ai
```

This is configured automatically when you use:
- `POST /analyze/text` - Direct text analysis
- `GET /analyze?file_url=...` - File URL analysis

### n8n → Ollama

The n8n workflow calls Ollama at:
```
http://host.docker.internal:11434
```

Make sure Ollama is running locally!

## 🧪 Verification Checklist

- [ ] n8n accessible at http://localhost:5678
- [ ] Can login with admin/strongpassword123
- [ ] Workflow imported and active
- [ ] Ollama accessible from n8n container
- [ ] Webhook test returns response
- [ ] Flask backend can call n8n

## 📝 Useful Commands

```bash
# View n8n logs
cd n8n-setup
docker compose logs -f n8n

# Restart services
docker compose restart

# Stop services
docker compose down

# Start services
docker compose up -d

# Check Ollama connection from container
docker exec -it n8n-setup-n8n-1 curl http://host.docker.internal:11434/health
```

## 🐛 Troubleshooting

### n8n not starting?

```bash
# Check logs
docker compose logs n8n

# Check if port 5678 is in use
lsof -i :5678

# Restart services
docker compose restart
```

### Ollama connection failing?

1. Ensure Ollama is running: `curl http://localhost:11434/health`
2. Test from container: `docker exec -it n8n-setup-n8n-1 curl http://host.docker.internal:11434/health`
3. If on Linux, you might need to adjust the URL

### Workflow not executing?

1. Make sure workflow is **Active** (toggle switch)
2. Check webhook path is: `chat/swasth-ai`
3. Verify the webhook URL in n8n matches: `http://localhost:5678/webhook/chat/swasth-ai`

## 🎯 Quick Test

Run this to test everything:

```bash
# 1. Test Ollama
curl http://localhost:11434/health

# 2. Test n8n webhook (if workflow is active)
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# 3. Test Flask backend
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache"}'
```

## 📚 Documentation

- Full setup guide: `n8n-setup/README.md`
- Flask integration: `INTEGRATION-GUIDE.md`
- API documentation: `backend/ANALYZE-ENDPOINT.md`

---

**Everything is ready!** 🎉 Start using your SwasthAI chatbot with n8n and Ollama integration!

