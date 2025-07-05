# Project Details Page Documentation

## Overview
The project details page displays comprehensive information about a specific project, including its configuration, statistics, and sender information. This page serves as the main dashboard for viewing project metrics and managing sender-related activities.

## Page Location
- **Base Component:** `/modules/sendsol/components/projects/details/ProjectsDetails.vue`
- **Stats Component:** `/modules/sendsol/components/projects/details/ProjectsDetailsStats.vue`
- **Senders Component:** `/modules/sendsol/components/projects/senders/ProjectsSenders.vue`

## Component Structure

### ProjectsDetails.vue (Main Component)
The main container component that orchestrates the project details view.

#### Features
- Loading state management with skeleton UI
- Error handling for missing projects
- Project name display with navigation
- Integration of stats and senders components

#### State Management
- Uses `projectStore` for centralized project data management
- Fetches project details based on URL handle
- Handles loading and error states

### ProjectsDetailsStats.vue (Statistics Component)
Displays key metrics and statistics for the project.

#### Statistics Displayed
1. **Total Sent**
   - SOL amount sent
   - USDC equivalent value
   
2. **Total Senders**
   - Number of unique senders
   - Project duration information

3. **Coin Allocation** (for coin projects)
   - Total allocated quantity
   - Coin ticker display
   - Only shown if project is a coin project

4. **Social Stats** (under review)
   - Follower count
   - Profile information

#### Features
- Responsive stats layout
- Number formatting with K/M/B suffixes
- Integration with various icons and SVGs
- Conditional rendering based on project type

### ProjectsSenders Component
Manages the display and interaction with project senders.

## Data Flow
1. URL handle triggers project data fetch
2. Project store updates with fetched data
3. Components reactively update based on store changes
4. Stats and sender information are displayed based on project data

## Error Handling
- Displays skeleton UI during loading
- Shows error alert for missing projects
- Graceful handling of missing project details

## Navigation
- Back button to return to home page
- Project name displayed in header
- Clear navigation structure

## Styling
- Uses DaisyUI components for consistent styling
- Responsive design for various screen sizes
- Skeleton loading states for better UX
- Consistent use of icons and visual elements

## Future Enhancements
- Page view statistics (placeholder already in place)
- Enhanced social media integration
- Additional metrics and analytics

## Related Components
- SVG components for various icons
- Number formatting helpers
- Project store for state management

## Technical Dependencies
- Vue.js Options API
- Pinia for state management
- DaisyUI for UI components
- Custom SVG components
- NumberHelper utility for formatting
