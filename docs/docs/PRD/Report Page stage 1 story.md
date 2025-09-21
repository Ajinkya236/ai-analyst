Stage 1 Description: Investment Memo Deck Generation


0. stage 1 title text to be white font
1. click on view button of a investment memo should open the preview of the ppt

2. click on download button of a investment memo should donwload the ppt

3. generate button to not be in between prev and next buttons

4. next button and stage 2 button to be by default disabled, if at least one investment memo is created , then next button and stage 2 button to be

user flow:

When the user lands on Stage 1, the system displays a splash screen with animations and the text:

"Please do not stick around. This will take some time”

During this time, the PPT Generator AI Agent automatically creates Investment Memo decks based on the data collected and ingested in Stage 0, using only the sources selected by the user.

- Now user will view a list of such ppt documents with title, timestamp and version no in their name , created by ai
- he can click  on download button of  a document or delete a document 
-
- user can also click on generate button whoch opens a confirmation pop up to generate the ppt  again using stage 0 ingested sources
- he can click on prev  button of the stage 1 screen , to go to stage 0 screen
- click on prev will take him to stage 0 page where he can edit the data sources
and ingestion
- user can select  one of the created inestment memos , click on slect  will take him to stage 2 page "Curated Investment Memo screen"




PPT Generator AI Agent Description

Purpose: Automatically generates Investment Memo decks (PPT format) from ingested Stage 0 data sources, aligned to selected sources and structured sections.


The decks include the following sections:

Objective of the Memo – Investment, strategic partnership, or project approval goals.

Problem Statement – Pain points addressed, market challenges, inefficiencies.

Business Model – Type, revenue model, revenue streams.

Market Conditions – Trends, customer demographics, regulatory environment.

Growth Projections – Forecasted financial and operational growth.

Strategic Fit – Alignment with investor or partner goals.

Executive Summary – Concise overview, valuation, target returns, investment thesis.

Market Opportunity – TAM, SAM, SOM, growth potential, new opportunities.

Business Overview – Business model, plan, product-market fit, roadmap, pricing, value proposition.

Financial Analysis – Historical performance, revenue, profitability, EBITDA, burn rate.

Competitive Analysis – Direct/indirect competitors, SWOT, market share.

Management Team – Founders and executives profiles, track records.

Investment Thesis – Rationale for investment.

Risks and Mitigation – Financial, market, legal risks, mitigation strategies.

Valuation and Deal Structure – Valuation method, investment size, equity structure.

Exit Strategies – Scenarios, timeline, waterfall analysis.

Solution Description – Product uniqueness, value proposition, benefits.

Market Analysis – TAM, SAM, SOM, scale opportunity.

Competitive Landscape – Competitor strengths/weaknesses, differentiation, barriers to entry.

Product Development Status – Roadmap, milestones, funding usage.

Sales & Distribution – Go-to-market strategy, CAC, LTV, sales traction.

Key Metrics – Revenue growth, engagement, retention, charts/graphs.

Team Overview – Qualifications, expertise, advisors, board members.

Screening Report – Green flag score, AI confidence score, red flag analysis comparing founder files and voice transcript vs research agent data.

Investment Score – Combined AI confidence score and overall evaluation.


Capabilities:

Uses selected and ingested source data to populate all memo sections.

Formats data into slides with charts, graphs, and tables where applicable.

Calculates AI confidence scores for each section based on source reliability and completeness.

Creates multiple versions of the deck with title/version numbers.

Updates system to show newly generated deck list dynamically.

Boundaries:

Cannot include unselected sources.

Cannot alter manually edited data from Stage 0.

Only generates structured decks for review, download, or deletion.

User Journey with Embedded Rules/Flows

Landing on Stage 1

User sees splash screen with “No need to stick around…”

AI Agent automatically starts generating decks.

Viewing Generated Decks

System displays list of generated decks with title and version number.

User can download or delete a deck.

Stage Navigation

Prev button: Returns user to Stage 0, allowing editing of sources or re-ingestion.

Next button: Advances user to Stage 2: Curated Investment Memo Screen.

Rules: Navigation is only allowed after at least one deck is generated.

Data-Driven AI Behavior

Decks reflect selected sources only.

AI calculates confidence scores, red flag analysis, and overall investment score.

Multiple versions generated if desired (e.g., V1, V2) with unique titles.

Acceptance Criteria (AC) in GWT

Splash Screen

Given user lands on Stage 1

When AI agent begins deck generation

Then show loading splash with animations and message: “No need to stick around. This will take some time”.

Deck Generation

Given Stage 0 data has been ingested

When AI agent processes selected sources

Then generate a fully structured Investment Memo deck covering all defined sections.

Deck List Display

Given AI deck generation completes

When user views Stage 1

Then list decks with title and version number is displayed.

Download/Deletion

Given decks are displayed

When user clicks Download

Then deck is downloaded in PPT format.

When user clicks Delete

Then selected deck is removed from the list.

Prev Button Navigation

Given user clicks Prev

Then user is navigated to Stage 0 and can edit or re-ingest sources.

Next Button Navigation

Given at least one deck exists

When user clicks Next

Then user is navigated to Stage 2: Curated Investment Memo Screen.

AI Confidence & Scores

Given decks are generated

Then each deck includes green flag score, red flag analysis, AI confidence score, and overall investment score.

below is detailed description: 


Stage 1:  once user lands on the stage 1 screen he views a splash screen showing loading status with animations and text "No need to stick around. This will take some time" . AI agent  creates Investment Memo deck, based on the data collected and ingested in stage 0, as per selected only sources: 
6.1.	 objective of the memo. Are you seeking investment, strategic partnerships, or approval for a new project? Define what you hope to achieve and why the reader should care. 
6.2.	Identify the problem or pain point your business addresses. Explain why this problem is significant and worth solving. Highlight the current challenges and inefficiencies in the market that your product or service aims to overcome.
6.3.	Business model, Type of business model, revenue model and streams
6.4.	Market conditions
6.5.	Growth projections
6.6.	Strategic fit 
6.7.	Executive summary: Provides a concise overview of the investment opportunity. Includes a brief description of the company, valuation, target returns, potential risks, and a summary of the investment thesis.
6.8.	Market opportunity: Covers the market size (TAM, SAM, SOM), market trends, customer demographics, growth potential, regulatory environment, and new opportunities or challenges.
6.9.	Business overview: Includes a description of the target company's business model, business plan, customer acquisition strategy, product-market fit, product roadmap, pricing, and value proposition.
6.10.	Financial analysis: Assesses the target company’s historical performance, important milestones, financial projections, and other key metrics like revenue, profitability, cash flow, EBITDA, gross margin, and burn rate.
6.11.	Competitive analysis: Evaluates the company’s competitive landscape, including direct and indirect competitors, competitive advantages, SWOT analysis, and market share.
6.12.	Management team: Profiles the company’s founding team and top executives, their experience, track records, and ability to execute the business plan.
•	Investment thesis: Explains the rationale behind the opportunity, including growth potential, market positioning, or strategic alignment other goals.
•	Risks and mitigation: Identifies potential financial, market, legal, and other risks and offers mitigation strategies to address them.
•	Valuation and deal structure: Explains the valuation method, investment size, equity ownership structure, and other highlights from the term sheet including liquidation preferences and control rights.
•	Exit strategies: Outlines exit scenarios and includes an estimated timeline and waterfall analysis
6.13.	
6.14.	Describe your solution to the identified problem. Detail how your product or service works, what makes it unique, and why it is superior to existing solutions. Emphasize the value proposition and the benefits it provides to customers.
6.15.	Provide an analysis of the market size and potential. Include data on the total addressable market (TAM), the serviceable available market (SAM), and your serviceable obtainable market (SOM). This helps investors understand the scale of the opportunity and the potential for growth.
6.16.	Analyze the competitive landscape. Identify key competitors and their strengths and weaknesses. Explain how your business differentiates itself from the competition and the strategic advantages you hold. Highlight any barriers to entry that protect your position in the market.
6.17.	Detail the current state of your product development. Include information on the product roadmap, milestones achieved, and future plans. Explain how the capital you are raising will be used to advance product development and achieve key objectives.
6.18.	Sales and Distribution Outline your go-to-market strategy. Describe your sales and distribution channels, marketing plans, and any strategic partnerships. Provide data on customer acquisition costs (CAC), lifetime value (LTV), and sales traction to date.
6.19.	Present key performance metrics that demonstrate your business’s progress and potential. Include data on revenue growth, user engagement, customer retention, and other relevant metrics. Use charts and graphs to make this information easily digestible.
6.20.	Introduce your team and highlight their qualifications and expertise. Explain why your team is uniquely positioned to execute the business plan and achieve success. Include information on key advisors and board members who bring additional value and credibility.
6.21    Screening report with green flag Score and ai confidence score: 
	Data Comparison of founder files and voice transcript vs data found by research agent, + ai confidence score, and meaning of ranges of value
	Red flag analysis using above comparables, inconsistent metrics, inflated market size, or unusual churn patterns or bad employee or customer reviews and brand reputation
6.22 : show Investment Score and ai confidence score on the results








PPT Generator AI Agent Description

Purpose:
The PPT Generator AI Agent automatically generates Investment Memo decks (PowerPoint) from the ingested Stage 0 data sources, producing structured, visually organized decks that summarize investment opportunities for analyst review. The agent ensures all selected sources are reflected accurately, and calculates confidence and risk scores for each section.

Capabilities

Automated Deck Creation

Transforms ingested Stage 0 data into structured slides aligned with pre-defined memo sections (objective, problem, business model, market, financials, team, risks, etc.).

Formats content into readable, professional slides with text, tables, charts, and graphs.

Data-Driven Insights

Generates AI confidence scores for each section based on source reliability and completeness.

Performs red flag analysis comparing founder-submitted files and voice transcripts vs research agent findings.

Computes overall Investment Score per deck for decision-making.

Versioning

Creates multiple deck versions (e.g., V1, V2) with unique titles reflecting the generation timestamp or version number.

Selective Source Inclusion

Uses only the sources selected by the analyst from Stage 0.

Excludes unselected or irrelevant sources to maintain focus and accuracy.

Output Management

Populates system with the generated deck list including title and version number.

Allows decks to be downloaded or deleted by the analyst.

Supports previewing key metrics (green flag, red flag, confidence score) for each deck.

Performance & Scalability

Can process multiple decks in parallel.

Optimized for speed while maintaining accuracy of data representation.

Boundaries

Cannot modify original source data from Stage 0.

Cannot include unselected sources.

Does not provide investment advice.

Generates decks only; manual editing or annotation requires analyst intervention.

Behavior & Rules

Trigger: Activated automatically when user lands on Stage 1 and selected sources exist.

Progress Feedback: Displays a splash screen with animations and message: “No need to stick around. This will take some time” until decks are generated.

Error Handling: Logs and reports any failed deck generation attempts; retries automatically for transient errors.

Completion: Updates the system with a list of generated decks and activates the Next button for navigation.
Trigger Deck Generation













Given the user has ingested Stage 0 data and selected at least one source

When the user lands on Stage 1

Then the PPT Generator AI Agent starts generating Investment Memo decks automatically and displays a splash screen with the message: “No need to stick around. This will take some time.”

Deck Content Generation

Given the AI agent is generating decks

When the process completes

Then each deck includes all pre-defined sections (objective, problem, business model, market, growth, financials, team, risks, solution, metrics, screening report, and investment score) with structured formatting.

Selective Source Usage

Given multiple sources were ingested in Stage 0

When generating decks

Then the AI agent uses only the sources selected by the user and excludes unselected sources.

Deck Versioning

Given multiple decks are generated

When generation completes

Then each deck has a unique title and version number displayed in the deck list.

Deck List Display

Given decks are generated

When user views Stage 1

Then a list of all generated decks is displayed with options to download or delete each deck.

Download Deck

Given decks are listed

When the user clicks the Download button for a deck

Then the deck is downloaded in PPT format to the user’s device.

Delete Deck

Given decks are listed

When the user clicks the Delete button for a deck

Then the selected deck is removed from the list and the system updates the deck repository.

Navigation – Prev Button

Given user is on Stage 1

When the user clicks Prev

Then the system navigates the user back to Stage 0 to allow editing or re-ingestion of sources.

Navigation – Next Button

Given at least one deck exists in the list

When the user clicks Next

Then the system navigates the user to Stage 2: Curated Investment Memo screen.

AI Confidence & Scores

Given decks are generated

When user views a deck

Then each deck displays green flag score, red flag analysis, and overall AI confidence and investment score.

Error Handling

Given a deck generation fails

When the AI agent encounters an error

Then a failure message is logged and displayed, and the agent retries deck generation if possible.




