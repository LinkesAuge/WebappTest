# Revised Script.js Refactoring Plan

## Overview
This revised plan outlines the process of breaking down the large `script.js` file (4200 lines) into smaller, more maintainable modules using the ES6 module system.

## Goals
- Improve code maintainability and readability
- Reduce file size and complexity
- Organize code by functionality
- Make future development easier
- Fix existing linter errors
- Create a consistent testing approach

## Technical Decisions
- **Chart Library**: Standardize on ApexCharts for all chart rendering
- **Browser Compatibility**: Support modern browsers only (Chrome-based, Mozilla, Safari)
- **Module Loading**: Serve ES6 modules directly without bundling
- **Application Entry Point**: Single entry point (`main.js`)
- **State Management**: Simple pub/sub state management pattern

## File Structure
We will create a `js/` directory with the following files:

```
js/
├── config.js        # Constants, file paths, configuration values, chart themes
├── utils.js         # Helper functions (formatting, sorting, etc.)
├── state.js         # Global state variables and state management (pub/sub pattern)
├── i18n.js          # Internationalization and text content
├── dom.js           # DOM element references and manipulation
├── listeners.js     # Event listener setup and handlers
├── dataLoading.js   # Functions for fetching and parsing data
├── dataProcessing.js # Data calculation and aggregation
├── uiUpdates.js     # UI rendering functions
├── charts.js        # Chart rendering functions (ApexCharts)
├── main.js          # Application entry point and initialization
```

## Module Content Mapping

### config.js
- Constants (e.g., `CSV_PATH`, `RULES_PATH`)
- Chart theme colors and configurations
- Configuration values
- Environment settings

### utils.js
- Generic helper functions (`triggerDownload`, `formatDateRange`)
- Utility functions not tied to specific application features
- Date and number formatting helpers

### state.js
- Global state variables (`allPlayersData`, `scoreRules`, etc.)
- State management functions (getters/setters)
- Pub/sub system for state change notifications
- Local storage functions

### i18n.js
- `TEXT_CONTENT` object
- Language-related functions
- Translation initialization

### dom.js
- DOM element references
- Element reference assignment function
- Generic DOM manipulation functions

### listeners.js
- Event listener setup functions
- Event handler functions
- Event delegation utilities

### dataLoading.js
- CSV loading functions
- Data parsing utilities
- Error handling for data loading

### dataProcessing.js
- Data calculation functions
- Data sorting and filtering
- Data transformation functions

### uiUpdates.js
- View switching
- UI status/message display
- Table rendering functions
- UI update functions

### charts.js
- ApexCharts configuration factories
- Chart rendering functions
- Chart interaction handlers

### main.js
- Application initialization
- Module loading and orchestration
- High-level application flow coordination

## Implementation Process with Granular Checkpoints

### Phase 1: Setup & Proof of Concept
1. Create the `js/` directory and all module files with basic structure
   - **Checkpoint 1.1**: Directory structure created
2. Update `index.html` to load `main.js` as a module
   - **Checkpoint 1.2**: HTML updated, no console errors
3. Implement `config.js` with essential constants
   - **Checkpoint 1.3**: Config values accessible in console
4. Implement `utils.js` with core utility functions
   - **Checkpoint 1.4**: Utility functions testable via console
5. Create a minimal `main.js` that imports these modules
   - **Checkpoint 1.5**: Basic modules load without errors

### Phase 2: Core Framework
1. Implement `state.js` with the pub/sub pattern
   - **Checkpoint 2.1**: State gets/sets work with notifications
2. Move DOM references to `dom.js`
   - **Checkpoint 2.2**: DOM elements accessible through module
3. Move i18n functionality to `i18n.js`
   - **Checkpoint 2.3**: Language switching works
4. Connect these core modules in `main.js`
   - **Checkpoint 2.4**: Basic app initialization works

### Phase 3: Data Handling
1. Implement `dataLoading.js` for CSV loading
   - **Checkpoint 3.1**: Data loads correctly from CSV
2. Implement `dataProcessing.js` for calculations
   - **Checkpoint 3.2**: Data is processed correctly
3. Connect data modules to state management
   - **Checkpoint 3.3**: Processed data stored in state
4. Update main.js to orchestrate data loading
   - **Checkpoint 3.4**: Data loads on app initialization

### Phase 4: UI & Interaction
1. Implement `listeners.js` for event handling
   - **Checkpoint 4.1**: Event listeners function correctly
2. Implement `uiUpdates.js` for rendering
   - **Checkpoint 4.2**: UI updates when state changes
3. Connect UI modules to state via pub/sub
   - **Checkpoint 4.3**: UI reacts to state changes
4. Update main.js to initialize UI modules
   - **Checkpoint 4.4**: Complete UI initialization works

### Phase 5: Chart Implementation
1. Implement `charts.js` with ApexCharts
   - **Checkpoint 5.1**: Basic charts render correctly
2. Connect charts to state management
   - **Checkpoint 5.2**: Charts update when data changes
3. Implement chart interaction handlers
   - **Checkpoint 5.3**: Chart interactions work correctly
4. Update tests to use ApexCharts instead of Chart.js
   - **Checkpoint 5.4**: Chart tests pass with ApexCharts

### Phase 6: Integration & Testing
1. Ensure main.js properly initializes all modules
   - **Checkpoint 6.1**: App initializes without errors
2. Test all functionality end-to-end
   - **Checkpoint 6.2**: All features work as expected
3. Remove the original `script.js` file
   - **Checkpoint 6.3**: App works without script.js
4. Fix any issues that arise during testing
   - **Checkpoint 6.4**: All tests pass

## Testing Approach
1. Test after completing each phase
2. For each module, create corresponding unit tests
3. Run integration tests after connecting modules
4. Test key user flows after each phase
5. Run a full suite of tests before removing script.js

## Migration Challenges & Solutions

### Potential Circular Dependencies
- Identify potential circular dependencies early
- Use dependency injection for problematic modules
- Consider using mediator pattern for highly interconnected modules
- Restructure functions if necessary to avoid cycles

### State Management Transitions
- Gradually migrate to the pub/sub pattern
- Test state changes thoroughly
- Keep a debug mode that logs state changes during development

### Browser Compatibility
- Test in Chrome, Firefox, and Safari
- Use feature detection when necessary
- Add error handling for unsupported features

## Completion Criteria
- All functionality works as before
- All tests pass
- No references to the original script.js remain
- No console errors in supported browsers
- Performance is maintained or improved

## Architectural Changes

This revised plan includes the following key architectural changes:

1. **No Weekly Data Selection**: The week selection feature has been removed to simplify the application architecture. The application now only works with a single dataset without historical comparison.

2. **Modular Structure**: Breaking down script.js into specialized modules with clear responsibilities.

3. **ES6 Module System**: Using modern JavaScript module syntax for better encapsulation.

4. **Pub/Sub State Management**: Implementing a centralized state with publish/subscribe pattern.

5. **Standardized Chart Library**: Consolidating on ApexCharts for all visualizations.

6. **Clear Module Interfaces**: Establishing well-defined public APIs for each module.

7. **Improved Error Handling**: Adding comprehensive error handling across all modules.

8. **Enhanced Testing Strategy**: Implementing unit, integration, and end-to-end tests.