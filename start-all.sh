#!/bin/bash

# SwasthAI - Start All Services
# This script starts both the Flask ML backend and the Next.js frontend

set -e

echo "🚀 Starting SwasthAI Services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit
}

trap cleanup INT TERM

# Start ML Backend
echo -e "${BLUE}📦 Starting ML Backend (Flask)...${NC}"
cd backend

# Check if virtual environment exists
if [ ! -d ".venv" ] && [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found. Creating one...${NC}"
    python3 -m venv .venv
fi

# Activate virtual environment
if [ -d ".venv" ]; then
    source .venv/bin/activate
elif [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install dependencies if needed
if [ ! -f ".deps-installed" ]; then
    echo -e "${YELLOW}📥 Installing Python dependencies...${NC}"
    pip install -r requirements.txt
    touch .deps-installed
fi

# Check if models exist
if [ ! -f "models/ml/diabetes_model.pkl" ]; then
    echo -e "${YELLOW}⚠️  Warning: diabetes_model.pkl not found${NC}"
fi
if [ ! -f "models/ml/heart_disease_model.pkl" ]; then
    echo -e "${YELLOW}⚠️  Warning: heart_disease_model.pkl not found${NC}"
fi

# Start Flask backend
echo -e "${GREEN}✅ Starting Flask backend on http://localhost:5001${NC}"
python app.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${BLUE}⏳ Waiting for backend to start...${NC}"
sleep 3

# Check if backend is running
if curl -s http://localhost:5001/ > /dev/null; then
    echo -e "${GREEN}✅ Backend is running!${NC}"
else
    echo -e "${YELLOW}⚠️  Backend might still be starting...${NC}"
fi

# Start Frontend
echo ""
echo -e "${BLUE}📦 Starting Frontend (Next.js)...${NC}"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installing Node.js dependencies...${NC}"
    if command -v pnpm &> /dev/null; then
        pnpm install
    else
        npm install
    fi
fi

# Start Next.js frontend
echo -e "${GREEN}✅ Starting Next.js frontend on http://localhost:3000${NC}"
if command -v pnpm &> /dev/null; then
    pnpm dev > ../frontend.log 2>&1 &
else
    npm run dev > ../frontend.log 2>&1 &
fi
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✨ All services are starting!${NC}"
echo ""
echo "📊 Service Status:"
echo "   • Backend (ML API):  http://localhost:5001"
echo "   • Frontend (Next.js): http://localhost:3000"
echo "   • Health Check:      http://localhost:3000/api/health"
echo ""
echo "📝 Logs:"
echo "   • Backend:  tail -f backend.log"
echo "   • Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

