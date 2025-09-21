VC Analyst Investment Memo App – Overview
Purpose

The app is designed to help venture capital analysts and investors collect, synthesize, and evaluate startup data efficiently. By leveraging AI agents, it automates data ingestion, research, analysis, and memo generation while keeping the user in control of preferences, scoring, and prioritization.

It enables faster decision-making, deeper insights, and structured reporting for Investment Committee (IC) evaluations.

Core Users

VC Analysts / Associates – Collect data, trigger AI workflows, and review generated memos.

Principals / Partners – Review curated memos and insights for IC decisions.

Admins – Configure system defaults, behavioral assessments, and AI agent parameters.

Key Functional Modules
1. Stage 0 – Data Collection

Sources: Upload founder files (PDF, DOCX, PPT, video, email threads), paste text, or add links (website, YouTube).

Founder Voice Capture: AI agent calls founders to capture adaptive Q&A (structured + sentiment analysis).

Founder Behavioral Assessment: Send psychometric surveys via SMS/email and ingest results automatically.

Deep Research Agent: Searches public & paid sources for funding, market, competitor, and sentiment intelligence.

Data Ingestion Agent: Normalizes all collected sources into structured formats (JSON/tabular) with confidence scores and metadata.

User Actions: Add/edit/delete sources, select relevant ones, and track ingestion progress with splash/loading UI.

2. Stage 1 – AI-Generated Investment Memo

AI synthesizes collected Stage 0 data into structured Investment Memo decks.

Deck includes founder profile, market sizing, differentiation, and company review.

Analyst can view, download, delete, or select decks as context for Stage 2.

3. Stage 2 – Curated Investment Memo

AI Curated Memo: Combines Stage 1 decks + Stage 0 sources into an actionable, prioritized memo.

Document Management: View decks (Curated Memo & Investment Memo) with version numbers; download, delete, or regenerate decks.

Edit Preferences: Configure weightages for sections and sub-parts (Founder Profile, Problem Sizing, Differentiation, Company Review).

Scoring Impact: Adjusted preferences influence AI scoring, highlights, and recommendations.

Visual Summaries: Charts, graphs, and risk red flags for quick insights.

AI Agents

Founder Voice AI Agent

Conducts structured calls to founders

Captures voice, transcripts, sentiment, and confidence

Adaptive questioning based on responses

Behavioral Assessment Agent

Sends secure psychometric assessment links

Ingests and scores responses

Provides structured behavioral insights

Deep Research Agent

Searches multiple layers of sources (websites, Crunchbase, SEC filings, blogs, social media)

Extracts and structures company, market, financial, and competitor data

Data Ingestion Agent

Normalizes uploaded or collected data

Applies RAG/CAG/MCP techniques

Assigns confidence scores and metadata

Blocks next stage until ingestion completes

Curated Memo Agent

Generates stage 2 memo based on Stage 1 + Stage 0 sources

Uses weightages defined by default or user-edited preferences

Produces actionable insights and visual summaries

Benefits

Saves time by automating research and memo creation.

Provides structured, validated insights with confidence scores.

Allows custom prioritization of memo sections for focused analysis.

Combines quantitative KPIs and qualitative assessments for holistic evaluation.

Supports collaboration across analyst, principal, and partner roles.