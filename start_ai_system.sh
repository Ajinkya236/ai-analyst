#!/bin/bash

# AI Analyst System Startup Script
# This script starts both the Python AI agents service and the Spring Boot backend

echo "🚀 Starting AI Analyst System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${RED}Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}Port $1 is available${NC}"
        return 0
    fi
}

# Function to start Python AI agents service
start_ai_agents() {
    echo -e "${BLUE}Starting Python AI Agents Service...${NC}"
    
    cd /Users/ajinkya4.patil/documents/ai_models/ai_agents
    
    # Check if port 8001 is available
    if ! check_port 8001; then
        echo -e "${YELLOW}Port 8001 is in use. Trying to kill existing process...${NC}"
        lsof -ti:8001 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Start the AI agents service
    python main.py &
    AI_AGENTS_PID=$!
    
    # Wait for service to start
    echo -e "${YELLOW}Waiting for AI Agents service to start...${NC}"
    sleep 10
    
    # Check if service is running
    if curl -s http://localhost:8001/health > /dev/null; then
        echo -e "${GREEN}✅ AI Agents service started successfully on port 8001${NC}"
        echo $AI_AGENTS_PID > ai_agents.pid
    else
        echo -e "${RED}❌ Failed to start AI Agents service${NC}"
        exit 1
    fi
}

# Function to start Spring Boot backend
start_backend() {
    echo -e "${BLUE}Starting Spring Boot Backend...${NC}"
    
    cd /Users/ajinkya4.patil/Documents/AI\ Analyst/backend
    
    # Check if port 8080 is available
    if ! check_port 8080; then
        echo -e "${YELLOW}Port 8080 is in use. Trying to kill existing process...${NC}"
        lsof -ti:8080 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Start the Spring Boot application
    mvn spring-boot:run &
    BACKEND_PID=$!
    
    # Wait for service to start
    echo -e "${YELLOW}Waiting for Spring Boot backend to start...${NC}"
    sleep 30
    
    # Check if service is running
    if curl -s http://localhost:8080/api/health > /dev/null; then
        echo -e "${GREEN}✅ Spring Boot backend started successfully on port 8080${NC}"
        echo $BACKEND_PID > backend.pid
    else
        echo -e "${RED}❌ Failed to start Spring Boot backend${NC}"
        exit 1
    fi
}

# Function to start Angular frontend
start_frontend() {
    echo -e "${BLUE}Starting Angular Frontend...${NC}"
    
    cd /Users/ajinkya4.patil/Documents/AI\ Analyst
    
    # Check if port 4200 is available
    if ! check_port 4200; then
        echo -e "${YELLOW}Port 4200 is in use. Trying to kill existing process...${NC}"
        lsof -ti:4200 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    # Start the Angular application
    npm start &
    FRONTEND_PID=$!
    
    # Wait for service to start
    echo -e "${YELLOW}Waiting for Angular frontend to start...${NC}"
    sleep 15
    
    # Check if service is running
    if curl -s http://localhost:4200 > /dev/null; then
        echo -e "${GREEN}✅ Angular frontend started successfully on port 4200${NC}"
        echo $FRONTEND_PID > frontend.pid
    else
        echo -e "${RED}❌ Failed to start Angular frontend${NC}"
        exit 1
    fi
}

# Function to stop all services
stop_services() {
    echo -e "${YELLOW}Stopping all services...${NC}"
    
    # Stop AI agents service
    if [ -f /Users/ajinkya4.patil/documents/ai_models/ai_agents/ai_agents.pid ]; then
        AI_PID=$(cat /Users/ajinkya4.patil/documents/ai_models/ai_agents/ai_agents.pid)
        kill $AI_PID 2>/dev/null || true
        rm -f /Users/ajinkya4.patil/documents/ai_models/ai_agents/ai_agents.pid
        echo -e "${GREEN}✅ AI Agents service stopped${NC}"
    fi
    
    # Stop backend
    if [ -f /Users/ajinkya4.patil/Documents/AI\ Analyst/backend/backend.pid ]; then
        BACKEND_PID=$(cat /Users/ajinkya4.patil/Documents/AI\ Analyst/backend/backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm -f /Users/ajinkya4.patil/Documents/AI\ Analyst/backend/backend.pid
        echo -e "${GREEN}✅ Backend stopped${NC}"
    fi
    
    # Stop frontend
    if [ -f /Users/ajinkya4.patil/Documents/AI\ Analyst/frontend.pid ]; then
        FRONTEND_PID=$(cat /Users/ajinkya4.patil/Documents/AI\ Analyst/frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm -f /Users/ajinkya4.patil/Documents/AI\ Analyst/frontend.pid
        echo -e "${GREEN}✅ Frontend stopped${NC}"
    fi
}

# Function to show status
show_status() {
    echo -e "${BLUE}System Status:${NC}"
    
    # Check AI agents service
    if curl -s http://localhost:8001/health > /dev/null; then
        echo -e "${GREEN}✅ AI Agents Service: Running (port 8001)${NC}"
    else
        echo -e "${RED}❌ AI Agents Service: Not running${NC}"
    fi
    
    # Check backend
    if curl -s http://localhost:8080/api/health > /dev/null; then
        echo -e "${GREEN}✅ Backend: Running (port 8080)${NC}"
    else
        echo -e "${RED}❌ Backend: Not running${NC}"
    fi
    
    # Check frontend
    if curl -s http://localhost:4200 > /dev/null; then
        echo -e "${GREEN}✅ Frontend: Running (port 4200)${NC}"
    else
        echo -e "${RED}❌ Frontend: Not running${NC}"
    fi
}

# Main script logic
case "$1" in
    start)
        start_ai_agents
        start_backend
        start_frontend
        echo -e "${GREEN}🎉 AI Analyst System started successfully!${NC}"
        echo -e "${BLUE}Access the application at: http://localhost:4200${NC}"
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 5
        start_ai_agents
        start_backend
        start_frontend
        echo -e "${GREEN}🎉 AI Analyst System restarted successfully!${NC}"
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Start all services (AI agents, backend, frontend)"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  status  - Show status of all services"
        exit 1
        ;;
esac
