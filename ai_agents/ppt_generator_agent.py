#!/usr/bin/env python3
"""
PPT Generator AI Agent
Automatically generates Investment Memo decks (PowerPoint) from ingested Stage 0 data sources.
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
import uuid

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class MemoSection:
    """Represents a section of the investment memo"""
    title: str
    content: str
    confidence: float
    data_sources: List[str]
    charts: List[Dict[str, Any]] = None
    tables: List[Dict[str, Any]] = None

@dataclass
class InvestmentMemo:
    """Represents a complete investment memo"""
    id: str
    title: str
    company_name: str
    version: int
    status: str
    summary: str
    sections: List[MemoSection]
    average_confidence: float
    risk_flags: int
    investment_score: float
    green_flag_score: float
    red_flag_analysis: Dict[str, Any]
    created_at: datetime
    file_path: Optional[str] = None

class PPTGeneratorAgent:
    """AI Agent for generating Investment Memo PowerPoint presentations"""
    
    def __init__(self):
        self.agent_name = "PPTGeneratorAgent"
        self.version = "1.0.0"
        self.status = "ready"
        self.current_session = None
        
        # Define required memo sections based on PRD
        self.required_sections = [
            "Objective of the Memo",
            "Problem Statement", 
            "Business Model",
            "Market Conditions",
            "Growth Projections",
            "Strategic Fit",
            "Executive Summary",
            "Market Opportunity",
            "Business Overview",
            "Financial Analysis",
            "Competitive Analysis",
            "Management Team",
            "Investment Thesis",
            "Risks and Mitigation",
            "Valuation and Deal Structure",
            "Exit Strategies",
            "Solution Description",
            "Market Analysis",
            "Competitive Landscape",
            "Product Development Status",
            "Sales & Distribution",
            "Key Metrics",
            "Team Overview",
            "Screening Report",
            "Investment Score"
        ]
        
        logger.info(f"Initialized {self.agent_name} v{self.version}")

    async def generate_investment_memo(
        self, 
        report_id: str, 
        session_id: str,
        company_name: str,
        selected_sources: List[Dict[str, Any]],
        config: Optional[Dict[str, Any]] = None
    ) -> InvestmentMemo:
        """Generate a complete investment memo from selected sources"""
        
        logger.info(f"Starting investment memo generation for {company_name}")
        self.status = "running"
        self.current_session = session_id
        
        try:
            # Create memo ID and basic info
            memo_id = f"memo_{report_id}_{int(datetime.now().timestamp())}"
            version = 1
            
            # Generate sections based on selected sources
            sections = await self._generate_memo_sections(selected_sources, company_name)
            
            # Calculate confidence scores
            average_confidence = sum(section.confidence for section in sections) / len(sections) if sections else 0
            
            # Perform risk analysis
            risk_flags, red_flag_analysis = await self._analyze_risks(sections, selected_sources)
            
            # Calculate investment scores
            investment_score = await self._calculate_investment_score(sections, risk_flags)
            green_flag_score = await self._calculate_green_flag_score(sections)
            
            # Generate summary
            summary = await self._generate_summary(sections, company_name, investment_score)
            
            # Create investment memo
            memo = InvestmentMemo(
                id=memo_id,
                title=f"{company_name} Investment Memo",
                company_name=company_name,
                version=version,
                status="completed",
                summary=summary,
                sections=sections,
                average_confidence=average_confidence,
                risk_flags=risk_flags,
                investment_score=investment_score,
                green_flag_score=green_flag_score,
                red_flag_analysis=red_flag_analysis,
                created_at=datetime.now()
            )
            
            # Generate PPT file (mock for now)
            memo.file_path = await self._generate_ppt_file(memo)
            
            logger.info(f"Successfully generated investment memo: {memo_id}")
            self.status = "completed"
            
            return memo
            
        except Exception as e:
            logger.error(f"Error generating investment memo: {str(e)}")
            self.status = "failed"
            raise e
        finally:
            self.current_session = None

    async def _generate_memo_sections(
        self, 
        selected_sources: List[Dict[str, Any]], 
        company_name: str
    ) -> List[MemoSection]:
        """Generate all required memo sections"""
        
        sections = []
        
        for section_title in self.required_sections:
            try:
                # Extract relevant data from sources for this section
                section_data = await self._extract_section_data(section_title, selected_sources)
                
                # Generate content for the section
                content = await self._generate_section_content(section_title, section_data, company_name)
                
                # Calculate confidence based on data quality
                confidence = await self._calculate_section_confidence(section_data, section_title)
                
                # Create section
                section = MemoSection(
                    title=section_title,
                    content=content,
                    confidence=confidence,
                    data_sources=section_data.get('sources', []),
                    charts=section_data.get('charts', []),
                    tables=section_data.get('tables', [])
                )
                
                sections.append(section)
                
            except Exception as e:
                logger.warning(f"Error generating section {section_title}: {str(e)}")
                # Create empty section with low confidence
                section = MemoSection(
                    title=section_title,
                    content=f"Unable to generate content for {section_title}",
                    confidence=0.0,
                    data_sources=[]
                )
                sections.append(section)
        
        return sections

    async def _extract_section_data(
        self, 
        section_title: str, 
        selected_sources: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Extract relevant data for a specific section from selected sources"""
        
        # This would analyze the selected sources and extract relevant data
        # For now, return mock data based on section type
        
        section_data = {
            'sources': [source.get('id', '') for source in selected_sources],
            'charts': [],
            'tables': []
        }
        
        # Add section-specific data extraction logic here
        if "Financial" in section_title:
            section_data['charts'] = [
                {'type': 'revenue_growth', 'title': 'Revenue Growth Projection'},
                {'type': 'burn_rate', 'title': 'Monthly Burn Rate'}
            ]
        elif "Market" in section_title:
            section_data['charts'] = [
                {'type': 'tam_sam_som', 'title': 'Market Size Analysis'},
                {'type': 'market_trends', 'title': 'Market Trends'}
            ]
        elif "Competitive" in section_title:
            section_data['tables'] = [
                {'type': 'competitor_comparison', 'title': 'Competitor Analysis'}
            ]
        
        return section_data

    async def _generate_section_content(
        self, 
        section_title: str, 
        section_data: Dict[str, Any], 
        company_name: str
    ) -> str:
        """Generate content for a specific section"""
        
        # This would use AI/LLM to generate content based on the data
        # For now, return mock content
        
        content_templates = {
            "Objective of the Memo": f"This memo evaluates the investment opportunity in {company_name}, seeking to determine the viability of a Series A investment round.",
            "Problem Statement": f"{company_name} addresses critical market inefficiencies in their target sector, solving key pain points for customers.",
            "Business Model": f"{company_name} operates on a [revenue model] with multiple revenue streams including [streams].",
            "Market Conditions": f"The target market shows strong growth potential with favorable regulatory conditions and increasing demand.",
            "Growth Projections": f"Based on current traction and market analysis, {company_name} projects [growth metrics] over the next 3 years.",
            "Strategic Fit": f"This investment aligns with our portfolio strategy and offers significant synergies with existing investments.",
            "Executive Summary": f"{company_name} presents a compelling investment opportunity with strong market potential and experienced team.",
            "Market Opportunity": f"Total Addressable Market (TAM): $X billion, Serviceable Available Market (SAM): $Y billion, Serviceable Obtainable Market (SOM): $Z billion.",
            "Business Overview": f"{company_name} has developed a unique solution that addresses market needs with strong product-market fit.",
            "Financial Analysis": f"Historical performance shows [metrics] with projected revenue growth of [percentage] annually.",
            "Competitive Analysis": f"Competitive landscape analysis reveals {company_name}'s unique positioning and competitive advantages.",
            "Management Team": f"The founding team brings [experience] with proven track records in [areas].",
            "Investment Thesis": f"Investment thesis is based on [key factors] that support strong returns and market success.",
            "Risks and Mitigation": f"Key risks include [risks] with mitigation strategies including [strategies].",
            "Valuation and Deal Structure": f"Valuation methodology: [method], Investment size: $X, Equity structure: [details].",
            "Exit Strategies": f"Potential exit scenarios include [scenarios] with estimated timeline of [timeframe].",
            "Solution Description": f"{company_name}'s solution provides [benefits] with unique value proposition of [proposition].",
            "Market Analysis": f"Market analysis reveals [insights] supporting the investment opportunity.",
            "Competitive Landscape": f"Competitive analysis shows {company_name}'s differentiation and market positioning.",
            "Product Development Status": f"Product roadmap includes [milestones] with current development status of [status].",
            "Sales & Distribution": f"Go-to-market strategy includes [channels] with customer acquisition cost of $X and LTV of $Y.",
            "Key Metrics": f"Key performance indicators include [metrics] showing [trends].",
            "Team Overview": f"Team qualifications and expertise include [details] with advisory board of [advisors].",
            "Screening Report": f"AI screening analysis shows [green flags] with confidence score of [score]%.",
            "Investment Score": f"Overall investment score: [score]/100 based on comprehensive analysis."
        }
        
        return content_templates.get(section_title, f"Content for {section_title} section.")

    async def _calculate_section_confidence(
        self, 
        section_data: Dict[str, Any], 
        section_title: str
    ) -> float:
        """Calculate confidence score for a section based on data quality"""
        
        # Base confidence on data availability and quality
        base_confidence = 70.0
        
        # Adjust based on data sources
        source_count = len(section_data.get('sources', []))
        if source_count > 0:
            base_confidence += min(source_count * 5, 20)
        
        # Adjust based on charts and tables
        if section_data.get('charts'):
            base_confidence += 5
        if section_data.get('tables'):
            base_confidence += 5
        
        # Add some randomness for realism
        import random
        confidence = base_confidence + random.uniform(-10, 10)
        
        return max(0, min(100, confidence))

    async def _analyze_risks(
        self, 
        sections: List[MemoSection], 
        selected_sources: List[Dict[str, Any]]
    ) -> tuple[int, Dict[str, Any]]:
        """Analyze risks and generate red flag analysis"""
        
        risk_flags = 0
        red_flag_analysis = {}
        
        # Analyze each section for potential risks
        for section in sections:
            if section.confidence < 50:
                risk_flags += 1
                red_flag_analysis[f"low_confidence_{section.title.lower().replace(' ', '_')}"] = {
                    "type": "Low Confidence",
                    "description": f"Low confidence score ({section.confidence}%) for {section.title}",
                    "severity": "medium"
                }
        
        # Check for data inconsistencies
        if len(selected_sources) < 3:
            risk_flags += 1
            red_flag_analysis["insufficient_sources"] = {
                "type": "Insufficient Data",
                "description": "Limited data sources available for analysis",
                "severity": "high"
            }
        
        # Check for missing critical sections
        critical_sections = ["Financial Analysis", "Management Team", "Market Analysis"]
        for critical in critical_sections:
            section = next((s for s in sections if critical in s.title), None)
            if not section or section.confidence < 60:
                risk_flags += 1
                red_flag_analysis[f"missing_{critical.lower().replace(' ', '_')}"] = {
                    "type": "Missing Critical Data",
                    "description": f"Insufficient data for {critical}",
                    "severity": "high"
                }
        
        return risk_flags, red_flag_analysis

    async def _calculate_investment_score(
        self, 
        sections: List[MemoSection], 
        risk_flags: int
    ) -> float:
        """Calculate overall investment score"""
        
        # Base score from average confidence
        base_score = sum(section.confidence for section in sections) / len(sections) if sections else 0
        
        # Adjust for risk flags
        risk_penalty = risk_flags * 5
        
        # Adjust for section completeness
        completeness_bonus = min(len(sections) / len(self.required_sections) * 10, 10)
        
        investment_score = base_score - risk_penalty + completeness_bonus
        
        return max(0, min(100, investment_score))

    async def _calculate_green_flag_score(
        self, 
        sections: List[MemoSection]
    ) -> float:
        """Calculate green flag score based on positive indicators"""
        
        green_flags = 0
        total_indicators = 0
        
        # Check for high confidence sections
        for section in sections:
            total_indicators += 1
            if section.confidence > 80:
                green_flags += 1
        
        # Check for specific positive indicators
        positive_sections = ["Management Team", "Financial Analysis", "Market Analysis"]
        for section in sections:
            if any(positive in section.title for positive in positive_sections):
                if section.confidence > 75:
                    green_flags += 1
                total_indicators += 1
        
        return (green_flags / total_indicators * 100) if total_indicators > 0 else 0

    async def _generate_summary(
        self, 
        sections: List[MemoSection], 
        company_name: str, 
        investment_score: float
    ) -> str:
        """Generate executive summary of the investment memo"""
        
        high_confidence_sections = [s for s in sections if s.confidence > 80]
        avg_confidence = sum(s.confidence for s in sections) / len(sections) if sections else 0
        
        summary = f"Comprehensive analysis of {company_name}'s investment opportunity. "
        summary += f"Analysis covers {len(sections)} key areas with an average confidence of {avg_confidence:.1f}%. "
        summary += f"Overall investment score: {investment_score:.1f}/100. "
        
        if high_confidence_sections:
            summary += f"Strong data available for {len(high_confidence_sections)} sections including "
            summary += ", ".join([s.title for s in high_confidence_sections[:3]])
            if len(high_confidence_sections) > 3:
                summary += f" and {len(high_confidence_sections) - 3} others"
            summary += "."
        
        return summary

    async def _generate_ppt_file(self, memo: InvestmentMemo) -> str:
        """Generate PowerPoint file for the memo"""
        
        # This would generate an actual PPT file
        # For now, return a mock file path
        
        file_name = f"{memo.title.replace(' ', '_')}_v{memo.version}_{int(datetime.now().timestamp())}.ppt"
        file_path = f"/tmp/generated_memos/{file_name}"
        
        # In production, this would:
        # 1. Create actual PowerPoint file using python-pptx or similar
        # 2. Add slides for each section
        # 3. Include charts and tables
        # 4. Apply professional formatting
        # 5. Save to file system or cloud storage
        
        logger.info(f"Generated PPT file: {file_path}")
        return file_path

    async def get_status(self, session_id: str) -> Dict[str, Any]:
        """Get current status of the agent"""
        
        return {
            "agent_name": self.agent_name,
            "version": self.version,
            "status": self.status,
            "current_session": self.current_session,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat()
        }

    async def list_generated_memos(self, report_id: str) -> List[Dict[str, Any]]:
        """List all generated memos for a report"""
        
        # This would query a database or file system
        # For now, return mock data
        
        return [
            {
                "id": f"memo_{report_id}_1",
                "title": "Sample Investment Memo",
                "company_name": "Sample Company",
                "version": 1,
                "status": "completed",
                "created_at": datetime.now().isoformat(),
                "file_path": "/tmp/sample_memo.ppt"
            }
        ]

    async def delete_memo(self, memo_id: str) -> bool:
        """Delete a generated memo"""
        
        # This would delete from database and file system
        logger.info(f"Deleted memo: {memo_id}")
        return True

# Global instance
ppt_generator_agent = PPTGeneratorAgent()
