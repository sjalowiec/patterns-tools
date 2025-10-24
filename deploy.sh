#!/bin/bash

echo "🚀 Starting deployment process..."

# Build the project
echo "📦 Building wizards..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful!"

# Add all changes
echo "📝 Adding changes to git..."
git add .

# Create commit with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
git commit -m "Deploy: Updated wizards - $TIMESTAMP" || echo "No changes to commit"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main || git push origin master

if [ $? -eq 0 ]; then
  echo "✅ Successfully deployed to GitHub!"
  echo "🌐 Netlify will automatically update your site"
else
  echo "❌ Push failed. Please check your GitHub connection."
  exit 1
fi
