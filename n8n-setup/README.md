# n8n Setup for SwasthAI

Complete Docker-based setup for n8n with PostgreSQL and Ollama integration.

## 🚀 Quick Start

```bash
# Navigate to setup directory
cd n8n-setup

# Start services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f n8n

# Stop services
docker compose down
```

## 📋 Prerequisites

- Docker Desktop installed and running
- Ollama running locally (port 11434)

## 🔧 Configuration

### Environment Variables (.env file)

```bash
N8N_USER=admin
N8N_PASS=strongpassword123
```

### Access n8n

- **URL**: http://localhost:5678
- **Username**: admin
- **Password**: strongpassword123

## 🔗 Integration with SwasthAI

### Webhook Endpoint

The n8n workflow is accessible at:
```
POST http://localhost:5678/webhook/chat/swasth-ai
```

**Payload:**
```json
{
  "message": "I have headache and fatigue"
}
```

### Flask Backend Integration

The Flask backend (`backend/app.py`) automatically calls this webhook when using `/analyze/text` endpoint.

**Example:**
```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have a sore throat and fever"}'
```

## 🧪 Testing

### 1. Test n8n Webhook Directly

```bash
curl -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a sore throat and fever"}'
```

### 2. Test via Flask Backend

```bash
curl -X POST http://localhost:5001/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "I have been experiencing headache and fatigue"}'
```

### 3. Test Ollama Connection

```bash
# From host
curl http://localhost:11434/health

# From inside n8n container
docker exec -it n8n-setup-n8n-1 curl http://host.docker.internal:11434/health
```

## 📊 Services

| Service | Port | Description |
|---------|------|-------------|
| n8n | 5678 | n8n workflow automation platform |
| PostgreSQL | 5432 | Database (internal) |

## 🐳 Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Remove everything (including data)
docker compose down -v
```

## 🔍 Troubleshooting

### Issue: n8n not accessible

**Solution:**
1. Check containers are running: `docker compose ps`
2. Check logs: `docker compose logs n8n`
3. Verify port 5678 is not in use: `lsof -i :5678`

### Issue: Ollama connection fails

**Solution:**
1. Ensure Ollama is running: `curl http://localhost:11434/health`
2. On macOS/Windows, `host.docker.internal` should work automatically
3. On Linux, you may need to add `--network host` or use `172.17.0.1` instead

### Issue: Workflow not executing

**Solution:**
1. Ensure workflow is **Active** (toggle switch in n8n UI)
2. Check webhook path matches: `chat/swasth-ai`
3. Verify Ollama credentials are configured in workflow

## 📝 Workflow Setup

### Import Your Workflow

1. Open n8n at http://localhost:5678
2. Login with admin/strongpassword123
3. Click "Import from File" or "Import from URL"
4. Paste your workflow JSON
5. Toggle workflow to **Active**

### Workflow Structure

```
Webhook (Receive Symptoms)
  ↓
Set Prompt
  ↓
Generate Remedy (Ollama Chat Model)
  ↓
Code in JavaScript
  ↓
Send Response
```

## 🔐 Security Notes

- Change default password in production
- Use HTTPS in production
- Configure firewall rules
- Regularly backup `.n8n` directory

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Ollama Documentation](https://ollama.ai/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

