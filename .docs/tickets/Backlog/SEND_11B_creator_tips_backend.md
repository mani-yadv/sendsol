# SEND_11B: Auto-Create User Profile Projects - Backend Implementation

## Overview
Backend implementation for automatically creating `user_profile` projects when users authenticate with Twitter, using existing infrastructure.

## Requirements

### 1. Database Schema Changes

**Migration SQL:**
```sql
-- Add project_type column with constraints
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_type VARCHAR(20) DEFAULT 'project' 
CHECK (project_type IN ('project', 'tip', 'user_profile'));

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_user_id_type ON projects(user_id, project_type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profile_unique ON projects(user_id) 
WHERE project_type = 'user_profile';

-- Update existing data
UPDATE projects SET project_type = 'project' WHERE project_type IS NULL;

-- Add column documentation
COMMENT ON COLUMN projects.project_type IS 'project: crowdfunding, tip: tip pages, user_profile: auto-created profiles';
```

### 2. User Profile Service

**Service Implementation:**
```javascript
// stores/user/userProfileService.js
import { useSupabaseClient } from '#imports';

export class UserProfileService {
  constructor() {
    this.supabase = useSupabaseClient();
  }

  async createUserProfile(user) {
    // Check for existing profile
    const { data: existing } = await this.supabase
      .from('projects')
      .select('id, handle')
      .eq('user_id', user.id)
      .eq('project_type', 'user_profile')
      .maybeSingle();
    
    if (existing) {
      return existing;
    }
    
    // Create new user profile project
    const projectData = {
      project_type: 'user_profile',
      handle: user.username,
      name: `Tips for @${user.username}`,
      description: `Send tips to support @${user.username}`,
      user_id: user.id,
      wallet_address: user.wallet_address || null,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 100).toISOString(), // 100 years
      is_featured: false,
      goal_amount: null,
      pitch_deck_url: null,
      x_profile_url: user.x_profile_url || null,
      website_url: null
    };
    
    const { data: newProject, error } = await this.supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
    
    return newProject;
  }

  async ensureUserProfile(user) {
    try {
      return await this.createUserProfile(user);
    } catch (error) {
      // Handle duplicate constraint violations gracefully
      if (error.code === '23505') {
        // Fetch existing profile
        const { data: existing } = await this.supabase
          .from('projects')
          .select('id, handle')
          .eq('user_id', user.id)
          .eq('project_type', 'user_profile')
          .single();
        
        return existing;
      }
      
      throw error;
    }
  }
}
```

### 3. API Endpoints

**Profile Creation Endpoint:**
```javascript
// pages/api/users/profile/ensure.post.js
import { UserProfileService } from '~/stores/user/userProfileService';
import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const session = await getServerSession(event);
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    // Create/ensure user profile
    const userProfileService = new UserProfileService();
    const profile = await userProfileService.ensureUserProfile(session.user);

    return {
      data: profile,
      success: true
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create user profile'
    });
  }
});
```

**Profile Validation Endpoint:**
```javascript
// pages/api/users/profile/validate.get.js
export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);
    if (!session?.user) {
      return { hasProfile: false };
    }

    const supabase = useSupabaseClient();
    const { data: profile } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('project_type', 'user_profile')
      .maybeSingle();

    return {
      hasProfile: !!profile,
      profileId: profile?.id || null
    };
  } catch (error) {
    return { hasProfile: false, error: error.message };
  }
});
```

### 4. Authentication Integration

**Twitter Auth Callback Extension:**
```javascript
// In existing Twitter auth callback
import { UserProfileService } from '~/stores/user/userProfileService';

// After successful authentication
const onAuthSuccess = async (authResult) => {
  try {
    // Existing auth logic
    const user = authResult.user;
    
    // Auto-create user profile (non-blocking)
    const userProfileService = new UserProfileService();
    await userProfileService.ensureUserProfile(user);
    
    return {
      success: true,
      user: user,
      profileCreated: true
    };
  } catch (error) {
    // Log error but don't block auth
    console.error('User profile creation failed:', error);
    
    return {
      success: true,
      user: authResult.user,
      profileCreated: false,
      profileError: error.message
    };
  }
};
```

### 5. Store Integration

**User Store Extensions:**
```javascript
// stores/user/userStore.js
import { UserProfileService } from './userProfileService';

export const useUserStore = defineStore('user', {
  state: () => ({
    // ... existing state
    profileCreationLoading: false,
    profileCreationError: null,
    userProfile: null
  }),

  actions: {
    // ... existing actions
    
    async ensureUserProfile() {
      if (!this.authenticated) {
        throw new Error('Authentication required');
      }
      
      this.profileCreationLoading = true;
      this.profileCreationError = null;
      
      try {
        const userProfileService = new UserProfileService();
        const profile = await userProfileService.ensureUserProfile(this.user);
        
        this.userProfile = profile;
        this.profileCreationLoading = false;
        
        return profile;
      } catch (error) {
        this.profileCreationError = error.message;
        this.profileCreationLoading = false;
        throw error;
      }
    },

    async validateUserProfile() {
      if (!this.authenticated) {
        return false;
      }

      try {
        const { data } = await $fetch('/api/users/profile/validate');
        return data.hasProfile;
      } catch (error) {
        console.error('Profile validation failed:', error);
        return false;
      }
    }
  }
});
```

### 6. Project Store Compatibility

**Extend Existing Project Store:**
```javascript
// stores/project/projectStore.js - Add methods
export const useProjectStore = defineStore('project', {
  actions: {
    // ... existing actions
    
    async fetchUserProfileProject(userId) {
      const { data, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .eq('project_type', 'user_profile')
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data;
    },

    async fetchProjectByHandle(handle, projectType = null) {
      let query = this.supabase
        .from('projects')
        .select('*')
        .eq('handle', handle);
      
      if (projectType) {
        query = query.eq('project_type', projectType);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data;
    }
  }
});
```

### 7. Error Handling

**Comprehensive Error Handling:**
```javascript
// utils/userProfileErrors.js
export const UserProfileErrors = {
  AUTHENTICATION_REQUIRED: 'Authentication required',
  DUPLICATE_PROFILE: 'User profile already exists',
  INVALID_USER_DATA: 'Invalid user data provided',
  DATABASE_ERROR: 'Database operation failed',
  NETWORK_ERROR: 'Network connection failed',
  UNKNOWN_ERROR: 'An unexpected error occurred'
};

export const handleUserProfileError = (error) => {
  if (error.code === '23505') {
    return UserProfileErrors.DUPLICATE_PROFILE;
  }
  
  if (error.code === 'PGRST301') {
    return UserProfileErrors.AUTHENTICATION_REQUIRED;
  }
  
  if (error.message.includes('network')) {
    return UserProfileErrors.NETWORK_ERROR;
  }
  
  return UserProfileErrors.UNKNOWN_ERROR;
};
```

### 8. Performance Optimizations

**Database Indexes:**
```sql
-- Performance indexes for user profiles
CREATE INDEX IF NOT EXISTS idx_projects_user_id_type ON projects(user_id, project_type);
CREATE INDEX IF NOT EXISTS idx_projects_handle_type ON projects(handle, project_type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
```

**Query Optimization:**
```javascript
// Optimized profile creation query
const createProfileQuery = `
  INSERT INTO projects (
    project_type, handle, name, description, user_id, 
    wallet_address, start_date, end_date, is_featured, goal_amount
  ) VALUES (
    'user_profile', $1, $2, $3, $4, $5, $6, $7, false, null
  ) 
  ON CONFLICT (user_id) WHERE project_type = 'user_profile'
  DO UPDATE SET updated_at = NOW()
  RETURNING *;
`;
```

### 9. Testing Strategy

**Unit Tests:**
```javascript
// tests/stores/userProfileService.test.js
describe('UserProfileService', () => {
  test('creates user profile successfully', async () => {
    const service = new UserProfileService();
    const user = { id: '1', username: 'testuser' };
    
    const profile = await service.createUserProfile(user);
    
    expect(profile).toBeDefined();
    expect(profile.project_type).toBe('user_profile');
    expect(profile.handle).toBe('testuser');
  });
  
  test('handles duplicate profile gracefully', async () => {
    const service = new UserProfileService();
    const user = { id: '1', username: 'testuser' };
    
    // Create first profile
    await service.createUserProfile(user);
    
    // Attempt to create duplicate
    const duplicate = await service.createUserProfile(user);
    
    expect(duplicate).toBeDefined();
  });
});
```

**Integration Tests:**
```javascript
// tests/api/userProfile.test.js
describe('/api/users/profile/ensure', () => {
  test('creates profile for authenticated user', async () => {
    const response = await fetch('/api/users/profile/ensure', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-token' }
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
  });
});
```

### 10. Migration Strategy

**Phase 1: Database Migration**
```sql
-- Run during maintenance window
BEGIN;

-- Add project_type column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type VARCHAR(20) DEFAULT 'project';

-- Add constraints
ALTER TABLE projects ADD CONSTRAINT chk_project_type 
CHECK (project_type IN ('project', 'tip', 'user_profile'));

-- Add indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_project_type ON projects(project_type);
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profile_unique ON projects(user_id) 
WHERE project_type = 'user_profile';

-- Update existing data
UPDATE projects SET project_type = 'project' WHERE project_type IS NULL;

COMMIT;
```

**Phase 2: Code Deployment**
- Deploy UserProfileService
- Deploy API endpoints
- Deploy authentication integration
- Monitor error logs

**Phase 3: Validation**
- Test profile creation for new users
- Verify existing functionality unchanged
- Monitor database performance

### 11. Implementation Tasks

**Database Tasks:**
- [ ] Create migration script
- [ ] Add database indexes
- [ ] Test migration in staging
- [ ] Schedule production migration

**Service Implementation:**
- [ ] Create UserProfileService class
- [ ] Add error handling
- [ ] Add logging for debugging
- [ ] Write comprehensive tests

**API Development:**
- [ ] Create profile creation endpoint
- [ ] Add validation endpoint
- [ ] Add authentication middleware
- [ ] Test error scenarios

**Integration:**
- [ ] Update Twitter auth callback
- [ ] Extend user store methods
- [ ] Add project store compatibility
- [ ] Test end-to-end flow

### 12. File Structure

**New Files:**
```
stores/
└── user/
    └── userProfileService.js   # Profile creation service

pages/api/
└── users/
    └── profile/
        ├── ensure.post.js      # Profile creation endpoint
        └── validate.get.js     # Profile validation endpoint

utils/
└── userProfileErrors.js        # Error handling utilities
```

**Modified Files:**
```
stores/
├── user/
│   └── userStore.js           # Add profile methods
└── project/
    └── projectStore.js        # Add compatibility methods
```

### 13. Production Readiness

- [ ] Comprehensive error handling
- [ ] Database constraints prevent data corruption
- [ ] Performance optimizations
- [ ] Monitoring and logging
- [ ] Graceful failure handling
- [ ] Rollback strategy defined
- [ ] Security validation
- [ ] Load testing completed