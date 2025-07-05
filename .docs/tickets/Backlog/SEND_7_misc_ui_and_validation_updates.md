# SEND_7: Miscellaneous UI and Validation Updates

## Status: Backlog
**Created:** 2025-02-09

## Overview
Collection of various UI improvements and validation updates across different components. These tasks will be split into separate tickets later for better tracking and implementation.

## Tasks Breakdown

### 1. Send SOL Modal Improvements
- Fix transparency issues in the Send SOL modal
- Ensure proper z-index layering
- Maintain consistent background blur effect
- Verify modal appearance across different themes

### 2. Project Name Validation
- Implement maximum character limit (20-25 chars) for project names
- Add client-side validation
- Show character count indicator
- Add proper error message when limit is exceeded
- Update database constraints if necessary

### 3. "Start Project" Banner Feature
- Add banner to encourage project creation when active projects are low
- Show banner when active projects count < 10
- Design banner with clear CTA
- Make banner dismissible
- Track banner effectiveness

### 4. Roadmap Link Update
- Link roadmap to SendSol Canva public URL
- Alternative: Create dedicated roadmap page
- Ensure proper link tracking
- Add loading state for external link
- Handle link errors gracefully

### 5. Project Details Stats Enhancement
- Add sender wallet address to project details statistics
- Format wallet address for readability
- Add copy functionality
- Add link to blockchain explorer
- Handle long addresses appropriately

## Technical Implementation Details

### UI Components
1. Send SOL Modal
   - Review and fix z-index hierarchy
   - Adjust backdrop filter values
   - Test across different screen sizes

2. Project Creation Form
   - Add character counter component
   - Implement real-time validation
   - Update error message handling

3. Start Project Banner
   - Create new banner component
   - Add animation for better UX
   - Implement dismiss functionality
   - Store user preference for dismissed state

4. Wallet Address Display
   - Create truncated address display
   - Add hover to show full address
   - Implement copy-to-clipboard
   - Add blockchain explorer link

### Backend Changes
1. Project Validation
   - Update project name validation rules
   - Add database constraints
   - Update API validation

2. Active Projects Counter
   - Add efficient query for active projects count
   - Cache count if necessary
   - Update in real-time

### Testing Requirements
1. UI/UX Testing
   - Verify modal transparency across themes
   - Test project name validation
   - Check banner display conditions
   - Test wallet address interactions

2. Performance Testing
   - Verify modal performance
   - Test banner impact on page load
   - Check validation response time

3. Cross-browser Testing
   - Test modal in different browsers
   - Verify backdrop filters compatibility
   - Check copy functionality

## Acceptance Criteria

### Send SOL Modal
1. Modal has proper transparency
2. Background blur is consistent
3. No z-index conflicts with other elements

### Project Name Validation
1. Maximum length is enforced (20-25 chars)
2. Character count is visible
3. Error messages are clear and helpful

### Start Project Banner
1. Banner shows when active projects < 10
2. Banner is dismissible
3. CTA is clear and functional
4. Banner state persists across sessions

### Roadmap Link
1. Links to correct Canva URL/page
2. Loading states are implemented
3. Errors are handled gracefully

### Wallet Address Display
1. Address is properly formatted
2. Copy functionality works
3. Blockchain explorer link works
4. Long addresses are handled properly

## Notes
- These tasks will be split into separate tickets for implementation
- Priority order will be determined when splitting
- Some tasks may require design input
- Consider A/B testing for banner effectiveness
