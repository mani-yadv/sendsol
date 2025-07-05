# SEND_4: Update Project Details Page

## Status: In Progress
**Created:** 2025-02-09
**Updated:** 2025-02-16

## Description
Enhance the project details page by adding new stats and information sections while preserving the existing UI. We will add new sections below the current stats component without modifying its current structure.

## Implementation Phases

### Phase 1: Add New Stats Section
1. Update TransactionsStore:
   - Add project transaction stats functionality to existing `stores/transactions/transactionsStore.js`
   - Add project-based caching for stats
   - Add pagination support for senders list
   - Add new state for stats data
   - Add actions for fetching stats
   - Add getters for accessing stats
   - Move stats logic from ProjectStore
   - Update ProjectsSendersList to use new methods

2. Update User Avatar Section:
   - Replace hardcoded avatar with UserAvatar component
   - Add proper creator details:
     - Use project.creator_image for avatar
     - Use project.creator_name for display
     - Add project.creator_x_url for profile link
   - Add "Under review" status for non-featured projects
   - Make X profile link open in new tab

3. ProjectsDetailsStats.vue Updates:
   - Keep existing stats UI unchanged
   - Add new stats section below current stats:
     ```vue
     <!-- New Stats Section -->
     <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
       <!-- Project Creator -->
       <div class="stat bg-base-200">
         <div class="stat-title">Project Creator</div>
         <div class="stat-value text-base">{{ project.creator_wallet }}</div>
       </div>
       
       <!-- Total Raised -->
       <div class="stat bg-base-200">
         <div class="stat-title">Total Raised</div>
         <div class="stat-value text-primary">
           {{ NumberHelper.formatSOL(project.total_sent) }} SOL
         </div>
         <div class="stat-desc text-secondary">
           ≈ ${{ NumberHelper.formatUSDC(project.total_sent_usdc) }}
         </div>
       </div>
     </div>
     ```

### Phase 2: Project Information Display
1. Add Project Details Section:
   ```vue
   <div class="mt-6 space-y-4">
     <!-- Project Info -->
     <div class="card bg-base-200">
       <div class="card-body">
         <h3 class="card-title text-sm">Project Details</h3>
         <p>{{ project.description }}</p>
         
         <!-- Project Links -->
         <div class="mt-4 flex gap-4">
           <a v-if="project.website_url" :href="project.website_url" target="_blank">
             <PhosphorIconGlobe />Website
           </a>
           <a v-if="project.pitch_deck_url" :href="project.pitch_deck_url" target="_blank">
             <PhosphorIconPresentation />Pitch Deck
           </a>
           <a v-if="project.x_profile_url" :href="project.x_profile_url" target="_blank">
             <PhosphorIconTwitterLogo />X Profile
           </a>
         </div>
       </div>
     </div>
   </div>
   ```

### Phase 3: Project Timeline
1. Add Duration Information:
   ```vue
   <div class="mt-4 card bg-base-200">
     <div class="card-body">
       <div class="flex justify-between">
         <span class="text-sm">Project Duration</span>
         <span class="text-sm text-primary">
           {{ formatDuration(project.duration) }}
         </span>
       </div>
       <div class="flex justify-between">
         <span class="text-sm">End Date</span>
         <span class="text-sm text-primary">
           {{ formatDate(project.end_date) }}
         </span>
       </div>
     </div>
   </div>
   ```

## Technical Details

### Available Project Data
From create form, we have access to:
```javascript
{
  name: String,
  handle: String,
  pitchDeckUrl: String,
  goalAmount: String,
  xProfileUrl: String,
  websiteUrl: String,
  duration: String,
  walletAddress: String,
  description: String
}
```

### Required Store Updates
```javascript
// projectStore.js
const project = {
  ...existingFields,
  total_sent: Number,
  total_sent_usdc: Number,
  creator_wallet: String,
  end_date: String,
  duration: String
}
```

### Helper Functions
```javascript
// Add to existing NumberHelper or create new DateHelper
function formatDuration(duration) {
  // Convert duration to readable format
  // e.g., "2 weeks", "1 month"
}

function formatDate(date) {
  // Format date to readable string
  // e.g., "Feb 28, 2025"
}
```

## Testing Requirements

### Visual Testing
1. Verify new sections align properly with existing UI
2. Check responsive behavior
3. Verify dark/light mode compatibility

### Functional Testing
1. Data display accuracy
2. Link functionality
3. Number formatting
4. Date formatting

## Acceptance Criteria

### Phase 1
1. New stats section is added without affecting existing stats
2. Creator wallet is displayed correctly
3. Total raised shows correct SOL and USDC values
4. All numbers are properly formatted

### Phase 2
1. Project description is displayed properly
2. Links work correctly
3. Missing links are properly handled (not shown)
4. Layout is responsive

### Phase 3
1. Duration is displayed in readable format
2. End date is properly formatted
3. Timeline information is accurate

## Dependencies
- NumberHelper for SOL/USDC formatting
- Existing UI components and styles
- DaisyUI for new components

## Notes
- Do not modify existing stats UI
- Add all new sections below current components
- Maintain consistent styling with existing UI
- Use existing color schemes and component classes
- Test thoroughly in both light and dark modes
