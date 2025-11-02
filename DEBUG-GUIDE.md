# 🐛 Debug Guide - Empty Prediction Issue

## Problem
The `/analyze/text` endpoint is returning `"prediction": ""` (empty string).

## Root Causes & Solutions

### ✅ Issue 1: n8n Workflow Not Active

**Symptoms:**
- Response shows `"source": "n8n"` but `"prediction": ""`
- Backend logs show: "n8n workflow unavailable" or 404 errors

**Solution:**
1. Open http://localhost:5678
2. Login: `admin` / `strongpassword123`
3. Open workflow: "Swasth AI Home Remedy Suggestion System"
4. **Toggle "Active" to ON** (green switch in top-right)
5. Verify webhook path: `chat/swasth-ai`

**Test:**
```bash
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache"}'
```

Should return JSON with remedy suggestions, not 404.

---

### ✅ Issue 2: n8n Response Format Mismatch

**Symptoms:**
- n8n responds but Flask can't extract the text
- Backend logs show n8n response but empty prediction

**Solution:**
Check backend logs to see the actual n8n response structure:

```bash
tail -f /tmp/flask_backend.log
```

Then update `call_n8n_workflow()` in `backend/app.py` to match your workflow's response format.

**Common formats:**
- `{"reply": "text"}` - Check for 'reply' key
- `{"finalResponse": "text"}` - Check for 'finalResponse' key
- `{"body": "text"}` - Check for 'body' key
- Plain text response - Handle as `response.text`

---

### ✅ Issue 3: Ollama Not Running or Model Not Loaded

**Symptoms:**
- n8n workflow executes but returns empty
- n8n execution logs show errors

**Solution:**
```bash
# Check Ollama
curl http://localhost:11434/health

# If not running, start it:
ollama serve

# Pull model if needed:
ollama pull llama3.2
```

---

### ✅ Issue 4: Timeout Issues

**Symptoms:**
- Backend logs show timeout errors
- n8n workflow takes too long

**Solution:**
The timeout is already set to 60 seconds. If Ollama is slow:
1. Use a smaller/faster model
2. Adjust timeout in `backend/app.py`:
   ```python
   timeout=120  # Increase to 2 minutes
   ```

---

## 🔍 Debug Steps

### Step 1: Check Backend Logs

```bash
tail -f /tmp/flask_backend.log
```

Look for:
- `Calling n8n workflow at: ...`
- `n8n response status: ...`
- `n8n JSON response: ...`
- Any ERROR messages

### Step 2: Test n8n Directly

```bash
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a headache"}'
```

**Expected Response:**
```json
{
  "reply": "Possible cause: Headache might be due to... Home Remedies: 1. Tulsi-Ginger Tea..."
}
```

**If 404:**
- Workflow is not active

**If Empty:**
- Check n8n execution logs in n8n UI
- Verify Ollama is running
- Check workflow nodes are configured correctly

### Step 3: Test Flask Backend

```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache", "use_n8n": true}'
```

**Expected Response:**
```json
{
  "status": "success",
  "prediction": "Home remedy suggestions...",
  "source": "n8n"
}
```

### Step 4: Check n8n Execution Logs

1. Open http://localhost:5678
2. Go to "Executions" tab
3. Click on recent execution
4. Check each node for errors
5. Verify "Send Response" node has output

---

## 🔧 Quick Fixes

### Fix 1: Use Placeholder (Temporary)

If n8n is unavailable, you can force placeholder:

```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache", "use_n8n": false}'
```

### Fix 2: Check n8n Webhook URL

Verify in `backend/app.py`:
```python
webhook_url = f"{n8n_url}/webhook/{webhook_path}"
# Should be: http://localhost:5678/webhook/chat/swasth-ai
```

### Fix 3: Add Fallback Response

The code already has a fallback to `analyze_medical_text()` if n8n fails. Check logs to see if this is being used.

---

## 📊 Current Status

Based on logs:
- ✅ Flask backend is running
- ✅ Endpoint `/analyze/text` is working
- ⚠️ n8n workflow likely not active (404 or empty response)
- ✅ Fallback to placeholder is working

**Action Required:**
1. Activate n8n workflow
2. Verify Ollama is running
3. Test n8n webhook directly
4. Check n8n execution logs

---

## 🎯 Expected Flow

```
User Input → Flask /analyze/text → n8n Webhook → n8n Workflow → Ollama LLM → Response
```

**Each step should:**
1. ✅ Receive input
2. ✅ Process successfully
3. ✅ Return non-empty response
4. ✅ Pass to next step

If any step fails, check logs and verify configuration.

