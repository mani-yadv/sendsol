# SEND_10A: Creator Profile Pages - UI Implementation

## Overview
Create the frontend UI for public profile pages at `/users/:xhandle` using existing SendSol UI components.

## Requirements

### 1. URL Structure & Routing
- **Route**: `/users/:xhandle` 
- **File**: `pages/users/[xhandle].vue`
- **Examples**: `/users/elonmusk`, `/users/sendsolapp`

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

### 3. Component Reuse (Production-Ready)

**Existing Components to Reuse:**
- **`UserAvatar.vue`** - Profile pictures with fallback
- **`ProjectsDetailsStats.vue`** - Statistics display pattern
- **`ProjectsSendersUserActionSend.vue`** - Send tips button
- **`ProjectsSendersList.vue`** - Tippers list with pagination
- **Phosphor Icons** - Profile, coins, users icons

### 4. CSS Classes (DaisyUI + Tailwind)

**Profile Header:**
```html
<div class="flex flex-col space-y-6 p-6">
  <div class="flex items-center space-x-4">
    <UserAvatar :user="profileUser" size="large" />
    <div class="flex-1">
      <h1 class="text-xl font-bold">@{{ profileUser.username }}</h1>
      <p class="text-base-content/70">{{ profileUser.name }}</p>
    </div>
    <ProjectsSendersUserActionSend :project="userProfileProject" />
  </div>
</div>
```

**Statistics Section:**
```html
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

**Tippers List:**
```html
<ProjectsSendersList 
  :project-id="userProfileProject.id" 
  :show-header="true"
  title="Tippers"
/>
```

### 5. Implementation Tasks
- [ ] Create `/pages/users/[xhandle].vue` file (~50 lines)
- [ ] Implement profile data fetching from API
- [ ] Add loading states using existing skeleton patterns
- [ ] Add error handling with existing 404 pages
- [ ] Test responsive design on mobile/desktop
- [ ] Test tip sending functionality
- [ ] Verify accessibility features

### 6. Error Handling
- **404 Page**: Reuse existing error pages for invalid handles
- **Loading States**: Use existing skeleton patterns
- **Failed API calls**: Standard error display patterns

### 7. Testing Strategy
- Component reuse testing (existing components already tested)
- New route testing (profile loading, error states)
- Mobile responsiveness testing
- Tip sending integration testing

### 8. Dependencies
- Requires SEND_10B (backend) to be completed for API endpoints
- User profile data structure from backend
- User project data with `project_type = 'user_profile'`

### 9. File Structure
```
pages/
└── users/
    └── [xhandle].vue  # New file (~50 lines)
```

### 10. Production Readiness
- Uses battle-tested existing components
- Follows established DaisyUI patterns
- Maintains design system consistency
- Leverages existing accessibility features
- Mobile-responsive by default