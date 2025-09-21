"""
FastAPI server for AI Agents
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
import logging
from datetime import datetime

from agent_orchestrator import AgentOrchestrator, AgentType
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Analyst Agents API",
    description="API for AI Agents in the AI Analyst platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent orchestrator
orchestrator = AgentOrchestrator()

# Pydantic models
class AgentExecutionRequest(BaseModel):
    session_id: str
    report_id: str
    user_id: str
    input_data: Dict[str, Any]

class Stage0WorkflowRequest(BaseModel):
    session_id: str
    report_id: str
    user_id: str
    sources: Optional[List[Dict[str, Any]]] = None
    research_query: Optional[Dict[str, Any]] = None
    founder: Optional[Dict[str, Any]] = None

class AgentStatusResponse(BaseModel):
    agent_type: str
    session_id: str
    status: str
    last_execution: Optional[str] = None
    available: bool

# API Routes

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Analyst Agents API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents_available": len(orchestrator.agents)
    }

@app.get("/agents")
async def get_all_agents():
    """Get all available agents"""
    try:
        status = await orchestrator.get_all_agents_status()
        return {
            "status": "success",
            "agents": status,
            "count": len(status)
        }
    except Exception as e:
        logger.error(f"Error getting agents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents/{agent_type}")
async def get_agent_info(agent_type: str):
    """Get information about a specific agent"""
    try:
        agent_enum = AgentType(agent_type)
        capabilities = orchestrator.get_agent_capabilities(agent_enum)
        return {
            "status": "success",
            "agent": capabilities
        }
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Agent type {agent_type} not found")
    except Exception as e:
        logger.error(f"Error getting agent info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/{agent_type}/execute")
async def execute_agent(agent_type: str, request: AgentExecutionRequest):
    """Execute a specific agent"""
    try:
        agent_enum = AgentType(agent_type)
        
        # Prepare input data
        input_data = {
            "session_id": request.session_id,
            "report_id": request.report_id,
            "user_id": request.user_id,
            **request.input_data
        }
        
        # Execute agent
        result = await orchestrator.execute_agent(agent_enum, input_data)
        
        return {
            "status": "success",
            "result": result
        }
        
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Agent type {agent_type} not found")
    except Exception as e:
        logger.error(f"Error executing agent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/workflows/stage-0")
async def execute_stage_0_workflow(request: Stage0WorkflowRequest):
    """Execute the complete Stage 0 workflow"""
    try:
        # Prepare input data
        input_data = {
            "session_id": request.session_id,
            "report_id": request.report_id,
            "user_id": request.user_id,
            "sources": request.sources,
            "research_query": request.research_query,
            "founder": request.founder
        }
        
        # Execute workflow
        result = await orchestrator.execute_stage_0_workflow(input_data)
        
        return {
            "status": "success",
            "workflow_result": result
        }
        
    except Exception as e:
        logger.error(f"Error executing Stage 0 workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents/{agent_type}/status/{session_id}")
async def get_agent_status(agent_type: str, session_id: str):
    """Get status of a specific agent execution"""
    try:
        agent_enum = AgentType(agent_type)
        status = await orchestrator.get_agent_status(agent_enum, session_id)
        return {
            "status": "success",
            "agent_status": status
        }
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Agent type {agent_type} not found")
    except Exception as e:
        logger.error(f"Error getting agent status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/{agent_type}/cancel/{session_id}")
async def cancel_agent_execution(agent_type: str, session_id: str):
    """Cancel agent execution"""
    try:
        agent_enum = AgentType(agent_type)
        result = await orchestrator.cancel_agent_execution(agent_enum, session_id)
        return {
            "status": "success",
            "cancellation_result": result
        }
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Agent type {agent_type} not found")
    except Exception as e:
        logger.error(f"Error cancelling agent execution: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Data Ingestion specific endpoints
@app.post("/data-ingestion/process")
async def process_data_sources(request: AgentExecutionRequest):
    """Process data sources using data ingestion agent"""
    try:
        result = await orchestrator.execute_agent(AgentType.DATA_INGESTION, {
            "session_id": request.session_id,
            "report_id": request.report_id,
            "user_id": request.user_id,
            **request.input_data
        })
        return {
            "status": "success",
            "ingestion_result": result
        }
    except Exception as e:
        logger.error(f"Error processing data sources: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Deep Research specific endpoints
@app.post("/deep-research/execute")
async def execute_deep_research(request: AgentExecutionRequest):
    """Execute deep research using research agent"""
    try:
        result = await orchestrator.execute_agent(AgentType.DEEP_RESEARCH, {
            "session_id": request.session_id,
            "report_id": request.report_id,
            "user_id": request.user_id,
            **request.input_data
        })
        return {
            "status": "success",
            "research_result": result
        }
    except Exception as e:
        logger.error(f"Error executing deep research: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Founder Voice specific endpoints
@app.post("/founder-voice/interview")
async def conduct_founder_interview(request: AgentExecutionRequest):
    """Conduct founder voice interview"""
    try:
        result = await orchestrator.execute_agent(AgentType.FOUNDER_VOICE, {
            "session_id": request.session_id,
            "report_id": request.report_id,
            "user_id": request.user_id,
            **request.input_data
        })
        return {
            "status": "success",
            "interview_result": result
        }
    except Exception as e:
        logger.error(f"Error conducting founder interview: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Behavioral Assessment specific endpoints
@app.post("/behavioral-assessment/send")
async def send_behavioral_assessment(request: AgentExecutionRequest):
    """Send behavioral assessment to founder"""
    try:
        result = await orchestrator.execute_agent(AgentType.BEHAVIORAL_ASSESSMENT, {
            "session_id": request.session_id,
            "report_id": request.report_id,
            "user_id": request.user_id,
            **request.input_data
        })
        return {
            "status": "success",
            "assessment_result": result
        }
    except Exception as e:
        logger.error(f"Error sending behavioral assessment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
