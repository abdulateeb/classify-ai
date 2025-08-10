#!/bin/bash
set -e

echo "🚀 Starting build process for WasteCycle..."

# Install Node.js 18 (Render uses older version by default)
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Build frontend
echo "🏗️ Building React frontend..."
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install --production=false

# Build the application
echo "🔨 Building frontend application..."
npm run build

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Frontend build successful - dist folder created"
    ls -la dist/
else
    echo "❌ Frontend build failed - no dist folder found"
    exit 1
fi

cd ..

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Build completed successfully!"
echo "📁 Build artifacts:"
echo "   - Frontend: frontend/dist/"
echo "   - Backend: Python packages installed"
