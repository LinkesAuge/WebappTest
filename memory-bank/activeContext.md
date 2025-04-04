# Active Context: Chest Analyzer

## Current Work Focus

The development team is currently focused on stabilizing the application by addressing key UI/UX issues and enhancing the data visualization capabilities. Recent work has centered on:

1. **Internationalization (i18n) Stability**: Fixing issues related to language switching and formatting.
2. **Chart Rendering Improvements**: Ensuring consistent modal display of expanded charts.
3. **Week Selection Feature**: Enhancing the ability to view specific weekly data sets.
4. **Documentation Updates**: Maintaining comprehensive documentation of all implemented features.

## Recent Changes

### Internationalization (i18n) System
- Fixed issue with "last updated" timestamp disappearing during language switches
- Improved robustness of date formatting across different languages
- Enhanced language switching to properly maintain state and UI elements
- Added fallback mechanisms for missing translations or formatting errors

### Chart System
- Fixed modal rendering issues where expanded charts were not displaying data
- Implemented player data reference management to ensure data availability in modals
- Added debug logging to help trace and resolve data access issues
- Created fallback mechanisms for accessing player data when the primary reference is unavailable

### Week Selection
- Finalized implementation of the week selection feature
- Ensured that all charts and views update correctly when the week changes
- Fixed UI update issues during week switching
- Added proper handling for unavailable data in selected weeks

### Performance Optimizations
- Implemented DOM caching to reduce redundant element queries
- Optimized chart rendering to minimize redraws
- Reduced redundant data processing during view switches

## Next Steps

1. **Testing**: Comprehensive testing of all features to ensure stability.
2. **User Experience Improvements**:
   - Add more informative error messages
   - Implement better loading indicators
   - Enhance responsive design for various screen sizes
3. **Feature Enhancements**:
   - Implement data export functionality
   - Add comparison view for week-over-week analysis
   - Extend player detail view with additional metrics
4. **Documentation**:
   - Complete user guide with examples
   - Update developer documentation with recent architectural changes

## Active Decisions and Considerations

### State Management Approach
We've decided to use a centralized reference to player data (`playerDataRef` in `domManager.js`) complemented by exposing data to the window object as a fallback. This hybrid approach provides multiple access paths to ensure data availability throughout the application.

### Browser Compatibility
The application currently targets modern browsers (Chrome, Firefox, Safari, Edge) with limited support for legacy browsers. We prioritize features and stability for current browser versions over backward compatibility.

### Data Processing Strategy
Data processing is performed client-side, with preprocessing during the initial load to optimize subsequent operations. We're exploring opportunities to further reduce runtime processing by precomputing certain metrics.

### UI/UX Philosophy
We continue to prioritize clarity and usability over aesthetics, ensuring that data visualization remains the core focus of the application while providing intuitive navigation and interaction.

## Current Focus

We are actively working on stabilizing the application by fixing critical bugs that affect the user experience. We have recently fixed issues related to internationalization, UI components, and data visualization. The main focus now is to ensure the core functionality works reliably across all parts of the application, particularly with features that involve language switching, date formatting, and chart rendering.

### Current Stage: Bug Fixing, UI/UX Improvements & Stability Enhancements

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
   - Fixed date format translation issues:
     - Improved English translation for week date range format in `i18n.js`
     - Enhanced comments in `getWeekDateRange` function to clarify expected formats (German: DD.MM-DD.MM.YYYY, English: MM/DD-MM/DD/YYYY)
   - Fixed "last updated" timestamp disappearing when switching languages:
     - Improved handling of timestamp formatting during language switches
     - Enhanced storage and retrieval of timestamp data to maintain consistency
   - Fixed dashboard charts not displaying properly in modal view:
     - Added robust fallback logic for accessing player data in modal charts
     - Exposed player data to the window object for emergency access
     - Added comprehensive logging for debugging chart rendering issues
     - Made chart container references more reliable
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

### Week Selection Implementation

The week selection feature has been implemented and allows users to select data from different weeks. The implementation includes:

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
- Continue testing the modal chart rendering to ensure it works consistently
- Improve error handling for edge cases in date formatting
- Review the internationalization system for other potential issues
- Ensure all charts render correctly with different languages
- Verify that timestamps correctly persist across language switches
- Conduct thorough cross-browser testing of the UI components
- Address any remaining internationalization inconsistencies

## Key Decisions

1. **Bug Fixing Strategy**
   - Focus on user-facing issues that impact core functionality
   - Implement robust fallback mechanisms for critical components
   - Add comprehensive logging for easier debugging
   - Use defensive programming techniques to handle edge cases
   - Maintain compatibility with existing code structure while fixing issues

2. **Week Selection Implementation**
   - Use Flatpickr library for the calendar widget
   - Only weeks with available data will be selectable
   - Default to the latest available week
   - Format: "24.03-30.03.2025 (Week 13)"
   - Load data on-demand rather than caching all weeks
   - No transitions when switching between weeks
   - No persistence of selected week between sessions

3. **Analytics Page Organization**
   - Clan Analysis section is now displayed first
   - Category Analysis section follows Clan Analysis
   - Function call order has been modified to match this new UI flow
   - Removed redundant nested initialization to prevent circular dependencies

4. **Modular Architecture**
   - Each module has a clear responsibility
   - Modules export a well-defined interface
   - Cross-module dependencies are explicitly set
   - State is managed centrally in the app module

5. **Testing Approach**
   - Test-driven development for new features
   - Unit tests focus on isolated functionality
   - Integration tests verify module interactions
   - Mocking approach for browser APIs

6. **Code Organization**
   - Flat module structure for now
   - Clear separation of concerns
   - Functions grouped by logical purpose
   - Core constants defined at module level

7. **Modal Chart Rendering**
   - Implement fallback mechanisms to ensure charts always have access to data
   - Add global window object reference for emergency access to player data
   - Include comprehensive logging for debugging rendering issues
   - Make container references more robust to prevent "element not found" errors

## Current Challenges

1. **Internationalization and Formatting**
   - Ensuring consistent date formatting across languages
   - Properly handling language switches without losing state
   - Maintaining timestamp displays during language changes
   - Preventing UI glitches during translation updates

2. **Chart Rendering Reliability**
   - Ensuring data access for modal charts
   - Preventing "no data available" errors in expanded views
   - Managing chart lifecycle properly (creation, update, destruction)
   - Implementing robust fallback mechanisms for data access

3. **UI Component Stability**
   - Ensuring consistent behavior across browsers
   - Maintaining correct state during view transitions
   - Handling edge cases in user interactions
   - Preserving display state during async operations

## Next Developmental Phases
- Further refinement of chart visualizations
- Additional analytics features
- Improved mobile responsiveness
- Comprehensive error handling and recovery mechanisms

## Technical Considerations
### Module Structure:

The codebase structure is organized as follows:

app/
├── app.js                // Core application logic and integration of modules
├── utils.js              // Utility functions (sorting, formatting, date handling, etc.)
├── dataLoader.js         // CSV data loading, parsing, and cleaning
├── i18n.js               // Internationalization functions and language management
├── domManager.js         // DOM element reference management and UI updates
├── eventListeners.js     // Event attachment and handling for user interactions
└── renderer/             // Contains view-specific rendering modules:
    ├── dashboardRenderer.js      // Rendering for dashboard (stats, charts)
    ├── tableRenderer.js          // Table rendering functions
    ├── chartRenderer.js          // Chart creation and management (ApexCharts)
    ├── playerDetailRenderer.js   // Player detail view rendering
    └── analyticsRenderer.js      // Analytics visualizations and reports