
Stage 2:  once user lands on the stage 2 screen he views a splash screen showing loading status with animations and text "No need to stick around. This will take some time" . AI agent  creates Investment Memo deck based on default preferences values, based on the data collected and ingested in stage 0 and stage 1 documents created , as per selected only sources: 



- Now user will view a list of such ppt documents with title and version no in their name  in two sections: curated memo and Investment memo, created by ai

- he can click  on download button of  a document or delete a document 
- user can click on generate button whoch opens a confirmation pop up to generate the document again using preferences set and the stage 0 ingested sources and stage 1 doc as context/memory
- he can click on prev  button of the stage 2 screen ,
- click on prev will take him to stage 1 page where he can only view the list of investment memo decks 

- user can also click on edit preferences which allows him to configure weightages for the 4 sections of the curated investment memo and parts inside the section
Curated Investment Memo – Edit Preferences Form
Form Purpose

Allow the analyst or user to adjust the relative importance (weightage) of each section and sub-part of the memo. This will influence the AI scoring, highlights, and ranking in the Curated Investment Memo output.

1. Section-Level Weightage

Instruction: “Adjust the importance of each section for scoring and prioritization (Total must sum to 100%).”

UI Element: Slider or numeric input (0–100) per section.

Sections:

Founder Profile

Problem Sizing

Differentiation

Company Review

2. Sub-Part Weightage (Optional Advanced)

Instruction: “Optionally adjust weightages for key sub-parts within each section (sum of sub-parts = 100% of the section).”

UI Element: Expandable accordion for each section showing sub-parts with sliders or numeric inputs.

Example Configuration:

Founder Profile

Founder-Market Fit (0–100)

Behavioral Analysis Summary (0–100)

Work Profile & Achievements (0–100)

Founder Commitment (0–100)

Problem Sizing

Problem Validation (0–100)

Market Sizing (TAM, SAM, SOM) (0–100)

Competitive Landscape (0–100)

Differentiation

Positioning & Pricing (0–100)

Benefits & Product Differentiation (0–100)

Moat (0–100)

Delivery Channels & Distribution (0–100)

Design Differentiation (0–100)

User Perception & Branding (0–100)

Company Review

Financial KPIs & Metrics (0–100)

User & Engagement KPIs (0–100)

Unit Economics / Retention (0–100)

Operating Health (0–100)

Sales & Funnel (0–100)

Risk Assessment (0–100)

Investment Thesis & Visual Summaries (0–100)

Red Flag Analysis (0–100)

3. Form Controls

Reset to Default: Button to reset all weightages to system defaults.

Validation:

Section weightages must sum to 100%.

Sub-part weightages must sum to 100% within their section.

Save Preferences: Button to save changes.

Cancel: Button to discard changes.

4. UX Considerations

Expandable/Collapsible Sections: Allows focusing on sections the user cares most about.

Live Preview/Impact Indicator: Show a real-time preview of how weight changes will affect the overall memo scoring.

Tooltip/Info Icon: Explain what each section/sub-part represents.







Curated Investment Memo – Stage 2 Description (Refined)

The Curated Investment Memo synthesizes insights from the Stage 1 AI-generated Investment Memo and ingested Stage 0 sources. It organizes analysis into four main parts: Founder Profile, Problem Sizing, Differentiation, and Company Review. This memo provides actionable insights for investors by combining quantitative KPIs, qualitative assessments, competitive intelligence, and risk analysis.

1. Founder Profile

Provides a holistic view of the founder’s background, market fit, and behavioral characteristics.

Subsections:

Founder-Market Fit

Alignment of founder skills, experience, and vision with the target market.

Behavioral Analysis Summary

Insights from behavioral assessments (Google Forms) and critical incident reports, if available.

Highlights decision-making style, leadership traits, and risk appetite.

Work Profile & Achievements

Education, work experience, sector expertise, top skills, competencies, projects, and notable achievements.

Founder Commitment

Time, capital, and equity share invested in the business.

2. Problem Sizing

Validates the business problem and quantifies the market opportunity.

Subsections:

Problem Validation

Verified using customer voice, search insights, and secondary data.

Relevance of the problem in current market conditions.

Market Sizing

TAM, SAM, SOM, including target segment sizing.

Competitive Landscape

Competitors targeting the same industry/sector/segment, their financial multiples, hiring data, traction signals, and market share.

3. Differentiation

Assesses the startup’s unique positioning and competitive advantages.

Subsections:

Positioning & Pricing

Benefits Differentiation – Key product/service benefits.

Moat – Sustainable competitive advantages.

Product Differentiation – Unique features, IP, patents.

Delivery Channels & Distribution – Sales and marketing channels.

Design Differentiation – UX/UI, product design.

User Perception & Branding – Satisfaction scores, testimonials, and brand differentiation.

4. Company Review

Comprehensive operational, financial, market, and risk review.

Subsections:

Company Identity & Metadata

company_name, legal_entity_name (optional), ticker, domain, headquarters_city, headquarters_country.

Team

founder_list (array: name, role, LinkedIn URL, confidence score), founding date/year.

Organizational structure, key executives, and team journey.

Stage & Market

Stage (enum), primary sector tags, one-liner description.

Financial KPIs & Metrics

Revenue: ARR, MRR, Revenue_TTM, Revenue_latest_month, YoY and MoM growth %.

User & Engagement: total_users, active_users (DAU/MAU), ARPU.

Unit Economics / Retention: churn_rate_monthly/annual, CAC, LTV, LTV:CAC ratio, gross_margin_pct.

Operating Health: burn_rate_monthly, runway_months, cash_on_hand, total headcount, hiring_velocity.

Sales & Funnel: new_customer_signups_monthly, paying_customers_total, enterprise_customers_count.

Other Signals: top_customers, notable_partners, recent_funding_rounds, traction_highlights.

Per KPI Metadata

Confidence score (0–1), provenance (data source), unit and timeframe.

Financial, Market & Operational Risk Assessment

Identification of financial, market, legal, and operational risks.

Mitigation strategies suggested based on data analysis and industry benchmarks.

Investment Thesis

Summary of why the startup presents a compelling opportunity.

Includes growth potential, market positioning, and strategic alignment.

Visual Summaries

Charts/graphs for growth, traction, market share, and KPIs.

Red Flag Analysis

Detect inconsistencies in founder data vs research agent data, inflated metrics, unusual churn, negative reviews, or reputational issues.