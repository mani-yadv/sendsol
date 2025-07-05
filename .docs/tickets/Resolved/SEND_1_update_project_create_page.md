# SEND_1: Update Project Create Page

## Status: In Progress
**Created:** 2025-02-05
**Last Updated:** 2025-02-08

## Description
Update the project create page by removing coin-related fields and adding new project information fields.

### Current Implementation
The project creation form currently has the following fields:
1. Project Name (text input) - Keep
2. Project Page Handle (text input) - Keep
3. ~~Coin Project Selection (yes/no select)~~ - Remove
4. ~~Coin Ticker (text input)~~ - Remove
5. ~~Allocation Type (select)~~ - Remove
6. ~~Total Allocated Coins (number input)~~ - Remove

### Changes Required

#### Fields to Remove
1. Coin Project Selection
   - Remove the yes/no select field
   - Remove related validation logic
   - Update form state management

2. Coin Ticker
   - Remove the text input field
   - Remove conditional rendering logic
   - Remove related validation

3. Allocation Type
   - Remove the select field with options (proportionate, fixed, not_revealed)
   - Remove related state management
   - Update form submission logic

4. Total Allocated Coins
   - Remove the number input field
   - Remove related validation logic
   - Update form submission data structure

#### New Fields to Add
1. Pitch Deck Link
   - Type: URL input field
   - Optional field
   - Validation: Valid URL format if provided
   - Placeholder: "https://..."

2. Goal Amount
   - Type: Number input field
   - Optional field
   - Unit: SOL
   - Validation: Positive number if provided
   - Placeholder: "Enter goal amount in SOL"

3. Project X Link
   - Type: URL input field
   - Optional field
   - Validation: 
     - Valid URL format if provided
     - Must be from domain 'x.com' if provided
     - Should accept formats: 
       - https://x.com/username
       - https://www.x.com/username
   - Placeholder: "https://x.com/..."
   - Show validation error if incorrect domain is provided

4. Project Website
   - Type: URL input field
   - Optional field
   - Validation: Valid URL format if provided
   - Placeholder: "https://..."

### Technical Implementation Details

#### Component Updates
1. Template Changes
   - Remove coin-related form fields and their containers
   - Add new form fields with proper labeling and validation
   - Maintain consistent UI/UX with existing fields

2. Script Updates
   - Update data model to remove coin-related properties
   - Add new properties for added fields
   - Update form validation schema
   - Modify form submission logic

3. Validation Rules
   - Remove coin-related validations
   - URL format validation:
     - General URL format check for all link fields
     - Specific X.com domain validation:
       ```javascript
       {
         xLink: value => {
           if (!value) return true; // Optional field
           try {
             const url = new URL(value);
             return url.hostname === 'x.com' || url.hostname === 'www.x.com' || 
                    'Invalid X profile URL. Must be from x.com domain';
           } catch {
             return 'Invalid URL format';
           }
         }
       }
       ```
   - Number validation for goal amount:
     - Must be positive number if provided
     - Maximum precision of 4 decimal places
   - Ensure all new fields are properly marked as optional

4. State Management
   - Update initial state structure
   - Remove coin-related state management
   - Add state management for new fields

### Schema Updates

#### Database Schema Changes
1. Fields to Remove:
   ```sql
   ALTER TABLE projects
   DROP COLUMN is_coin_project,
   DROP COLUMN coin_ticker,
   DROP COLUMN allocation_type,
   DROP COLUMN total_allocated_quantity;
   ```

2. Fields to Add:
   ```sql
   ALTER TABLE projects
   ADD COLUMN pitch_deck_url TEXT,
   ADD COLUMN goal_amount DECIMAL(18,4),
   ADD COLUMN x_profile_url TEXT,
   ADD COLUMN website_url TEXT;
   ```

#### Validation Schema Updates
1. Remove Coin-Related Validations:
   ```javascript
   // Remove these fields from schema
   isCoinProject: yup.string().required("Please specify if this is a coin project"),
   coinTicker: yup.string().required("Coin ticker is required for coin projects"),
   allocationType: yup.string().required("Allocation type is required for coin projects"),
   totalAllocatedQuantity: yup.number()...
   ```

2. Add New Field Validations:
   ```javascript
   const createSchema = (supabase) => {
     return yup.object({
       // ... existing fields ...
       
       // New optional fields
       pitchDeckUrl: yup.string()
         .url('Must be a valid URL')
         .nullable()
         .transform((value) => value || null),
         
       goalAmount: yup.number()
         .nullable()
         .transform((value) => value || null)
         .test('decimal', 'Maximum 4 decimal places', (value) => {
           if (!value) return true;
           return /^\d+(\.\d{1,4})?$/.test(value.toString());
         })
         .min(0, 'Goal amount must be positive'),
         
       xProfileUrl: yup.string()
         .nullable()
         .transform((value) => value || null)
         .test('x-domain', 'Must be a valid X profile URL', (value) => {
           if (!value) return true;
           try {
             const url = new URL(value);
             return url.hostname === 'x.com' || url.hostname === 'www.x.com';
           } catch {
             return false;
           }
         }),
         
       websiteUrl: yup.string()
         .url('Must be a valid URL')
         .nullable()
         .transform((value) => value || null)
     });
   };
   ```

#### API Integration Updates
1. Update project creation payload:
   ```typescript
   interface CreateProjectPayload {
     name: string;
     handle: string;
     duration: string;
     walletAddress: string;
     description: string;
     // New optional fields
     pitchDeckUrl?: string | null;
     goalAmount?: number | null;
     xProfileUrl?: string | null;
     websiteUrl?: string | null;
   }
   ```

2. Update response types to reflect new schema

#### Migration Considerations
1. Existing Projects:
   - Remove all coin-related data as it's no longer needed
   - Set new fields as null for existing projects
   - Run a simple migration to clean up old data structure

2. Database Migration:
   - Create a single migration file for all schema changes
   - Execute changes in one transaction for atomicity
   - No need for backwards compatibility as project is not public

### Dependencies
- VeeForm/VeeField for form validation
- Project creation API endpoints (may need updates)

### Testing Requirements
1. Form Validation
   - Test optional nature of new fields
   - Verify URL format validation
   - Test goal amount validation
   - Verify form submission with various combinations of filled/empty optional fields

2. UI/UX Testing
   - Verify form layout and spacing
   - Check responsive behavior
   - Verify error messages and validation feedback
   - Test form reset and navigation

3. Integration Testing
   - Test API integration with new field structure
   - Verify data persistence
   - Check project creation with new fields

### Notes
- Maintain existing form validation patterns
- Follow Vue Options API pattern as per project guidelines
- Maintain consistent error handling
- Keep the UI/UX consistent with existing design
- Ensure smooth transition for existing projects

## Updates
- 2025-02-05: Ticket created with initial analysis
- 2025-02-08: Updated with specific field changes and implementation details
