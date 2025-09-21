"""
Data Ingestion Agent - Processes and ingests various data sources using RAG/CAG/MCP
"""
import os
import asyncio
import aiofiles
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
from pathlib import Path
import mimetypes
import json

from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import (
    PyPDFLoader, 
    Docx2txtLoader, 
    UnstructuredPowerPointLoader,
    TextLoader
)
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

from base_agent import BaseAIAgent, AgentState
from config import Config

logger = logging.getLogger(__name__)

class DataIngestionAgent(BaseAIAgent):
    """Agent for ingesting and processing various data sources"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(
            name="Data Ingestion Agent",
            description="Processes and ingests uploaded documents, links, and text using RAG/CAG/MCP",
            config=config
        )
        self.embeddings = OpenAIEmbeddings(
            model=Config.EMBEDDING_MODEL,
            api_key=Config.OPENAI_API_KEY
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP
        )
        self.vector_store = None
        self._init_vector_store()
    
    def _init_vector_store(self):
        """Initialize vector store for document embeddings"""
        try:
            self.vector_store = Chroma(
                persist_directory=Config.VECTOR_STORE_PATH,
                embedding_function=self.embeddings
            )
            logger.info("Vector store initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize vector store: {e}")
            self.vector_store = None
    
    def _build_graph(self):
        """Build the LangGraph workflow for data ingestion"""
        from langgraph.graph import StateGraph, END
        
        workflow = StateGraph(AgentState)
        
        # Define nodes
        workflow.add_node("validate_sources", self._validate_sources)
        workflow.add_node("process_documents", self._process_documents)
        workflow.add_node("process_links", self._process_links)
        workflow.add_node("process_text", self._process_text)
        workflow.add_node("generate_embeddings", self._generate_embeddings)
        workflow.add_node("store_data", self._store_data)
        workflow.add_node("generate_summary", self._generate_summary)
        
        # Define edges
        workflow.set_entry_point("validate_sources")
        workflow.add_edge("validate_sources", "process_documents")
        workflow.add_edge("process_documents", "process_links")
        workflow.add_edge("process_links", "process_text")
        workflow.add_edge("process_text", "generate_embeddings")
        workflow.add_edge("generate_embeddings", "store_data")
        workflow.add_edge("store_data", "generate_summary")
        workflow.add_edge("generate_summary", END)
        
        return workflow.compile()
    
    async def _execute(self, state: AgentState) -> AgentState:
        """Execute the data ingestion process"""
        try:
            self._update_progress(state, 10, "Starting data ingestion process")
            
            # Run the workflow
            result = await self.graph.ainvoke(state)
            
            self._update_progress(state, 100, "Data ingestion completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Data ingestion failed: {e}")
            return self._create_error_state(state, str(e))
    
    async def _validate_sources(self, state: AgentState) -> AgentState:
        """Validate input sources"""
        self._update_progress(state, 20, "Validating sources")
        
        sources = state.metadata.get("sources", [])
        if not sources:
            return self._create_error_state(state, "No sources provided")
        
        validated_sources = []
        for source in sources:
            if self._validate_source(source):
                validated_sources.append(source)
            else:
                logger.warning(f"Invalid source skipped: {source.get('name', 'Unknown')}")
        
        if not validated_sources:
            return self._create_error_state(state, "No valid sources found")
        
        state.metadata["validated_sources"] = validated_sources
        self._update_progress(state, 30, f"Validated {len(validated_sources)} sources")
        return state
    
    def _validate_source(self, source: Dict[str, Any]) -> bool:
        """Validate a single source"""
        required_fields = ["id", "name", "type"]
        if not all(field in source for field in required_fields):
            return False
        
        source_type = source.get("type")
        if source_type == "file":
            return "file_path" in source and os.path.exists(source["file_path"])
        elif source_type in ["url", "youtube"]:
            return "url" in source and source["url"].startswith(("http://", "https://"))
        elif source_type == "text":
            return "content" in source and len(source["content"]) > 0
        
        return False
    
    async def _process_documents(self, state: AgentState) -> AgentState:
        """Process document files (PDF, DOCX, PPTX)"""
        self._update_progress(state, 40, "Processing documents")
        
        documents = []
        sources = state.metadata.get("validated_sources", [])
        
        for source in sources:
            if source.get("type") == "file":
                try:
                    doc_content = await self._extract_document_content(source)
                    if doc_content:
                        documents.append({
                            "source_id": source["id"],
                            "name": source["name"],
                            "type": "document",
                            "content": doc_content,
                            "metadata": {
                                "file_path": source.get("file_path"),
                                "file_size": source.get("file_size"),
                                "uploaded_at": source.get("uploaded_at")
                            }
                        })
                except Exception as e:
                    logger.error(f"Failed to process document {source['name']}: {e}")
        
        state.results["documents"] = documents
        self._update_progress(state, 50, f"Processed {len(documents)} documents")
        return state
    
    async def _extract_document_content(self, source: Dict[str, Any]) -> Optional[str]:
        """Extract content from document file"""
        file_path = source["file_path"]
        file_extension = Path(file_path).suffix.lower()
        
        try:
            if file_extension == ".pdf":
                loader = PyPDFLoader(file_path)
                documents = loader.load()
                return "\n".join([doc.page_content for doc in documents])
            
            elif file_extension == ".docx":
                loader = Docx2txtLoader(file_path)
                documents = loader.load()
                return "\n".join([doc.page_content for doc in documents])
            
            elif file_extension in [".ppt", ".pptx"]:
                loader = UnstructuredPowerPointLoader(file_path)
                documents = loader.load()
                return "\n".join([doc.page_content for doc in documents])
            
            elif file_extension == ".txt":
                loader = TextLoader(file_path)
                documents = loader.load()
                return "\n".join([doc.page_content for doc in documents])
            
            else:
                logger.warning(f"Unsupported file type: {file_extension}")
                return None
                
        except Exception as e:
            logger.error(f"Error extracting content from {file_path}: {e}")
            return None
    
    async def _process_links(self, state: AgentState) -> AgentState:
        """Process web links and YouTube URLs"""
        self._update_progress(state, 60, "Processing links")
        
        links = []
        sources = state.metadata.get("validated_sources", [])
        
        for source in sources:
            if source.get("type") in ["url", "youtube"]:
                try:
                    link_content = await self._extract_link_content(source)
                    if link_content:
                        links.append({
                            "source_id": source["id"],
                            "name": source["name"],
                            "type": source["type"],
                            "url": source["url"],
                            "content": link_content,
                            "metadata": {
                                "scraped_at": datetime.now().isoformat(),
                                "title": link_content.get("title", ""),
                                "description": link_content.get("description", "")
                            }
                        })
                except Exception as e:
                    logger.error(f"Failed to process link {source['url']}: {e}")
        
        state.results["links"] = links
        self._update_progress(state, 70, f"Processed {len(links)} links")
        return state
    
    async def _extract_link_content(self, source: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Extract content from web link"""
        url = source["url"]
        
        try:
            import requests
            from bs4 import BeautifulSoup
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract title
            title = soup.find('title')
            title_text = title.get_text().strip() if title else ""
            
            # Extract main content
            content_selectors = ['main', 'article', '.content', '#content', 'body']
            content_text = ""
            
            for selector in content_selectors:
                element = soup.select_one(selector)
                if element:
                    content_text = element.get_text().strip()
                    break
            
            if not content_text:
                content_text = soup.get_text().strip()
            
            # Clean up content
            content_text = " ".join(content_text.split())
            
            return {
                "title": title_text,
                "content": content_text[:5000],  # Limit content length
                "description": soup.find('meta', attrs={'name': 'description'}).get('content', '') if soup.find('meta', attrs={'name': 'description'}) else ""
            }
            
        except Exception as e:
            logger.error(f"Error extracting content from {url}: {e}")
            return None
    
    async def _process_text(self, state: AgentState) -> AgentState:
        """Process text content"""
        self._update_progress(state, 80, "Processing text content")
        
        text_sources = []
        sources = state.metadata.get("validated_sources", [])
        
        for source in sources:
            if source.get("type") == "text":
                text_sources.append({
                    "source_id": source["id"],
                    "name": source["name"],
                    "type": "text",
                    "content": source["content"],
                    "metadata": {
                        "created_at": source.get("created_at"),
                        "word_count": len(source["content"].split())
                    }
                })
        
        state.results["text_sources"] = text_sources
        self._update_progress(state, 85, f"Processed {len(text_sources)} text sources")
        return state
    
    async def _generate_embeddings(self, state: AgentState) -> AgentState:
        """Generate embeddings for all processed content"""
        self._update_progress(state, 90, "Generating embeddings")
        
        all_documents = []
        
        # Collect all documents
        for doc in state.results.get("documents", []):
            all_documents.append(Document(
                page_content=doc["content"],
                metadata={
                    "source_id": doc["source_id"],
                    "source_type": "document",
                    "name": doc["name"],
                    **doc["metadata"]
                }
            ))
        
        for link in state.results.get("links", []):
            all_documents.append(Document(
                page_content=link["content"],
                metadata={
                    "source_id": link["source_id"],
                    "source_type": "link",
                    "name": link["name"],
                    "url": link["url"],
                    **link["metadata"]
                }
            ))
        
        for text in state.results.get("text_sources", []):
            all_documents.append(Document(
                page_content=text["content"],
                metadata={
                    "source_id": text["source_id"],
                    "source_type": "text",
                    "name": text["name"],
                    **text["metadata"]
                }
            ))
        
        # Split documents into chunks
        if all_documents:
            split_docs = self.text_splitter.split_documents(all_documents)
            
            # Store in vector database
            if self.vector_store:
                self.vector_store.add_documents(split_docs)
                state.results["embeddings_created"] = len(split_docs)
                logger.info(f"Created {len(split_docs)} document embeddings")
        
        return state
    
    async def _store_data(self, state: AgentState) -> AgentState:
        """Store processed data in database"""
        self._update_progress(state, 95, "Storing processed data")
        
        # Prepare data for storage
        ingestion_data = {
            "session_id": state.session_id,
            "report_id": state.report_id,
            "user_id": state.user_id,
            "sources_processed": len(state.metadata.get("validated_sources", [])),
            "documents_count": len(state.results.get("documents", [])),
            "links_count": len(state.results.get("links", [])),
            "text_sources_count": len(state.results.get("text_sources", [])),
            "embeddings_count": state.results.get("embeddings_created", 0),
            "processed_at": datetime.now().isoformat(),
            "status": "completed"
        }
        
        state.results["ingestion_summary"] = ingestion_data
        
        # Here you would typically store this in your database
        # For now, we'll just log it
        logger.info(f"Data ingestion completed: {ingestion_data}")
        
        return state
    
    async def _generate_summary(self, state: AgentState) -> AgentState:
        """Generate summary of ingested data"""
        self._update_progress(state, 100, "Generating summary")
        
        summary_prompt = ChatPromptTemplate.from_template("""
        Based on the following data sources that were ingested, provide a comprehensive summary:
        
        Documents: {documents_count}
        Links: {links_count}
        Text Sources: {text_sources_count}
        Total Embeddings: {embeddings_count}
        
        Please provide:
        1. A brief overview of the data types processed
        2. Key themes or topics identified
        3. Data quality assessment
        4. Recommendations for further analysis
        
        Keep the summary concise but informative.
        """)
        
        try:
            summary = await self.llm.ainvoke(
                summary_prompt.format_messages(
                    documents_count=len(state.results.get("documents", [])),
                    links_count=len(state.results.get("links", [])),
                    text_sources_count=len(state.results.get("text_sources", [])),
                    embeddings_count=state.results.get("embeddings_created", 0)
                )
            )
            
            state.results["summary"] = summary.content
            
        except Exception as e:
            logger.error(f"Failed to generate summary: {e}")
            state.results["summary"] = "Summary generation failed"
        
        return state
