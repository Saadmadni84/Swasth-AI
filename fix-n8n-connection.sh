#!/bin/bash

# SwasthAI MediChat n8n Connection Fix
# Run this script to restart services with the correct configuration

echo "🔧 Fixing MediChat Bot n8n Connection..."
echo ""

# Step 1: Stop any running Flask processes
echo "1️⃣  Stopping Flask backend..."
lsof -ti:5003 | xargs kill -9 2>/dev/null || echo "   No Flask process on port 5003"

# Step 2: Restart n8n with new environment variables
echo ""
echo "2️⃣  Restarting n8n with CORS configuration..."
cd "/Users/saadmadni/Downloads/2nd  year/project/SwasThAI 2/SwasThAI"
docker-compose restart n8n
sleep 5

# Step 3: Wait for n8n to be ready
echo ""
echo "3️⃣  Waiting for n8n to be ready..."
until curl -s http://localhost:5678 > /dev/null; do
    echo "   Waiting for n8n..."
    sleep 2
done
echo "   ✅ n8n is ready!"

# Step 4: Start Flask backend with environment variables
echo ""
echo "4️⃣  Starting Flask ML backend..."
cd backend
source .venv/bin/activate
PORT=5003 python app.py &
FLASK_PID=$!
sleep 3

# Step 5: Test the connection
echo ""
echo "5️⃣  Testing connections..."
echo ""

# Test n8n
if curl -s http://localhost:5678 > /dev/null; then
    echo "   ✅ n8n: Running on port 5678"
else
    echo "   ❌ n8n: NOT responding"
fi

# Test Flask
if curl -s http://localhost:5003 > /dev/null; then
    echo "   ✅ Flask: Running on port 5003"
else
    echo "   ❌ Flask: NOT responding"
fi

# Test n8n webhook
if curl -s -X POST http://localhost:5678/webhook/chat/swasth-ai \
    -H "Content-Type: application/json" \
    -d '{"message":"test"}' > /dev/null; then
    echo "   ✅ n8n Webhook: Responding"
else
    echo "   ❌ n8n Webhook: NOT responding"
fi

echo ""
echo "🎉 Setup complete! Flask PID: $FLASK_PID"
echo ""
echo "📝 Next steps:"
echo "   1. Open browser: http://localhost:3001/test-ai"
echo "   2. Type a health question"
echo "   3. MediChat should respond with AI-generated advice"
echo ""
echo "🛑 To stop Flask: kill $FLASK_PID"
