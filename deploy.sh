#!/bin/bash

# SkillMatch AI - DigitalOcean Deployment Script
# This script helps prepare and deploy your application

set -e

echo "🚀 SkillMatch AI - DigitalOcean Deployment Helper"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f ".do/app.yaml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Project structure verified"

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Please commit them first."
    git status --short
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Git status checked"

# Build and test locally (optional)
echo "🔧 Building application locally for testing..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed. Please fix errors before deploying."
    exit 1
fi

# Check if doctl is installed
if command -v doctl &> /dev/null; then
    echo "✅ DigitalOcean CLI (doctl) is installed"
    
    # Check authentication
    if doctl auth list | grep -q "current"; then
        echo "✅ DigitalOcean authentication verified"
        
        read -p "🚀 Deploy to DigitalOcean App Platform? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "🚀 Creating DigitalOcean App..."
            doctl apps create --spec .do/app.yaml
            echo "✅ Deployment initiated! Check the DigitalOcean dashboard for progress."
        fi
    else
        echo "⚠️  DigitalOcean CLI not authenticated. Run: doctl auth init"
    fi
else
    echo "⚠️  DigitalOcean CLI not installed. Install with: brew install doctl"
    echo "📖 Or deploy manually via the DigitalOcean dashboard"
fi

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check deployment status in DigitalOcean dashboard"
echo "2. Configure custom domain (optional)"
echo "3. Set up monitoring and alerts"
echo "4. Test the live application"
echo ""
echo "🌐 Your app will be available at:"
echo "   https://skillmatch-ai-[random].ondigitalocean.app"
