#!/bin/bash

# EcoWaste Management - Frontend Development Server Startup Script
echo "🌱 Starting EcoWaste Frontend Development Server..."

# Kill any existing frontend processes
echo "📋 Cleaning up existing frontend processes..."
pkill -f "vite" > /dev/null 2>&1
lsof -ti:5173 | xargs kill -9 > /dev/null 2>&1
lsof -ti:5174 | xargs kill -9 > /dev/null 2>&1
lsof -ti:5175 | xargs kill -9 > /dev/null 2>&1

# Wait a moment for cleanup
sleep 2

echo "✅ Frontend cleanup completed"

# Navigate to frontend directory
cd frontend

# Check if node_modules exists, install if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo "✅ Frontend dependencies installed"
fi

# Start the frontend development server
echo "🚀 Starting React development server..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🎨 Features: React 18 + TypeScript + TailwindCSS v4"
echo ""

npm run dev
