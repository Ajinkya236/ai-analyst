📌 User Story: My Reports Page
Title: Manage and Create Reports
As a

VC associate or analyst

I want to

view, search, sort, create, and manage my startup evaluation reports in a consistent, easy-to-use interface

So that

I can efficiently organize reports, generate new ones with CRM integration or manual input, and maintain control over edits/deletions.

🧭 User Journey with Embedded Rules/Flows

Landing on My Reports Page

The user sees a grid/list of report tiles, sorted by last edited date (descending).

At the top, they see:

A Search Bar (for report titles, company names, or founder names).

A Sort option (default: “Last Edited Desc”).

A Create New Report button aligned consistently with the design system.

Searching & Sorting

When the user types in the search bar, results update dynamically.

When sort is changed, tiles reorder accordingly.

Creating a New Report

User clicks Create New Report → a pop-up modal appears.

Pop-up flow:

Step 1: Enter/search for Company Name.

If found in CRM (via AI Agent) → auto-fill description, founder phone, email.

If not found →

Company Name (mandatory, text input)

Description (optional)

Founder Phone (mandatory with country code selector)

Founder Email (mandatory text input)

Step 2: After filling required details → Next → redirect to the report/id page with report title, a back button and stage 0 screen 

step 3: 
my reports page -> Editing or Deleting a Report

On each tile, a vertical ellipsis (“…”) menu exists.

4: click on a report card to redirect to the report/id page with report title, a back button and previously accessed  stage n screen 

Options:

Edit Title (inline edit or modal input).

Delete Report (confirmation pop-up: “Are you sure? Yes/No”).

Design Consistency

All UI elements follow the same theme colors, fonts, spacing, and style as the Landing Page (dark navy, green highlights, serif/sans font system).

Spacing & Alignment Rules

Search bar ↔ Sort filter = 12px gap

Bubble filters ↔ Create Button = 12px gap

🤖 AI Agent Description for My Reports
Agent Name: Report Creation & CRM Assistant
Purpose

To streamline the process of creating new startup evaluation reports by intelligently connecting with internal CRM data, autofilling known details, and guiding the user through mandatory inputs when data is missing. The agent ensures speed, consistency, and reduced manual entry effort for associates and analysts.

Key Responsibilities

Company Search & Data Retrieval

Search company name in CRM or external linked database.

If company exists:

Autofill:

Company Description

Founder Phone (with country code)

Founder Email

Mark auto-filled fields as “pre-verified” with confidence scores.

If company does not exist:

Prompt user for manual inputs:

Company Name (mandatory)

Founder Email (mandatory)

Founder Phone with country code (mandatory)

Description (optional).

Validation & Rule Enforcement

Enforce rules:

Company Name = mandatory always.

Founder Email = mandatory if not in CRM.

Founder Phone = mandatory if not in CRM.

Description = optional unless auto-filled.

Check for invalid entries (e.g., wrong email format, phone number length).

AI Confidence & Escalation

Provide confidence scores for auto-filled data.

If confidence < threshold (e.g., 0.7), highlight field for user verification.

If data is missing or inconsistent, trigger escalation flow (user manual entry required).

Data Consistency & Integrity

Ensure company data is normalized before saving (e.g., consistent email formats, international phone codes, standardized description).

Sync saved entries with CRM for future reuse.

User Guidance & Transparency

Clearly mark which fields are auto-filled, which require manual entry, and which are optional.

Explain autofill provenance (e.g., “Pulled from CRM last updated 2024-12”).

Agent Workflow in My Reports

Trigger: User clicks Create New Report.

Step 1: Agent prompts user → “Enter or search for company name”.

Runs a search query against CRM.

Step 2: If match found → autofill fields with confidence scores.

Example: Founder Email (0.92 confidence, source: CRM update Dec 2024).

User can override autofilled details.

Step 3: If no match → prompt user for manual inputs.

Validate formats before proceeding.

Step 4: User clicks Next → agent packages the structured data → passes to report creation module → redirects to /report/{id}.

Step 5: Agent logs provenance (CRM, manual, external enrichment) for each data field.

Data Output Structure (to Report Module)
{
  "company_name": "AcmeTech",
  "description": "AI-driven healthcare platform",
  "founder_phone": {
    "country_code": "+1",
    "number": "9876543210",
    "confidence": 0.88,
    "provenance": "CRM"
  },
  "founder_email": {
    "value": "founder@acmetech.com",
    "confidence": 0.92,
    "provenance": "CRM"
  },
  "source": "CRM/manual",
  "created_by": "user123",
  "timestamp": "2025-09-20T18:45:00Z"
}

KPIs for Agent Effectiveness

Autofill Coverage % – % of reports where CRM data was successfully pulled.

Manual Input Reduction % – reduction in fields users typed vs. pre-agent workflow.

Data Accuracy % – correctness of autofilled fields validated later.

Time to Create Report – avg. time taken per report creation (target ↓ by 60%).

User Override Rate – % of autofilled fields edited by users (indicator of trust).

✅ Acceptance Criteria (GWT Format)
Report Tile Display

Given the user lands on the My Reports page

When the reports are displayed

Then they should be shown as tiles sorted by last edited date (descending).

Search Functionality

Given the user is on the My Reports page

When they type a keyword in the search bar

Then only matching reports (by title, company name, or founder name) should be displayed.

Sorting

Given the user is on the My Reports page

When they select a different sort option

Then the reports reorder accordingly.

Create New Report Pop-up

Given the user clicks on Create New Report

When the pop-up opens

Then they should be able to:

Search/select company from CRM → auto-fill fields (description, founder phone, email).

If company not found → enter mandatory Company Name, Founder Email, Founder Phone, optional Description.

Create Report Navigation

Given the user fills required info in the pop-up

When they click Next

Then they are redirected to /report/{id} in the same tab.

Edit Report

Given the user clicks the ellipsis (“…”) menu on a tile

When they choose Edit Title

Then they can edit the report title and save changes.

Delete Report

Given the user clicks the ellipsis (“…”) menu on a tile

When they choose Delete Report

Then a confirmation pop-up appears, and only upon confirmation, the report is deleted.

Design Consistency

Given the My Reports page is loaded

When any component (tiles, search, pop-ups, buttons) is rendered

Then it should follow the same design system as the Landing Page (colors, fonts, spacing).

Spacing Rules

Given the search bar, sort filter, bubble filters, and create button are displayed

When the page is viewed

Then there must be exactly 12px gap between defined components.

User Story:

As a user, I want to create a new startup evaluation report by providing or retrieving company details so that I can generate a report quickly with minimal manual effort.

Acceptance Criteria (GWT format)
1. Company Search & Autofill

Given I click “Create New Report”

When I enter a company name that exists in CRM

Then the system should autofill the company description, founder email, and founder phone with country code, along with confidence scores and data source labels.

2. No Company Match

Given I click “Create New Report”

When I enter a company name that does not exist in CRM

Then the system should require me to manually input:

Company Name (mandatory)

Founder Email (mandatory)

Founder Phone with country code (mandatory)

Description (optional).

3. Validation Rules

Given I provide company details

When I enter an invalid email or phone number (e.g., missing @ or wrong digit length)

Then the system should show an error message and prevent me from proceeding.

4. Autofill Confidence Threshold

Given the CRM autofills details

When the confidence score of a field is below 0.7

Then the system should highlight the field and prompt me to verify or edit the value before proceeding.

5. Manual Override of Autofill

Given CRM autofills company details

When I manually edit the autofilled values

Then the system should accept my changes and save them as the final version.

6. Report Creation & Redirect

Given I have provided all mandatory details

When I click “Next”

Then the system should save the data, generate a new report entry, and redirect me to /report/{id}.

7. Data Provenance Tracking

Given company details are either autofilled or manually entered

When the report is created

Then the system should store the provenance of each field (e.g., CRM/manual) along with a confidence score.

8. Mandatory Field Enforcement

Given I try to create a report

When I leave any mandatory field (Company Name, Founder Email, Founder Phone) empty

Then the system should not allow me to proceed and should display a clear validation error.