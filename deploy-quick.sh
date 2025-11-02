#!/bin/bash

# SwasthAI Quick Deployment Script
# This script helps you deploy to Vercel, Railway, and Render

echo "🚀 SwasthAI Deployment Helper"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment Checklist${NC}"
echo "----------------------------"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Git status
echo -e "${YELLOW}🔍 Checking Git status...${NC}"
if git diff-index --quiet HEAD --; then
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
else
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    read -p "Do you want to commit and push them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        git push origin main
        echo -e "${GREEN}✅ Changes committed and pushed${NC}"
    fi
fi
echo ""

# Check for required CLI tools
echo -e "${YELLOW}🔧 Checking for required tools...${NC}"

if command_exists vercel; then
    echo -e "${GREEN}✅ Vercel CLI installed${NC}"
else
    echo -e "${RED}❌ Vercel CLI not installed${NC}"
    read -p "Install Vercel CLI? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
        echo -e "${GREEN}✅ Vercel CLI installed${NC}"
    fi
fi

if command_exists railway; then
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
else
    echo -e "${RED}❌ Railway CLI not installed${NC}"
    read -p "Install Railway CLI? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g @railway/cli
        echo -e "${GREEN}✅ Railway CLI installed${NC}"
    fi
fi
echo ""

# Deployment options
echo -e "${BLUE}🚀 Select Deployment Option${NC}"
echo "----------------------------"
echo "1) Deploy Frontend to Vercel"
echo "2) Deploy Flask Backend to Railway"
echo "3) Setup Node Backend for Render (Manual)"
echo "4) Deploy All (Vercel + Railway)"
echo "5) Show Deployment URLs"
echo "6) Exit"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}📦 Deploying Frontend to Vercel...${NC}"
        echo "-----------------------------------"
        cd frontend
        
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}📥 Installing dependencies...${NC}"
            npm install
        fi
        
        echo -e "${YELLOW}🔐 Please log in to Vercel...${NC}"
        vercel login
        
        echo -e "${YELLOW}🚀 Starting deployment...${NC}"
        vercel --prod
        
        echo ""
        echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
        echo -e "${YELLOW}⚠️  Don't forget to add environment variables in Vercel dashboard${NC}"
        ;;
        
    2)
        echo ""
        echo -e "${BLUE}📦 Deploying Flask Backend to Railway...${NC}"
        echo "----------------------------------------"
        cd backend
        
        echo -e "${YELLOW}🔐 Please log in to Railway...${NC}"
        railway login
        
        echo -e "${YELLOW}🚀 Starting deployment...${NC}"
        railway up
        
        echo -e "${YELLOW}🌐 Generating domain...${NC}"
        railway domain
        
        echo ""
        echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
        echo -e "${YELLOW}⚠️  Copy the Railway URL and add it to Vercel environment variables${NC}"
        ;;
        
    3)
        echo ""
        echo -e "${BLUE}📦 Setting up Node Backend for Render...${NC}"
        echo "----------------------------------------"
        echo ""
        echo -e "${YELLOW}📝 Render deployment is done via GitHub integration${NC}"
        echo ""
        echo "Steps to deploy:"
        echo "1. Go to https://render.com/dashboard"
        echo "2. Click 'New +' → 'Web Service'"
        echo "3. Connect your GitHub repository: Swasth-AI"
        echo "4. Configure:"
        echo "   - Name: swasthai-node-backend"
        echo "   - Root Directory: backend-node"
        echo "   - Build Command: npm install"
        echo "   - Start Command: node server.js"
        echo "5. Add environment variables (see DEPLOYMENT-COMPLETE-GUIDE.md)"
        echo "6. Click 'Create Web Service'"
        echo ""
        echo -e "${GREEN}✅ Configuration ready for Render${NC}"
        ;;
        
    4)
        echo ""
        echo -e "${BLUE}📦 Deploying Frontend and Backend...${NC}"
        echo "------------------------------------"
        
        # Deploy Frontend
        echo -e "${YELLOW}🌐 Deploying Frontend to Vercel...${NC}"
        cd frontend
        if [ ! -d "node_modules" ]; then
            npm install
        fi
        vercel login
        vercel --prod
        cd ..
        
        echo ""
        
        # Deploy Backend
        echo -e "${YELLOW}🔧 Deploying Backend to Railway...${NC}"
        cd backend
        railway login
        railway up
        railway domain
        cd ..
        
        echo ""
        echo -e "${GREEN}✅ All deployments completed!${NC}"
        echo ""
        echo -e "${YELLOW}📝 Next Steps:${NC}"
        echo "1. Copy Railway backend URL"
        echo "2. Add to Vercel environment variables:"
        echo "   NEXT_PUBLIC_ML_BACKEND_URL=<railway-url>"
        echo "3. Deploy Node backend to Render (see option 3)"
        echo "4. Add Node backend URL to Vercel:"
        echo "   NEXT_PUBLIC_NODE_BACKEND_URL=<render-url>"
        echo "5. Redeploy frontend with: cd frontend && vercel --prod"
        ;;
        
    5)
        echo ""
        echo -e "${BLUE}🌐 Your Deployment URLs${NC}"
        echo "------------------------"
        echo ""
        echo -e "${GREEN}Frontend (Vercel):${NC}"
        echo "Run: cd frontend && vercel ls"
        echo ""
        echo -e "${GREEN}Backend (Railway):${NC}"
        echo "Run: cd backend && railway status"
        echo ""
        echo -e "${YELLOW}Or check your dashboards:${NC}"
        echo "• Vercel: https://vercel.com/dashboard"
        echo "• Railway: https://railway.app/dashboard"
        echo "• Render: https://render.com/dashboard"
        ;;
        
    6)
        echo -e "${BLUE}👋 Goodbye!${NC}"
        exit 0
        ;;
        
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}📚 Documentation${NC}"
echo "----------------"
echo "For detailed deployment guide, see: DEPLOYMENT-COMPLETE-GUIDE.md"
echo ""
echo -e "${GREEN}🎉 Happy Deploying!${NC}"
