# SwasthAI n8n Integration Guide

## 🚀 Quick Start

The Flask backend now includes `/analyze` endpoints that integrate with your n8n "Swasth AI Home Remedy Suggestion System" workflow.

## 📋 Prerequisites

1. **Flask Backend Running** on port 5001
2. **n8n Running** on port 5678
3. **n8n Workflow Active** with webhook path: `chat/swasth-ai`

## 🔧 Setup

### 1. Install Dependencies

The `requests` library has been added to `requirements.txt`. Install it:

```bash
cd backend
source .venv/bin/activate  # or: source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables (Optional)

```bash
export N8N_URL=http://localhost:5678
export N8N_WEBHOOK_PATH=chat/swasth-ai
export USE_N8N=true
export DOWNLOAD_TIMEOUT=10
```

### 3. Ensure n8n Workflow is Active

1. Open n8n at `http://localhost:5678`
2. Open your workflow: "Swasth AI Home Remedy Suggestion System"
3. Toggle the **Active** switch to ON (green)
4. Verify webhook path is: `chat/swasth-ai`

## 📡 API Endpoints

### `/analyze` - Analyze from File URL

Download and analyze medical text from a URL.

```bash
GET http://localhost:5001/analyze?file_url=<URL_TO_TXT_FILE>
```

**Example:**
```bash
curl "http://localhost:5001/analyze?file_url=https://raw.githubusercontent.com/user/repo/symptoms.txt"
```

### `/analyze/text` - Analyze Direct Text

Analyze text directly without downloading.

```bash
POST http://localhost:5001/analyze/text
Content-Type: application/json

{
  "text": "I have headache and fatigue",
  "use_n8n": true
}
```

**Example:**
```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been experiencing headache and fatigue for 2 days"}'
```

## 🔄 How It Works

1. **Frontend/Client** sends request to Flask backend `/analyze` or `/analyze/text`
2. **Flask Backend** downloads/processes the text
3. **Flask Backend** calls n8n webhook: `POST http://localhost:5678/webhook/chat/swasth-ai`
4. **n8n Workflow** processes the message through Ollama LLM (llama3.2)
5. **n8n Workflow** generates home remedy suggestions
6. **Flask Backend** returns the AI-generated response

## 🧪 Testing

Run the test script:

```bash
cd backend
source .venv/bin/activate
python test_analyze.py
```

Or test manually:

```bash
# Test direct text analysis
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a headache and feel tired"}'
```

## 🐳 Docker Setup

If using Docker Compose (which includes n8n):

1. Ensure `docker-compose.yml` has n8n service
2. Start services: `docker compose up`
3. Access n8n at `http://localhost:5678`
4. Set environment variable: `N8N_URL=http://n8n:5678` (if backend is in same Docker network)

## 🎯 Frontend Integration

### React/Next.js Example

```javascript
// Analyze symptoms and get home remedies
async function getHomeRemedy(symptoms) {
  try {
    const response = await fetch('http://localhost:5001/analyze/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: symptoms })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.prediction; // Home remedy suggestions from n8n
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

// Usage in component
const handleAnalyze = async () => {
  const symptoms = "I have been experiencing headache and fatigue";
  const remedy = await getHomeRemedy(symptoms);
  setRemedyText(remedy);
};
```

### File Upload Example

```javascript
async function analyzeFile(fileURL) {
  const response = await fetch(
    `http://localhost:5001/analyze?file_url=${encodeURIComponent(fileURL)}`
  );
  return await response.json();
}
```

## 🔍 Troubleshooting

### Issue: "n8n workflow unavailable"

**Solutions:**
1. Check n8n is running: `curl http://localhost:5678`
2. Verify workflow is **Active** (toggle ON)
3. Check webhook path matches: `chat/swasth-ai`
4. Check n8n logs for errors

### Issue: "Connection refused"

**Solutions:**
1. Ensure n8n is accessible at `N8N_URL`
2. If using Docker, use service name: `http://n8n:5678`
3. Check firewall/network settings

### Issue: "Timeout"

**Solutions:**
1. Increase timeout: `export DOWNLOAD_TIMEOUT=30`
2. Check n8n workflow execution time
3. Ensure Ollama model is loaded

## 📝 Response Format

**Success Response:**
```json
{
  "file_url": "https://...",  // (only for /analyze endpoint)
  "input_excerpt": "First 200 chars...",
  "prediction": "AI-generated home remedy suggestions with:\n- Possible cause\n- Home remedies\n- Preventive measures\n- Disclaimer",
  "status": "success",
  "source": "n8n"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "status": "error",
  "file_url": "..."  // if applicable
}
```

## 🎨 n8n Workflow Structure

Your workflow processes:
1. **Receive Symptoms** (Webhook) - Receives POST with `{"message": "..."}`
2. **Set Prompt** - Constructs detailed prompt for AI
3. **Generate Remedy** - Calls Ollama LLM (llama3.2)
4. **Code in JavaScript** - Extracts final response
5. **Send Response** - Returns formatted remedy

The Flask backend integrates seamlessly with this workflow structure.

## 🔐 Production Considerations

1. **Security**: Add authentication for production
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **Logging**: Add comprehensive logging
4. **Monitoring**: Monitor n8n workflow execution times
5. **Error Handling**: Implement retry logic for n8n calls
6. **Caching**: Cache common symptom analyses

## 📚 Additional Resources

- See `backend/ANALYZE-ENDPOINT.md` for detailed API documentation
- See `backend/test_analyze.py` for test examples
- n8n Documentation: https://docs.n8n.io/

