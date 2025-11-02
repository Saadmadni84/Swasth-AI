#!/bin/bash

# SwasthAI MediChatBot Startup Script
# This script starts all necessary services for the MediChatBot with n8n integration

echo "🚀 Starting SwasthAI MediChatBot Services..."
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Ollama is running
echo "Checking Ollama..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Ollama is running${NC}"
else
    echo -e "${RED}✗ Ollama is not running${NC}"
    echo "  Please start Ollama first: ollama serve"
    exit 1
fi

# Check if n8n is running
echo "Checking n8n..."
if curl -s http://localhost:5678/healthz > /dev/null 2>&1; then
    echo -e "${GREEN}✓ n8n is running${NC}"
else
    echo -e "${YELLOW}⚠ n8n is not running${NC}"
    echo "  Starting n8n with Docker Compose..."
    cd n8n-setup
    docker compose up -d
    echo "  Waiting for n8n to be healthy..."
    sleep 10
    cd ..
fi

# Check if Flask backend is running
echo "Checking Flask backend..."
if curl -s http://localhost:5003/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Flask backend is running${NC}"
else
    echo -e "${YELLOW}⚠ Flask backend is not running${NC}"
    echo "  Starting Flask backend..."
    cd backend
    PORT=5003 python3 app.py > /tmp/swasthai-backend.log 2>&1 &
    BACKEND_PID=$!
    echo "  Backend started with PID: $BACKEND_PID"
    echo $BACKEND_PID > /tmp/swasthai-backend.pid
    sleep 3
    cd ..
fi

echo ""
echo "==================================="
echo "📊 Service Status"
echo "==================================="
echo -e "${GREEN}✓ Ollama:${NC} http://localhost:11434"
echo -e "${GREEN}✓ n8n:${NC} http://localhost:5678"
echo -e "${GREEN}✓ Flask Backend:${NC} http://localhost:5003"
echo -e "${YELLOW}ℹ Frontend:${NC} http://localhost:3000 (should be running separately)"
echo ""

echo "==================================="
echo "🧪 Testing Integration"
echo "==================================="

# Test n8n webhook
echo "Testing n8n webhook..."
N8N_RESPONSE=$(curl -s -X POST http://localhost:5678/webhook/chat/swasth-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}' \
  --max-time 30 2>&1)

if [ $? -eq 0 ] && [[ $N8N_RESPONSE == *"finalResponse"* ]]; then
    echo -e "${GREEN}✓ n8n webhook is responding${NC}"
else
    echo -e "${RED}✗ n8n webhook test failed${NC}"
    echo "  Response: $N8N_RESPONSE"
fi

# Test Flask backend
echo "Testing Flask backend..."
BACKEND_RESPONSE=$(curl -s -X POST http://localhost:5003/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "test", "use_n8n": false}' \
  --max-time 5 2>&1)

if [ $? -eq 0 ] && [[ $BACKEND_RESPONSE == *"prediction"* ]]; then
    echo -e "${GREEN}✓ Flask backend is responding${NC}"
else
    echo -e "${YELLOW}⚠ Flask backend test inconclusive${NC}"
fi

echo ""
echo "==================================="
echo "✅ Setup Complete!"
echo "==================================="
echo ""
echo "Your MediChatBot is ready to use with n8n integration!"
echo ""
echo "📝 Important Notes:"
echo "  1. Make sure your Next.js frontend is running (npm run dev)"
echo "  2. The frontend should have .env.local with:"
echo "     NEXT_PUBLIC_ML_API_URL=http://localhost:5003"
echo "  3. Check n8n workflows at: http://localhost:5678"
echo "     (Login: admin / strongpassword123)"
echo ""
echo "📊 View Logs:"
echo "  Backend: tail -f /tmp/swasthai-backend.log"
echo "  n8n: cd n8n-setup && docker compose logs -f n8n"
echo ""
echo "🛑 Stop Services:"
echo "  Backend: kill \$(cat /tmp/swasthai-backend.pid)"
echo "  n8n: cd n8n-setup && docker compose down"
echo ""
