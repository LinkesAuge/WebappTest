# Active Context

## Current Focus
- Transitioning from "Chest Analyzer" to "ChefScore Analytics Dashboard"
- Building testing infrastructure from scratch (all previous tests deleted)
- Restructuring project folder organization
- Improving user experience on mobile devices
- Ensuring accuracy of data visualization and analysis

## Recent Changes
- Removed all previous tests to start fresh with a proper testing approach
- Set up modern development environment with Babel and ESLint
- Added configuration files (.babelrc, .eslintrc, package.json)
- Implemented responsive design for better mobile compatibility
- Added chart expansion feature for more detailed analysis
- Improved sorting functionality in tables
- Enhanced internationalization support for German and English

## Next Steps
- Create app/ folder structure and move files according to planned architecture
- Implement testing infrastructure from scratch
- Develop initial tests following test-driven development approach
- Achieve >95% test coverage as per project requirements
- Finalize the transition to "ChefScore Analytics Dashboard"
- Consider adding more visualization types for deeper analysis
- Improve error handling for malformed CSV data
- Optimize chart rendering for better performance
- Explore adding download options for visualization results
- Integrate testing with CI/CD pipeline

## Key Decisions
- Transitioning from "Chest Analyzer" to "ChefScore Analytics Dashboard"
- Adopting test-driven development for all new features
- Planning to use pytest for all testing needs
- Using UV for dependency management
- Using ApexCharts for all visualization needs
- Implementing client-side only processing to eliminate server dependencies
- Supporting only modern browsers to enable use of latest JavaScript features
- Using Tailwind CSS for styling to speed up development
- Storing language preference in localStorage

## Technical Considerations
- Migration strategy from flat structure to modular architecture
- Balancing between maintaining the existing functionality and adding new features
- Potential optimization of the large script.js file (approximately 4000+ lines)
- Browser compatibility for various chart interaction features
- Memory usage when processing large datasets
- Performance of chart rendering and table operations
- Proper path handling when moving files to new folder structure

## Timeline Expectations
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