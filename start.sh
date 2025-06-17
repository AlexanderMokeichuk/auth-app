#!/bin/bash

# Auth App Startup Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the root auth-app directory"
    exit 1
fi

# Function to setup dependencies
setup() {
    print_status "Setting up project dependencies..."

    # Frontend dependencies
    if [ -d "frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        bun install
        cd ..
        print_success "Frontend dependencies installed"
    fi

    # Backend dependencies
    if [ -d "backend" ]; then
        print_status "Setting up backend dependencies..."
        cd backend
        go mod tidy
        cd ..
        print_success "Backend dependencies ready"
    fi
}

# Function to start the application
start_app() {
    print_status "Starting Auth App..."

    # Check if setup is needed
    if [ ! -d "frontend/node_modules" ]; then
        print_warning "Frontend dependencies not found. Running setup..."
        setup
    fi

    # Check for environment file
    if [ ! -f "frontend/.env" ]; then
        print_warning "Creating frontend .env file..."
        cat > frontend/.env << 'EOF'
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Auth App
VITE_APP_VERSION=1.0.0

# Auth Configuration
VITE_TOKEN_KEY=auth_token
VITE_AUTO_LOGOUT_ON_401=true

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=info
EOF
        print_success "Created frontend/.env file"
    fi

    print_status "Starting backend and frontend servers..."
    print_status "Backend will be available at: http://localhost:5000"
    print_status "Frontend will be available at: http://localhost:5173"
    print_status ""
    print_status "Press Ctrl+C to stop both servers"
    print_status ""

    # Start backend in background
    cd backend
    go run main.go &
    BACKEND_PID=$!
    cd ..

    # Wait a moment for backend to start
    sleep 2

    # Start frontend in background
    cd frontend
    bun run dev &
    FRONTEND_PID=$!
    cd ..

    # Wait for Ctrl+C
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
}

# Main script logic
case "${1:-start}" in
    "setup"|"-s"|"--setup")
        setup
        ;;
    "start"|"-d"|"--dev"|"")
        start_app
        ;;
    "help"|"-h"|"--help")
        echo "Auth App Startup Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start, --dev, -d    Start the application (default)"
        echo "  setup, --setup, -s  Setup dependencies"
        echo "  help, --help, -h    Show this help"
        echo ""
        echo "Examples:"
        echo "  $0                  # Start the app"
        echo "  $0 setup           # Setup dependencies"
        ;;
    *)
        print_error "Unknown command: $1"
        print_status "Use '$0 help' for available commands"
        exit 1
        ;;
esac