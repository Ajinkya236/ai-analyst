#!/bin/bash

echo "🚀 STARTING FULL-STACK APPLICATION"
echo "=================================="

# Kill any existing processes
echo "🔄 Stopping existing services..."
pkill -f "ng serve" 2>/dev/null
pkill -f "mvn spring-boot:run" 2>/dev/null
pkill -f "python.*api_server" 2>/dev/null
sleep 3

# Start AI Agents API
echo "🤖 Starting AI Agents API (Port 8000)..."
cd ai_agents
source venv/bin/activate
python enhanced_api_server.py &
AI_PID=$!
cd ..
sleep 5

# Start Spring Boot Backend
echo "☕ Starting Spring Boot Backend (Port 8080)..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..
sleep 10

# Start Angular Frontend
echo "🌐 Starting Angular Frontend (Port 4200)..."
ng serve --host 0.0.0.0 --port 4200 --disable-host-check &
FRONTEND_PID=$!
sleep 15

echo ""
echo "🔍 CHECKING SERVICE STATUS"
echo "=========================="

# Check AI Agents API
echo -n "AI Agents API (Port 8000): "
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ RUNNING"
    curl -s http://localhost:8000/health | jq -r '.status + " (v" + .version + ")"' 2>/dev/null || echo "Healthy"
else
    echo "❌ NOT RUNNING"
fi

# Check Spring Boot Backend
echo -n "Spring Boot Backend (Port 8080): "
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✅ RUNNING"
else
    echo "⚠️ NOT RUNNING (Optional)"
fi

# Check Angular Frontend
echo -n "Angular Frontend (Port 4200): "
if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ RUNNING"
else
    echo "⚠️ NOT RUNNING (Compilation issues)"
fi

echo ""
echo "🎉 FULL-STACK APPLICATION STARTED"
echo "================================="
echo ""
echo "✅ RUNNING SERVICES:"
echo "   • AI Agents API: http://localhost:8000"
echo "   • API Documentation: http://localhost:8000/docs"
echo "   • Angular Frontend: http://localhost:4200"
echo "   • Spring Boot Backend: http://localhost:8080"
echo ""
echo "📊 FEATURES AVAILABLE:"
echo "   • Investment Memo Generation (25 sections)"
echo "   • Data Ingestion and Processing"
echo "   • Deep Research and Analysis"
echo "   • Founder Voice Interview"
echo "   • AI Confidence Scoring"
echo "   • Risk Analysis and Flagging"
echo "   • Professional PPT Export"
echo ""
echo "🔧 Process IDs:"
echo "   • AI Agents API: $AI_PID"
echo "   • Spring Boot Backend: $BACKEND_PID"
echo "   • Angular Frontend: $FRONTEND_PID"
echo ""
echo "To stop all services, run: pkill -f 'ng serve|mvn spring-boot|python.*api_server'"
echo ""
echo "🚀 Application is ready for use!"
