# Feature 3: My Reports Page - Report Management & CRM Integration

## Brief Description
Create a comprehensive My Reports page that allows users to view, search, sort, create, and manage startup evaluation reports. The page includes CRM integration for auto-filling company details, report creation workflow, and report management capabilities with edit/delete functionality.

## Files and Functions to Change/Create

### New Components
- `src/app/components/report-card/report-card.component.ts` - Individual report tile component
- `src/app/components/create-report-modal/create-report-modal.component.ts` - Report creation modal
- `src/app/components/search-bar/search-bar.component.ts` - Search functionality component
- `src/app/components/sort-dropdown/sort-dropdown.component.ts` - Sorting options component
- `src/app/components/company-search/company-search.component.ts` - CRM company search component

### Updated Files
- `src/app/pages/reports/reports.component.ts` - Main reports page component
- `src/app/services/data-source.service.ts` - Add report management methods
- `src/app/services/ai-agent.service.ts` - Add CRM integration methods
- `src/app/models/investment-memo.model.ts` - Add report model properties

## Algorithms and Implementation Steps

### Step 1: Reports Page Layout
1. Create main reports page with:
   - Header with search bar and sort dropdown
   - Create New Report button
   - Reports grid/list view
   - Empty state for no reports
   - Loading states for data fetching

### Step 2: Search and Sort Functionality
1. Implement search bar with real-time filtering:
   - Search by report title, company name, founder name
   - Debounced input for performance
   - Clear search functionality
2. Add sort dropdown with options:
   - Last Edited Desc (default)
   - Last Edited Asc
   - Company Name A-Z
   - Company Name Z-A
   - Created Date Desc
   - Created Date Asc

### Step 3: Report Card Component
1. Create report tile with:
   - Company name and description
   - Founder name and contact info
   - Last edited date
   - Status indicators (draft, in-progress, completed)
   - Action menu (edit title, delete)
2. Implement hover effects and glassmorphic styling
3. Add status badges and progress indicators

### Step 4: Create Report Modal
1. Implement modal with two-step process:
   - Step 1: Company search/input
   - Step 2: Founder details input
2. Add CRM integration:
   - Search existing companies
   - Auto-fill company details
   - Show confidence scores for auto-filled data
3. Add validation:
   - Required fields validation
   - Email format validation
   - Phone number validation
4. Handle both CRM and manual entry flows

### Step 5: CRM Integration
1. Implement company search:
   - Search by company name
   - Return matching companies with details
   - Show confidence scores and data provenance
2. Auto-fill functionality:
   - Company description
   - Founder phone with country code
   - Founder email
   - Mark fields as "pre-verified"
3. Data validation and error handling

### Step 6: Report Management
1. Edit report title:
   - Inline editing or modal input
   - Save changes to backend
   - Update UI immediately
2. Delete report:
   - Confirmation dialog
   - Soft delete with undo option
   - Update reports list
3. Report status management:
   - Track report progress
   - Update status indicators
   - Show last modified timestamps

### Step 7: Navigation and Routing
1. Handle report creation flow:
   - Create report → redirect to /report/{id}
   - Pass report data to next page
   - Handle back navigation
2. Implement breadcrumb navigation
3. Add loading states during navigation

### Step 8: Responsive Design
1. Mobile-first approach:
   - Single column layout on mobile
   - Touch-friendly interactions
   - Optimized modal for mobile
2. Tablet and desktop enhancements:
   - Multi-column grid layout
   - Hover effects and animations
   - Larger touch targets

## Technical Requirements

### Data Models
```typescript
interface Report {
  id: string;
  title: string;
  companyName: string;
  companyDescription?: string;
  founderName: string;
  founderEmail: string;
  founderPhone: {
    countryCode: string;
    number: string;
    confidence?: number;
    provenance?: string;
  };
  status: 'draft' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface CompanySearchResult {
  name: string;
  description: string;
  founderEmail: string;
  founderPhone: string;
  confidence: number;
  provenance: string;
}
```

### API Integration
- GET /api/reports - Fetch user reports
- POST /api/reports - Create new report
- PUT /api/reports/:id - Update report
- DELETE /api/reports/:id - Delete report
- GET /api/companies/search - Search companies in CRM
- POST /api/companies - Create new company

### State Management
- Use RxJS BehaviorSubjects for reports list
- Implement caching for search results
- Handle loading and error states
- Manage modal state and form data

### Performance Optimization
- Lazy load report details
- Implement virtual scrolling for large lists
- Debounce search input
- Cache search results
- Optimize image loading

## Acceptance Criteria

1. **Report Display**: Reports shown as tiles sorted by last edited date (descending)
2. **Search Functionality**: Real-time search by title, company name, or founder name
3. **Sorting**: Multiple sort options with proper reordering
4. **Create Report Modal**: Two-step process with CRM integration and manual input
5. **CRM Integration**: Auto-fill company details with confidence scores
6. **Report Management**: Edit title and delete with confirmation
7. **Navigation**: Seamless redirect to /report/{id} after creation
8. **Responsive Design**: Works on mobile, tablet, and desktop
9. **Loading States**: Proper loading indicators and error handling
10. **Data Validation**: Required field validation and format checking

## Error Handling

- Network errors during API calls
- Invalid form data submission
- CRM search failures
- Report creation/update failures
- Navigation errors

## Security Considerations

- Validate all user inputs
- Sanitize data before display
- Implement proper authentication
- Secure API endpoints
- Protect sensitive company data
