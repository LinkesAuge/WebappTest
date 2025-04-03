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

1. **Continue Test Improvements**
   - Address DOM mocking issues in tests
   - Improve localStorage mocking
   - Fix integration issues between modules
   - Ensure proper cleanup in tests

2. **Enhance Error Handling**
   - Add more comprehensive error checking
   - Improve user feedback for error states
   - Handle edge cases in data loading
   - Add validation for all data operations

3. **Refine Module Integration**
   - Further optimize cross-module dependencies
   - Improve data flow between components
   - Enhance error propagation across module boundaries

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

1. **DOM Testing**
   - Properly mocking DOM elements for tests
   - Handling event listeners in tests
   - Simulating user interactions
   - Managing DOM state between tests

2. **Asynchronous Testing**
   - Testing data loading operations
   - Handling promises and async/await
   - Ensuring proper test completion
   - Avoiding race conditions in tests

3. **Browser API Mocking**
   - Creating realistic localStorage behavior
   - Mocking fetch API for data loading
   - Simulating browser events
   - Managing global state in tests

4. **Initialization Order**
   - Ensuring proper module loading sequence
   - Handling cross-module dependencies
   - Managing state initialization
   - Preventing circular dependencies

## Next Developmental Phases

1. **Complete Test Stabilization**
   - Fix all test failures
   - Ensure reliable test runs
   - Improve test documentation
   - Establish CI integration

2. **Enhanced Chart Rendering**
   - Create chart-specific abstraction module
   - Improve chart configuration management
   - Add more visualization options
   - Optimize chart performance

3. **Export Functionality**
   - Add support for multiple export formats
   - Improve CSV generation
   - Add export configurations
   - Enhance filename handling

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

### Next Steps
- Consider adding export functionality for table data
- Review mobile view of tables for responsive design improvements
- Test performance with large datasets

## Next Steps
- Continue fixing test failures and improving test coverage
- Enhance error handling for edge cases
- Add more comprehensive validation for all data operations
- Optimize performance for large datasets
- Improve user feedback for error states
- Create app/ folder structure and move files according to planned architecture
- Implement testing infrastructure from scratch
- Develop initial tests following test-driven development approach
- Achieve >95% test coverage as per project requirements

## Technical Considerations
- Proper initialization sequence for modules to prevent undefined references
- Defensive programming techniques for data validation and error handling
- Clear interfaces between modules to manage dependencies
- Consistent error propagation across module boundaries
- Migration strategy from flat structure to modular architecture
- Balancing between maintaining the existing functionality and adding new features
- Potential optimization of the large script.js file (approximately 4000+ lines)
- Browser compatibility for various chart interaction features
- Memory usage when processing large datasets
- Performance of chart rendering and table operations
- Proper path handling when moving files to new folder structure

## Timeline Expectations
- Complete remaining bug fixes within 1 week
- Create folder structure and move files within 1 week
- Set up testing infrastructure and implement initial tests within 2-3 weeks
- Finalize transition to "ChefScore Analytics Dashboard" within 1 month
- Ongoing maintenance as needed
- Feature additions based on user feedback and requirements

## Refactor Plan for script.js Modularization

### Clarifications (as provided by the user):
- We will continue to use global variables for state management.
- No backward compatibility is required; we can refactor freely.
- We will rely on native ES6 modules (using <script type="module">) for our new structure.
- The functionality of the application will remain identical.
- We will use Jest for testing, installed via our uv dependency manager.

### Proposed New Module Structure:

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

### Transition Phases:

1. **Analysis and Preparation**: 
   - Review script.js to identify cut points and document dependencies (e.g., CORE_COLUMNS, NUMERIC_FORMATTER).
   - Confirm that global variables remain as is and that we can work with native modules.
   - Establish that no backwards compatibility is required.

2. **Module Refactoring**: 
   - Create the new module files listed above.
   - Incrementally migrate functions from script.js into these modules (e.g., CSV loading into dataLoader.js, i18n functions into i18n.js, DOM assignments into domManager.js, etc.).
   - Adjust imports/exports accordingly in main.js and other modules.

3. **Detailed Testing with Jest**:
   - Install Jest using uv (e.g., `uv add jest`).
   - Create test files for each module in the tests/ directory (e.g., tests/test_dataLoader.js, tests/test_i18n.js, etc.).
   - Write tests to cover functionality, including CSV parsing, data cleaning, i18n translations, DOM updates, event handling, and chart configuration.
   - Aim for at least 95% test coverage.

4. **Integration and Regression Testing**:
   - Integrate the modules into main.js and run end-to-end tests in the browser.
   - Verify that all application features (data loading, view switching, and chart rendering) behave identically to the current implementation.

5. **Finalization and Documentation**:
   - Update memory bank files (e.g., activeContext.md, progress.md) and the project README with the new structure and testing instructions.
   - Commit all changes on the master branch.

----- End of Refactor Plan and Clarifications -----

// ----- Detailed Refactor Plan and Checklist -----

### Detailed Refactor Plan and Checklist

#### Phase 1: Analysis and Preparation
- [ ] Review the entire script.js (∼4000+ lines) to identify functionally coherent sections (data loading, internationalization, DOM management, event handling, chart rendering, table and player detail rendering).
- [ ] Document key dependencies and global variables (e.g., CORE_COLUMNS, NUMERIC_FORMATTER, chartInstances).
- [ ] Confirm that global variables will remain as is for state management.
- [ ] Decide to use native ES6 modules and update index.html accordingly (use <script type="module"> to load app/main.js).

#### Phase 2: Module Refactoring
- [ ] Create the following new module files under the `app/` folder:
  - [ ] `main.js` – Entry point that initializes the application and wires up modules.
  - [ ] `utils.js` – Utility functions including sorting, formatting, and CSS variable retrieval.
  - [ ] `dataLoader.js` – Functions for CSV data loading, parsing, and cleaning (for both data.csv and rules.csv).
  - [ ] `i18n.js` – Internationalization functions (getText, getLanguagePreference, updateUIText, language switching).
  - [ ] `domManager.js` – Functions to assign and cache DOM element references and update UI segments.
  - [ ] `eventListeners.js` – Functions to attach event handlers for navigation, filtering, sort clicks, chart expansion, mobile menu, etc.
  - [ ] Under the `renderer/` folder:
    - [ ] `dashboardRenderer.js` – Functions to render the dashboard (stats, ranking table, chart widgets).
    - [ ] `tableRenderer.js` – Functions to render the full detailed data table view.
    - [ ] `chartRenderer.js` – Functions to configure and render charts with ApexCharts for top sources, score distribution, scatter plots, frequent sources, etc.
    - [ ] `playerDetailRenderer.js` – Functions to render the player detail view (score breakdown, radar chart, etc.).
- [ ] Incrementally migrate functions from script.js into the above modules, updating their export/import statements and removing them from the original file as they are relocated.
- [ ] Update index.html to load the application via `<script type="module" src="app/main.js">`.

#### Phase 3: Detailed Testing with Jest
- [ ] Install Jest using the uv dependency manager (e.g., run `uv add jest`).
- [ ] Set up a `tests/` folder along with any initialization files (like an `init.js` if necessary).
- [ ] Create test stubs for each module:
  - [ ] `tests/test_dataLoader.js`
  - [ ] `tests/test_i18n.js`
  - [ ] `tests/test_domManager.js`
  - [ ] `tests/test_eventListeners.js`
  - [ ] `tests/test_dashboardRenderer.js`
  - [ ] `tests/test_tableRenderer.js`
  - [ ] `tests/test_chartRenderer.js`
  - [ ] `tests/test_playerDetailRenderer.js`
- [ ] Write comprehensive tests covering:
  - CSV parsing and data cleaning (including handling edge cases, missing fields, and type conversion).
  - Internationalization functions: correct string translations, language preference storage/retrieval, and DOM text updates.
  - DOM management: proper assignment of element references and UI update functions.
  - Event handling: onClick and onInput events triggering the correct callbacks, verifying sorting and navigation behaviors.
  - Chart rendering: the configuration objects generated for ApexCharts and proper error handling (mocking ApexCharts if necessary).
- [ ] Aim to achieve at least 95% test coverage across all modules.

#### Phase 4: Integration and Regression Testing
- [ ] Integrate all newly created modules via `main.js` and verify module interactivity.
- [ ] Conduct end-to-end testing in a development browser to ensure that data loading, view switching, and chart rendering function exactly as in the current implementation.
- [ ] Perform regression testing to compare the refactored application with the original functionality and address any integration issues.

#### Phase 5: Finalization and Documentation
- [ ] Update memory bank files (activeContext.md, progress.md) with details of the new architecture and testing strategy.
- [ ] Update or create a project README with instructions on setting up, running tests (e.g., using Jest), and the new module structure.
- [ ] Commit all changes on the master branch and push to GitHub.

// ----- End of Detailed Refactor Plan and Checklist ----- 