# 🔧 Ollama-n8n Connection Fix Guide

## ✅ Current Status

- ✅ **Ollama**: Running on `localhost:11434`
- ✅ **Model**: `llama3.2:latest` is installed
- ⚠️ **Docker**: Starting/needs verification
- ⚠️ **n8n Container**: Needs curl installation and Ollama connection test

---

## 🎯 Quick Fix (Automated)

Run the automated fix script:

```bash
./fix-ollama-n8n-connection.sh
```

This script will:
1. ✅ Check Docker is running
2. ✅ Start n8n containers if needed
3. ✅ Install curl in n8n container
4. ✅ Test Ollama connection from container
5. ✅ Verify everything works

---

## 🎯 Manual Fix Steps

### Step 1: Start Docker (if not running)

```bash
# Check if Docker Desktop is running
docker ps

# If not running, start it:
open -a Docker

# Wait 10-15 seconds for Docker to start
# Verify Docker is running:
docker ps
```

If you see container listings (or empty list), Docker is running ✅

---

### Step 2: Start n8n Containers

```bash
cd n8n-setup
docker compose up -d
```

Wait 10 seconds, then verify:

```bash
docker compose ps
```

You should see:
- ✅ `n8n-setup-n8n-1` - Running
- ✅ `n8n-setup-postgres-1` - Healthy

---

### Step 3: Install curl in n8n Container

```bash
# Enter the n8n container
docker exec -it n8n-setup-n8n-1 bash
```

Inside the container, run:

```bash
# Update package list and install curl
apt-get update && apt-get install -y curl

# Verify curl is installed
curl --version
```

You should see:
```
curl 7.x.x ...
```

**Exit the container:**
```bash
exit
```

---

### Step 4: Test Ollama Connection from Container

From your **host machine** (not inside container):

```bash
# Test connection from n8n container to Ollama on Mac host
docker exec n8n-setup-n8n-1 curl -s http://host.docker.internal:11434/api/tags
```

**Expected Output:**
```json
{
  "models": [
    {
      "name": "llama3.2:latest",
      "model": "llama3.2:latest",
      ...
    }
  ]
}
```

If you see the model list ✅, the connection works!

If you see `404` or connection error, see **Troubleshooting** below.

---

### Step 5: Configure n8n Ollama Node

1. **Open n8n UI:**
   ```
   http://localhost:5678
   ```
   - Username: `admin`
   - Password: `strongpassword123`

2. **Go to your workflow** (the SwasthAI home remedy workflow)

3. **Click on "Ollama Chat Model" node**

4. **Configure Base URL:**
   - Set **Base URL** to: `http://host.docker.internal:11434`
   
5. **Select Model:**
   - Click the **Model** dropdown
   - You should now see `llama3.2:latest` (not `[object Object]`)
   - Select it

6. **Save the workflow** (Ctrl+S or Cmd+S)

7. **Activate the workflow** (toggle switch in top-right)

---

### Step 6: Test the Complete Flow

**Test 1: Direct n8n webhook**
```bash
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache"}'
```

**Expected:** JSON response with home remedy suggestions

**Test 2: Via Flask backend**
```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been experiencing headaches for 2 days", "use_n8n": true}'
```

**Expected:**
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

### Issue 1: `Cannot connect to Docker daemon`

**Solution:**
```bash
# Start Docker Desktop
open -a Docker

# Wait 15 seconds, then retry
docker ps
```

---

### Issue 2: `404 page not found` when testing Ollama from container

**Cause:** `host.docker.internal` might not work on your Mac

**Solution A: Use IP address instead**
```bash
# Find your Mac's IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Use that IP (e.g., 192.168.1.100)
docker exec n8n-setup-n8n-1 curl http://192.168.1.100:11434/api/tags

# Update n8n Ollama node Base URL to: http://192.168.1.100:11434
```

**Solution B: Add extra_hosts to docker-compose.yml**
```yaml
n8n:
  # ... existing config ...
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

Then restart:
```bash
cd n8n-setup
docker compose down
docker compose up -d
```

---

### Issue 3: Still seeing `[object Object]` in n8n model dropdown

**Solution:**
1. Clear browser cache for `localhost:5678`
2. In n8n, go to **Settings** → **Credentials**
3. Delete the Ollama credential if it exists
4. Re-create the Ollama credential with:
   - Base URL: `http://host.docker.internal:11434`
   - Model: `llama3.2:latest`
5. Refresh the workflow page
6. Re-select the model in the node

---

### Issue 4: n8n workflow returns empty response

**Check:**
1. **Is workflow active?** (Toggle in top-right should be ON/green)
2. **Is "Send Response" node configured?**
   - Response Body should be: `={{ $json.finalResponse }}`
   - Or: `={{ $json.response }}`
   - Or: `={{ $json.message }}`
3. **Check n8n execution logs:**
   - Click on the workflow
   - Go to "Executions" tab
   - Check the latest execution for errors

**Quick fix for "Send Response" node:**
1. Click on "Send Response" node
2. In "Respond With" field, select: `JSON`
3. In the JSON body, enter:
   ```json
   {
     "finalResponse": "={{ $json.finalResponse }}"
   }
   ```
4. Save and retry

---

## ✅ Verification Checklist

After completing all steps:

- [ ] Docker is running (`docker ps` works)
- [ ] n8n containers are healthy (`docker compose ps` shows both running)
- [ ] curl is installed in n8n container (`docker exec n8n-setup-n8n-1 curl --version`)
- [ ] Ollama connection test works (`docker exec n8n-setup-n8n-1 curl http://host.docker.internal:11434/api/tags`)
- [ ] n8n UI shows model `llama3.2:latest` (not `[object Object]`)
- [ ] Workflow is active (toggle is ON/green)
- [ ] "Send Response" node is configured correctly
- [ ] Direct webhook test returns JSON response
- [ ] Flask backend test returns prediction with `source: "n8n"`

---

## 🎉 Success Indicators

When everything is working:

1. **n8n webhook returns:**
   ```json
   {
     "finalResponse": "Based on your symptoms of headache...",
     "status": "success"
   }
   ```

2. **Flask backend returns:**
   ```json
   {
     "prediction": "Based on your symptoms...",
     "status": "success",
     "source": "n8n"
   }
   ```

3. **Chatbot shows:**
   - Bot responds with home remedy suggestions
   - No "empty response" or "placeholder" messages

---

## 📝 Quick Reference Commands

```bash
# Start n8n
cd n8n-setup && docker compose up -d

# Check status
docker compose ps

# Install curl (one-time)
docker exec -it n8n-setup-n8n-1 bash -c "apt-get update && apt-get install -y curl"

# Test Ollama connection
docker exec n8n-setup-n8n-1 curl http://host.docker.internal:11434/api/tags

# Test n8n webhook
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'

# View n8n logs
docker compose logs n8n -f

# Restart n8n
docker compose restart n8n
```

---

## 🚀 Next Steps After Fix

1. ✅ Test the chatbot in the frontend
2. ✅ Verify all health checks pass
3. ✅ Monitor n8n execution logs for any issues
4. ✅ Document any custom workflow configurations

---

**Last Updated:** Based on current setup with Ollama running on Mac host and n8n in Docker.
