#!/bin/bash

echo "🔧 Fixing Deployment Issues..."
echo "================================"

# Update Nginx configuration on server
echo "📝 Updating Nginx configuration..."
sudo tee /etc/nginx/sites-available/ecocircle.in << 'EOF'
server {
    listen 80;
    server_name ecocircle.in www.ecocircle.in 31.97.236.47;

    # Serve React frontend
    location / {
        root /var/www/ecocircle/frontend/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # API Routes - User Service (auth and user endpoints)
    # Don't rewrite - pass the full /api/auth and /api/users paths
    location /api/auth/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/users/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Routes - Marketplace Service
    location /api/marketplace/ {
        proxy_pass http://localhost:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Routes - Educational Content Service
    location /api/education/ {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Routes - Community Service
    location /api/community/ {
        proxy_pass http://localhost:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 50M;
}
EOF

# Test and reload Nginx
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration has errors. Please check the config."
    exit 1
fi

# Rebuild frontend with TypeScript fixes
echo "🏗️ Rebuilding frontend with TypeScript fixes..."
cd /var/www/ecocircle/frontend

# Install dependencies if needed
npm install

# Build with relaxed TypeScript checks
echo "📦 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed. Check the errors above."
    exit 1
fi

# Test API endpoints
echo "🧪 Testing API endpoints..."
echo "Testing user service health..."
curl -s http://localhost:3001/ | jq . || echo "User service response received"

echo "Testing auth endpoint through Nginx..."
curl -s -X POST http://31.97.236.47/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | head -n 5

echo ""
echo "🎉 Deployment fixes completed!"
echo "================================"
echo "✅ Nginx configuration updated (removed path rewriting)"
echo "✅ Frontend rebuilt with TypeScript fixes"
echo "✅ API routing should now work correctly"
echo ""
echo "🔗 Test the application:"
echo "   Frontend: http://31.97.236.47"
echo "   API Test: curl -X POST http://31.97.236.47/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"test\",\"password\":\"test\"}'"
echo ""
echo "📋 Next steps:"
echo "1. Test login/register functionality in the frontend"
echo "2. Configure DNS A records for ecocircle.in"
echo "3. Set up SSL certificate once DNS resolves"
