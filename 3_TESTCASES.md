# Feature 3: My Reports Page - Test Cases

## Manual Testing Checklist

### 1. Page Load and Initial Display

#### Test Case 1.1: Page Load
- **Given**: User navigates to /reports
- **When**: Page loads completely
- **Then**: 
  - Page title "My Reports" is visible
  - Subtitle "Manage and create startup evaluation reports" is displayed
  - "Create New Report" button is present
  - Search bar and sort dropdown are visible
  - Reports grid is displayed (or empty state if no reports)

#### Test Case 1.2: Loading State
- **Given**: User navigates to /reports
- **When**: Page is loading
- **Then**: 
  - Loading spinner is displayed
  - "Loading reports..." text is shown
  - No reports are visible during loading
  - Loading state disappears after data loads

#### Test Case 1.3: Empty State
- **Given**: User has no reports
- **When**: Page loads
- **Then**: 
  - Empty state icon is displayed
  - "No reports found" heading is shown
  - "Create your first startup evaluation report to get started" message is displayed
  - "Create Your First Report" button is present

### 2. Search Functionality

#### Test Case 2.1: Search by Company Name
- **Given**: User has reports in the list
- **When**: User types company name in search bar
- **Then**: 
  - Only matching reports are displayed
  - Search results update in real-time
  - Non-matching reports are hidden
  - Search query is highlighted in results

#### Test Case 2.2: Search by Founder Name
- **Given**: User has reports in the list
- **When**: User types founder name in search bar
- **Then**: 
  - Only reports with matching founder names are displayed
  - Search is case-insensitive
  - Partial matches are included
  - Results update as user types

#### Test Case 2.3: Search by Report Title
- **Given**: User has reports in the list
- **When**: User types report title in search bar
- **Then**: 
  - Only reports with matching titles are displayed
  - Search works across all report titles
  - Results are filtered immediately
  - No delay in search results

#### Test Case 2.4: Clear Search
- **Given**: User has performed a search
- **When**: User clicks clear search button (X)
- **Then**: 
  - Search input is cleared
  - All reports are displayed again
  - Clear button disappears
  - Original sort order is maintained

#### Test Case 2.5: Empty Search Results
- **Given**: User has reports in the list
- **When**: User searches for non-existent term
- **Then**: 
  - "No reports found" message is displayed
  - Search bar shows the search query
  - Clear search button is visible
  - User can clear search to see all reports

### 3. Sorting Functionality

#### Test Case 3.1: Sort by Last Edited (Newest)
- **Given**: User has multiple reports
- **When**: User selects "Last Edited (Newest)" from dropdown
- **Then**: 
  - Reports are sorted by updatedAt in descending order
  - Most recently updated report appears first
  - Sort order is maintained during search
  - Visual indicators show current sort

#### Test Case 3.2: Sort by Company Name (A-Z)
- **Given**: User has multiple reports
- **When**: User selects "Company Name (A-Z)" from dropdown
- **Then**: 
  - Reports are sorted alphabetically by company name
  - A-Z order is maintained
  - Case-insensitive sorting
  - Sort persists during search

#### Test Case 3.3: Sort by Created Date
- **Given**: User has multiple reports
- **When**: User selects "Created Date (Newest)" from dropdown
- **Then**: 
  - Reports are sorted by createdAt in descending order
  - Most recently created report appears first
  - Sort order is consistent
  - All reports maintain their relative positions

### 4. Report Card Display

#### Test Case 4.1: Report Card Content
- **Given**: User has reports in the list
- **When**: User views report cards
- **Then**: 
  - Company name is displayed prominently
  - Company description is shown (if available)
  - Founder name and email are visible
  - Phone number with country code is displayed
  - Last updated date is shown
  - Status badge is displayed with correct color

#### Test Case 4.2: Status Badges
- **Given**: User has reports with different statuses
- **When**: User views report cards
- **Then**: 
  - Draft reports show yellow "Draft" badge
  - In-progress reports show blue "In-Progress" badge
  - Completed reports show green "Completed" badge
  - Status badges are properly styled and readable

#### Test Case 4.3: Confidence Scores
- **Given**: User has reports with auto-filled data
- **When**: User views report cards
- **Then**: 
  - Confidence scores are displayed for auto-filled fields
  - Scores are shown as percentages
  - High confidence scores are highlighted
  - Provenance information is indicated

#### Test Case 4.4: Hover Effects
- **Given**: User hovers over report cards
- **When**: Mouse hovers over any report card
- **Then**: 
  - Card background opacity increases
  - Card lifts up with translateY(-4px)
  - Shadow increases for depth effect
  - Smooth transition animation (0.3s ease)
  - Cursor changes to pointer

### 5. Action Menu

#### Test Case 5.1: Open Action Menu
- **Given**: User clicks three-dot menu on report card
- **When**: Action menu button is clicked
- **Then**: 
  - Action menu appears below the button
  - Menu contains "Edit Title" and "Delete" options
  - Menu has glassmorphic styling
  - Menu is positioned correctly
  - Clicking outside closes the menu

#### Test Case 5.2: Edit Title Option
- **Given**: User clicks "Edit Title" in action menu
- **When**: Edit title option is clicked
- **Then**: 
  - Action menu closes
  - Edit functionality is triggered
  - User can modify the report title
  - Changes are saved and reflected in UI

#### Test Case 5.3: Delete Option
- **Given**: User clicks "Delete" in action menu
- **When**: Delete option is clicked
- **Then**: 
  - Action menu closes
  - Delete confirmation modal appears
  - Modal asks "Are you sure you want to delete this report?"
  - Modal has Cancel and Delete buttons

### 6. Create Report Modal

#### Test Case 6.1: Open Create Modal
- **Given**: User clicks "Create New Report" button
- **When**: Create button is clicked
- **Then**: 
  - Modal overlay appears with backdrop blur
  - Modal contains "Create New Report" title
  - Step 1 "Company Information" is active
  - Form fields are empty and ready for input
  - Close button (X) is visible

#### Test Case 6.2: Company Search
- **Given**: User is in create modal step 1
- **When**: User types company name in search field
- **Then**: 
  - Search results dropdown appears (if matches found)
  - Results show company name, description, and confidence score
  - User can click on search results to auto-fill
  - Auto-filled fields are marked as pre-verified

#### Test Case 6.3: Form Validation - Step 1
- **Given**: User is in create modal step 1
- **When**: User tries to proceed without required fields
- **Then**: 
  - "Next" button is disabled
  - Required field validation prevents progression
  - User must enter company name to proceed
  - Form shows validation feedback

#### Test Case 6.4: Form Validation - Step 2
- **Given**: User is in create modal step 2
- **When**: User tries to create report without required fields
- **Then**: 
  - "Create Report" button is disabled
  - Required fields (founder name, email, phone) must be filled
  - Email format validation is applied
  - Phone number validation is applied

#### Test Case 6.5: Phone Number Input
- **Given**: User is in create modal step 2
- **When**: User enters phone number
- **Then**: 
  - Country code dropdown is available
  - Common country codes are listed (+1, +44, +91, etc.)
  - Phone number input accepts digits
  - Full phone number is formatted correctly

#### Test Case 6.6: Create Report Success
- **Given**: User fills all required fields
- **When**: User clicks "Create Report"
- **Then**: 
  - Modal closes
  - New report appears in the reports list
  - User is redirected to /report/{id}
  - Report is created with "draft" status
  - All form data is properly saved

### 7. Delete Confirmation

#### Test Case 7.1: Delete Confirmation Modal
- **Given**: User clicks "Delete" in action menu
- **When**: Delete confirmation modal appears
- **Then**: 
  - Modal has "Delete Report" title
  - Confirmation message is clear and informative
  - "Cancel" and "Delete" buttons are present
  - Modal has proper styling and backdrop

#### Test Case 7.2: Cancel Delete
- **Given**: User is in delete confirmation modal
- **When**: User clicks "Cancel"
- **Then**: 
  - Modal closes
  - Report remains in the list
  - No changes are made
  - User returns to reports list

#### Test Case 7.3: Confirm Delete
- **Given**: User is in delete confirmation modal
- **When**: User clicks "Delete"
- **Then**: 
  - Modal closes
  - Report is removed from the list
  - UI updates immediately
  - No trace of deleted report remains

### 8. Navigation

#### Test Case 8.1: Open Report
- **Given**: User clicks on a report card
- **When**: Report card is clicked
- **Then**: 
  - User is navigated to /report/{id}
  - Report data is passed to the next page
  - Navigation is smooth and fast
  - No page reload or flash

#### Test Case 8.2: Back Navigation
- **Given**: User is on a report detail page
- **When**: User navigates back
- **Then**: 
  - User returns to reports list
  - Previous search and sort state is maintained
  - Reports list is in the same state as before

### 9. Responsive Design

#### Test Case 9.1: Mobile View (375px)
- **Given**: User views on mobile device
- **When**: Page loads on mobile
- **Then**: 
  - Single column layout is used
  - Search and sort stack vertically
  - Report cards are full width
  - Touch targets are at least 44px
  - Modal is optimized for mobile

#### Test Case 9.2: Tablet View (768px)
- **Given**: User views on tablet
- **When**: Page loads on tablet
- **Then**: 
  - Two-column grid layout is used
  - Search and sort are side by side
  - Report cards are properly sized
  - Touch interactions work smoothly

#### Test Case 9.3: Desktop View (1024px+)
- **Given**: User views on desktop
- **When**: Page loads on desktop
- **Then**: 
  - Multi-column grid layout is used
  - Hover effects work properly
  - All interactions are smooth
  - Layout is optimized for mouse use

### 10. Error Handling

#### Test Case 10.1: Network Error
- **Given**: User performs an action that requires API call
- **When**: Network error occurs
- **Then**: 
  - Error message is displayed to user
  - User can retry the action
  - Application remains functional
  - No data is lost

#### Test Case 10.2: Invalid Form Data
- **Given**: User enters invalid data in create modal
- **When**: User tries to submit form
- **Then**: 
  - Validation errors are displayed
  - User cannot proceed until errors are fixed
  - Error messages are clear and helpful
  - Form state is preserved

#### Test Case 10.3: Empty Search Results
- **Given**: User searches for non-existent term
- **When**: Search returns no results
- **Then**: 
  - "No reports found" message is displayed
  - User can clear search to see all reports
  - Search functionality remains available
  - No errors are thrown

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
- ✅ Search and sort functionality works as expected
- ✅ Modal interactions are intuitive
- ✅ Responsive design works on all devices
- ✅ No console errors or broken functionality
- ✅ Data validation prevents invalid submissions
- ✅ Error handling provides clear feedback to users
