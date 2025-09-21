Design Guidelines for New App
🎨 Color Scheme & Backgrounds
Primary Background
•	Use dark gradient background: linear-gradient(135deg, #0f1419 0%, #1e2a3a 20%, #2d4059 40%, #3d5a80 60%, #5a4fcf 80%, #7b68ee 100%)
•	Add subtle texture overlays with radial gradients for depth
•	Never use solid bright colors as main backgrounds
Glassmorphic Elements
•	Main Cards: background: rgba(255, 255, 255, 0.08) + backdrop-filter: blur(20px)
•	Secondary Elements: background: rgba(255, 255, 255, 0.12) for hover states
•	Borders: 1px solid rgba(255, 255, 255, 0.12) for all glassmorphic elements
•	Shadows: box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4)
🔲 Card/container Design Rules
Card/ container Structure
•	Border-radius: Always use 16px-20px for main cards, 12px for smaller elements
•	Padding: 24px-32px for large cards, 16px-20px for compact cards
•	Margins: 20px-24px gap between cards in grid layouts
•	Hover Effects: transform: translateY(-2px) with increased shadow and brightness
Card/ container Layout Options
•	Vertical Cards: 300px-400px width, auto height
•	Horizontal Cards: 480px+ width, 120px-140px height
•	Compact Cards: 280px-320px width for secondary content
Card /container Content Hierarchy
1.	Tags at top (small, pill-shaped)
2.	Title (20px-32px font size)
3.	Description (13px-16px font size)
4.	Progress/stats section
5.	Action buttons at bottom
🏷️ Tags & Pills
Bubble Tags
•	background: rgba(255, 255, 255, 0.15) + backdrop-filter: blur(10px)
•	border-radius: 12px-20px (pill shape)
•	padding: 6px-12px 10px-16px
•	font-size: 10px-12px
•	font-weight: 500-600
•	White text: color: rgba(255, 255, 255, 0.9)
Tag Categories
•	Status Tags: Required, Optional, New, Popular, Trending
•	Skill Level: BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
•	Type Tags: Skill, Topic, Course, Certification
•	Time Tags: +1 YR, +2 YRS, Entry Level
📝 Typography
Font Stack
css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
Text Hierarchy
•	Main Titles: 32px-56px, font-weight: 700, white
•	Section Titles: 24px-32px, font-weight: 600-700, white
•	Card Titles: 18px-24px, font-weight: 700, white
•	Body Text: 13px-16px, font-weight: 400, rgba(255, 255, 255, 0.7-0.8)
•	Small Text: 10px-12px, font-weight: 400-500, rgba(255, 255, 255, 0.6)
Text Colors
•	Primary Text: color: white
•	Secondary Text: color: rgba(255, 255, 255, 0.8)
•	Tertiary Text: color: rgba(255, 255, 255, 0.6-0.7)
•	Placeholder Text: color: rgba(255, 255, 255, 0.5)
🔘 Buttons & Interactive Elements
Primary Buttons
•	background: rgba(255, 255, 255, 0.15) + backdrop-filter: blur(10px)
•	border: 1px solid rgba(255, 255, 255, 0.2)
•	border-radius: 8px-12px
•	padding: 12px-16px 20px-24px
•	Hover: background: rgba(255, 255, 255, 0.25)
Secondary Buttons
•	background: rgba(255, 255, 255, 0.08)
•	Same styling as primary but lower opacity
•	Hover: background: rgba(255, 255, 255, 0.15)
Button Text
•	color: white
•	font-weight: 500-600
•	font-size: 12px-16px
•	Include arrow icons: → for actions
📊 Progress & Data Visualization
Progress Bars
•	Container: background: rgba(255, 255, 255, 0.1), height: 4px-8px, border-radius: 2px-4px
•	Fill: background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)
•	Width: 80px-120px for compact, 100% for full-width
Progress Levels
•	Beginner: 0-40% (Red-orange gradient)
•	Intermediate: 41-70% (Orange-yellow gradient)
•	Advanced: 71-90% (Blue gradient)
•	Expert: 91-100% (Green-blue gradient)
🔍 Search & Input Fields
Search Bars
•	background: rgba(255, 255, 255, 0.08) + backdrop-filter: blur(20px)
•	border-radius: 50px for search, 12px for regular inputs
•	padding: 16px 24px
•	Focus: Increase background opacity to 0.12
Input Styling
•	White text, placeholder at 50% opacity
•	No outline, use border color changes for focus states
•	Consistent with glassmorphic theme
🧭 Navigation
Top Navigation
•	background: rgba(64, 64, 64, 0.4) + backdrop-filter: blur(20px)
•	Sticky positioning: position: sticky; top: 0
•	border-bottom: 1px solid rgba(255, 255, 255, 0.1)
Navigation Items
•	Default: Transparent background
•	Hover: background: rgba(128, 128, 128, 0.2)
•	Active: background: rgba(128, 128, 128, 0.25)
•	border-radius: 12px, padding: 8px-12px 16px-20px
📱 Layout & Spacing
Grid Systems
•	Card Grids: grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
•	Gap: 20px-24px between grid items
•	Container: max-width: 1200px-1400px, centered
Spacing Scale
•	XS: 4px-6px
•	S: 8px-12px
•	M: 16px-20px
•	L: 24px-32px
•	XL: 40px-60px
•	XXL: 80px+
Responsive Breakpoints
•	Mobile: < 768px (single column)
•	Tablet: 768px-1024px (2 columns)
•	Desktop: > 1024px (3+ columns)
✨ Animation & Transitions
Standard Transitions
•	transition: all 0.3s ease for most hover effects
•	transform: translateY(-2px-4px) for card hovers
•	Smooth opacity changes for text and elements
Hover Effects
•	Cards: Lift + shadow increase + slight brightness boost
•	Buttons: Background opacity increase + border brightness
•	Tags: Subtle glow or brightness increase
🚫 Never Do
Forbidden Elements
•	Never use localStorage or sessionStorage (not supported)
•	Never use solid bright backgrounds (purple, blue, etc.)
•	Never use harsh borders (always soft, low-opacity)
•	Never use black text on glass elements
•	Never use sharp corners (minimum 8px border-radius)
•	Never stack elements without proper glassmorphic separation
Avoid
•	Cluttered layouts with too many elements
•	High contrast borders or shadows
•	Inconsistent spacing or typography scales
•	Missing backdrop-filter blur effects on glass elements
•	Bright, saturated colors in the dark theme
📏 Component Standards
Consistent Measurements
•	Small elements: 8px-12px border-radius
•	Medium elements: 12px-16px border-radius
•	Large elements: 16px-20px border-radius
•	Buttons: 8px-12px border-radius
•	Cards: 16px-20px border-radius
•	Search/inputs: 12px or 50px (pills)
Standard Components to Always Include
•	Glassmorphic cards with proper blur and transparency
•	Bubble tags with consistent styling
•	Progress bars with gradient fills
•	Hover animations and transitions
•	Proper text hierarchy with opacity levels
•	Responsive grid layouts
•	Dark gradient backgrounds with texture
 
Apply these guidelines consistently across all components, pages, and interactions. Maintain the glassmorphic aesthetic with dark theme throughout the entire application.

