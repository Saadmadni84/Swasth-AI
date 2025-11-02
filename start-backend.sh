#!/bin/bash
# Start the SwasthAI Flask backend on port 5003

# Kill any existing backend process
echo "🧹 Cleaning up existing processes..."
pkill -9 -f 'python3.*app.py' 2>/dev/null || echo "No existing backend process"
lsof -ti:5003 | xargs kill -9 2>/dev/null || echo "Port 5003 is free"

# Navigate to backend directory
cd "$(dirname "$0")/backend" || exit 1

# Activate virtual environment if it exists
if [ -f "../.venv/bin/activate" ]; then
    echo "📦 Activating virtual environment..."
    source "../.venv/bin/activate"
fi

# Start the backend
echo "🚀 Starting Flask backend on port 5003..."
PORT=5003 python3 -u app.py > backend.log 2>&1 &

# Get the PID
BACKEND_PID=$!
echo "✅ Backend started with PID: $BACKEND_PID"

# Wait a bit for it to start
sleep 3

# Verify it's running
if curl --max-time 5 -sS http://localhost:5003/ > /dev/null 2>&1; then
    echo "✅ Backend is running and responding!"
    echo "📋 View logs: tail -f backend/backend.log"
else
    echo "⚠️  Backend started but not responding yet. Check logs: tail -f backend/backend.log"
fi
