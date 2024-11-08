#!/bin/bash
REPO_URL="git@github.com:iranzithierry/cognova-frontend"
PORT=3020
LOG_FILE="deployment.log"

# Function for logging
log() {
    local message="[$(date +'%Y-%m-%d %H:%M:%S')] $1"
    echo "$message"
    echo "$message" >> "$LOG_FILE"
}

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        log "✓ $1 succeeded"
    else
        log "✗ $1 failed"
        exit 1
    fi
}

# Start deployment
log "Starting deployment..."

cd "$(dirname "$0")" || exit 1

if ! git config --get user.name > /dev/null; then
    log "Setting up git configuration..."
    git config --global user.name "iranzithierry"
    check_status "Git config setup"
fi

log "Pulling latest changes..."
git pull origin main
check_status "Git pull"

log "Installing dependencies..."
npm install
check_status "npm install"

log "Building application..."
npm run build
check_status "npm build"

log "Deleting current pm2 instance"
pm2 delete app
log "Starting new pm2 instance"
pm2 start ecosystem.config.js

log "Deployment completed successfully"