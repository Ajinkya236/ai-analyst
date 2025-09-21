# 🚀 AI Analyst - Full-Stack Investment Memo Application

A comprehensive full-stack application for generating AI-powered investment memos with integrated frontend, backend, and AI agents.

## ✨ Features

### 🎯 Core Functionality
- **Investment Memo Generation**: AI-powered generation of 25-section investment memos
- **Data Ingestion**: Auto-processing of documents, URLs, and text inputs
- **Deep Research**: Multi-layered web search and market analysis
- **Founder Voice**: Automated founder interviews and transcript analysis
- **Behavioral Assessment**: Psychometric testing and evaluation
- **PPT Export**: Professional PowerPoint file generation

### 🏗️ Architecture
- **Frontend**: Angular 17 with TypeScript
- **Backend**: Spring Boot with Java 17
- **AI Agents**: Python with LangGraph integration
- **Database**: H2/MySQL support
- **API**: RESTful APIs with comprehensive documentation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Python 3.9+
- Maven 3.6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd ai-analyst
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install AI Agents Dependencies**
   ```bash
   cd ai_agents
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

4. **Start All Services**
   ```bash
   ./start_fullstack_app.sh
   ```

### Manual Start

1. **Start AI Agents API (Port 8000)**
   ```bash
   cd ai_agents
   source venv/bin/activate
   python enhanced_api_server.py
   ```

2. **Start Angular Frontend (Port 4200)**
   ```bash
   ng serve --host 0.0.0.0 --port 4200
   ```

3. **Start Spring Boot Backend (Port 8080)**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

## 🌐 Access URLs

- **Frontend**: http://localhost:4200
- **AI Agents API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Spring Boot Backend**: http://localhost:8080

## 📊 AI Agents

### 🤖 Available Agents
1. **PPT Generator Agent**: Creates comprehensive investment memos
2. **Data Ingestion Agent**: Processes and stores data sources
3. **Deep Research Agent**: Conducts market research and analysis
4. **Founder Voice Agent**: Manages founder interviews
5. **Behavioral Assessment Agent**: Performs psychometric evaluations

### 🔧 API Endpoints
```
POST /ppt-generator/generate - Generate investment memo
GET  /ppt-generator/memos/{report_id} - List generated memos
DELETE /ppt-generator/memos/{memo_id} - Delete memo
POST /data-ingestion/process - Process data sources
POST /deep-research/execute - Execute deep research
POST /founder-voice/interview - Conduct founder interview
POST /behavioral-assessment/send - Send behavioral assessment
```

## 🎯 Application Stages

### Stage 0: Data Collection
- Upload documents (PDF, DOCX, PPT)
- Add URLs and YouTube links
- Paste text content
- Auto-ingestion into knowledge base
- Real-time processing status

### Stage 1: Investment Memo Generation
- AI-powered memo generation
- 25 comprehensive sections
- Confidence scoring
- Risk analysis
- PPT preview and download

### Stage 2: Curated Investment Memo
- Advanced analysis and curation
- Professional formatting
- Final review and approval

## 🛠️ Development

### Project Structure
```
ai-analyst/
├── src/                    # Angular frontend
├── backend/               # Spring Boot backend
├── ai_agents/            # Python AI agents
├── docs/                 # Documentation
├── cypress/              # E2E tests
└── docker-compose.yml    # Docker configuration
```

### Testing
```bash
# Frontend tests
npm test

# Backend tests
cd backend && mvn test

# AI Agents tests
cd ai_agents && python -m pytest

# E2E tests
npx cypress run
```

## 🐳 Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up --build
```

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs)
- [Frontend Components](docs/frontend/)
- [Backend Services](docs/backend/)
- [AI Agents](docs/ai-agents/)

## 🔧 Configuration

### Environment Variables
```bash
# Copy example environment file
cp env.example .env

# Edit configuration
nano .env
```

### AI Agents Configuration
- OpenAI API key for LLM integration
- Twilio credentials for SMS/voice
- Database connection settings
- Vector store configuration

## 🚀 Deployment

### Production Setup
1. Configure environment variables
2. Set up database (MySQL/PostgreSQL)
3. Configure AI service credentials
4. Deploy using Docker or cloud services

### Cloud Deployment
- **Frontend**: Vercel, Netlify, or AWS S3
- **Backend**: AWS ECS, Google Cloud Run, or Azure Container Instances
- **AI Agents**: AWS Lambda, Google Cloud Functions, or Azure Functions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation at http://localhost:8000/docs

## 🎉 Acknowledgments

- Built with Angular, Spring Boot, and Python
- AI powered by LangGraph and OpenAI
- UI components and styling
- Comprehensive testing framework

---

**Status**: ✅ **FULLY FUNCTIONAL** - All services running and tested
**Version**: 2.2.0
**Last Updated**: 2025-09-21