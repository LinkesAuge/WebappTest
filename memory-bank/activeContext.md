# Active Context

## Current Focus

We are actively working on modernizing the application's architecture by implementing a modular approach and establishing a solid testing infrastructure. We have recently fixed critical initialization and data loading issues that were preventing the application from functioning correctly, and we've made significant improvements to the Analytics page layout and functionality.

### Current Stage: Modularization & Testing + Bug Fixing + UI Improvements + Week Selection Implementation

The application has been refactored from its original monolithic script.js file into a modular structure with clear separation of concerns:

1. **Core Modules**
   - `dataLoader.js`: Handles data fetching, parsing, and processing
   - `domManager.js`: Manages DOM references and basic UI operations
   - `i18n.js`: Handles internationalization and language switching
   - `utils.js`: Contains utility functions for formatting, sorting, etc.
   - `app.js`: Core application logic and integration of other modules

2. **Testing Infrastructure**
   - Jest testing framework is set up
   - Unit tests are created for all modules
   - Integration tests demonstrate cross-module functionality
   - Test mocks are implemented for browser APIs
   - Test failures are currently being addressed

3. **Recently Fixed Issues**
   - Fixed errors related to removed function references (`renderSourceStrengthHeatmap` and `renderPlayerValueAdded`) in `createClanAnalysisView`
   - Reordered the Analytics page sections to show Clan Analysis first followed by Category Analysis
   - Changed the initialization order in `app.js` to create Clan Analysis before Category Analysis
   - Removed redundant function calls between Analytics sections
   - Enhanced tooltips in charts to prevent "Cannot read properties of undefined" errors
   - Improved chart visualization and data labeling
   - Initialization sequence in `app.js` has been corrected to ensure proper loading order
   - Cross-module utility references have been fixed to prevent "utils is not defined" errors
   - Data cleaning and processing has been improved for better handling of numeric values
   - Sort state initialization has been fixed to prevent null reference errors
   - Sort icon visibility and rendering has been enhanced

### New Feature: Week Selection Implementation

We are implementing a new feature that allows users to select data from different weeks. The implementation plan includes:

1. **Core Data Loading Updates**
   - Update `dataLoader.js` to handle week-based data loading
   - Create functions to detect available weeks from the `/data/week/` directory
   - Implement week number to date range conversion (e.g., week 13 → 24.03-30.03.2025)
   - Modify data loading functions to load from selected week's CSV file

2. **UI Implementation with Flatpickr**
   - Add Flatpickr calendar widget to the header 
   - Style it to match the existing dark fantasy theme
   - Display weeks as Monday-Sunday blocks
   - Visually highlight and make selectable only weeks with available data
   - Format date display as "24.03-30.03.2025 (Week 13)" using German date format
   - Make the calendar appear as a dropdown when clicking a week selector button
   - Ensure the UI is mobile-responsive

3. **Application Logic Changes**
   - Update app initialization to detect and load the latest available week by default
   - Implement week switching functionality to load data on-demand
   - Update all views to reflect the selected week's data
   - Maintain the current view/tab when switching weeks

### Immediate Tasks
- Implement week detection functionality in `dataLoader.js`
- Create the calendar widget UI in the header
- Update data loading flow to work with week-specific files
- Test the week selection feature across all views
- Ensure mobile compatibility for the calendar widget
- Test all Analytics page improvements
- Ensure tooltips display correctly in all charts
- Verify that the Category Analysis and Clan Analysis sections work properly with the new ordering

## Key Decisions

1. **Week Selection Implementation**
   - Use Flatpickr library for the calendar widget
   - Only weeks with available data will be selectable
   - Default to the latest available week
   - Format: "24.03-30.03.2025 (Week 13)"
   - Load data on-demand rather than caching all weeks
   - No transitions when switching between weeks
   - No persistence of selected week between sessions

2. **Analytics Page Organization**
   - Clan Analysis section is now displayed first
   - Category Analysis section follows Clan Analysis
   - Function call order has been modified to match this new UI flow
   - Removed redundant nested initialization to prevent circular dependencies

3. **Modular Architecture**
   - Each module has a clear responsibility
   - Modules export a well-defined interface
   - Cross-module dependencies are explicitly set
   - State is managed centrally in the app module

4. **Testing Approach**
   - Test-driven development for new features
   - Unit tests focus on isolated functionality
   - Integration tests verify module interactions
   - Mocking approach for browser APIs

5. **Code Organization**
   - Flat module structure for now
   - Clear separation of concerns
   - Functions grouped by logical purpose
   - Core constants defined at module level

6. **Bug Fixing Strategy**
   - Prioritize initialization and cross-module dependencies
   - Focus on critical data flow paths
   - Implement defensive programming techniques
   - Add safety checks for tooltip functions to prevent errors
   - Add more detailed logging for debugging

## Current Challenges

1. **Initialization Order**
   - Ensuring proper module loading sequence
   - Handling cross-module dependencies
   - Managing state initialization
   - Preventing circular dependencies

2. **Chart Tooltip Safety**
   - Implementing robust null/undefined checks in tooltip functions
   - Ensuring data properties are safely accessed
   - Providing fallback options when data is missing

## Next Developmental Phases
- Further refinement of chart visualizations
- Additional analytics features
- Improved mobile responsiveness

## Current Focus: UI Refinements and Table/Chart Improvements

### Recent Changes
- **Analytics Page Reorganization**
  - Reordered sections to show Clan Analysis first, followed by Category Analysis
  - Updated the initialization order in `app.js` to match the new UI flow
  - Removed redundant function calls to prevent duplication

- **Chart Enhancement**
  - Added robust safety checks in tooltip functions to prevent "Cannot read properties of undefined" errors
  - Improved data labels in the "Quellenimportanz" (Source Importance) chart
  - Enhanced tooltip styling to match the overall dashboard theme

- **Sort Icon Visibility and Behavior**
  - Fixed sort icons to display with proper opacity (100% for active column, 50% for inactive)
  - Ensured correct arrow direction logic (▲ for ascending, ▼ for descending)
  - Applied primary theme color to icons for better visibility

- **Table Appearance Enhancements**
  - Implemented alternating row colors in all tables using multiple approaches for reliability:
    - CSS nth-child selectors with !important rules
    - Direct inline styles on rows
    - Properly targeted tbody elements by ID
  - Added hover effects for clickable rows with smooth transitions
  - Narrowed the rank column width (w-16) for more efficient space usage
  - Adjusted padding and alignment for rank column to improve readability

- **Translation Fixes**
  - Fixed header translations in tables by correctly mapping column names to translation keys
  - Added proper case handling for column names (uppercase/lowercase) in translation key mapping
  - Ensured rank column shows the correct translation ("Rang" in German)

### Technical Improvements
- Applied more robust CSS styling techniques using specific selectors to target table elements
- Improved hover effects with proper transition animations
- Enhanced table readability through consistent spacing and alignment
- Implemented comprehensive safety checks in chart tooltip functions
- Updated initialization flow to ensure proper component creation order

## Next Steps
- Continue testing all UI improvements
- Consider additional analytics features
- Explore options for more interactive visualizations

## Technical Considerations
### Module Structure:

The new codebase structure is organized as follows:

app/
├── main.js               // Entry point: initializes the app and wires up modules.
├── utils.js              // Utility functions (sorting, formatting, CSS variable retrieval, etc.).
├── dataLoader.js         // CSV data loading, parsing, and cleaning (for both data.csv and rules.csv).
├── i18n.js               // Internationalization functions (getText, language preferences, etc.).
├── domManager.js         // DOM element reference assignment and UI update functions.
├── eventListeners.js     // Event attachment and handling for navigation, filtering, and others.
└── renderer/             // Contains view-specific rendering modules:
    ├── dashboardRenderer.js      // Render functions for the dashboard (stats, ranking table, chart widgets).
    ├── tableRenderer.js          // Rendering for the full detailed data table view.
    ├── chartRenderer.js          // Chart rendering functions (using ApexCharts) for various charts.
    ├── playerDetailRenderer.js   // Rendering for the player detail view (stats, breakdown, radar chart).
    └── analyticsRenderer.js      // Rendering for analytics views (charts, visualizations, category analyses).