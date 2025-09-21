"""
Base AI Agent class for all LangGraph agents
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
import asyncio
from pydantic import BaseModel, Field
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentState(BaseModel):
    """Base state for all agents"""
    session_id: str
    report_id: str
    user_id: str
    status: str = "pending"  # pending, running, completed, failed
    progress: int = 0
    results: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class BaseAIAgent(ABC):
    """Base class for all AI agents"""
    
    def __init__(self, name: str, description: str, config: Dict[str, Any] = None):
        self.name = name
        self.description = description
        self.config = config or {}
        self.llm = ChatOpenAI(
            model=self.config.get("model", "gpt-4o"),
            temperature=self.config.get("temperature", 0.1),
            api_key=self.config.get("openai_api_key")
        )
        self.graph = self._build_graph()
        
    @abstractmethod
    def _build_graph(self) -> StateGraph:
        """Build the LangGraph workflow for this agent"""
        pass
    
    @abstractmethod
    async def _execute(self, state: AgentState) -> AgentState:
        """Execute the main logic for this agent"""
        pass
    
    async def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Run the agent with input data"""
        try:
            # Create initial state
            state = AgentState(
                session_id=input_data.get("session_id", ""),
                report_id=input_data.get("report_id", ""),
                user_id=input_data.get("user_id", ""),
                status="running",
                metadata=input_data
            )
            
            logger.info(f"Starting {self.name} for session {state.session_id}")
            
            # Execute the agent
            result_state = await self._execute(state)
            
            # Update final status
            result_state.status = "completed"
            result_state.updated_at = datetime.now()
            
            logger.info(f"Completed {self.name} for session {state.session_id}")
            
            return {
                "status": "success",
                "agent_name": self.name,
                "session_id": result_state.session_id,
                "results": result_state.results,
                "metadata": result_state.metadata
            }
            
        except Exception as e:
            logger.error(f"Error in {self.name}: {str(e)}")
            return {
                "status": "error",
                "agent_name": self.name,
                "error": str(e),
                "session_id": input_data.get("session_id", "")
            }
    
    def _update_progress(self, state: AgentState, progress: int, message: str = None):
        """Update progress and log message"""
        state.progress = progress
        state.updated_at = datetime.now()
        if message:
            logger.info(f"{self.name}: {message}")
    
    def _log_execution(self, message: str, level: str = "info"):
        """Log execution message"""
        if level == "error":
            logger.error(f"{self.name}: {message}")
        elif level == "warning":
            logger.warning(f"{self.name}: {message}")
        else:
            logger.info(f"{self.name}: {message}")
    
    def _validate_input(self, input_data: Dict[str, Any]) -> bool:
        """Validate input data"""
        required_fields = ["session_id", "report_id", "user_id"]
        return all(field in input_data for field in required_fields)
    
    def _create_error_state(self, state: AgentState, error: str) -> AgentState:
        """Create error state"""
        state.status = "failed"
        state.error = error
        state.updated_at = datetime.now()
        return state
