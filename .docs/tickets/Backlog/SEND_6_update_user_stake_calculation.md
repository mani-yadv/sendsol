# SEND_6: Update User Stake Calculation in Project Details

## Status: Backlog
**Created:** 2025-02-09

## Overview
Update the "Your Stake" value calculation in the user stats component on the project details page to show the user's percentage stake of total project contributions.

## Technical Specifications

### 1. Feature Requirements

#### 1.1 Stake Percentage Calculation
- Calculate user's percentage stake in the project:
  ```
  stake_percentage = (user_total_contribution / project_total_contributions) * 100
  ```
- Sum all transactions from user's wallet address
- Sum all project transactions for total contributions
- Format percentage with proper decimal places
- Update value in real-time when new transactions occur

#### 1.2 User Interface Updates
- Update user stats component to show stake percentage
- Add proper loading state during calculation
- Show percentage with % symbol
- Handle zero stake case appropriately
- Add tooltip to explain stake calculation:
  "Your contribution as a percentage of total SOL sent to this project"

### 2. Technical Implementation

#### 2.1 Backend Changes
- Create efficient query to calculate:
  - User's total contributions
  - Project's total contributions
  - Percentage stake
- Filter transactions by:
  - Project ID
  - User's wallet address (for user contributions)
  - Valid transaction status
- Optimize queries for performance

#### 2.2 Frontend Changes
- Update user stats component
- Add proper error handling
- Implement loading states
- Use NumberHelper for consistent percentage formatting
- Add real-time updates when new transactions occur
- Show appropriate decimal places for percentage

### 3. Error Handling
- Handle cases where user is not connected
- Handle failed transaction queries
- Show appropriate error messages
- Provide fallback UI for error states
- Handle division by zero case (when no contributions)

### Testing Requirements

#### 1. Functionality Testing
- Verify percentage calculation accuracy
- Test with various contribution scenarios:
  - User is sole contributor (100%)
  - User is one of many contributors
  - User has no contributions (0%)
- Verify real-time updates
- Test error scenarios

#### 2. Performance Testing
- Test with large number of transactions
- Verify calculation speed
- Check query optimization

## Acceptance Criteria
1. User stake shows correct percentage of total contributions
2. Percentage is properly formatted with appropriate decimal places
3. Value updates in real-time with new transactions
4. Loading states are properly implemented
5. Error cases are handled appropriately
6. Zero stake case is handled gracefully (shows 0%)
7. Performance is optimized for large transaction sets
8. Tooltip explains the stake calculation clearly
9. Percentage calculation is accurate across all test scenarios
