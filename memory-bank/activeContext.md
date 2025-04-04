# Active Context

## Current Focus

We are actively working on modernizing the application's architecture by implementing a modular approach and establishing a solid testing infrastructure. We have recently fixed critical initialization and data loading issues that were preventing the application from functioning correctly.

### Current Stage: Modularization & Testing + Bug Fixing

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
   - Initialization sequence in `app.js` has been corrected to ensure proper loading order
   - Cross-module utility references have been fixed to prevent "utils is not defined" errors
   - Data cleaning and processing has been improved for better handling of numeric values
   - Sort state initialization has been fixed to prevent null reference errors
   - Sort icon visibility and rendering has been enhanced

### Immediate Tasks

## Key Decisions

1. **Modular Architecture**
   - Each module has a clear responsibility
   - Modules export a well-defined interface
   - Cross-module dependencies are explicitly set
   - State is managed centrally in the app module

2. **Testing Approach**
   - Test-driven development for new features
   - Unit tests focus on isolated functionality
   - Integration tests verify module interactions
   - Mocking approach for browser APIs

3. **Code Organization**
   - Flat module structure for now
   - Clear separation of concerns
   - Functions grouped by logical purpose
   - Core constants defined at module level

4. **Bug Fixing Strategy**
   - Prioritize initialization and cross-module dependencies
   - Focus on critical data flow paths
   - Implement defensive programming techniques
   - Add more detailed logging for debugging

## Current Challenges

1. **Initialization Order**
   - Ensuring proper module loading sequence
   - Handling cross-module dependencies
   - Managing state initialization
   - Preventing circular dependencies

## Next Developmental Phases


## Current Focus: UI Refinements and Table Improvements

### Recent Changes
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


## Next Steps


## Technical Considerations
factor Plan for script.js Modularization



### Module Structure:

The new codebase structure will be organized as follows:

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
    └── playerDetailRenderer.js   // Rendering for the player detail view (stats, breakdown, radar chart).
    └── playerDetailRenderer.js   // Rendering for the player detail view (stats, breakdown, radar chart).