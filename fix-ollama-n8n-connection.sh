#!/bin/bash

# 🔧 Fix Ollama-n8n Connection Script
# This script installs curl in the n8n container and tests the Ollama connection

set -e

echo "🔧 Fixing Ollama-n8n Connection"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check Docker
echo -e "${YELLOW}Step 1: Checking Docker...${NC}"
if ! docker ps &>/dev/null; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Starting Docker Desktop..."
    open -a Docker
    echo "Waiting 15 seconds for Docker to start..."
    sleep 15
    
    if ! docker ps &>/dev/null; then
        echo -e "${RED}❌ Docker still not running. Please start Docker Desktop manually.${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Step 2: Check n8n containers
echo -e "${YELLOW}Step 2: Checking n8n containers...${NC}"
cd "$(dirname "$0")/n8n-setup" || exit 1

if ! docker compose ps | grep -q "n8n-setup-n8n-1"; then
    echo "Starting n8n containers..."
    docker compose up -d
    echo "Waiting 10 seconds for containers to start..."
    sleep 10
fi

if docker compose ps | grep -q "Up\|healthy"; then
    echo -e "${GREEN}✅ n8n containers are running${NC}"
    docker compose ps
else
    echo -e "${RED}❌ n8n containers are not running properly${NC}"
    docker compose ps
    exit 1
fi
echo ""

# Step 3: Install curl in n8n container
echo -e "${YELLOW}Step 3: Installing curl in n8n container...${NC}"
if docker exec n8n-setup-n8n-1 curl --version &>/dev/null; then
    echo -e "${GREEN}✅ curl is already installed${NC}"
else
    echo "Installing curl..."
    docker exec n8n-setup-n8n-1 bash -c "apt-get update && apt-get install -y curl" 2>&1 | grep -v "^$"
    
    if docker exec n8n-setup-n8n-1 curl --version &>/dev/null; then
        echo -e "${GREEN}✅ curl installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install curl${NC}"
        exit 1
    fi
fi
echo ""

# Step 4: Test Ollama connection
echo -e "${YELLOW}Step 4: Testing Ollama connection from n8n container...${NC}"
echo "Testing: http://host.docker.internal:11434/api/tags"

OLLAMA_TEST=$(docker exec n8n-setup-n8n-1 curl -s http://host.docker.internal:11434/api/tags 2>&1)

if echo "$OLLAMA_TEST" | grep -q "llama3.2:latest"; then
    echo -e "${GREEN}✅ Ollama connection works! Found model: llama3.2:latest${NC}"
    echo ""
    echo "Model details:"
    echo "$OLLAMA_TEST" | grep -o '"name":"[^"]*"' | head -1
elif echo "$OLLAMA_TEST" | grep -q "404\|Connection refused\|Failed"; then
    echo -e "${RED}❌ Ollama connection failed${NC}"
    echo "Response: $OLLAMA_TEST"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "1. Make sure Ollama is running: ps aux | grep ollama"
    echo "2. Test from host: curl http://localhost:11434/api/tags"
    echo "3. If host test works, try using IP address instead of host.docker.internal"
    exit 1
else
    echo -e "${YELLOW}⚠️  Unexpected response from Ollama${NC}"
    echo "Response: $OLLAMA_TEST"
fi
echo ""

# Step 5: Verify Ollama on host
echo -e "${YELLOW}Step 5: Verifying Ollama on host machine...${NC}"
HOST_TEST=$(curl -s http://localhost:11434/api/tags 2>&1 || echo "FAILED")

if echo "$HOST_TEST" | grep -q "llama3.2:latest"; then
    echo -e "${GREEN}✅ Ollama is running on host with llama3.2:latest${NC}"
elif echo "$HOST_TEST" | grep -q "404"; then
    echo -e "${YELLOW}⚠️  Ollama is running but returned 404${NC}"
    echo "This is normal - the /api/tags endpoint might not exist"
    echo "Trying health check..."
    HEALTH=$(curl -s http://localhost:11434/health 2>&1 || echo "FAILED")
    if echo "$HEALTH" | grep -q "ok"; then
        echo -e "${GREEN}✅ Ollama health check passed${NC}"
    fi
else
    echo -e "${RED}❌ Ollama is not running on host${NC}"
    echo "Please start Ollama: ollama serve"
    exit 1
fi
echo ""

# Summary
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SETUP COMPLETE!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Open n8n UI: http://localhost:5678"
echo "   Username: admin"
echo "   Password: strongpassword123"
echo ""
echo "2. Configure Ollama Chat Model node:"
echo "   - Base URL: http://host.docker.internal:11434"
echo "   - Model: llama3.2:latest (should appear in dropdown)"
echo ""
echo "3. Test the webhook:"
echo "   curl -X POST http://localhost:5678/webhook/chat/swasth-ai \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"message\": \"I have a headache\"}'"
echo ""
echo "4. Test via Flask backend:"
echo "   curl -X POST http://localhost:5001/analyze/text \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"text\": \"I have a headache\", \"use_n8n\": true}'"
echo ""
echo -e "${GREEN}All set! 🎉${NC}"

