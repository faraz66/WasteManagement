#!/bin/bash

# EcoWaste Management - Backend Services Startup Script
echo "🚀 Starting EcoWaste Backend Services..."

# Kill any existing services on our ports
echo "📋 Cleaning up existing services..."
pkill -f "node.*server.js" > /dev/null 2>&1
lsof -ti:3001 | xargs kill -9 > /dev/null 2>&1
lsof -ti:3002 | xargs kill -9 > /dev/null 2>&1
lsof -ti:3003 | xargs kill -9 > /dev/null 2>&1

# Wait a moment for cleanup
sleep 2

echo "✅ Port cleanup completed"

# Check if databases exist, create if needed
echo "🗄️  Setting up databases..."

# Create databases if they don't exist
createdb waste_marketplace_users 2>/dev/null || echo "   → waste_marketplace_users already exists"
createdb waste_marketplace 2>/dev/null || echo "   → waste_marketplace already exists"
createdb education_db 2>/dev/null || echo "   → education_db already exists"

echo "✅ Database setup completed"

# Set up database tables
echo "📋 Setting up database tables..."
psql -d waste_marketplace -f backend/marketplace-service/database/migrations/create_marketplace_tables.sql > /dev/null 2>&1
echo "✅ Marketplace tables ready"

# Navigate to backend directory and start services
cd backend

# Start services using concurrently
echo "🌟 Starting all backend services..."

# Use npm run to start all services together
npm run dev:backend
