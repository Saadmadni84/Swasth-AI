# Medical Text Analysis Endpoint

## Overview

The `/analyze` endpoint allows you to download medical text files from URLs and process them through the SwasthAI n8n workflow for AI-powered home remedy suggestions.

## Integration with n8n Workflow

The endpoint integrates with your n8n "Swasth AI Home Remedy Suggestion System" workflow that uses Ollama LLM (llama3.2) to generate traditional Indian home remedies based on symptoms.

## API Endpoints

### 1. `/analyze` - File URL Analysis (GET)

Analyze medical text from a remote URL.

**Request:**
```bash
GET http://localhost:5001/analyze?file_url=https://example.com/patient_symptoms.txt
```

**Query Parameters:**
- `file_url` (required): URL to a `.txt` file containing patient symptoms/reports

**Response:**
```json
{
  "file_url": "https://example.com/patient_symptoms.txt",
  "input_excerpt": "First 200 characters of the file...",
  "prediction": "AI-generated home remedy suggestions from n8n workflow...",
  "status": "success",
  "source": "n8n"
}
```

**Error Responses:**
```json
{
  "error": "Missing 'file_url' parameter",
  "status": "error"
}
```

### 2. `/analyze/text` - Direct Text Analysis (POST)

Analyze medical text directly without downloading from a URL.

**Request:**
```bash
POST http://localhost:5001/analyze/text
Content-Type: application/json

{
  "text": "I have been experiencing headache and fatigue for 2 days",
  "use_n8n": true  // optional, defaults to true
}
```

**Response:**
```json
{
  "input_excerpt": "I have been experiencing headache...",
  "prediction": "AI-generated home remedy suggestions...",
  "status": "success",
  "source": "n8n"
}
```

## Environment Variables

Configure these environment variables to customize behavior:

- `N8N_URL`: Base URL for n8n instance (default: `http://localhost:5678`)
- `USE_N8N`: Enable/disable n8n integration (default: `true`)
- `DOWNLOAD_TIMEOUT`: Timeout for file downloads in seconds (default: `10`)

**Example:**
```bash
export N8N_URL=http://localhost:5678
export USE_N8N=true
export DOWNLOAD_TIMEOUT=15
```

## n8n Workflow Configuration

Your n8n workflow should be:
- **Active** (toggle switch enabled)
- **Webhook path**: `chat/swasth-ai`
- **Webhook method**: POST
- **Expected payload**: `{"message": "symptoms text"}`

The Flask backend calls: `http://<N8N_URL>/webhook/chat/swasth-ai`

## Example Usage

### Using File URL

1. **Prepare a text file** with patient symptoms:
```txt
I have been experiencing severe headache, nausea, and dizziness for the past 2 days. 
I also feel fatigued and have difficulty concentrating.
```

2. **Upload to a publicly accessible URL** (GitHub, cloud storage, etc.)

3. **Call the API:**
```bash
curl "http://localhost:5001/analyze?file_url=https://raw.githubusercontent.com/user/repo/symptoms.txt"
```

### Using Direct Text

```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I have been experiencing headache and fatigue for 2 days"
  }'
```

### Frontend Integration (JavaScript/React)

```javascript
// Method 1: File URL
async function analyzeFromURL(fileURL) {
  const response = await fetch(
    `http://localhost:5001/analyze?file_url=${encodeURIComponent(fileURL)}`
  );
  const data = await response.json();
  return data.prediction;
}

// Method 2: Direct text
async function analyzeText(symptoms) {
  const response = await fetch('http://localhost:5001/analyze/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: symptoms })
  });
  const data = await response.json();
  return data.prediction;
}

// Usage
const remedy = await analyzeText("I have a cough and cold");
console.log(remedy);
```

## Fallback Behavior

If n8n is unavailable or `USE_N8N=false`, the endpoint uses a placeholder function that returns a basic analysis. This ensures the API always responds even if n8n is down.

## Error Handling

The endpoint handles:
- ❌ Missing `file_url` parameter
- ❌ Invalid URL format
- ❌ Download timeout
- ❌ Network errors
- ❌ Empty file content
- ❌ n8n workflow unavailability (falls back to placeholder)

## Testing

See `test_analyze.py` for example test cases.

## Production Deployment

For production:
1. Set `FLASK_ENV=production`
2. Use `gunicorn` instead of Flask dev server
3. Configure proper `N8N_URL` for your production n8n instance
4. Set up monitoring and logging

