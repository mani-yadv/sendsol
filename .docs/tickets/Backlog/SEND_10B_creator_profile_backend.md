# SEND_10B: Creator Profile Pages - Backend Integration

## Overview
Backend API endpoints and data integration for public profile pages at `/users/:xhandle`.

## Requirements

### 1. API Endpoints

**User Profile Endpoint:**
```
GET /api/users/profile?handle=:xhandle
```
**Response:**
```json
{
  "data": {
    "id": "user_id",
    "username": "xhandle",
    "name": "Display Name",
    "avatar_url": "https://...",
    "x_profile_url": "https://twitter.com/xhandle",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**User Project Endpoint:**
```
GET /api/projects?handle=:xhandle&project_type=user_profile
```
**Response:**
```json
{
  "data": {
    "id": "project_id",
    "handle": "xhandle",
    "name": "Tips for @xhandle",
    "description": "Send tips to support @xhandle",
    "user_id": "user_id",
    "project_type": "user_profile",
    "wallet_address": "wallet_address",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2124-01-01T00:00:00Z",
    "total_amount": 1.5,
    "total_amount_usd": 150.00,
    "unique_senders": 25
  }
}
```

### 2. Data Fetching Integration

**Frontend Data Fetching:**
```javascript
// In pages/users/[xhandle].vue
const { data: userProfile } = await $fetch('/api/users/profile', {
  params: { handle: route.params.xhandle }
});

const { data: userProject } = await $fetch('/api/projects', {
  params: { 
    handle: route.params.xhandle,
    project_type: 'user_profile'
  }
});
```

### 3. Database Query Requirements

**User Profile Query:**
```sql
SELECT 
  id, username, name, avatar_url, x_profile_url, created_at
FROM user_profiles 
WHERE username = $1
```

**User Project Query:**
```sql
SELECT 
  p.id, p.handle, p.name, p.description, p.user_id, p.project_type,
  p.wallet_address, p.start_date, p.end_date,
  COALESCE(SUM(t.amount), 0) as total_amount,
  COALESCE(SUM(t.amount_usd), 0) as total_amount_usd,
  COUNT(DISTINCT t.sender_wallet_address) as unique_senders
FROM projects p
LEFT JOIN transactions t ON p.id = t.project_id
WHERE p.handle = $1 AND p.project_type = 'user_profile'
GROUP BY p.id, p.handle, p.name, p.description, p.user_id, p.project_type,
         p.wallet_address, p.start_date, p.end_date
```

### 4. Implementation Tasks

**API Route Files:**
- [ ] Create/update `/api/users/profile.js` endpoint
- [ ] Update `/api/projects.js` to handle `project_type` filter
- [ ] Add input validation for handle parameter
- [ ] Add error handling for non-existent users
- [ ] Add proper HTTP status codes (200, 404, 500)

**Database Integration:**
- [ ] Create database queries using existing Supabase client
- [ ] Implement proper error handling for database calls
- [ ] Add query optimization for performance
- [ ] Test with existing project store methods

**Store Integration:**
- [ ] Extend existing `projectStore.js` methods
- [ ] Add `fetchUserProfile()` method
- [ ] Add `fetchUserProject()` method  
- [ ] Maintain compatibility with existing store patterns

### 5. Error Handling

**API Error Responses:**
```json
// 404 - User not found
{
  "error": "User not found",
  "code": 404
}

// 500 - Server error
{
  "error": "Internal server error",
  "code": 500
}
```

**Frontend Error Handling:**
```javascript
try {
  const userProfile = await $fetch('/api/users/profile', {
    params: { handle: route.params.xhandle }
  });
} catch (error) {
  if (error.status === 404) {
    // Show 404 page
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }
  // Handle other errors
}
```

### 6. Performance Considerations

- [ ] Add database indexes on `username` and `handle` columns
- [ ] Implement query result caching where appropriate
- [ ] Use existing pagination patterns for transaction lists
- [ ] Optimize joins for user project statistics

### 7. Security Considerations

- [ ] Validate handle parameter (alphanumeric + underscore only)
- [ ] Sanitize input to prevent injection attacks
- [ ] Rate limiting on API endpoints
- [ ] Proper CORS configuration

### 8. Integration Points

**With Existing Code:**
- Reuse existing `projectStore.supabase` client
- Reuse existing transaction API endpoints
- Reuse existing error handling patterns
- Maintain compatibility with existing project methods

**With Frontend (SEND_10A):**
- Provide data structure expected by UI components
- Ensure proper error states for 404 handling
- Support pagination for transaction lists

### 9. Testing Strategy

- [ ] Unit tests for API endpoints
- [ ] Integration tests with database
- [ ] Test error scenarios (invalid handles, missing data)
- [ ] Performance testing with large datasets
- [ ] Test compatibility with existing store methods

### 10. Database Schema Dependencies

**Required Tables:**
- `user_profiles` - User profile data
- `projects` - User profile projects (with `project_type = 'user_profile'`)
- `transactions` - Tip transaction data

**Required Indexes:**
```sql
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_projects_handle_type ON projects(handle, project_type);
```

### 11. File Structure

**API Files:**
```
pages/api/
├── users/
│   └── profile.js     # User profile endpoint
└── projects.js        # Extended with project_type filter
```

**Store Files:**
```
stores/
└── project/
    └── projectStore.js # Extended with user profile methods
```