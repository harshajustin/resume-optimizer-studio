#!/bin/bash
# DigitalOcean Droplet Setup Script for SkillMatch Backend
# Run this on a new Ubuntu 22.04 droplet
#
# ⚠️ SECURITY WARNING: This script creates placeholder environment variables
# ⚠️ You MUST manually edit the .env file with real credentials before running the service
# ⚠️ NEVER commit real credentials to version control
#

echo "🚀 Setting up SkillMatch Backend on DigitalOcean Droplet..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.11 and dependencies
sudo apt install -y python3.11 python3.11-venv python3.11-dev python3-pip git curl

# Install PostgreSQL client for testing
sudo apt install -y postgresql-client

# Create app directory
sudo mkdir -p /opt/skillmatch
sudo chown $USER:$USER /opt/skillmatch
cd /opt/skillmatch

# Clone repository
git clone https://github.com/harshajustin/resume-optimizer-studio.git
cd resume-optimizer-studio/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
cat > .env << EOF
# ⚠️ SECURITY WARNING: Replace ALL these placeholder values with actual credentials
# This is just a template - DO NOT use these placeholder values in production!

DATABASE_URL=postgresql+asyncpg://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:25060/YOUR_DB_NAME?ssl=require
JWT_SECRET_KEY=REPLACE_WITH_SECURE_RANDOM_STRING_GENERATE_WITH_openssl_rand_hex_32
DO_SPACES_ACCESS_KEY=YOUR_DIGITALOCEAN_SPACES_ACCESS_KEY
DO_SPACES_SECRET_KEY=YOUR_DIGITALOCEAN_SPACES_SECRET_KEY
DO_SPACES_BUCKET_NAME=your-bucket-name
DO_SPACES_REGION=your-region
DO_SPACES_ENDPOINT=https://your-bucket.your-region.digitaloceanspaces.com
DO_SPACES_CDN_ENDPOINT=https://your-bucket.your-region.cdn.digitaloceanspaces.com
ENVIRONMENT=production
DEBUG=false
ALLOWED_ORIGINS=https://yourdomain.com
EOF

echo "⚠️  IMPORTANT: Edit .env file with your actual credentials before proceeding!"
echo "   Run: nano .env"
read -p "Press Enter after you've updated .env with real credentials..."

# Test database connection
echo "🔍 Testing database connection..."
python test_db.py

# Run migrations
echo "🗄️ Running database migrations..."
python migrate_db.py

# Create systemd service
sudo tee /etc/systemd/system/skillmatch-backend.service > /dev/null << EOF
[Unit]
Description=SkillMatch AI Backend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/skillmatch/resume-optimizer-studio/backend
Environment=PATH=/opt/skillmatch/resume-optimizer-studio/backend/venv/bin
ExecStart=/opt/skillmatch/resume-optimizer-studio/backend/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start and enable service
sudo systemctl daemon-reload
sudo systemctl enable skillmatch-backend
sudo systemctl start skillmatch-backend

# Install nginx
sudo apt install -y nginx

# Configure nginx
sudo tee /etc/nginx/sites-available/skillmatch-backend > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable nginx site
sudo ln -s /etc/nginx/sites-available/skillmatch-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Setup complete!"
echo "🌐 Backend running on: http://your-droplet-ip"
echo "📖 API docs: http://your-droplet-ip/docs"
echo "🔧 Check service: sudo systemctl status skillmatch-backend"
echo "📝 View logs: sudo journalctl -u skillmatch-backend -f"
