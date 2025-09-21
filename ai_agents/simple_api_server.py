"""
Simplified FastAPI server for AI Agents - No heavy dependencies
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
import logging
from datetime import datetime

from simple_agents import orchestrator

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Analyst Agents API (Simplified)",
    description="Simplified API for AI Agents in the AI Analyst platform",
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

# API Routes

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Analyst Agents API (Simplified)",
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
        status = orchestrator.get_all_agents_status()
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
        status = orchestrator.get_agent_status(agent_type)
        if status.get("status") == "not_found":
            raise HTTPException(status_code=404, detail=f"Agent type {agent_type} not found")
        
        return {
            "status": "success",
            "agent": status
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting agent info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents/{agent_type}/execute")
async def execute_agent(agent_type: str, request: AgentExecutionRequest):
    """Execute a specific agent"""
    try:
        # Prepare input data
        input_data = {
            "session_id": request.session_id,
            "report_id": request.report_id,
            "user_id": request.user_id,
            **request.input_data
        }
        
        # Execute agent
        result = await orchestrator.execute_agent(agent_type, input_data)
        
        return {
            "status": "success",
            "result": result
        }
        
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

@app.get("/agents/{agent_type}/status")
async def get_agent_status(agent_type: str):
    """Get status of a specific agent"""
    try:
        status = orchestrator.get_agent_status(agent_type)
        if status.get("status") == "not_found":
            raise HTTPException(status_code=404, detail=f"Agent type {agent_type} not found")
        
        return {
            "status": "success",
            "agent_status": status
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting agent status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Data Ingestion specific endpoints
@app.post("/data-ingestion/process")
async def process_data_sources(request: AgentExecutionRequest):
    """Process data sources using data ingestion agent"""
    try:
        result = await orchestrator.execute_agent("data_ingestion", {
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
        result = await orchestrator.execute_agent("deep_research", {
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
        result = await orchestrator.execute_agent("founder_voice", {
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
        result = await orchestrator.execute_agent("behavioral_assessment", {
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
