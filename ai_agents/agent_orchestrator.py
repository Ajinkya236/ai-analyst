"""
AI Agent Orchestrator - Manages and coordinates all AI agents
"""
import asyncio
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
from enum import Enum

from data_ingestion_agent import DataIngestionAgent
from deep_research_agent import DeepResearchAgent
from founder_voice_agent import FounderVoiceAgent
from behavioral_assessment_agent import BehavioralAssessmentAgent
from base_agent import BaseAIAgent, AgentState
from config import Config

logger = logging.getLogger(__name__)

class AgentType(Enum):
    DATA_INGESTION = "data_ingestion"
    DEEP_RESEARCH = "deep_research"
    FOUNDER_VOICE = "founder_voice"
    BEHAVIORAL_ASSESSMENT = "behavioral_assessment"

class AgentOrchestrator:
    """Orchestrates and manages all AI agents"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.agents = {}
        self.active_sessions = {}
        self._initialize_agents()
    
    def _initialize_agents(self):
        """Initialize all available agents"""
        try:
            self.agents[AgentType.DATA_INGESTION] = DataIngestionAgent(self.config)
            self.agents[AgentType.DEEP_RESEARCH] = DeepResearchAgent(self.config)
            self.agents[AgentType.FOUNDER_VOICE] = FounderVoiceAgent(self.config)
            self.agents[AgentType.BEHAVIORAL_ASSESSMENT] = BehavioralAssessmentAgent(self.config)
            
            logger.info(f"Initialized {len(self.agents)} AI agents")
            
        except Exception as e:
            logger.error(f"Failed to initialize agents: {e}")
            raise
    
    async def execute_agent(self, agent_type: AgentType, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a specific agent"""
        if agent_type not in self.agents:
            return {
                "status": "error",
                "error": f"Agent type {agent_type} not found"
            }
        
        agent = self.agents[agent_type]
        
        try:
            logger.info(f"Executing {agent.name} for session {input_data.get('session_id', 'unknown')}")
            result = await agent.run(input_data)
            return result
            
        except Exception as e:
            logger.error(f"Error executing {agent.name}: {e}")
            return {
                "status": "error",
                "agent_name": agent.name,
                "error": str(e)
            }
    
    async def execute_stage_0_workflow(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the complete Stage 0 workflow"""
        session_id = input_data.get("session_id", f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
        report_id = input_data.get("report_id", "")
        user_id = input_data.get("user_id", "")
        
        logger.info(f"Starting Stage 0 workflow for session {session_id}")
        
        workflow_results = {
            "session_id": session_id,
            "report_id": report_id,
            "user_id": user_id,
            "started_at": datetime.now().isoformat(),
            "agents_executed": [],
            "results": {},
            "status": "running"
        }
        
        try:
            # 1. Data Ingestion (if sources provided)
            if input_data.get("sources"):
                logger.info("Executing data ingestion agent")
                ingestion_result = await self.execute_agent(
                    AgentType.DATA_INGESTION,
                    {
                        "session_id": session_id,
                        "report_id": report_id,
                        "user_id": user_id,
                        "sources": input_data["sources"]
                    }
                )
                workflow_results["agents_executed"].append("data_ingestion")
                workflow_results["results"]["data_ingestion"] = ingestion_result
            
            # 2. Deep Research (if query provided)
            if input_data.get("research_query"):
                logger.info("Executing deep research agent")
                research_result = await self.execute_agent(
                    AgentType.DEEP_RESEARCH,
                    {
                        "session_id": session_id,
                        "report_id": report_id,
                        "user_id": user_id,
                        "query": input_data["research_query"]
                    }
                )
                workflow_results["agents_executed"].append("deep_research")
                workflow_results["results"]["deep_research"] = research_result
            
            # 3. Founder Voice (if founder data provided)
            if input_data.get("founder"):
                logger.info("Executing founder voice agent")
                voice_result = await self.execute_agent(
                    AgentType.FOUNDER_VOICE,
                    {
                        "session_id": session_id,
                        "report_id": report_id,
                        "user_id": user_id,
                        "founder": input_data["founder"]
                    }
                )
                workflow_results["agents_executed"].append("founder_voice")
                workflow_results["results"]["founder_voice"] = voice_result
            
            # 4. Behavioral Assessment (if founder contact info provided)
            if input_data.get("founder") and input_data["founder"].get("phone_number") and input_data["founder"].get("email"):
                logger.info("Executing behavioral assessment agent")
                assessment_result = await self.execute_agent(
                    AgentType.BEHAVIORAL_ASSESSMENT,
                    {
                        "session_id": session_id,
                        "report_id": report_id,
                        "user_id": user_id,
                        "founder": input_data["founder"]
                    }
                )
                workflow_results["agents_executed"].append("behavioral_assessment")
                workflow_results["results"]["behavioral_assessment"] = assessment_result
            
            workflow_results["status"] = "completed"
            workflow_results["completed_at"] = datetime.now().isoformat()
            
            logger.info(f"Stage 0 workflow completed for session {session_id}")
            return workflow_results
            
        except Exception as e:
            logger.error(f"Stage 0 workflow failed: {e}")
            workflow_results["status"] = "failed"
            workflow_results["error"] = str(e)
            workflow_results["failed_at"] = datetime.now().isoformat()
            return workflow_results
    
    async def get_agent_status(self, agent_type: AgentType, session_id: str) -> Dict[str, Any]:
        """Get status of a specific agent"""
        if agent_type not in self.agents:
            return {
                "status": "error",
                "error": f"Agent type {agent_type} not found"
            }
        
        # In a real implementation, this would query the agent's status
        # For now, return a mock status
        return {
            "agent_type": agent_type.value,
            "session_id": session_id,
            "status": "idle",
            "last_execution": None,
            "available": True
        }
    
    async def get_all_agents_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        status = {}
        
        for agent_type, agent in self.agents.items():
            status[agent_type.value] = {
                "name": agent.name,
                "description": agent.description,
                "status": "idle",
                "available": True
            }
        
        return status
    
    async def cancel_agent_execution(self, agent_type: AgentType, session_id: str) -> Dict[str, Any]:
        """Cancel agent execution"""
        if agent_type not in self.agents:
            return {
                "status": "error",
                "error": f"Agent type {agent_type} not found"
            }
        
        # In a real implementation, this would cancel the actual execution
        logger.info(f"Cancelling {agent_type.value} execution for session {session_id}")
        
        return {
            "status": "cancelled",
            "agent_type": agent_type.value,
            "session_id": session_id,
            "cancelled_at": datetime.now().isoformat()
        }
    
    def get_agent_capabilities(self, agent_type: AgentType) -> Dict[str, Any]:
        """Get capabilities of a specific agent"""
        if agent_type not in self.agents:
            return {
                "status": "error",
                "error": f"Agent type {agent_type} not found"
            }
        
        agent = self.agents[agent_type]
        
        capabilities = {
            "name": agent.name,
            "description": agent.description,
            "input_requirements": self._get_input_requirements(agent_type),
            "output_format": self._get_output_format(agent_type),
            "estimated_duration": self._get_estimated_duration(agent_type),
            "dependencies": self._get_dependencies(agent_type)
        }
        
        return capabilities
    
    def _get_input_requirements(self, agent_type: AgentType) -> List[str]:
        """Get input requirements for agent"""
        requirements = {
            AgentType.DATA_INGESTION: ["sources"],
            AgentType.DEEP_RESEARCH: ["query"],
            AgentType.FOUNDER_VOICE: ["founder"],
            AgentType.BEHAVIORAL_ASSESSMENT: ["founder"]
        }
        return requirements.get(agent_type, [])
    
    def _get_output_format(self, agent_type: AgentType) -> Dict[str, Any]:
        """Get output format for agent"""
        formats = {
            AgentType.DATA_INGESTION: {
                "type": "ingestion_summary",
                "fields": ["sources_processed", "embeddings_created", "summary"]
            },
            AgentType.DEEP_RESEARCH: {
                "type": "research_report",
                "fields": ["company_info", "funding", "market_data", "analysis"]
            },
            AgentType.FOUNDER_VOICE: {
                "type": "interview_report",
                "fields": ["responses", "analysis", "recommendations"]
            },
            AgentType.BEHAVIORAL_ASSESSMENT: {
                "type": "assessment_report",
                "fields": ["scores", "profile", "recommendations"]
            }
        }
        return formats.get(agent_type, {})
    
    def _get_estimated_duration(self, agent_type: AgentType) -> str:
        """Get estimated duration for agent"""
        durations = {
            AgentType.DATA_INGESTION: "5-15 minutes",
            AgentType.DEEP_RESEARCH: "30-60 minutes",
            AgentType.FOUNDER_VOICE: "45-60 minutes",
            AgentType.BEHAVIORAL_ASSESSMENT: "30-45 minutes"
        }
        return durations.get(agent_type, "Unknown")
    
    def _get_dependencies(self, agent_type: AgentType) -> List[str]:
        """Get dependencies for agent"""
        dependencies = {
            AgentType.DATA_INGESTION: ["OpenAI API", "Vector Store"],
            AgentType.DEEP_RESEARCH: ["OpenAI API", "Web Search APIs"],
            AgentType.FOUNDER_VOICE: ["OpenAI API", "Twilio", "Speech Services"],
            AgentType.BEHAVIORAL_ASSESSMENT: ["OpenAI API", "Twilio", "SendGrid"]
        }
        return dependencies.get(agent_type, [])
