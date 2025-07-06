# SEND_10: Creator Profile Pages

## Overview
Create public profile pages at `/users/:xhandle` with Instagram-inspired design using existing SendSol UI components (production-ready, minimal new code).

## Requirements

### 1. URL Structure
- **Route**: `/users/:xhandle`
- **Examples**: `/users/elonmusk`, `/users/sendsolapp`
- **Data Source**: Fetch `user_profile` project by handle

### 2. Page Layout (Instagram-inspired)
```
┌─────────────────────────────────────────┐
│ [○ Avatar] [@username]    [Send Tips]   │
│            [Real Name]                  │
│            [Total: $XXX] [X Tippers]   │
└─────────────────────────────────────────┘
│                                         │
│ ──── Tippers ────                      │
│ [Wallet 1] [Amount] [Time]             │
│ [Wallet 2] [Amount] [Time]             │
│ [Wallet 3] [Amount] [Time]             │
└─────────────────────────────────────────┘
```

### 3. Component Reuse Strategy (Production-Ready)

#### **REUSE EXISTING Components (No new code needed):**

**A. Profile Avatar & User Info:**
- **`UserAvatar.vue`** - For profile pictures with fallback to PhosphorIconUser
- **Path**: `/components/common/user/UserAvatar.vue`
- **Features**: Circular avatar, clickable, external profile links, online status

**B. Statistics Display:**
- **`ProjectsDetailsStats.vue` pattern** - For user tip statistics
- **Path**: `/modules/sendsol/components/projects/details/ProjectsDetailsStats.vue`
- **DaisyUI classes**: `stats stats-vertical w-full border border-neutral shadow`
- **Features**: SOL formatting via `NumberHelper.formatSol()`, USD conversion, card layout

**C. Action Button:**
- **`ProjectsSendersUserActionSend.vue`** - Send tips functionality (EXACT reuse)
- **Path**: `/modules/sendsol/components/projects/senders/user/action/ProjectsSendersUserActionSend.vue`
- **Features**: Wallet integration, transaction handling, loading states, validation

**D. Tippers List:**
- **`ProjectsSendersList.vue`** - Transaction history display (EXACT reuse)
- **Path**: `/modules/sendsol/components/projects/senders/list/ProjectsSendersList.vue`
- **Features**: Pagination, infinite scroll, loading states, SOL formatting, wallet addresses

**E. Icons (Phosphor Icons):**
- **`PhosphorIconUser`** - Profile fallback
- **`PhosphorIconCoins`** - Tips icon  
- **`PhosphorIconUsers`** - Tippers count
- **`SVGSolanaOutline`** - SOL amounts

### 4. Exact CSS Classes to Use (DaisyUI + Tailwind)

#### **Profile Header Layout:**
```html
<!-- Main container -->
<div class="flex flex-col space-y-6 p-6">
  <!-- Header section -->
  <div class="flex items-center space-x-4">
    <!-- Avatar (left) -->
    <UserAvatar :user="profileUser" size="large" />
    
    <!-- User info (center) -->
    <div class="flex-1">
      <h1 class="text-xl font-bold">@{{ profileUser.username }}</h1>
      <p class="text-base-content/70">{{ profileUser.name }}</p>
    </div>
    
    <!-- Send tips button (right) -->
    <ProjectsSendersUserActionSend :project="userProfileProject" />
  </div>
</div>
```

#### **Statistics Section:**
```html
<!-- Reuse exact ProjectsDetailsStats pattern -->
<div class="stats stats-vertical w-full border border-neutral shadow">
  <div class="stat">
    <div class="stat-figure text-primary">
      <PhosphorIconCoins size="32" />
    </div>
    <div class="stat-title">Total Tips</div>
    <div class="stat-value text-primary">{{ formatSol(totalTips) }} SOL</div>
    <div class="stat-desc">${{ formatUSD(totalTipsUSD) }} USD</div>
  </div>
  
  <div class="stat">
    <div class="stat-figure text-secondary">
      <PhosphorIconUsers size="32" />
    </div>
    <div class="stat-title">Tippers</div>
    <div class="stat-value text-secondary">{{ uniqueTippers }}</div>
    <div class="stat-desc">{{ uniqueTippers === 1 ? 'person' : 'people' }} sent tips</div>
  </div>
</div>
```

#### **Tippers List:**
```html
<!-- Direct component reuse -->
<ProjectsSendersList 
  :project-id="userProfileProject.id" 
  :show-header="true"
  title="Tippers"
/>
```

### 5. Implementation Steps (Minimal Code)

#### **Step 1: Create Route File**
- **File**: `pages/users/[xhandle].vue`
- **Code**: ~50 lines (mostly layout, data fetching)

#### **Step 2: Data Fetching Logic**
```javascript
// Reuse existing project store methods
const { data: userProfile } = await $fetch('/api/users/profile', {
  params: { handle: route.params.xhandle }
});

const { data: userProject } = await projectStore.fetchProject(route.params.xhandle);
// Filter by project_type = 'user_profile'
```

#### **Step 3: Error Handling**
- **404 Page**: Reuse existing error pages
- **Loading States**: Use existing skeleton patterns

### 6. No New Components Needed

**Why minimal new code:**
- **Avatar**: `UserAvatar.vue` handles all profile image needs
- **Stats**: `ProjectsDetailsStats.vue` pattern for metrics
- **Buttons**: `ProjectsSendersUserActionSend.vue` for tip sending
- **Lists**: `ProjectsSendersList.vue` for transaction history
- **Icons**: Phosphor Icons + existing SVG components
- **CSS**: DaisyUI stats + existing patterns

### 7. File Structure (Only 1 new file needed)
```
pages/
└── users/
    └── [xhandle].vue  # ~50 lines of Vue template + logic
```

### 8. Data Requirements
- **User Profile**: From `user_profiles` table (username, name, avatar_url)
- **User Project**: From `projects` table where `project_type = 'user_profile'`
- **Tips Data**: From existing transaction APIs (reuse endpoints)

### 9. Testing Strategy
- **Component Reuse**: All existing components already tested
- **New Route**: Test profile loading, error states, tip sending
- **Mobile**: Existing responsive patterns ensure mobile compatibility

### 10. Production Readiness
- **No new CSS**: Uses proven DaisyUI patterns
- **No new components**: Reuses battle-tested UI components  
- **Consistent UX**: Matches existing SendSol design language
- **Performance**: Leverages existing optimizations
- **Accessibility**: Inherits existing a11y features

This approach ensures production-ready code with minimal development time and maximum consistency with the existing SendSol design system.