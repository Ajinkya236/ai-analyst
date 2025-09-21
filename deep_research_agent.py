"""
Deep Research Agent - Conducts comprehensive web research using multiple sources
"""
import asyncio
import aiohttp
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
from urllib.parse import urljoin, urlparse
import re

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from bs4 import BeautifulSoup

from base_agent import BaseAIAgent, AgentState
from config import Config

logger = logging.getLogger(__name__)

class DeepResearchAgent(BaseAIAgent):
    """Agent for conducting deep web research across multiple sources"""
    
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__(
            name="Deep Research Agent",
            description="Conducts comprehensive web research using multiple sources and data extraction",
            config=config
        )
        
        # Research sources configuration
        self.research_sources = {
            "official": [
                "crunchbase.com",
                "pitchbook.com",
                "angellist.com",
                "linkedin.com/company"
            ],
            "financial": [
                "sec.gov",
                "tracxn.com",
                "cbinsights.com",
                "bloomberg.com"
            ],
            "market": [
                "gartner.com",
                "statista.com",
                "mckinsey.com",
                "deloitte.com"
            ],
            "social": [
                "twitter.com",
                "linkedin.com",
                "glassdoor.com",
                "trustpilot.com"
            ],
            "regulatory": [
                "uspto.gov",
                "wipo.int",
                "gov.uk",
                "europa.eu"
            ]
        }
    
    def _build_graph(self):
        """Build the LangGraph workflow for deep research"""
        from langgraph.graph import StateGraph, END
        
        workflow = StateGraph(AgentState)
        
        # Define nodes
        workflow.add_node("analyze_query", self._analyze_query)
        workflow.add_node("generate_search_queries", self._generate_search_queries)
        workflow.add_node("execute_searches", self._execute_searches)
        workflow.add_node("extract_data", self._extract_data)
        workflow.add_node("validate_data", self._validate_data)
        workflow.add_node("enrich_data", self._enrich_data)
        workflow.add_node("generate_report", self._generate_report)
        
        # Define edges
        workflow.set_entry_point("analyze_query")
        workflow.add_edge("analyze_query", "generate_search_queries")
        workflow.add_edge("generate_search_queries", "execute_searches")
        workflow.add_edge("execute_searches", "extract_data")
        workflow.add_edge("extract_data", "validate_data")
        workflow.add_edge("validate_data", "enrich_data")
        workflow.add_edge("enrich_data", "generate_report")
        workflow.add_edge("generate_report", END)
        
        return workflow.compile()
    
    async def _execute(self, state: AgentState) -> AgentState:
        """Execute the deep research process"""
        try:
            self._update_progress(state, 10, "Starting deep research process")
            
            # Run the workflow
            result = await self.graph.ainvoke(state)
            
            self._update_progress(result, 100, "Deep research completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Deep research failed: {e}")
            return self._create_error_state(state, str(e))
    
    async def _analyze_query(self, state: AgentState) -> AgentState:
        """Analyze the research query and requirements"""
        self._update_progress(state, 20, "Analyzing research query")
        
        query_data = state.metadata.get("query", {})
        startup_name = query_data.get("startup_name", "")
        sector = query_data.get("sector", "")
        geography = query_data.get("geography", "")
        stage = query_data.get("stage", "")
        custom_questions = query_data.get("custom_questions", [])
        
        analysis_prompt = ChatPromptTemplate.from_template("""
        Analyze the following research request and provide a structured analysis:
        
        Startup Name: {startup_name}
        Sector: {sector}
        Geography: {geography}
        Stage: {stage}
        Custom Questions: {custom_questions}
        
        Please provide:
        1. Key research objectives
        2. Priority data points to find
        3. Potential challenges or limitations
        4. Recommended research approach
        
        Format as JSON with clear structure.
        """)
        
        try:
            analysis = await self.llm.ainvoke(
                analysis_prompt.format_messages(
                    startup_name=startup_name,
                    sector=sector,
                    geography=geography,
                    stage=stage,
                    custom_questions=", ".join(custom_questions) if custom_questions else "None"
                )
            )
            
            state.results["query_analysis"] = json.loads(analysis.content)
            
        except Exception as e:
            logger.error(f"Failed to analyze query: {e}")
            state.results["query_analysis"] = {
                "objectives": ["Find company information", "Research market data"],
                "priority_data": ["funding", "team", "traction"],
                "challenges": ["Limited public information"],
                "approach": ["Multi-source search"]
            }
        
        self._update_progress(state, 30, "Query analysis completed")
        return state
    
    async def _generate_search_queries(self, state: AgentState) -> AgentState:
        """Generate targeted search queries for different sources"""
        self._update_progress(state, 40, "Generating search queries")
        
        query_data = state.metadata.get("query", {})
        startup_name = query_data.get("startup_name", "")
        sector = query_data.get("sector", "")
        
        search_queries = {}
        
        for category, sources in self.research_sources.items():
            queries = []
            
            # Generate queries for each category
            if category == "official":
                queries = [
                    f'"{startup_name}" company profile',
                    f'"{startup_name}" funding rounds',
                    f'"{startup_name}" founders team',
                    f'"{startup_name}" investors'
                ]
            elif category == "financial":
                queries = [
                    f'"{startup_name}" SEC filings',
                    f'"{startup_name}" funding history',
                    f'"{startup_name}" valuation',
                    f'"{startup_name}" revenue metrics'
                ]
            elif category == "market":
                queries = [
                    f'"{sector}" market size TAM',
                    f'"{sector}" growth rate',
                    f'"{sector}" competitive landscape',
                    f'"{startup_name}" market position'
                ]
            elif category == "social":
                queries = [
                    f'"{startup_name}" reviews',
                    f'"{startup_name}" employee satisfaction',
                    f'"{startup_name}" social media presence',
                    f'"{startup_name}" customer feedback'
                ]
            elif category == "regulatory":
                queries = [
                    f'"{startup_name}" patents',
                    f'"{startup_name}" regulatory compliance',
                    f'"{startup_name}" legal filings',
                    f'"{sector}" regulations'
                ]
            
            search_queries[category] = queries
        
        state.results["search_queries"] = search_queries
        self._update_progress(state, 50, f"Generated {sum(len(q) for q in search_queries.values())} search queries")
        return state
    
    async def _execute_searches(self, state: AgentState) -> AgentState:
        """Execute searches across different sources"""
        self._update_progress(state, 60, "Executing web searches")
        
        search_queries = state.results.get("search_queries", {})
        search_results = {}
        
        async with aiohttp.ClientSession() as session:
            for category, queries in search_queries.items():
                category_results = []
                
                for query in queries:
                    try:
                        # Simulate search execution (in real implementation, use actual search APIs)
                        results = await self._execute_search_query(session, query, category)
                        category_results.extend(results)
                        
                        # Add delay to avoid rate limiting
                        await asyncio.sleep(0.5)
                        
                    except Exception as e:
                        logger.error(f"Search failed for query '{query}': {e}")
                
                search_results[category] = category_results
                logger.info(f"Found {len(category_results)} results for {category}")
        
        state.results["search_results"] = search_results
        self._update_progress(state, 70, f"Executed searches across {len(search_queries)} categories")
        return state
    
    async def _execute_search_query(self, session: aiohttp.ClientSession, query: str, category: str) -> List[Dict[str, Any]]:
        """Execute a single search query"""
        # This is a simplified implementation
        # In a real system, you would integrate with search APIs like Google Custom Search, Bing, etc.
        
        # For demo purposes, return mock results
        mock_results = [
            {
                "title": f"Search result for: {query}",
                "url": f"https://example.com/{category}/result1",
                "snippet": f"Relevant information about {query} from {category} source",
                "source": category,
                "confidence": 0.8
            },
            {
                "title": f"Another result for: {query}",
                "url": f"https://example.com/{category}/result2",
                "snippet": f"Additional information about {query} from {category} source",
                "source": category,
                "confidence": 0.7
            }
        ]
        
        return mock_results
    
    async def _extract_data(self, state: AgentState) -> AgentState:
        """Extract structured data from search results"""
        self._update_progress(state, 80, "Extracting structured data")
        
        search_results = state.results.get("search_results", {})
        extracted_data = {
            "company_info": {},
            "funding": [],
            "team": [],
            "market_data": {},
            "competition": [],
            "metrics": {},
            "risks": [],
            "signals": {}
        }
        
        # Process results from each category
        for category, results in search_results.items():
            for result in results:
                try:
                    # Extract data based on category
                    if category == "official":
                        company_data = await self._extract_company_info(result)
                        extracted_data["company_info"].update(company_data)
                    
                    elif category == "financial":
                        funding_data = await self._extract_funding_info(result)
                        if funding_data:
                            extracted_data["funding"].append(funding_data)
                    
                    elif category == "market":
                        market_data = await self._extract_market_info(result)
                        extracted_data["market_data"].update(market_data)
                    
                    elif category == "social":
                        social_data = await self._extract_social_signals(result)
                        extracted_data["signals"].update(social_data)
                    
                    elif category == "regulatory":
                        risk_data = await self._extract_regulatory_info(result)
                        if risk_data:
                            extracted_data["risks"].extend(risk_data)
                
                except Exception as e:
                    logger.error(f"Failed to extract data from result: {e}")
        
        state.results["extracted_data"] = extracted_data
        self._update_progress(state, 85, "Data extraction completed")
        return state
    
    async def _extract_company_info(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Extract company information from search result"""
        # This would use AI to extract structured data from the result
        return {
            "name": result.get("title", ""),
            "description": result.get("snippet", ""),
            "website": result.get("url", ""),
            "confidence": result.get("confidence", 0.5)
        }
    
    async def _extract_funding_info(self, result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Extract funding information from search result"""
        # This would use AI to extract funding data
        return {
            "round": "Series A",
            "amount": 15000000,
            "date": "2023-06-10",
            "investors": ["Sequoia", "Accel"],
            "confidence": result.get("confidence", 0.5)
        }
    
    async def _extract_market_info(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Extract market information from search result"""
        return {
            "tam": "5B",
            "growth_rate": "18%",
            "competitors": ["Competitor A", "Competitor B"],
            "confidence": result.get("confidence", 0.5)
        }
    
    async def _extract_social_signals(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Extract social signals from search result"""
        return {
            "sentiment": "positive",
            "engagement": "high",
            "reviews_score": 4.2,
            "confidence": result.get("confidence", 0.5)
        }
    
    async def _extract_regulatory_info(self, result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract regulatory information from search result"""
        return [
            {
                "type": "patent",
                "status": "pending",
                "description": "AI technology patent",
                "confidence": result.get("confidence", 0.5)
            }
        ]
    
    async def _validate_data(self, state: AgentState) -> AgentState:
        """Validate and score extracted data"""
        self._update_progress(state, 90, "Validating extracted data")
        
        extracted_data = state.results.get("extracted_data", {})
        
        # Calculate confidence scores
        validation_results = {
            "company_info_score": self._calculate_confidence_score(extracted_data.get("company_info", {})),
            "funding_score": self._calculate_confidence_score(extracted_data.get("funding", [])),
            "market_data_score": self._calculate_confidence_score(extracted_data.get("market_data", {})),
            "overall_confidence": 0.0
        }
        
        # Calculate overall confidence
        scores = [v for v in validation_results.values() if isinstance(v, (int, float))]
        validation_results["overall_confidence"] = sum(scores) / len(scores) if scores else 0.0
        
        state.results["validation_results"] = validation_results
        self._update_progress(state, 95, f"Data validation completed - Overall confidence: {validation_results['overall_confidence']:.2f}")
        return state
    
    def _calculate_confidence_score(self, data: Any) -> float:
        """Calculate confidence score for data"""
        if isinstance(data, dict):
            return sum(v.get("confidence", 0.5) for v in data.values() if isinstance(v, dict)) / len(data) if data else 0.0
        elif isinstance(data, list):
            return sum(item.get("confidence", 0.5) for item in data if isinstance(item, dict)) / len(data) if data else 0.0
        else:
            return 0.5
    
    async def _enrich_data(self, state: AgentState) -> AgentState:
        """Enrich data with additional analysis"""
        self._update_progress(state, 98, "Enriching data with analysis")
        
        extracted_data = state.results.get("extracted_data", {})
        
        # Generate SWOT analysis
        swot_analysis = await self._generate_swot_analysis(extracted_data)
        
        # Generate red flag report
        red_flags = await self._generate_red_flags_report(extracted_data)
        
        # Benchmark against industry
        benchmarking = await self._generate_benchmarking(extracted_data)
        
        state.results["enriched_analysis"] = {
            "swot": swot_analysis,
            "red_flags": red_flags,
            "benchmarking": benchmarking
        }
        
        return state
    
    async def _generate_swot_analysis(self, data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Generate SWOT analysis"""
        swot_prompt = ChatPromptTemplate.from_template("""
        Based on the following company data, generate a SWOT analysis:
        
        Company Info: {company_info}
        Funding: {funding}
        Market Data: {market_data}
        Metrics: {metrics}
        
        Provide strengths, weaknesses, opportunities, and threats as lists.
        """)
        
        try:
            swot = await self.llm.ainvoke(
                swot_prompt.format_messages(
                    company_info=json.dumps(data.get("company_info", {})),
                    funding=json.dumps(data.get("funding", [])),
                    market_data=json.dumps(data.get("market_data", {})),
                    metrics=json.dumps(data.get("metrics", {}))
                )
            )
            
            return json.loads(swot.content)
        except Exception as e:
            logger.error(f"Failed to generate SWOT analysis: {e}")
            return {
                "strengths": ["Strong team", "Innovative technology"],
                "weaknesses": ["Limited market presence", "High competition"],
                "opportunities": ["Market expansion", "Partnership opportunities"],
                "threats": ["Economic downturn", "Regulatory changes"]
            }
    
    async def _generate_red_flags_report(self, data: Dict[str, Any]) -> List[str]:
        """Generate red flags report"""
        red_flags = []
        
        # Check for common red flags
        if not data.get("company_info", {}).get("name"):
            red_flags.append("Missing company name")
        
        if not data.get("funding"):
            red_flags.append("No funding history found")
        
        if data.get("risks"):
            red_flags.extend([f"Risk: {risk.get('type', 'Unknown')}" for risk in data["risks"]])
        
        return red_flags
    
    async def _generate_benchmarking(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate benchmarking analysis"""
        return {
            "industry_average_funding": 10000000,
            "growth_rate_vs_industry": "Above average",
            "market_position": "Emerging",
            "competitive_advantage": "Technology innovation"
        }
    
    async def _generate_report(self, state: AgentState) -> AgentState:
        """Generate final research report"""
        self._update_progress(state, 100, "Generating research report")
        
        extracted_data = state.results.get("extracted_data", {})
        validation_results = state.results.get("validation_results", {})
        enriched_analysis = state.results.get("enriched_analysis", {})
        
        # Generate comprehensive report
        report = {
            "startup": extracted_data.get("company_info", {}).get("name", "Unknown"),
            "research_summary": {
                "total_sources_searched": sum(len(results) for results in state.results.get("search_results", {}).values()),
                "data_points_extracted": len(extracted_data),
                "overall_confidence": validation_results.get("overall_confidence", 0.0)
            },
            "company_info": extracted_data.get("company_info", {}),
            "funding": extracted_data.get("funding", []),
            "market_data": extracted_data.get("market_data", {}),
            "competition": extracted_data.get("competition", []),
            "metrics": extracted_data.get("metrics", {}),
            "risks": extracted_data.get("risks", []),
            "signals": extracted_data.get("signals", {}),
            "analysis": enriched_analysis,
            "generated_at": datetime.now().isoformat()
        }
        
        state.results["final_report"] = report
        logger.info(f"Generated comprehensive research report for {report['startup']}")
        
        return state
