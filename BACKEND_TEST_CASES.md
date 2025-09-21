# Backend Test Cases

## Test Coverage Overview
This document outlines comprehensive test cases for all backend services, controllers, and AI agents based on the PRD requirements.

## 1. Health Check Tests

### 1.1 Health Endpoints
- [ ] GET /api/health returns 200 OK
- [ ] GET /api/actuator/health returns 200 OK
- [ ] Health check includes database status
- [ ] Health check includes Redis status
- [ ] Health check includes AI service status

### 1.2 Readiness Checks
- [ ] Readiness endpoint returns correct status
- [ ] Database connectivity is verified
- [ ] Redis connectivity is verified
- [ ] AI service connectivity is verified

## 2. Data Source Controller Tests

### 2.1 Create Data Source
- [ ] POST /api/data-sources creates data source
- [ ] Request validation works correctly
- [ ] File upload handling works
- [ ] Metadata extraction works
- [ ] Returns correct response format
- [ ] Error handling for invalid files

### 2.2 Get Data Sources
- [ ] GET /api/data-sources returns list
- [ ] Pagination works correctly
- [ ] Filtering by user works
- [ ] Sorting works correctly
- [ ] Empty list returns correctly

### 2.3 Update Data Source
- [ ] PUT /api/data-sources/:id updates correctly
- [ ] Validation works for updates
- [ ] Returns updated data source
- [ ] Error handling for non-existent ID

### 2.4 Delete Data Source
- [ ] DELETE /api/data-sources/:id deletes correctly
- [ ] Returns 204 No Content
- [ ] Error handling for non-existent ID
- [ ] Cascading deletes work

## 3. Investment Memo Controller Tests

### 3.1 Create Investment Memo
- [ ] POST /api/investment-memos creates memo
- [ ] Request validation works
- [ ] AI generation is triggered
- [ ] Returns correct response format
- [ ] Error handling for invalid data

### 3.2 Get Investment Memos
- [ ] GET /api/investment-memos returns list
- [ ] Pagination works correctly
- [ ] Search functionality works
- [ ] Filtering by status works
- [ ] Sorting works correctly

### 3.3 Get Investment Memo by ID
- [ ] GET /api/investment-memos/:id returns memo
- [ ] Error handling for non-existent ID
- [ ] Returns complete memo data
- [ ] Includes all sections and subsections

### 3.4 Update Investment Memo
- [ ] PUT /api/investment-memos/:id updates correctly
- [ ] Validation works for updates
- [ ] Returns updated memo
- [ ] Error handling for non-existent ID

### 3.5 Delete Investment Memo
- [ ] DELETE /api/investment-memos/:id deletes correctly
- [ ] Returns 204 No Content
- [ ] Error handling for non-existent ID

## 4. AI Agent Controller Tests

### 4.1 Get AI Agents
- [ ] GET /api/ai-agents returns list
- [ ] Pagination works correctly
- [ ] Filtering by type works
- [ ] Returns agent configuration

### 4.2 Create AI Agent
- [ ] POST /api/ai-agents creates agent
- [ ] Request validation works
- [ ] Returns created agent
- [ ] Error handling for invalid data

### 4.3 Update AI Agent
- [ ] PUT /api/ai-agents/:id updates correctly
- [ ] Validation works for updates
- [ ] Returns updated agent
- [ ] Error handling for non-existent ID

### 4.4 Delete AI Agent
- [ ] DELETE /api/ai-agents/:id deletes correctly
- [ ] Returns 204 No Content
- [ ] Error handling for non-existent ID

### 4.5 Trigger AI Agent
- [ ] POST /api/ai-agents/:id/trigger starts execution
- [ ] Returns execution ID
- [ ] Error handling for invalid agent
- [ ] Error handling for already running agent

### 4.6 Stop AI Agent
- [ ] POST /api/ai-agents/:id/stop stops execution
- [ ] Returns success status
- [ ] Error handling for non-running agent

### 4.7 Get Agent History
- [ ] GET /api/ai-agents/:id/history returns executions
- [ ] Pagination works correctly
- [ ] Filtering by status works
- [ ] Returns execution details

### 4.8 Get Agent Metrics
- [ ] GET /api/ai-agents/:id/metrics returns metrics
- [ ] Returns performance data
- [ ] Error handling for non-existent agent

## 5. Data Source Service Tests

### 5.1 Create Data Source
- [ ] Creates data source entity
- [ ] Extracts metadata correctly
- [ ] Handles file processing
- [ ] Saves to database
- [ ] Returns DTO

### 5.2 Process File
- [ ] Handles different file types
- [ ] Extracts text content
- [ ] Extracts metadata
- [ ] Error handling for unsupported formats
- [ ] Error handling for corrupted files

### 5.3 Get Data Sources
- [ ] Retrieves from database
- [ ] Applies pagination
- [ ] Applies filtering
- [ ] Applies sorting
- [ ] Returns DTOs

### 5.4 Update Data Source
- [ ] Updates entity in database
- [ ] Validates input
- [ ] Returns updated DTO
- [ ] Error handling for non-existent entity

### 5.5 Delete Data Source
- [ ] Deletes from database
- [ ] Handles cascading deletes
- [ ] Error handling for non-existent entity

## 6. Investment Memo Service Tests

### 6.1 Create Investment Memo
- [ ] Creates memo entity
- [ ] Triggers AI generation
- [ ] Saves to database
- [ ] Returns DTO

### 6.2 Generate Memo Content
- [ ] Calls AI service correctly
- [ ] Handles AI response
- [ ] Creates sections and subsections
- [ ] Calculates confidence scores
- [ ] Error handling for AI failures

### 6.3 Get Investment Memos
- [ ] Retrieves from database
- [ ] Applies pagination
- [ ] Applies search
- [ ] Applies filtering
- [ ] Returns DTOs

### 6.4 Update Investment Memo
- [ ] Updates entity in database
- [ ] Validates input
- [ ] Returns updated DTO
- [ ] Error handling for non-existent entity

### 6.5 Delete Investment Memo
- [ ] Deletes from database
- [ ] Handles cascading deletes
- [ ] Error handling for non-existent entity

## 7. AI Agent Service Tests

### 7.1 Get AI Agents
- [ ] Retrieves from database
- [ ] Applies pagination
- [ ] Applies filtering
- [ ] Returns DTOs

### 7.2 Create AI Agent
- [ ] Creates agent entity
- [ ] Validates configuration
- [ ] Saves to database
- [ ] Returns DTO

### 7.3 Update AI Agent
- [ ] Updates entity in database
- [ ] Validates configuration
- [ ] Returns updated DTO
- [ ] Error handling for non-existent entity

### 7.4 Delete AI Agent
- [ ] Deletes from database
- [ ] Error handling for non-existent entity

### 7.5 Trigger Agent
- [ ] Creates execution record
- [ ] Calls Python AI service
- [ ] Handles async execution
- [ ] Returns execution ID
- [ ] Error handling for service failures

### 7.6 Stop Agent
- [ ] Updates execution status
- [ ] Calls Python AI service
- [ ] Returns success status
- [ ] Error handling for non-running execution

### 7.7 Get Agent History
- [ ] Retrieves executions from database
- [ ] Applies pagination
- [ ] Applies filtering
- [ ] Returns execution DTOs

### 7.8 Get Agent Metrics
- [ ] Calculates performance metrics
- [ ] Returns metrics data
- [ ] Error handling for non-existent agent

## 8. Data Ingestion Agent Service Tests

### 8.1 Process Data Sources
- [ ] Processes multiple data sources
- [ ] Extracts content correctly
- [ ] Handles different file types
- [ ] Updates processing status
- [ ] Error handling for failures

### 8.2 Get Processing Status
- [ ] Returns current status
- [ ] Includes progress information
- [ ] Error handling for non-existent process

### 8.3 Health Check
- [ ] Checks Python service availability
- [ ] Returns health status
- [ ] Error handling for service down

## 9. Founder Voice Agent Service Tests

### 9.1 Process Audio
- [ ] Processes audio files
- [ ] Transcribes speech correctly
- [ ] Analyzes sentiment
- [ ] Extracts key insights
- [ ] Error handling for invalid audio

### 9.2 Get Analysis Results
- [ ] Returns transcription
- [ ] Returns sentiment analysis
- [ ] Returns key insights
- [ ] Error handling for non-existent analysis

### 9.3 Health Check
- [ ] Checks Python service availability
- [ ] Returns health status
- [ ] Error handling for service down

## 10. Behavioral Assessment Agent Service Tests

### 10.1 Analyze Responses
- [ ] Analyzes founder responses
- [ ] Calculates behavioral scores
- [ ] Identifies patterns
- [ ] Generates insights
- [ ] Error handling for invalid data

### 10.2 Get Assessment Results
- [ ] Returns behavioral scores
- [ ] Returns pattern analysis
- [ ] Returns insights
- [ ] Error handling for non-existent assessment

### 10.3 Health Check
- [ ] Checks Python service availability
- [ ] Returns health status
- [ ] Error handling for service down

## 11. Curated Memo Agent Service Tests

### 11.1 Generate Curated Memo
- [ ] Generates curated memo
- [ ] Applies user preferences
- [ ] Creates visualizations
- [ ] Calculates risk flags
- [ ] Error handling for generation failures

### 11.2 Get Memo Status
- [ ] Returns generation status
- [ ] Includes progress information
- [ ] Error handling for non-existent memo

### 11.3 Health Check
- [ ] Checks Python service availability
- [ ] Returns health status
- [ ] Error handling for service down

## 12. Database Integration Tests

### 12.1 Data Source Repository
- [ ] CRUD operations work correctly
- [ ] Custom queries work
- [ ] Pagination works
- [ ] Error handling for database errors

### 12.2 Investment Memo Repository
- [ ] CRUD operations work correctly
- [ ] Search queries work
- [ ] Pagination works
- [ ] Error handling for database errors

### 12.3 AI Agent Repository
- [ ] CRUD operations work correctly
- [ ] Custom queries work
- [ ] Pagination works
- [ ] Error handling for database errors

### 12.4 Agent Execution Repository
- [ ] CRUD operations work correctly
- [ ] Status updates work
- [ ] Pagination works
- [ ] Error handling for database errors

## 13. Redis Integration Tests

### 13.1 Caching
- [ ] Data is cached correctly
- [ ] Cache expiration works
- [ ] Cache invalidation works
- [ ] Error handling for Redis failures

### 13.2 Session Management
- [ ] Sessions are stored correctly
- [ ] Session expiration works
- [ ] Session cleanup works
- [ ] Error handling for Redis failures

## 14. Security Tests

### 14.1 Authentication
- [ ] Unauthenticated requests are rejected
- [ ] Invalid tokens are rejected
- [ ] Token expiration is handled
- [ ] Error handling for auth failures

### 14.2 Authorization
- [ ] Users can only access their data
- [ ] Admin endpoints require admin role
- [ ] Error handling for unauthorized access

### 14.3 Input Validation
- [ ] Malicious input is rejected
- [ ] SQL injection is prevented
- [ ] XSS is prevented
- [ ] Error handling for invalid input

## 15. Performance Tests

### 15.1 Load Testing
- [ ] System handles concurrent requests
- [ ] Response times are acceptable
- [ ] Memory usage is reasonable
- [ ] Database performance is good

### 15.2 Stress Testing
- [ ] System handles high load
- [ ] Graceful degradation
- [ ] Recovery after load reduction
- [ ] Error handling under stress

## 16. Integration Tests

### 16.1 AI Service Integration
- [ ] Python AI service communication works
- [ ] Error handling for service failures
- [ ] Timeout handling
- [ ] Retry logic works

### 16.2 Database Integration
- [ ] All database operations work
- [ ] Transaction handling works
- [ ] Connection pooling works
- [ ] Error handling for database failures

### 16.3 Redis Integration
- [ ] Caching works correctly
- [ ] Session management works
- [ ] Error handling for Redis failures

## 17. Error Handling Tests

### 17.1 API Error Responses
- [ ] Correct HTTP status codes
- [ ] Meaningful error messages
- [ ] Proper error format
- [ ] Error logging works

### 17.2 Service Error Handling
- [ ] Service failures are handled
- [ ] Fallback mechanisms work
- [ ] Error propagation works
- [ ] Error recovery works

## 18. Configuration Tests

### 18.1 Environment Configuration
- [ ] Development config works
- [ ] Production config works
- [ ] Test config works
- [ ] Configuration validation works

### 18.2 Database Configuration
- [ ] Connection strings work
- [ ] Pool settings work
- [ ] Migration scripts work
- [ ] Error handling for config issues

## Test Execution Strategy

### Unit Tests
- Service method testing
- Repository method testing
- Utility function testing
- Mock external dependencies

### Integration Tests
- Database integration testing
- Redis integration testing
- AI service integration testing
- API endpoint testing

### Performance Tests
- Load testing
- Stress testing
- Memory profiling
- Database performance testing

### Security Tests
- Authentication testing
- Authorization testing
- Input validation testing
- Vulnerability scanning

### End-to-End Tests
- Complete workflow testing
- Cross-service testing
- Error scenario testing
- Recovery testing
