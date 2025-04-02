# Script.js Refactoring Plan

## Overview
This plan outlines the process of breaking down the large `script.js` file into smaller, more maintainable modules using ES6 module system.

## Goals
- Improve code maintainability and readability
- Reduce file size and complexity
- Organize code by functionality
- Make future development easier
- Fix existing linter errors

## File Structure
We will create a new `js/` directory with the following files:

```
js/
├── config.js        # Constants, file paths, configuration values
├── utils.js         # Helper functions (formatting, sorting, etc.)
├── state.js         # Global state variables and state management
├── i18n.js          # Internationalization and text content
├── dom.js           # DOM element references and manipulation
├── listeners.js     # Event listener setup and handlers
├── dataLoading.js   # Functions for fetching and parsing data
├── dataProcessing.js # Data calculation and aggregation
├── uiUpdates.js     # UI rendering functions
├── charts.js        # Chart rendering functions
├── main.js          # Application entry point and initialization
```

## Module Content Mapping

### config.js
- Constants (e.g., `CSV_PATH`, `RULES_PATH`, chart colors)
- Configuration values

### utils.js
- Generic helper functions (`triggerDownload`, `formatDateRange`)
- Utility functions not tied to specific application features

### state.js
- Global state variables (`allPlayersData`, `scoreRules`, etc.)
- State management functions
- Local storage functions (`saveDataToLocalStorage`, `loadDataFromLocalStorage`)

### i18n.js
- `TEXT_CONTENT` object
- Language-related functions (`getText`, `setLanguage`, `getLanguagePreference`)
- Translation initialization

### dom.js
- DOM element references
- `assignElementReferences` function
- Generic DOM manipulation functions

### listeners.js
- `setupEventListeners` function
- Event handler functions
- `safeAddListener` helper

### dataLoading.js
- CSV loading functions (`loadStaticCsvData`, `loadScoreRulesData`)

### dataProcessing.js
- Data calculation functions (`calculateAggregateStats`, `calculateHistoricalStats`)
- Data sorting and filtering (`sortData`)
- Data transformation functions

### uiUpdates.js
- View switching (`switchView`)
- Status/message display functions (`setStatus`, `displayError`, etc.)
- Table rendering functions (`renderRankingTable`, `renderDetailedTable`, etc.)
- UI update functions (`updateHeaderButtonsVisibility`, `updateStatsBar`)

### charts.js
- Chart configuration (`getChartBaseOptions`, `getCssVariableValue`)
- Chart rendering functions (all `render*Chart` functions)
- Chart interaction handlers (`handleExpandChartClick`)

### main.js
- Main application initialization (`init`, `initializeApp`)
- DOMContentLoaded event handler
- High-level application flow coordination

## Migration Process

### Phase 1: Setup
1. Create the `js/` directory and all module files
2. Initialize each file with basic export structure
3. Update `index.html` to load `main.js` as a module

### Phase 2: Core Functionality
1. Move configuration and constants to `config.js`
2. Move utility functions to `utils.js`
3. Move state variables and management to `state.js`
4. Move i18n functionality to `i18n.js`
5. Move DOM references to `dom.js`

### Phase 3: Application Logic
1. Move data loading functions to `dataLoading.js`
2. Move data processing functions to `dataProcessing.js`
3. Move event listeners to `listeners.js`
4. Move UI update functions to `uiUpdates.js`

### Phase 4: Advanced Features
1. Move chart rendering to `charts.js`
3. Organize initialization and main flow in `main.js`

### Phase 5: Testing & Cleanup
1. Test all functionality to ensure it works as before
2. Fix any issues that arise during testing
3. Remove the original `script.js` file once everything is working

## Implementation Notes
- Use ES6 `import` and `export` statements to manage dependencies
- Fix existing linter errors during migration
- Maintain function names and signatures for compatibility
- Test incrementally as each module is completed

## Testing Approach
1. Test after moving each major functional area
2. Focus on:
   - Application initialization
   - Data loading and display
   - Chart rendering
   - UI interactions
   - View switching
   - Language switching
