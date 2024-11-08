#!/bin/bash

# Default configuration
PORT=3020
INSTALL=true
LOG_FILE="deployment.log"
BRANCH="main"

# Function to show usage
show_usage() {
    echo "Usage: ./deploy.sh [OPTIONS]"
    echo "Options:"
    echo "  --port=NUMBER        Port to run the application (default: 3020)"
    echo "  --install=BOOLEAN    Whether to run npm install (default: true)"
    echo "  --branch=STRING      Git branch to pull from (default: main)"
    echo "  --help              Show this help message"
    echo
    echo "Example:"
    echo "  ./deploy.sh --port=3030 --install=false --branch=develop"
    exit 1
}

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --port=*)
        PORT="${arg#*=}"
        ;;
        --install=*)
        INSTALL="${arg#*=}"
        ;;
        --branch=*)
        BRANCH="${arg#*=}"
        ;;
        --help)
        show_usage
        ;;
        *)
        echo "Unknown parameter: $arg"
        show_usage
        ;;
    esac
done

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
log "Starting deployment with settings:"
log "- Port: $PORT"
log "- Install dependencies: $INSTALL"
log "- Branch: $BRANCH"

# Ensure we're in the right directory
cd "$(dirname "$0")" || exit 1

# Check if git is configured
if ! git config --get user.name > /dev/null; then
    log "Setting up git configuration..."
    git config --global user.name "Troy"  # Replace with your git username
    check_status "Git config setup"
fi

# Pull latest changes
log "Pulling latest changes from branch $BRANCH..."
git pull origin "$BRANCH"
check_status "Git pull"

# Install dependencies if INSTALL is true
if [ "$INSTALL" = "true" ]; then
    log "Installing dependencies..."
    npm install
    check_status "npm install"
else
    log "Skipping npm install as per configuration"
fi

# Build the application
log "Building application..."
npm run build
check_status "npm build"

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    log "Port $PORT is already in use. Stopping existing process..."
    kill $(lsof -t -i:$PORT) || true
    sleep 2
fi

# Start the application
log "Starting application on port $PORT..."
npx next start --port $PORT >> "$LOG_FILE" 2>&1 &

# Check if application started successfully
sleep 5
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    log "Application successfully started on port $PORT"
else
    log "Failed to start application"
    exit 1
fi

log "Deployment completed successfully"