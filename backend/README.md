# AI Analyst Backend

Backend services for the AI Analyst VC Investment Memo App. Built with Spring Boot and designed to support comprehensive data collection, AI agent orchestration, and investment memo generation.

## 🚀 Features

### Core Services
- **Data Source Management**: File uploads, text input, URL processing, AI agent data collection
- **AI Agent Orchestration**: Founder voice, behavioral assessment, deep research, data ingestion, curated memo generation
- **Investment Memo Generation**: Stage 1 (AI-generated) and Stage 2 (curated) memo creation
- **File Processing**: Document parsing, content extraction, and structured data generation
- **Real-time Updates**: WebSocket support for live status updates and notifications

### AI Agents
- **Founder Voice Agent**: Conducts structured interviews with founders via phone calls
- **Behavioral Assessment Agent**: Sends and processes psychometric surveys via SMS/email
- **Deep Research Agent**: Searches public and paid sources for comprehensive market data
- **Data Ingestion Agent**: Processes and normalizes uploaded data using RAG, CAG, and MCP
- **Curated Memo Agent**: Generates final curated investment memos with customizable preferences

### Data Processing
- **File Upload Support**: PDF, DOCX, PPT, MP4, MP3, and text files
- **Content Extraction**: Apache Tika integration for multi-format content extraction
- **AI-Powered Analysis**: OpenAI integration for text generation and analysis
- **Vector Storage**: FAISS/Milvus integration for RAG operations
- **Real-time Processing**: Asynchronous processing with progress tracking

## 🛠️ Technology Stack

### Backend Framework
- **Spring Boot 3.2.0**: Main application framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database operations
- **Spring WebSocket**: Real-time communication
- **Spring AI**: AI model integration

### Database
- **MySQL 8.0**: Primary database for structured data
- **Redis**: Caching and session storage
- **Vector Database**: FAISS/Milvus for embeddings and similarity search

### AI & ML
- **OpenAI GPT-4**: Text generation and analysis
- **Apache Tika**: Document content extraction
- **LangGraph**: Multi-agent orchestration
- **RAG/CAG/MCP**: Advanced data processing

### File Processing
- **Apache POI**: PowerPoint generation
- **Apache Tika**: Content extraction
- **Local Storage**: File upload and management

## 📦 Installation

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- Redis 6.0+

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd ai-analyst-backend

# Install dependencies
mvn clean install

# Configure environment variables
cp src/main/resources/application.yml.example src/main/resources/application.yml
# Edit application.yml with your configuration

# Start the application
mvn spring-boot:run
```

### Environment Variables
```bash
# Database
DB_USERNAME=ai_analyst
DB_PASSWORD=ai_analyst123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Twilio (for phone calls and SMS)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Email
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password

# Storage
STORAGE_PATH=./uploads
```

## 🚀 API Endpoints

### Data Sources
- `GET /api/data-sources` - Get all data sources
- `POST /api/data-sources/upload` - Upload file
- `POST /api/data-sources/text` - Add text source
- `POST /api/data-sources/url` - Add URL source
- `PUT /api/data-sources/{id}` - Update data source
- `DELETE /api/data-sources/{id}` - Delete data source
- `GET /api/data-sources/search` - Search data sources

### AI Agents
- `GET /api/ai-agents` - Get all AI agents
- `POST /api/ai-agents/{id}/trigger` - Trigger agent execution
- `POST /api/ai-agents/{id}/stop` - Stop agent execution
- `GET /api/ai-agents/{id}/executions` - Get execution history
- `GET /api/ai-agents/{id}/metrics` - Get agent metrics

### Investment Memos
- `GET /api/investment-memos` - Get all memos
- `POST /api/investment-memos/generate/stage-1` - Generate Stage 1 memo
- `POST /api/investment-memos/generate/stage-2` - Generate Stage 2 memo
- `GET /api/investment-memos/{id}/download/pdf` - Download as PDF
- `GET /api/investment-memos/{id}/download/ppt` - Download as PPT

### WebSocket
- `ws://localhost:8080/ws` - WebSocket endpoint for real-time updates

## 🏗️ Architecture

### Service Layer
- **DataSourceService**: Manages data source operations
- **AIAgentService**: Orchestrates AI agent execution
- **InvestmentMemoService**: Handles memo generation and management
- **FileStorageService**: Manages file uploads and storage
- **FileProcessingService**: Extracts content from various file types

### AI Agent Services
- **FounderVoiceAgentService**: Phone call interviews
- **BehavioralAssessmentAgentService**: Psychometric surveys
- **DeepResearchAgentService**: Market research
- **DataIngestionAgentService**: Data processing
- **CuratedMemoAgentService**: Memo generation

### Supporting Services
- **AIService**: AI model integration
- **TwilioService**: Phone and SMS communication
- **EmailService**: Email notifications
- **WebScrapingService**: Web content extraction
- **VectorStoreService**: Vector database operations

## 🔧 Configuration

### Application Properties
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ai_analyst
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  
  data:
    redis:
      host: ${REDIS_HOST}
      port: ${REDIS_PORT}

ai:
  openai:
    api-key: ${OPENAI_API_KEY}
    chat:
      options:
        model: gpt-4
        temperature: 0.7
```

### Security Configuration
- CORS enabled for frontend integration
- Stateless session management
- API key authentication for AI services
- File upload size limits and validation

## 📊 Monitoring

### Health Checks
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed health status
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

### Metrics
- Spring Boot Actuator endpoints
- Prometheus metrics integration
- Custom business metrics
- Performance monitoring

## 🧪 Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Run with coverage
mvn jacoco:report
```

## 🚀 Deployment

### Docker
```bash
# Build Docker image
docker build -t ai-analyst-backend .

# Run container
docker run -p 8080:8080 ai-analyst-backend
```

### Production Considerations
- Database connection pooling
- Redis clustering
- File storage (S3/MinIO)
- Load balancing
- Monitoring and logging
- Security hardening

## 📝 API Documentation

The API follows RESTful conventions and returns JSON responses. All endpoints require a `X-User-ID` header for user identification.

### Response Format
```json
{
  "id": "uuid",
  "name": "string",
  "status": "enum",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Error Format
```json
{
  "timestamp": "datetime",
  "status": "number",
  "error": "string",
  "message": "string",
  "path": "string"
}
```

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
- Create an issue in the GitHub repository
- Contact the development team
- Check the API documentation

---

**Built with ❤️ by the AI Analyst Team**
