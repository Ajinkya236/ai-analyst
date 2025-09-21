# AI Analyst - VC Investment Memo App - Project Brief

## Project Overview / Description

AI Analyst is a comprehensive Angular application designed for venture capital analysts and investors to collect, synthesize, and evaluate startup data efficiently using AI agents. The app automates data ingestion, research, analysis, and memo generation while keeping users in control of preferences, scoring, and prioritization.

The application follows a three-stage workflow:
- **Stage 0**: Data Collection - Upload sources, trigger AI agents, collect founder voice and behavioral assessments
- **Stage 1**: AI-Generated Investment Memo - AI synthesizes data into structured investment memos
- **Stage 2**: Curated Investment Memo - Final curated memo with customizable preferences and visual summaries

## Target Audience

- **Primary**: VC Analysts and Associates who collect data, trigger AI workflows, and review generated memos
- **Secondary**: Principals and Partners who review curated memos and insights for Investment Committee decisions
- **Tertiary**: Admins who configure system defaults, behavioral assessments, and AI agent parameters

## Primary Benefits / Features

### Core Value Propositions
- **Time Savings**: Automates 70% of manual research and memo creation effort
- **Consistency**: Standardized analysis format across all investment evaluations
- **Scalability**: Handle multiple startup evaluations simultaneously
- **Quality**: AI-powered insights with confidence scoring and risk flag analysis
- **Control**: User maintains full control over preferences, scoring, and prioritization

### Key Features
1. **Multi-Source Data Collection**: File uploads, URLs, text input, founder voice calls, behavioral assessments
2. **AI Agent Orchestration**: Automated founder interviews, deep research, data ingestion, memo generation
3. **Structured Memo Generation**: AI creates comprehensive investment memos with confidence scoring
4. **Customizable Preferences**: Adjustable section weights and priorities for personalized analysis
5. **Visual Summaries**: Charts, graphs, and risk analysis for quick insights
6. **Report Management**: Comprehensive report history, search, and organization

## High-Level Tech/Architecture

### Frontend Stack
- **Framework**: Angular 17 with standalone components
- **Language**: TypeScript with strict mode
- **Styling**: Modern CSS with CSS Variables and glassmorphic design
- **State Management**: RxJS Observables and BehaviorSubjects
- **Testing**: Jest for unit tests, Cypress for e2e tests

### Backend Stack (Planned)
- **Primary Language**: Java with Spring Boot
- **Database**: MySQL for structured data
- **Caching**: Redis for AI outputs and session data
- **Message Queue**: Kafka/RabbitMQ for event-driven workflows
- **Search**: Elasticsearch for full-text search
- **Storage**: MinIO/S3 for documents and media

### AI Stack (Planned)
- **Orchestration**: LangGraph for multi-agent workflows
- **Models**: Open-source LLMs (GPT, LLaMA, MPT)
- **Processing**: MCP (Multi-Channel Processing) for data ingestion
- **RAG**: Retrieval-Augmented Generation for memo summarization
- **Vector DB**: FAISS, Milvus, or Weaviate for embedding-based search

### Design System
- **Theme**: Dark glassmorphic design with gradient backgrounds
- **Colors**: Blue/white/off-white palette with glassmorphic elements
- **Typography**: Inter font family with clear hierarchy
- **Components**: Consistent card-based layout with hover effects
- **Responsive**: Mobile-first design with progressive enhancement

This project aims to revolutionize how VC analysts evaluate startups by combining AI automation with human expertise, resulting in faster, more consistent, and higher-quality investment analysis.
