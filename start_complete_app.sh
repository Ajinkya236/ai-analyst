#!/bin/bash

# AI Analyst Complete Application Startup Script
echo "Starting AI Analyst Complete Application..."

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Java
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install Java first."
        exit 1
    fi
    
    # Check Maven
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed. Please install Maven first."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3 first."
        exit 1
    fi
    
    print_success "All requirements are met!"
}

# Install Python dependencies
install_python_deps() {
    print_status "Installing Python dependencies for AI agents..."
    
    cd ai_agents
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt not found in ai_agents directory"
        exit 1
    fi
    
    pip3 install -r requirements.txt
    if [ $? -eq 0 ]; then
        print_success "Python dependencies installed successfully!"
    else
        print_error "Failed to install Python dependencies"
        exit 1
    fi
    cd ..
}

# Install Node.js dependencies
install_node_deps() {
    print_status "Installing Node.js dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        exit 1
    fi
    
    npm install
    if [ $? -eq 0 ]; then
        print_success "Node.js dependencies installed successfully!"
    else
        print_error "Failed to install Node.js dependencies"
        exit 1
    fi
}

# Install Java dependencies
install_java_deps() {
    print_status "Installing Java dependencies..."
    
    cd backend
    if [ ! -f "pom.xml" ]; then
        print_error "pom.xml not found in backend directory"
        exit 1
    fi
    
    mvn clean install -DskipTests
    if [ $? -eq 0 ]; then
        print_success "Java dependencies installed successfully!"
    else
        print_error "Failed to install Java dependencies"
        exit 1
    fi
    cd ..
}

# Start AI Agents server
start_ai_agents() {
    print_status "Starting AI Agents server..."
    
    cd ai_agents
    python3 start_agents.py &
    AI_AGENTS_PID=$!
    echo $AI_AGENTS_PID > ../ai_agents.pid
    
    # Wait a moment for the server to start
    sleep 5
    
    # Check if the server is running
    if curl -s http://localhost:8000/health > /dev/null; then
        print_success "AI Agents server started successfully on port 8000!"
    else
        print_warning "AI Agents server may not be ready yet. Continuing..."
    fi
    cd ..
}

# Start Backend server
start_backend() {
    print_status "Starting Backend server..."
    
    cd backend
    mvn spring-boot:run &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    # Wait a moment for the server to start
    sleep 10
    
    # Check if the server is running
    if curl -s http://localhost:8080/actuator/health > /dev/null; then
        print_success "Backend server started successfully on port 8080!"
    else
        print_warning "Backend server may not be ready yet. Continuing..."
    fi
    cd ..
}

# Start Frontend
start_frontend() {
    print_status "Starting Frontend application..."
    
    npm start &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > frontend.pid
    
    # Wait a moment for the server to start
    sleep 15
    
    print_success "Frontend application started successfully on port 4200!"
}

# Create environment file if it doesn't exist
create_env_file() {
    if [ ! -f "ai_agents/.env" ]; then
        print_status "Creating environment file for AI agents..."
        cat > ai_agents/.env << EOF
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ai_analyst

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Twilio Configuration (for voice calls and SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# SendGrid Configuration (for emails)
SENDGRID_API_KEY=your_sendgrid_api_key

# Backend API Configuration
BACKEND_API_URL=http://localhost:8080/api

# Agent Configuration
AGENT_TIMEOUT=3600
MAX_RETRY_ATTEMPTS=3
CONFIDENCE_THRESHOLD=0.7

# File Processing Configuration
MAX_FILE_SIZE_MB=100
SUPPORTED_FILE_TYPES=pdf,docx,pptx,txt,mp3,mp4,wav
UPLOAD_DIRECTORY=./uploads

# Search Configuration
SEARCH_RESULTS_LIMIT=30
SEARCH_TIMEOUT=300
EOF
        print_warning "Please update the .env file in ai_agents directory with your actual API keys!"
    fi
}

# Cleanup function
cleanup() {
    print_status "Shutting down all services..."
    
    # Kill AI Agents server
    if [ -f "ai_agents.pid" ]; then
        kill $(cat ai_agents.pid) 2>/dev/null
        rm ai_agents.pid
    fi
    
    # Kill Backend server
    if [ -f "backend.pid" ]; then
        kill $(cat backend.pid) 2>/dev/null
        rm backend.pid
    fi
    
    # Kill Frontend
    if [ -f "frontend.pid" ]; then
        kill $(cat frontend.pid) 2>/dev/null
        rm frontend.pid
    fi
    
    print_success "All services stopped!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    print_status "AI Analyst Complete Application Startup"
    print_status "========================================"
    
    # Check requirements
    check_requirements
    
    # Create environment file
    create_env_file
    
    # Install dependencies
    install_python_deps
    install_node_deps
    install_java_deps
    
    # Start services
    start_ai_agents
    start_backend
    start_frontend
    
    print_success "All services started successfully!"
    print_status "========================================"
    print_status "Frontend: http://localhost:4200"
    print_status "Backend API: http://localhost:8080"
    print_status "AI Agents API: http://localhost:8000"
    print_status "========================================"
    print_status "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    wait
}

# Run main function
main
