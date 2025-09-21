📖 User Story: Landing Page → CTA → Reports
Title

As an investor visiting the platform, I want to understand the product’s value proposition clearly and take a single action (“Analyze Startups”) so that I can begin evaluating startups without confusion or distraction.

Description (User Journey with Embedded Rules & Flows)

Step 1: Arrival on Landing Page

User Role (Human): Investor (associate, principal, or partner) lands on the app’s landing page for the first time.

System/AI Role:

Detects new vs. returning visitor (via cookies/session).

Personalizes messaging slightly (e.g., “Welcome back, ready to analyze another startup?”).

Rule: Must always render a hero section first, with headline, subheadline, supporting visual, and a single bold CTA button.

Step 2: Hero Section Engagement

User Role: Scans headline, subheadline, hero image/video.

System/AI Role:

Ensure copy and visual load fast (<2s).

Highlight only one CTA: “Analyze Startups” above the fold.

Rule: No secondary CTAs allowed in hero (avoid distraction).

Step 3: Benefits & Features Exploration

User Role: Scrolls to understand how the app saves time, improves consistency, and scales startup evaluation.

System/AI Role:

Present features as benefits-driven headlines with icons.

Each feature mapped to a business/user value (e.g., “Automated memo drafting → Saves associates 70% manual effort”).

Rule: Text should be scannable (bullet points, <50 words per benefit).

Step 4: Social Proof & Trust Signals

User Role: Looks for credibility (logos, testimonials, customer quotes).

System/AI Role:

Rotate authentic testimonials (with names, photos, affiliations).

Show VC firm or accelerator logos (if available).

Rule: Must include at least one testimonial + logo block before FAQ.

Step 5: Problem/Solution & FAQ

User Role: Seeks reassurance (e.g., “Will AI replace my judgment?”).

System/AI Role:

Present FAQ section addressing typical objections (privacy, data accuracy, role of humans).

Ensure collapsible FAQ cards for clean UX.

Rule: FAQs must always reinforce humans-in-control narrative.

Step 6: Final CTA Section

User Role: Reaches the bottom and considers next step.

System/AI Role:

Display final CTA (“Analyze Startups”) with strongest action color.

Remove navigation/footer clutter near final CTA.

Rule: Only one CTA visible in bottom section.

Step 7: CTA → Reports Page

User Role: Clicks “Analyze Startups.”

System/AI Role:

Immediately redirect user to My Reports page (same tab).

Auto-create a default “Reports” workspace (if first-time user).

Rule: Must be a seamless redirect with no intermediate popups or page reload delays >1s.

📏 Acceptance Criteria (GWT Format)
Hero Section

Given I am on the landing page

When the hero section loads

Then I should see a headline, subheadline, supporting visual, and one bold CTA (“Analyze Startups”) above the fold

Benefits & Features

Given I scroll past the hero section

When I view the benefits section

Then I should see product features described as benefits in a scannable format with icons and concise copy

Social Proof

Given I scroll past the benefits

When I view the social proof section

Then I should see at least one testimonial with name/photo and at least one logo of a trusted firm

FAQ Section

Given I scroll to the FAQ

When I expand a FAQ card

Then the answer should reinforce transparency, data reliability, and human control

Final CTA

Given I scroll to the end of the page

When I view the bottom CTA

Then I should see a single bold CTA button (“Analyze Startups”) styled with the action color

Redirect

Given I click on “Analyze Startups” (either hero or final CTA)

When I take that action

Then I should be redirected instantly (same tab) to the My Reports page with a default workspace created if I am a first-time user