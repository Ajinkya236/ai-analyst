# AI Analyst - AI Agents

This directory contains the Python-based AI agents that power the AI Analyst platform's Stage 0 functionality. The agents are built using LangGraph and provide intelligent data processing, research, and analysis capabilities.

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- OpenAI API Key
- Node.js 18+ (for frontend integration)
- Java 11+ (for backend integration)
- Maven 3.6+ (for backend build)

### Installation

1. **Install Python dependencies:**
   ```bash
   cd ai_agents
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API keys
   ```

3. **Start the AI Agents server:**
   ```bash
   python start_agents.py
   ```

4. **Start the complete application:**
   ```bash
   # From the project root
   ./start_complete_app.sh
   ```

## 🤖 Available Agents

### 1. Data Ingestion Agent
**Purpose:** Processes and ingests various data sources using RAG/CAG/MCP techniques.

**Capabilities:**
- Document processing (PDF, DOCX, PPTX, TXT)
- Web content extraction
- Text processing and chunking
- Vector embedding generation
- Data normalization and structuring

**API Endpoints:**
- `POST /data-ingestion/process` - Process data sources
- `GET /agents/data-ingestion/status/{session_id}` - Get processing status

### 2. Deep Research Agent
**Purpose:** Conducts comprehensive web research across multiple sources.

**Capabilities:**
- Multi-source web search
- Data extraction and validation
- Market analysis and benchmarking
- SWOT analysis generation
- Risk assessment

**API Endpoints:**
- `POST /deep-research/execute` - Execute research
- `GET /agents/deep-research/status/{session_id}` - Get research status

### 3. Founder Voice Agent
**Purpose:** Conducts AI-powered voice interviews with startup founders.

**Capabilities:**
- Voice call initiation (via Twilio)
- Identity verification
- Structured interview process
- Real-time transcription
- Sentiment analysis
- Response analysis and scoring

**API Endpoints:**
- `POST /founder-voice/interview` - Conduct interview
- `GET /agents/founder-voice/status/{session_id}` - Get interview status

### 4. Behavioral Assessment Agent
**Purpose:** Sends and processes founder behavioral psychometric assessments.

**Capabilities:**
- Assessment generation
- SMS/Email delivery (via Twilio/SendGrid)
- Response processing
- Behavioral scoring
- Profile generation
- Investment recommendations

**API Endpoints:**
- `POST /behavioral-assessment/send` - Send assessment
- `GET /agents/behavioral-assessment/status/{session_id}` - Get assessment status

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `ai_agents` directory with the following variables:

```env
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
```

## 📡 API Usage

### Stage 0 Workflow

Execute the complete Stage 0 workflow:

```bash
curl -X POST http://localhost:8000/workflows/stage-0 \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session_123",
    "report_id": "report_456",
    "user_id": "user_789",
    "sources": [
      {
        "id": "source_1",
        "name": "pitch_deck.pdf",
        "type": "file",
        "file_path": "/path/to/pitch_deck.pdf"
      }
    ],
    "research_query": {
      "startup_name": "Example Startup",
      "sector": "Technology",
      "geography": "United States",
      "stage": "Series A",
      "custom_questions": ["What is the competitive landscape?"]
    },
    "founder": {
      "name": "John Doe",
      "phone_number": "+1234567890",
      "email": "john@example.com"
    }
  }'
```

### Individual Agent Execution

Execute a specific agent:

```bash
curl -X POST http://localhost:8000/agents/data-ingestion/execute \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session_123",
    "report_id": "report_456",
    "user_id": "user_789",
    "input_data": {
      "sources": [...]
    }
  }'
```

## 🏗️ Architecture

### LangGraph Workflows

Each agent uses LangGraph to create structured workflows:

1. **Data Ingestion Workflow:**
   - Validate sources → Process documents → Process links → Process text → Generate embeddings → Store data → Generate summary

2. **Deep Research Workflow:**
   - Analyze query → Generate search queries → Execute searches → Extract data → Validate data → Enrich data → Generate report

3. **Founder Voice Workflow:**
   - Initiate call → Verify identity → Conduct interview → Analyze responses → Generate report

4. **Behavioral Assessment Workflow:**
   - Validate founder → Generate assessment → Send assessment → Monitor completion → Process responses → Calculate scores → Generate report

### Integration Points

- **Frontend Integration:** Angular components call agent APIs via HTTP
- **Backend Integration:** Java backend can trigger agents via REST API
- **Database Integration:** Agents store results in PostgreSQL
- **Vector Store:** ChromaDB for document embeddings
- **External Services:** Twilio (voice/SMS), SendGrid (email), OpenAI (AI processing)

## 🔍 Monitoring and Logging

### Health Check

Check agent health:

```bash
curl http://localhost:8000/health
```

### Agent Status

Get status of all agents:

```bash
curl http://localhost:8000/agents
```

### Logs

Logs are written to:
- Console output
- `ai_agents.log` file
- Individual agent logs in `logs/` directory

## 🧪 Testing

### Unit Tests

Run individual agent tests:

```bash
python -m pytest tests/test_data_ingestion_agent.py
python -m pytest tests/test_deep_research_agent.py
python -m pytest tests/test_founder_voice_agent.py
python -m pytest tests/test_behavioral_assessment_agent.py
```

### Integration Tests

Test complete workflows:

```bash
python -m pytest tests/test_workflows.py
```

## 🚀 Deployment

### Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t ai-analyst-agents .

# Run container
docker run -p 8000:8000 --env-file .env ai-analyst-agents
```

### Production Considerations

1. **Environment Variables:** Use secure secret management
2. **Database:** Use production PostgreSQL instance
3. **Redis:** Use production Redis instance
4. **Monitoring:** Implement proper logging and monitoring
5. **Scaling:** Use load balancers for multiple agent instances
6. **Security:** Implement proper authentication and authorization

## 📚 Development

### Adding New Agents

1. Create agent class extending `BaseAIAgent`
2. Implement `_build_graph()` method with LangGraph workflow
3. Implement `_execute()` method with main logic
4. Add agent to `AgentOrchestrator`
5. Add API endpoints in `api_server.py`
6. Update frontend integration

### Code Structure

```
ai_agents/
├── base_agent.py              # Base agent class
├── data_ingestion_agent.py    # Data ingestion agent
├── deep_research_agent.py     # Deep research agent
├── founder_voice_agent.py     # Founder voice agent
├── behavioral_assessment_agent.py # Behavioral assessment agent
├── agent_orchestrator.py      # Agent orchestration
├── api_server.py              # FastAPI server
├── config.py                  # Configuration
├── start_agents.py            # Startup script
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note:** This is a production-ready implementation of AI agents for the AI Analyst platform. The agents are designed to be scalable, maintainable, and easily extensible for future requirements.
