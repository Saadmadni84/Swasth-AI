# ✅ Ollama-n8n Connection Setup Complete!

## 🎉 Status: READY

All components are properly configured and connected!

---

## ✅ Verified Connections

### 1. Docker & n8n Containers
- ✅ Docker Desktop is running
- ✅ `n8n-setup-n8n-1` container is healthy and running
- ✅ `n8n-setup-postgres-1` container is healthy and running
- ✅ curl is installed in n8n container (version 8.14.1)

### 2. Ollama
- ✅ Ollama is running on host: `localhost:11434`
- ✅ Model `llama3.2:latest` is installed and available
- ✅ Verified from host: `curl http://localhost:11434/api/tags` ✅

### 3. n8n → Ollama Connection
- ✅ **Connection verified!** 
- ✅ Test command: `docker exec n8n-setup-n8n-1 curl http://host.docker.internal:11434/api/tags`
- ✅ **Result:** Successfully returns model list with `llama3.2:latest`
- ✅ `host.docker.internal` works correctly from n8n container

---

## 🔧 Next Steps: Configure n8n Workflow

### Step 1: Open n8n UI

```
http://localhost:5678
```

**Credentials:**
- Username: `admin`
- Password: `strongpassword123`

### Step 2: Configure Ollama Chat Model Node

1. Open your SwasthAI home remedy workflow
2. Click on the **"Ollama Chat Model"** node
3. Configure:
   - **Base URL**: `http://host.docker.internal:11434`
   - **Model**: Select `llama3.2:latest` from dropdown
     - ⚠️ If you see `[object Object]`, see Troubleshooting below
4. Save the workflow (Ctrl+S or Cmd+S)

### Step 3: Activate Workflow

1. Toggle the workflow to **Active** (green switch in top-right)
2. Make sure the workflow is saved

### Step 4: Test n8n Webhook

```bash
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache"}'
```

**Expected Response:**
```json
{
  "finalResponse": "Based on your symptoms...",
  "status": "success"
}
```

### Step 5: Test Flask Backend Integration

```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been experiencing headaches for 2 days", "use_n8n": true}'
```

**Expected Response:**
```json
{
  "input_excerpt": "I have been experiencing...",
  "prediction": "Based on your symptoms...",
  "status": "success",
  "source": "n8n"
}
```

---

## 🔍 Troubleshooting

### Issue: `[object Object]` in Model Dropdown

**Solution:**
1. In n8n UI, go to **Settings** → **Credentials**
2. Delete the Ollama credential if it exists
3. Re-create with:
   - **Base URL**: `http://host.docker.internal:11434`
   - **Model**: `llama3.2:latest`
4. Refresh the workflow page (Cmd+R or Ctrl+R)
5. Re-select the model in the Ollama Chat Model node

### Issue: Empty Response from Webhook

**Check:**
1. Is workflow active? (Toggle should be ON/green)
2. Is "Send Response" node configured correctly?
   - Response Body: `={{ $json.finalResponse }}`
3. Check n8n execution logs:
   - Go to "Executions" tab
   - Check latest execution for errors

**Fix "Send Response" Node:**
1. Click "Send Response" node
2. Set **Response Format**: JSON
3. Set **Response Body**:
   ```json
   {
     "finalResponse": "={{ $json.finalResponse }}"
   }
   ```
4. Save and retry

### Issue: Ollama Connection Error in n8n Node

If n8n shows connection error:
1. Verify Ollama is running: `ps aux | grep ollama`
2. Test from container: `docker exec n8n-setup-n8n-1 curl http://host.docker.internal:11434/api/tags`
3. If that fails, try using your Mac's IP address instead:
   ```bash
   # Find your IP
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Use that IP in n8n Base URL (e.g., http://192.168.1.100:11434)
   ```

---

## 📋 Verification Checklist

After configuring n8n:

- [ ] n8n UI opens at http://localhost:5678
- [ ] Workflow is loaded/imported
- [ ] Ollama Chat Model node shows Base URL: `http://host.docker.internal:11434`
- [ ] Model dropdown shows `llama3.2:latest` (not `[object Object]`)
- [ ] Workflow is active (toggle ON/green)
- [ ] "Send Response" node is configured correctly
- [ ] Direct webhook test returns JSON with `finalResponse`
- [ ] Flask backend test returns prediction with `source: "n8n"`

---

## 🚀 Test Complete Integration

1. **Start Flask backend** (if not running):
   ```bash
   cd backend
   source .venv/bin/activate  # or activate your venv
   python app.py
   ```

2. **Start Next.js frontend** (if not running):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open chatbot**:
   - Go to http://localhost:3000/medibot
   - Or http://localhost:3000/test-ai
   - Send a message: "I have a headache"
   - Bot should respond with home remedy suggestions from Ollama!

---

## 📝 Quick Reference

### Service URLs
- **n8n UI**: http://localhost:5678
- **Flask Backend**: http://localhost:5001
- **Next.js Frontend**: http://localhost:3000
- **Ollama API**: http://localhost:11434

### Container Commands
```bash
# Check n8n status
cd n8n-setup && docker compose ps

# View n8n logs
docker compose logs n8n -f

# Test Ollama from container
docker exec n8n-setup-n8n-1 curl http://host.docker.internal:11434/api/tags

# Restart n8n
docker compose restart n8n
```

### Test Commands
```bash
# Test n8n webhook
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# Test Flask backend
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache", "use_n8n": true}'
```

---

## 🎉 Success!

All infrastructure is ready! You just need to:
1. Configure the Ollama node in n8n workflow
2. Activate the workflow
3. Test the chatbot

**Everything else is working!** ✅

---

**Last Updated:** Connection verified - Ollama accessible from n8n container via `host.docker.internal:11434`

