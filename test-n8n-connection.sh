#!/bin/bash
# Test the complete n8n → Backend → MediChatBot connection

echo "🔍 Testing SwasthAI n8n Integration..."
echo "========================================="
echo ""

# Test 1: Backend Health
echo "1️⃣ Testing Backend Health (port 5003)..."
BACKEND_STATUS=$(curl --max-time 5 -sS -o /dev/null -w "%{http_code}" http://localhost:5003/ 2>/dev/null)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not responding (Status: $BACKEND_STATUS)"
    echo "   Run: ./start-backend.sh"
    exit 1
fi
echo ""

# Test 2: n8n Health
echo "2️⃣ Testing n8n (port 5678)..."
N8N_STATUS=$(curl --max-time 5 -sS -o /dev/null -w "%{http_code}" http://localhost:5678/ 2>/dev/null)
if [ "$N8N_STATUS" = "200" ]; then
    echo "✅ n8n is running"
else
    echo "❌ n8n is not responding (Status: $N8N_STATUS)"
    echo "   Start n8n: docker-compose up -d n8n"
    exit 1
fi
echo ""

# Test 3: Ollama Health (if used by n8n)
echo "3️⃣ Testing Ollama (port 11434)..."
OLLAMA_STATUS=$(curl --max-time 5 -sS -o /dev/null -w "%{http_code}" http://localhost:11434/ 2>/dev/null)
if [ "$OLLAMA_STATUS" = "200" ]; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama is not responding (Status: $OLLAMA_STATUS)"
    echo "   This is OK if you're not using Ollama in your n8n workflow"
fi
echo ""

# Test 4: Backend analyze endpoint (local mode)
echo "4️⃣ Testing Backend /analyze/text (local mode)..."
LOCAL_RESPONSE=$(curl --max-time 10 -sS -X POST http://localhost:5003/analyze/text \
    -H "Content-Type: application/json" \
    -d '{"text": "test fever", "use_n8n": false}' 2>/dev/null)

if echo "$LOCAL_RESPONSE" | grep -q '"status".*:.*"success"'; then
    echo "✅ Backend analyze endpoint works (local mode)"
else
    echo "❌ Backend analyze endpoint failed"
    echo "   Response: $LOCAL_RESPONSE"
    exit 1
fi
echo ""

# Test 5: Backend → n8n integration
echo "5️⃣ Testing Backend → n8n Integration..."
echo "   (This may take 10-30 seconds as Ollama processes the request)"
N8N_RESPONSE=$(curl --max-time 35 -sS -X POST http://localhost:5003/analyze/text \
    -H "Content-Type: application/json" \
    -d '{"text": "I have a headache", "use_n8n": true}' 2>/dev/null)

if echo "$N8N_RESPONSE" | grep -q '"status".*:.*"success"' && echo "$N8N_RESPONSE" | grep -q '"source".*:.*"n8n"'; then
    echo "✅ Backend → n8n integration works!"
    echo ""
    echo "📋 Sample Response Preview:"
    echo "$N8N_RESPONSE" | python3 -m json.tool 2>/dev/null | head -n 15
else
    echo "❌ Backend → n8n integration failed"
    echo "   Response: $N8N_RESPONSE"
    exit 1
fi
echo ""

echo "========================================="
echo "✅ All tests passed! n8n is connected to your MediChatBot"
echo ""
echo "🎯 Next steps:"
echo "   1. Restart your Next.js frontend if it's running:"
echo "      cd frontend && npm run dev"
echo ""
echo "   2. Test in the browser at http://localhost:3000"
echo ""
echo "   3. View backend logs:"
echo "      tail -f backend/backend.log"
