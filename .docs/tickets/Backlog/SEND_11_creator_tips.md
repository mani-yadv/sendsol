# SEND_11: Auto-Create User Profile Projects

## Overview
Automatically create a `user_profile` project for every user when they log in with Twitter, enabling them to receive tips without manual setup. **Production-ready implementation using existing infrastructure.**

## Requirements

### 1. Database Schema Changes (Production SQL)
```sql
-- Migration: Add project_type column with proper constraints
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type VARCHAR(20) DEFAULT 'project' 
CHECK (project_type IN ('project', 'tip', 'user_profile'));

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_user_id_type ON projects(user_id, project_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_unique ON projects(user_id) 
WHERE project_type = 'user_profile';

-- Update existing data
UPDATE projects SET project_type = 'project' WHERE project_type IS NULL;

-- Documentation
COMMENT ON COLUMN projects.project_type IS 'project: crowdfunding, tip: tip pages, user_profile: auto-created profiles';
```

### 2. Project Types (Extended Schema)
- `'project'` - Regular crowdfunding projects
- `'tip'` - Tip pages (12 months) 
- `'user_profile'` - Auto-created user tip profiles (permanent)

### 3. Auto-Creation Logic (Reuse Existing Components)
**Trigger**: On successful Twitter authentication  
**Method**: Extend existing `projectStore.createProject()` method

**Data Structure** (Compatible with existing schema):
```javascript
{
  project_type: 'user_profile',
  handle: twitter_username, // without @
  name: `Tips for @${twitter_username}`,
  description: `Send tips to support @${twitter_username}`,
  user_id: authenticated_user.id,
  wallet_address: user.wallet_address || null,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 100).toISOString(), // 100 years
  is_featured: false,
  goal_amount: null,
  pitch_deck_url: null,
  x_profile_url: user.x_profile_url || null,
  website_url: null
}
```

### 4. Business Rules
- **One per user**: Unique constraint on (user_id, project_type='user_profile')
- **Handle uniqueness**: Use Twitter handle as project handle
- **Permanent duration**: Set 100-year end date
- **Auto-wallet**: Use user's connected wallet if available
- **Reuse validation**: Existing project validation rules apply

### 5. Implementation (Minimal New Code)

#### A. Auto-Creation Service (~30 lines)
**File**: `stores/user/userProfileService.js`
```javascript
import { useProjectStore } from '~/stores/project/projectStore';

export class UserProfileService {
  constructor() {
    this.projectStore = useProjectStore();
  }

  async createUserProfile(user) {
    // Check existing (prevent duplicates)
    const { data: existing } = await this.projectStore.supabase
      .from('projects')
      .select('id, handle')
      .eq('user_id', user.id)
      .eq('project_type', 'user_profile')
      .maybeSingle();
    
    if (existing) return existing;
    
    // Reuse existing createProject method
    const projectData = {
      project_type: 'user_profile',
      handle: user.username,
      name: `Tips for @${user.username}`,
      description: `Send tips to support @${user.username}`,
      user_id: user.id,
      wallet_address: user.wallet_address || null,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 100).toISOString(),
      is_featured: false,
      goal_amount: null
    };
    
    return await this.projectStore.createProject(projectData);
  }
}
```

#### B. Integration Points (Extend Existing Code)

**1. Twitter Auth Integration**:
```javascript
// In existing Twitter auth callback
import { UserProfileService } from '~/stores/user/userProfileService';

// After successful login:
const userProfileService = new UserProfileService();
await userProfileService.createUserProfile(authUser);
```

**2. User Store Extension** - Add to existing `userStore.js`:
```javascript
// Add method to existing userStore
async ensureUserProfile() {
  if (!this.authenticated) return null;
  
  const userProfileService = new UserProfileService();
  return await userProfileService.createUserProfile(this.user);
}
```

**3. Project Store Compatibility**:
- ✅ Existing `createProject()` method works unchanged
- ✅ Existing validation schema supports new fields
- ✅ Existing database queries handle new project_type

#### C. Error Handling (Reuse Existing Patterns)
```javascript
// Reuse projectStore error handling patterns
try {
  await userProfileService.createUserProfile(user);
} catch (error) {
  // Handle duplicate constraint violations gracefully
  if (error.code === '23505') {
    // User already has profile - not an error
    return;
  }
  // Log other errors using existing error handling
  console.error('User profile creation failed:', error);
}
```

### 6. File Structure (Minimal New Files)
```
stores/
└── user/
    └── userProfileService.js  # ~30 lines, reuses projectStore
```

**Existing files to modify** (~5 lines each):
- Twitter auth callback (add auto-creation call)
- `userStore.js` (add ensureUserProfile method)

### 7. Testing Strategy (Reuse Existing Tests)

#### Unit Tests:
- Test UserProfileService creation logic
- Test duplicate prevention
- Test error handling

#### Integration Tests:
- Test Twitter auth flow with auto-creation
- Test existing project functionality unchanged
- Test database constraints

#### Production Tests:
- Test with existing users (no duplicates)
- Test with new Twitter users
- Test wallet association and updates

### 8. Production Deployment Strategy

#### Phase 1: Database Migration
```sql
-- Run during maintenance window
ALTER TABLE projects ADD COLUMN project_type VARCHAR(20) DEFAULT 'project';
-- Add indexes
-- Update existing data
```

#### Phase 2: Code Deployment
- Deploy UserProfileService
- Deploy auth integration
- Monitor error logs

#### Phase 3: Validation
- Verify existing functionality unchanged
- Verify new user profile creation
- Monitor database performance

### 9. Monitoring & Maintenance

#### Database Monitoring:
- Index performance on new project_type column
- Unique constraint violations
- Query performance on user_profile projects

#### Application Monitoring:
- Auto-creation success/failure rates
- Twitter auth callback performance
- User profile project creation latency

### 10. Rollback Plan
- Remove auto-creation calls from auth flow
- Keep database schema (data preserved)
- Existing projects unaffected

### 11. Production Readiness Checklist
- ✅ Reuses existing, battle-tested projectStore
- ✅ Minimal new code (~35 lines total)
- ✅ Database constraints prevent data inconsistency
- ✅ Error handling patterns consistent with existing code
- ✅ No breaking changes to existing functionality
- ✅ Graceful handling of edge cases (duplicates, errors)
- ✅ Monitoring and rollback strategy defined

This implementation leverages 95% existing infrastructure while adding the minimal necessary code for auto-creation functionality.