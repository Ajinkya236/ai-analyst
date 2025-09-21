# Feature 4: Stage 0 - Data Collection - Test Cases

## Manual Testing Checklist

### 1. Page Load and Initial Display

#### Test Case 1.1: Page Load
- **Given**: User navigates to /stage-0
- **When**: Page loads completely
- **Then**: 
  - Stage progress indicators are displayed (rectangular, not circular)
  - Stage 0 is highlighted as active
  - "Data Collection" title and subtitle are visible
  - "Add Source" button is present
  - AI Agents section is displayed
  - Navigation buttons (Previous/Next) are visible

#### Test Case 1.2: Stage Progress Indicators
- **Given**: User is on Stage 0 page
- **When**: Page loads
- **Then**: 
  - Three stage indicators are displayed
  - Stage 0 shows "0" and "Data Collection" label
  - Stage 1 shows "1" and "AI-Generated Memo" label
  - Stage 2 shows "2" and "Curated Memo" label
  - Stage 0 is highlighted with blue accent
  - All indicators have rectangular styling (not circular)

#### Test Case 1.3: Back Button
- **Given**: User is on Stage 0 page
- **When**: User clicks "Back" button
- **Then**: 
  - User is navigated to /reports page
  - Navigation is smooth and fast
  - No page reload or flash

### 2. Add Source Modal

#### Test Case 2.1: Open Add Source Modal
- **Given**: User clicks "Add Source" button
- **When**: Modal opens
- **Then**: 
  - Modal overlay appears with backdrop blur
  - "Add Data Source" title is displayed
  - Source type selection is shown
  - 6 source type options are available
  - Close button (X) is visible
  - Cancel and Add Source buttons are present

#### Test Case 2.2: Source Type Selection
- **Given**: User is in Add Source modal
- **When**: User clicks on different source types
- **Then**: 
  - Selected source type is highlighted
  - Form adapts to show relevant input fields
  - Document: Shows file upload area
  - Video/Audio: Shows file upload area
  - YouTube/Website: Shows URL input field
  - Text: Shows large textarea with character counter

#### Test Case 2.3: Document Upload
- **Given**: User selects "Document" source type
- **When**: User interacts with file upload area
- **Then**: 
  - Upload area shows drag and drop instructions
  - Clicking area opens file picker
  - File picker accepts .pdf, .docx, .ppt files
  - Selected file name appears in title field
  - Upload area has hover effects

#### Test Case 2.4: URL Input
- **Given**: User selects "YouTube" or "Website" source type
- **When**: User enters URL
- **Then**: 
  - URL input field is displayed
  - Placeholder text shows "Enter URL..."
  - Input accepts valid URLs
  - Form validation works for URL format

#### Test Case 2.5: Text Input
- **Given**: User selects "Text" source type
- **When**: User enters text content
- **Then**: 
  - Large textarea is displayed
  - Character counter shows current/max (10000)
  - Text input accepts up to 10000 characters
  - Character limit is enforced

#### Test Case 2.6: Form Validation
- **Given**: User is in Add Source modal
- **When**: User tries to add source without required fields
- **Then**: 
  - "Add Source" button is disabled
  - Title field is required for all source types
  - URL field is required for YouTube/Website
  - Content field is required for Text
  - File selection is required for Document/Video/Audio

#### Test Case 2.7: Add Source Success
- **Given**: User fills all required fields
- **When**: User clicks "Add Source"
- **Then**: 
  - Modal closes
  - New source appears in sources list
  - Source is automatically selected
  - Source shows correct type and information
  - Sources list updates immediately

### 3. Sources Management

#### Test Case 3.1: Sources List Display
- **Given**: User has added sources
- **When**: Sources are displayed
- **Then**: 
  - Sources are shown in grid layout
  - Each source card shows title, type, upload date
  - File size is displayed for file sources
  - Status badges are shown with correct colors
  - Checkboxes are present for selection

#### Test Case 3.2: Source Selection
- **Given**: User has sources in the list
- **When**: User clicks source checkboxes
- **Then**: 
  - Selected sources are highlighted
  - Checkbox state is updated
  - Visual feedback shows selection
  - Selected count is tracked

#### Test Case 3.3: Select All Functionality
- **Given**: User has multiple sources
- **When**: User clicks "Select All" checkbox
- **Then**: 
  - All sources are selected
  - All source cards are highlighted
  - Individual checkboxes are checked
  - Clicking again deselects all sources

#### Test Case 3.4: Edit Source
- **Given**: User clicks edit button on source
- **When**: Edit functionality is triggered
- **Then**: 
  - Edit modal or inline editing is activated
  - User can modify source title
  - Changes are saved and reflected
  - Source information is updated

#### Test Case 3.5: Delete Source
- **Given**: User clicks delete button on source
- **When**: Delete is confirmed
- **Then**: 
  - Source is removed from list
  - Sources list updates immediately
  - No trace of deleted source remains
  - Selection state is maintained

### 4. AI Agents

#### Test Case 4.1: AI Agents Display
- **Given**: User views AI Agents section
- **When**: Page loads
- **Then**: 
  - 4 AI agent cards are displayed
  - Each agent shows name, description, and status
  - Agent icons are displayed correctly
  - Status badges show "Idle" initially
  - Start buttons are enabled

#### Test Case 4.2: Agent Types
- **Given**: User views AI agents
- **When**: Reading agent information
- **Then**: 
  - Founder Voice AI: "Automated founder interviews with adaptive Q&A"
  - Behavioral Assessment: "Psychometric surveys via SMS/email"
  - Deep Research Agent: "Comprehensive market and competitor analysis"
  - Data Ingestion Agent: "Process and structure all collected data"

#### Test Case 4.3: Trigger Agent
- **Given**: User clicks "Start" button on an agent
- **When**: Agent execution begins
- **Then**: 
  - Agent status changes to "Running"
  - Progress bar appears and animates
  - Start button changes to "Running..."
  - Button is disabled during execution
  - Last triggered timestamp is updated

#### Test Case 4.4: Agent Progress
- **Given**: Agent is running
- **When**: Agent executes
- **Then**: 
  - Progress bar fills from 0% to 100%
  - Progress percentage is displayed
  - Progress updates smoothly
  - Agent completes after reaching 100%

#### Test Case 4.5: Agent Completion
- **Given**: Agent reaches 100% progress
- **When**: Agent execution completes
- **Then**: 
  - Agent status changes to "Completed"
  - Progress bar shows 100%
  - Start button becomes enabled again
  - Results are available (if applicable)

### 5. Navigation and Progress

#### Test Case 5.1: Previous Button
- **Given**: User is on Stage 0 page
- **When**: User clicks "Previous" button
- **Then**: 
  - User is navigated to /reports page
  - Navigation is smooth and fast
  - No data is lost

#### Test Case 5.2: Next Button - Disabled
- **Given**: User has no selected sources
- **When**: User tries to click "Next" button
- **Then**: 
  - Next button is disabled
  - Button shows disabled state
  - User cannot proceed to next stage

#### Test Case 5.3: Next Button - Enabled
- **Given**: User has selected at least one completed source
- **When**: User clicks "Next" button
- **Then**: 
  - Next button is enabled
  - User is navigated to /stage-1
  - Selected sources are passed to next stage

### 6. Responsive Design

#### Test Case 6.1: Mobile View (375px)
- **Given**: User views on mobile device
- **When**: Page loads on mobile
- **Then**: 
  - Single column layout is used
  - Stage indicators stack vertically
  - Sources grid becomes single column
  - AI agents stack vertically
  - Touch targets are at least 44px
  - Modal is optimized for mobile

#### Test Case 6.2: Tablet View (768px)
- **Given**: User views on tablet
- **When**: Page loads on tablet
- **Then**: 
  - Two-column grid layout is used
  - Stage indicators remain horizontal
  - Sources grid shows 2 columns
  - AI agents show 2 columns
  - Touch interactions work smoothly

#### Test Case 6.3: Desktop View (1024px+)
- **Given**: User views on desktop
- **When**: Page loads on desktop
- **Then**: 
  - Multi-column grid layout is used
  - Hover effects work properly
  - All interactions are smooth
  - Layout is optimized for mouse use

### 7. Error Handling

#### Test Case 7.1: Invalid File Type
- **Given**: User tries to upload invalid file type
- **When**: File selection is made
- **Then**: 
  - File picker only accepts valid types
  - Error message is displayed
  - User cannot proceed until valid file is selected

#### Test Case 7.2: File Size Limit
- **Given**: User tries to upload very large file
- **When**: File selection is made
- **Then**: 
  - File size validation is applied
  - Error message is displayed if file is too large
  - User cannot proceed until valid file is selected

#### Test Case 7.3: Text Character Limit
- **Given**: User enters text exceeding 10000 characters
- **When**: Text input is made
- **Then**: 
  - Character counter shows limit exceeded
  - Input is prevented or truncated
  - User cannot proceed until within limit

#### Test Case 7.4: Invalid URL
- **Given**: User enters invalid URL format
- **When**: URL input is made
- **Then**: 
  - URL validation is applied
  - Error message is displayed
  - User cannot proceed until valid URL is entered

### 8. User Experience

#### Test Case 8.1: Smooth Animations
- **Given**: User interacts with page elements
- **When**: Hovering, clicking, or transitioning
- **Then**: 
  - All animations are smooth (60fps)
  - No jank or stuttering
  - Transitions are natural and intuitive
  - Loading states are clear and informative

#### Test Case 8.2: Visual Feedback
- **Given**: User performs actions
- **When**: Clicking buttons or selecting items
- **Then**: 
  - Immediate visual feedback is provided
  - Hover states are clear and consistent
  - Selected states are obvious
  - Status changes are clearly indicated

#### Test Case 8.3: Accessibility
- **Given**: User uses keyboard navigation
- **When**: Tabbing through page elements
- **Then**: 
  - All interactive elements are focusable
  - Focus indicators are visible
  - Tab order is logical
  - Screen reader can read all content

### 9. Data Persistence

#### Test Case 9.1: Source Persistence
- **Given**: User adds sources
- **When**: User navigates away and returns
- **Then**: 
  - Sources are preserved
  - Selection state is maintained
  - Source information is intact
  - No data is lost

#### Test Case 9.2: Agent State Persistence
- **Given**: User triggers AI agents
- **When**: User navigates away and returns
- **Then**: 
  - Agent states are preserved
  - Progress is maintained
  - Results are available
  - No work is lost

## Test Execution Notes

1. **Browser Testing**: Test on Chrome, Firefox, Safari, and Edge
2. **Device Testing**: Test on iPhone, Android, iPad, and various desktop sizes
3. **Performance Testing**: Use Lighthouse for performance metrics
4. **Accessibility Testing**: Use screen readers and keyboard navigation
5. **Cross-browser Testing**: Ensure consistent appearance across browsers

## Expected Results

All test cases should pass with the following criteria:
- ✅ All UI elements display correctly
- ✅ All interactions work smoothly
- ✅ Modal system works as expected
- ✅ Source management functions properly
- ✅ AI agents execute and track progress
- ✅ Navigation works correctly
- ✅ Responsive design works on all devices
- ✅ No console errors or broken functionality
- ✅ Form validation prevents invalid submissions
- ✅ Error handling provides clear feedback to users
