"""
Enhanced FastAPI server for AI Agents - Full-stack auto-ingestion support
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import asyncio
import logging
from datetime import datetime

from enhanced_agents import orchestrator
from advanced_ingestion_agent import AdvancedDataIngestionAgent
from ppt_generator_agent import ppt_generator_agent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize advanced ingestion agent
advanced_ingestion_agent = AdvancedDataIngestionAgent()

# Initialize FastAPI app
app = FastAPI(
    title="AI Analyst Enhanced Agents API",
    description="Enhanced API for AI Agents with advanced auto-ingestion capabilities",
    version="2.1.0"
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
class DataSourceRequest(BaseModel):
    id: str
    name: str
    type: str
    description: str
    size: int
    url: Optional[str] = None
    content: Optional[str] = None
    file_path: Optional[str] = None
    isSelected: Optional[bool] = True

class AutoIngestionRequest(BaseModel):
    sources: List[DataSourceRequest]
    report_id: str
    session_id: str
    user_id: str = "default"

class SourceSelectionRequest(BaseModel):
    source_id: str
    is_selected: bool
    report_id: str
    session_id: str

class URLDataExtractionRequest(BaseModel):
    url: str
    report_id: str
    session_id: str

class DeepResearchRequest(BaseModel):
    startupName: str
    sector: Optional[str] = ""
    geography: Optional[str] = ""
    stage: Optional[str] = ""
    customQuestions: Optional[str] = ""
    report_id: str
    session_id: str

class FounderVoiceRequest(BaseModel):
    phoneNumber: str
    report_id: str
    session_id: str

class BehavioralAssessmentRequest(BaseModel):
    email: str
    phoneNumber: str
    report_id: str
    session_id: str

# Health check endpoint
# PPT Generator endpoints
class PPTGenerationRequest(BaseModel):
    report_id: str
    session_id: str
    company_name: str
    selected_sources: List[Dict[str, Any]]
    config: Optional[Dict[str, Any]] = None

@app.post("/ppt-generator/generate")
async def generate_investment_memo(request: PPTGenerationRequest):
    """Generate investment memo PPT"""
    try:
        logger.info(f"Generating investment memo for {request.company_name}")
        
        memo = await ppt_generator_agent.generate_investment_memo(
            report_id=request.report_id,
            session_id=request.session_id,
            company_name=request.company_name,
            selected_sources=request.selected_sources,
            config=request.config
        )
        
        return {
            "status": "success",
            "message": "Investment memo generated successfully",
            "memo": {
                "id": memo.id,
                "title": memo.title,
                "company_name": memo.company_name,
                "version": memo.version,
                "status": memo.status,
                "summary": memo.summary,
                "sections": [
                    {
                        "title": section.title,
                        "confidence": section.confidence,
                        "data_sources": section.data_sources
                    } for section in memo.sections
                ],
                "average_confidence": memo.average_confidence,
                "risk_flags": memo.risk_flags,
                "investment_score": memo.investment_score,
                "green_flag_score": memo.green_flag_score,
                "red_flag_analysis": memo.red_flag_analysis,
                "created_at": memo.created_at.isoformat(),
                "file_path": memo.file_path
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error generating investment memo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ppt-generator/memos/{report_id}")
async def list_generated_memos(report_id: str):
    """List all generated memos for a report"""
    try:
        memos = await ppt_generator_agent.list_generated_memos(report_id)
        return {
            "status": "success",
            "report_id": report_id,
            "memos": memos,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error listing memos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/ppt-generator/memos/{memo_id}")
async def delete_memo(memo_id: str):
    """Delete a generated memo"""
    try:
        success = await ppt_generator_agent.delete_memo(memo_id)
        return {
            "status": "success" if success else "failed",
            "memo_id": memo_id,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error deleting memo: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/ppt-generator/status/{session_id}")
async def get_ppt_generator_status(session_id: str):
    """Get PPT generator agent status"""
    try:
        status = await ppt_generator_agent.get_status(session_id)
        return {
            "status": "success",
            "agent_status": status,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting PPT generator status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents_available": len(orchestrator.agents),
        "version": "2.2.0"
    }

# Data Ingestion Endpoints
@app.post("/data-ingestion/process")
async def process_data_ingestion(request: AutoIngestionRequest):
    """Process data sources with advanced auto-ingestion"""
    try:
        logger.info(f"Processing {len(request.sources)} sources for report {request.report_id}")
        
        # Convert Pydantic models to dictionaries
        sources_data = [source.dict() for source in request.sources]
        
        # Process sources with advanced ingestion agent
        result = await advanced_ingestion_agent.process_multiple_sources(
            sources=sources_data,
            report_id=request.report_id,
            session_id=request.session_id
        )
        
        return {
            "status": "success",
            "message": "Data sources processed with advanced ingestion",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error processing data ingestion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/data-ingestion/remove/{source_id}")
async def remove_source_from_kb(source_id: str, report_id: str, session_id: str):
    """Remove source from knowledge base"""
    try:
        result = await advanced_ingestion_agent.remove_from_knowledge_base(
            source_id=source_id,
            report_id=report_id,
            session_id=session_id
        )
        
        return {
            "status": "success",
            "message": "Source removed from knowledge base",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error removing source: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/data-ingestion/status/{source_id}")
async def get_ingestion_status(source_id: str, report_id: str, session_id: str):
    """Get ingestion status for a specific source"""
    try:
        # This would typically check a database or cache
        # For now, return a simulated status
        return {
            "source_id": source_id,
            "status": "completed",
            "progress": 100,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting ingestion status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/data-ingestion/knowledge-base-stats/{report_id}")
async def get_knowledge_base_stats(report_id: str):
    """Get knowledge base statistics for a report"""
    try:
        stats = advanced_ingestion_agent.get_knowledge_base_stats(report_id)
        return {
            "status": "success",
            "report_id": report_id,
            "stats": stats,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting knowledge base stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# URL Data Extraction Endpoints
@app.post("/data-extraction/extract-url")
async def extract_url_data(request: URLDataExtractionRequest):
    """Extract data from URL (webpage or YouTube)"""
    try:
        logger.info(f"Extracting data from URL: {request.url}")
        
        result = await orchestrator.execute_agent("url_extraction", {
            "url": request.url,
            "report_id": request.report_id,
            "session_id": request.session_id
        })
        
        return {
            "status": "success",
            "message": "URL data extracted successfully",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error extracting URL data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Deep Research Endpoints
@app.post("/deep-research/execute")
async def execute_deep_research(request: DeepResearchRequest):
    """Execute deep research"""
    try:
        logger.info(f"Executing deep research for {request.startupName}")
        
        result = await orchestrator.execute_agent("deep_research", {
            "startupName": request.startupName,
            "sector": request.sector,
            "geography": request.geography,
            "stage": request.stage,
            "customQuestions": request.customQuestions,
            "report_id": request.report_id,
            "session_id": request.session_id
        })
        
        return {
            "status": "success",
            "message": "Deep research executed successfully",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error executing deep research: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Founder Voice Endpoints
@app.post("/founder-voice/interview")
async def conduct_founder_interview(request: FounderVoiceRequest):
    """Conduct founder voice interview"""
    try:
        logger.info(f"Conducting founder interview with {request.phoneNumber}")
        
        result = await orchestrator.execute_agent("founder_voice", {
            "phoneNumber": request.phoneNumber,
            "report_id": request.report_id,
            "session_id": request.session_id
        })
        
        return {
            "status": "success",
            "message": "Founder interview conducted successfully",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error conducting founder interview: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Behavioral Assessment Endpoints
@app.post("/behavioral-assessment/send")
async def send_behavioral_assessment(request: BehavioralAssessmentRequest):
    """Send behavioral assessment"""
    try:
        logger.info(f"Sending behavioral assessment to {request.email}")
        
        result = await orchestrator.execute_agent("behavioral_assessment", {
            "email": request.email,
            "phoneNumber": request.phoneNumber,
            "report_id": request.report_id,
            "session_id": request.session_id
        })
        
        return {
            "status": "success",
            "message": "Behavioral assessment sent successfully",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error sending behavioral assessment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Agent Status Endpoints
@app.get("/agents/{agent_type}/status/{session_id}")
async def get_agent_status(agent_type: str, session_id: str):
    """Get status of a specific agent"""
    try:
        status = orchestrator.get_agent_status(agent_type, session_id)
        return {
            "agent_type": agent_type,
            "session_id": session_id,
            "status": status,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting agent status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Batch Operations
@app.post("/sources/select-all")
async def select_all_sources(request: AutoIngestionRequest):
    """Select all sources and auto-ingest them with advanced processing"""
    try:
        logger.info(f"Selecting all {len(request.sources)} sources for advanced auto-ingestion")
        
        # Mark all sources as selected
        for source in request.sources:
            source.isSelected = True
        
        # Process with advanced auto-ingestion
        sources_data = [source.dict() for source in request.sources]
        result = await advanced_ingestion_agent.process_multiple_sources(
            sources=sources_data,
            report_id=request.report_id,
            session_id=request.session_id
        )
        
        return {
            "status": "success",
            "message": "All sources selected and auto-ingested with advanced processing",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error selecting all sources: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sources/deselect-all")
async def deselect_all_sources(request: AutoIngestionRequest):
    """Deselect all sources and remove them from knowledge base"""
    try:
        logger.info(f"Deselecting all {len(request.sources)} sources")
        
        # Remove all sources from knowledge base
        removal_results = []
        for source in request.sources:
            removal_result = await advanced_ingestion_agent.remove_from_knowledge_base(
                source_id=source.id,
                report_id=request.report_id,
                session_id=request.session_id
            )
            removal_results.append(removal_result)
        
        return {
            "status": "success",
            "message": "All sources deselected and removed from knowledge base",
            "removal_results": removal_results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error deselecting all sources: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Individual Source Selection
@app.post("/sources/toggle-selection")
async def toggle_source_selection(request: SourceSelectionRequest):
    """Toggle individual source selection and auto-ingest/remove"""
    try:
        if request.is_selected:
            # Auto-ingest the source
            logger.info(f"Auto-ingesting source {request.source_id}")
            # This would typically fetch the source data and process it
            # For now, return success
            return {
                "status": "success",
                "message": "Source selected and auto-ingested",
                "source_id": request.source_id,
                "action": "ingested",
                "timestamp": datetime.now().isoformat()
            }
        else:
            # Remove from knowledge base
            logger.info(f"Removing source {request.source_id} from knowledge base")
            result = await orchestrator.remove_source_from_knowledge_base(
                source_id=request.source_id,
                report_id=request.report_id,
                session_id=request.session_id
            )
            
            return {
                "status": "success",
                "message": "Source deselected and removed from knowledge base",
                "source_id": request.source_id,
                "action": "removed",
                "result": result,
                "timestamp": datetime.now().isoformat()
            }
        
    except Exception as e:
        logger.error(f"Error toggling source selection: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
