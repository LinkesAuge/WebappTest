# Module Interface Definitions

This document defines the public API for each module in the refactored application. It serves as a reference for developers working on the codebase and ensures consistent interfaces across modules.

## config.js

### Constants

```javascript
/**
 * Path to the CSV data file
 * @constant {string}
 */
export const CSV_PATH = 'data.csv';

/**
 * Path to the rules CSV file
 * @constant {string}
 */
export const RULES_PATH = 'rules.csv';

/**
 * Default language for the application
 * @constant {string}
 */
export const DEFAULT_LANGUAGE = 'de';

/**
 * Chart color themes
 * @constant {Object}
 */
export const CHART_COLORS = {
  primary: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
  secondary: ['#FF9E80', '#80D8FF', '#CCFF90', '#B388FF', '#EA80FC']
};
```

### Functions

```javascript
/**
 * Gets ApexCharts base configuration
 * @param {string} chartType - The type of chart ('pie', 'bar', 'line', etc.)
 * @returns {Object} ApexCharts configuration object
 */
export function getChartBaseOptions(chartType);

/**
 * Gets CSS variable value from the document
 * @param {string} varName - The CSS variable name (without --) 
 * @returns {string} CSS variable value
 */
export function getCssVariableValue(varName);
```

## utils.js

```javascript
/**
 * Formats a date range for display
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @param {string} [locale='de'] - The locale for formatting
 * @returns {string} Formatted date range string
 */
export function formatDateRange(startDate, endDate, locale);

/**
 * Triggers a file download in the browser
 * @param {string} content - The file content
 * @param {string} fileName - The file name
 * @param {string} [mimeType='text/csv'] - The MIME type
 */
export function triggerDownload(content, fileName, mimeType);

/**
 * Formats a number with thousand separators
 * @param {number} num - The number to format
 * @param {string} [locale='de'] - The locale for formatting
 * @returns {string} Formatted number
 */
export function formatNumber(num, locale);

/**
 * Creates a debounced function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait);

/**
 * Creates a throttled function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in ms
 * @returns {Function} Throttled function
 */
export function throttle(func, limit);

/**
 * Safely adds an event listener with error handling
 * @param {HTMLElement} element - The DOM element
 * @param {string} eventType - The event type
 * @param {Function} handler - The event handler
 * @param {Object} [options] - Event listener options
 */
export function safeAddListener(element, eventType, handler, options);
```

## state.js

```javascript
/**
 * Gets a value from the application state
 * @param {string} key - The state key
 * @returns {*} The state value
 */
export function getState(key);

/**
 * Sets a value in the application state
 * @param {string} key - The state key
 * @param {*} value - The value to set
 * @returns {boolean} Success indicator
 */
export function setState(key, value);

/**
 * Subscribes to changes in a state key
 * @param {string} key - The state key to watch
 * @param {Function} callback - Function called when state changes
 * @returns {string} Subscription ID
 */
export function subscribe(key, callback);

/**
 * Unsubscribes from state changes
 * @param {string} subscriptionId - The subscription ID
 */
export function unsubscribe(subscriptionId);

/**
 * Saves application state to localStorage
 * @param {string[]} [keys] - Specific keys to save (saves all if omitted)
 * @returns {boolean} Success indicator
 */
export function saveStateToStorage(keys);

/**
 * Loads application state from localStorage
 * @param {string[]} [keys] - Specific keys to load (loads all if omitted)
 * @returns {boolean} Success indicator
 */
export function loadStateFromStorage(keys);

/**
 * Resets application state to defaults
 * @param {string[]} [keys] - Specific keys to reset (resets all if omitted)
 */
export function resetState(keys);

/**
 * Enables debug mode for state changes
 * @param {boolean} enabled - Whether debug mode is enabled
 */
export function setStateDebug(enabled);
```

## i18n.js

```javascript
/**
 * Gets text content by key
 * @param {string} key - The text content key (dot notation for nested properties)
 * @param {Object} [replacements] - Optional replacement values
 * @returns {string} Translated text
 */
export function getText(key, replacements);

/**
 * Sets the current language
 * @param {string} langCode - The language code ('de' or 'en')
 * @returns {boolean} Success indicator
 */
export function setLanguage(langCode);

/**
 * Gets the current language
 * @returns {string} Current language code
 */
export function getLanguage();

/**
 * Gets user's language preference
 * @returns {string} User's preferred language code
 */
export function getLanguagePreference();

/**
 * Saves user's language preference
 * @param {string} langCode - The language code to save
 */
export function saveLanguagePreference(langCode);

/**
 * Updates all text content in the DOM
 */
export function updateDomTextContent();
```

## dom.js

```javascript
/**
 * Gets a DOM element by ID with error handling
 * @param {string} id - The element ID
 * @returns {HTMLElement|null} The DOM element or null if not found
 */
export function getElement(id);

/**
 * Assigns element references for the application
 * @returns {Object} Object containing all element references
 */
export function assignElementReferences();

/**
 * Shows an element
 * @param {HTMLElement|string} element - The element or element ID
 */
export function showElement(element);

/**
 * Hides an element
 * @param {HTMLElement|string} element - The element or element ID
 */
export function hideElement(element);

/**
 * Sets the status message
 * @param {string} message - The status message
 * @param {string} [type='info'] - The message type ('info', 'error', 'success')
 */
export function setStatus(message, type);

/**
 * Shows a loading spinner
 * @param {boolean} show - Whether to show or hide the spinner
 */
export function showLoading(show);

/**
 * Displays an error message
 * @param {string|Error} error - The error message or Error object
 * @param {boolean} [log=true] - Whether to log the error to console
 */
export function showError(error, log);
```

## listeners.js

```javascript
/**
 * Sets up all event listeners
 */
export function setupEventListeners();

/**
 * Sets up navigation listeners
 */
export function setupNavigationListeners();

/**
 * Sets up data interaction listeners
 */
export function setupDataInteractionListeners();

/**
 * Sets up chart interaction listeners
 */
export function setupChartListeners();

/**
 * Sets up language switcher listeners
 */
export function setupLanguageListeners();

/**
 * Removes all event listeners (for cleanup)
 */
export function removeAllEventListeners();
```

## dataLoading.js

```javascript
/**
 * Loads CSV data from the specified path
 * @param {string} path - The CSV file path
 * @returns {Promise<Array>} Promise resolving to parsed CSV data
 */
export function loadCsvData(path);

/**
 * Loads score rules data
 * @returns {Promise<Array>} Promise resolving to parsed rules data
 */
export function loadScoreRulesData();

/**
 * Parses CSV text into an array of objects
 * @param {string} csvText - The CSV text content
 * @param {Object} [options] - Papa Parse options
 * @returns {Array} Parsed CSV data
 */
export function parseCsvText(csvText, options);

/**
 * Initializes data loading for the application
 * @returns {Promise<boolean>} Promise resolving to success indicator
 */
export function initializeDataLoading();
```

## dataProcessing.js

```javascript
/**
 * Processes raw player data
 * @param {Array} rawData - The raw CSV data
 * @returns {Array} Processed player data
 */
export function processPlayerData(rawData);

/**
 * Calculates aggregate statistics
 * @param {Array} playerData - The processed player data
 * @returns {Object} Aggregate statistics
 */
export function calculateAggregateStats(playerData);

/**
 * Filters player data by category
 * @param {Array} playerData - The processed player data
 * @param {string} category - The category to filter by
 * @returns {Array} Filtered player data
 */
export function filterByCategory(playerData, category);

/**
 * Sorts player data by a specific field
 * @param {Array} playerData - The processed player data
 * @param {string} field - The field to sort by
 * @param {boolean} [ascending=false] - Sort direction
 * @returns {Array} Sorted player data
 */
export function sortData(playerData, field, ascending);

/**
 * Calculates score distribution
 * @param {Array} playerData - The processed player data
 * @param {number} [buckets=5] - Number of distribution buckets
 * @returns {Object} Score distribution data
 */
export function calculateScoreDistribution(playerData, buckets);
```

## uiUpdates.js

```javascript
/**
 * Switches the active view
 * @param {string} viewName - The view name to switch to
 */
export function switchView(viewName);

/**
 * Updates the visibility of header buttons
 * @param {string} viewName - The current view name
 */
export function updateHeaderButtonsVisibility(viewName);

/**
 * Renders the ranking table
 * @param {Array} playerData - The processed player data
 */
export function renderRankingTable(playerData);

/**
 * Renders the detailed data table
 * @param {Array} playerData - The processed player data
 */
export function renderDetailedTable(playerData);

/**
 * Updates the stats bar with aggregate statistics
 * @param {Object} stats - The aggregate statistics
 */
export function updateStatsBar(stats);

/**
 * Updates the breadcrumb navigation
 * @param {string} viewName - The current view name
 */
export function updateBreadcrumbs(viewName);

/**
 * Handles errors in the UI
 * @param {string|Error} error - The error message or Error object
 */
export function handleUiError(error);
```

## charts.js

```javascript
/**
 * Creates an ApexCharts instance for top sources
 * @param {string} containerId - The container element ID
 * @param {Array} data - The chart data
 * @returns {ApexCharts} ApexCharts instance
 */
export function createTopSourcesChart(containerId, data);

/**
 * Creates an ApexCharts instance for score distribution
 * @param {string} containerId - The container element ID
 * @param {Array} data - The chart data
 * @returns {ApexCharts} ApexCharts instance
 */
export function createScoreDistributionChart(containerId, data);

/**
 * Creates an ApexCharts instance for score vs chests
 * @param {string} containerId - The container element ID
 * @param {Array} data - The chart data
 * @returns {ApexCharts} ApexCharts instance
 */
export function createScoreVsChestsChart(containerId, data);

/**
 * Creates an ApexCharts instance for player skills
 * @param {string} containerId - The container element ID
 * @param {Object} player - The player data
 * @returns {ApexCharts} ApexCharts instance
 */
export function createPlayerChart(containerId, player);

/**
 * Updates an existing chart with new data
 * @param {ApexCharts} chart - The ApexCharts instance
 * @param {Array} data - The new chart data
 */
export function updateChart(chart, data);

/**
 * Destroys chart instances
 * @param {ApexCharts|ApexCharts[]} charts - Chart instance(s) to destroy
 */
export function destroyCharts(charts);

/**
 * Handles chart export
 * @param {ApexCharts} chart - The ApexCharts instance
 * @param {string} format - Export format ('png', 'svg', 'csv')
 */
export function exportChart(chart, format);
```

## main.js

```javascript
/**
 * Initializes the application
 * @returns {Promise<boolean>} Promise resolving to success indicator
 */
export async function initializeApp();

/**
 * Handles DOMContentLoaded event
 */
export function handleDomContentLoaded();

/**
 * Sets up error handling
 */
export function setupErrorHandling();

/**
 * Initializes the app in debug mode
 * @param {Object} options - Debug options
 */
export function initializeDebugMode(options);
```

## Dependencies Between Modules

Each module should document its dependencies at the top of the file:

```javascript
/**
 * Module: charts.js
 * 
 * Dependencies:
 * - config.js: For chart colors and base options
 * - dom.js: For DOM element access
 * - state.js: For application data access
 * - utils.js: For formatting functions
 */
``` 