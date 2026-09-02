#!/bin/bash

# ==============================================================================
# Raahi 1-Click AWS EC2 Deployment Script (Ubuntu 22.04 / 24.04 LTS)
# ==============================================================================

set -e

echo "🚀 Starting Raahi AWS EC2 Deployment Setup..."

# 1. Update and install prerequisites
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

# 2. Install Docker
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker Engine..."
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    echo "✅ Docker installed successfully."
fi

# 3. Pull latest changes from git
if [ -d ".git" ]; then
    echo "🔄 Pulling latest changes from repository..."
    git pull origin main
fi

# 4. Prompt for Docker Hub username if not set in .env
if [ ! -f .env ]; then
    echo "📝 Creating production .env file..."
    read -p "Enter your Docker Hub username: " DOCKER_USER
    read -p "Enter your MongoDB Atlas Connection URI (Press Enter to use local MongoDB): " ATLAS_URI
    
    MONGO_URL=${ATLAS_URI:-mongodb://mongodb:27017/raahi}

    cat <<EOT >> .env
DOCKERHUB_USERNAME=$DOCKER_USER
PORT=4000
NODE_ENV=production
DB_CONNECT=$MONGO_URL
JWT_SECRET=raahi_secure_production_jwt_secret_$(openssl rand -hex 12)
LOCATIONIQ_API=pk.2454f0f2edd078ac4c7b3651b73a73a1
AUTOCOMPLETESUGGETION_API=06b26413597641e384218057a020ec5c
GOOGLE_MAPS_API=AIzaSyCym3TtZSETCk1aL8hwcdAbVwEi5a-9wd0
EOT
fi

# 5. Start the production stack
echo "🚀 Pulling pre-built images and starting Raahi services..."
docker compose -f docker-compose.prod.yml --env-file .env up -d --pull always

echo "=============================================================================="
echo "🎉 Raahi is LIVE on your AWS EC2 Server!"
echo "   - Frontend (Port 80 & 5173): http://$(curl -s ifconfig.me)"
echo "   - Backend API (Port 4000)  : http://$(curl -s ifconfig.me):4000"
echo "=============================================================================="
