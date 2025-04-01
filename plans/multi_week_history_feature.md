# Multi-Week Data & History Feature Implementation Plan

## Overview

This document outlines the implementation plan for enhancing the ChefScore Analytics Dashboard with multi-week data support and historical analysis capabilities.

## Current Limitations

Currently, the application:
- Loads data from a single static `data.csv` file
- Cannot track changes over time or show historical trends
- Has no week selection mechanism

## Goals

1. Support multiple weekly data files (`data_week_XX.csv`)
2. Default to displaying the most recent week's data
3. Allow users to select different weeks using a date picker
4. Provide a new "History" view with cross-week analysis
5. Maintain backward compatibility with the existing implementation

## Technical Design

### 1. Data Organization

- Create a "data" folder in the project root
- Store weekly data files with naming convention: `data_week_XX.csv` (where XX is the calendar week)
- Optionally create a `weeks.json` index file to list all available weeks

### 2. Data Management

#### 2.1 Week Detection

```javascript
/**
 * Fetches the list of available weeks from the weeks.json file.
 * Falls back to detecting files if weeks.json is not available.
 * @returns {Promise<boolean>} True if weeks data loaded successfully.
 */
async function loadAvailableWeeks() {
  // Implementation details in full code
}

/**
 * Fallback method to detect available weeks by probing for files.
 * @returns {Promise<boolean>} True if any weeks were detected.
 */
async function detectAvailableWeeks() {
  // Implementation details in full code
}

/**
 * Determines the most recent week from the list of available weeks.
 * @param {Array} weeks - The list of available weeks.
 * @returns {Object} The most recent week object.
 */
function determineLatestWeek(weeks) {
  // Implementation details in full code
}
```

#### 2.2 Data Loading

```javascript
/**
 * Loads data for a specific week.
 * @param {number|string|null} week - Week number to load, or null for most recent.
 * @returns {Promise<boolean>} True if data loaded successfully.
 */
async function loadWeekData(week = null) {
  // Implementation details in full code
}

/**
 * Modified data loading function to accept a specific file path.
 * @param {string} filePath - Path to the CSV file to load.
 * @returns {Promise<boolean>} True if data loaded successfully.
 */
async function loadStaticCsvData(filePath = DEFAULT_CSV_FILE_PATH) {
  // Implementation details in full code
}
```

#### 2.3 Historical Data Management

```javascript
/**
 * Loads data for all available weeks for historical analysis.
 * @returns {Promise<boolean>} True if historical data loaded successfully.
 */
async function loadHistoricalData() {
  // Implementation details in full code
}

/**
 * Calculates aggregate stats for each week.
 * @returns {Object} Object containing stats for each week.
 */
function calculateHistoricalStats() {
  // Implementation details in full code
}
```

### 3. UI Components

#### 3.1 Week Selector

```html
<!-- Week Selector Component -->
<div id="week-selector" class="flex items-center space-x-2 mb-4">
  <button id="prev-week-btn">
    <i class="fas fa-chevron-left"></i>
  </button>
  
  <div class="relative">
    <select id="week-select">
      <option value="" data-i18n-key="weekSelector.loading">Loading weeks...</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-500">
      <i class="fas fa-chevron-down text-xs"></i>
    </div>
  </div>
  
  <button id="next-week-btn">
    <i class="fas fa-chevron-right"></i>
  </button>
  
  <!-- Current week indicator -->
  <span id="latest-week-indicator" class="hidden">
    <i class="fas fa-star mr-1"></i>
    <span data-i18n-key="weekSelector.latest">Latest</span>
  </span>
</div>
```

```javascript
/**
 * Populates the week selector dropdown with available weeks.
 */
function populateWeekSelector() {
  // Implementation details in full code
}

/**
 * Updates the week selector UI based on the current week.
 */
function updateWeekSelectorUI() {
  // Implementation details in full code
}

/**
 * Sets up event listeners for the week selector.
 */
function setupWeekSelectorEventListeners() {
  // Implementation details in full code
}
```

#### 3.2 History View

New HTML section for the History view:

```html
<!-- History Section -->
<section id="history-section" class="hidden">
  <!-- Weekly Totals -->
  <div>
    <h3 data-i18n-key="history.weeklyTotals">Weekly Totals</h3>
    <table>
      <!-- Table headers -->
      <thead>
        <!-- Week, Period, Players, Total Score, Total Chests, Avg Score, Avg Chests -->
      </thead>
      <tbody id="weekly-totals-body">
        <!-- Data rows will be inserted here -->
      </tbody>
    </table>
  </div>

  <!-- Weekly Trends Charts -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Score Trend Chart -->
    <div>
      <h3 data-i18n-key="history.scoreTrend">Weekly Score Trend</h3>
      <div id="score-trend-chart-container"></div>
    </div>

    <!-- Chests Trend Chart -->
    <div>
      <h3 data-i18n-key="history.chestsTrend">Weekly Chests Trend</h3>
      <div id="chests-trend-chart-container"></div>
    </div>
  </div>

  <!-- Top Players Performance Chart -->
  <div>
    <h3 data-i18n-key="history.topPlayersPerformance">Top Players Performance</h3>
    <div id="top-players-chart-container"></div>
  </div>

  <!-- Category Trends -->
  <div>
    <h3 data-i18n-key="history.categoryTrends">Category Trends</h3>
    <select id="trend-category-select"></select>
    <div id="category-trend-chart-container"></div>
  </div>
</section>
```

```javascript
/**
 * Renders the weekly totals table in the history view.
 */
function renderWeeklyTotalsTable() {
  // Implementation details in full code
}

/**
 * Renders the score trend chart.
 */
function renderScoreTrendChart() {
  // Implementation details in full code
}

/**
 * Renders the chests trend chart.
 */
function renderChestsTrendChart() {
  // Implementation details in full code
}

/**
 * Renders the top players performance chart.
 */
function renderTopPlayersChart() {
  // Implementation details in full code
}

/**
 * Populates the category dropdown for the trend chart.
 */
function populateTrendCategoryDropdown() {
  // Implementation details in full code
}

/**
 * Renders the category trend chart.
 * @param {string} category - The category to show the trend for.
 */
function renderCategoryTrendChart(category) {
  // Implementation details in full code
}

/**
 * Renders the complete history view.
 */
function renderHistoryView() {
  // Implementation details in full code
}
```

### 4. Updated App Initialization

```javascript
/**
 * Main application initialization function.
 */
async function initializeApp() {
  // First, load available weeks
  const weeksLoaded = await loadAvailableWeeks();
  
  // Determine which data to load
  let dataToLoad;
  
  if (weeksLoaded && availableWeeks.length > 0) {
    // We have weeks data, load the most recent week
    dataToLoad = mostRecentWeek;
  } else {
    // No weeks data available, fall back to default data.csv
    dataToLoad = null;
  }

  // Load data and rules
  const [dataLoaded, rulesLoaded] = await Promise.all([
    loadWeekData(dataToLoad ? dataToLoad.week : null),
    loadScoreRulesData(),
  ]);

  if (dataLoaded) {
    // Initialize week selector if we have weeks data
    if (weeksLoaded && availableWeeks.length > 0) {
      populateWeekSelector();
      setupWeekSelectorEventListeners();
      updateWeekSelectorUI();
    }
    
    // Rest of initialization...
  }
}
```

### 5. Translation Keys

Add new translation keys for both German and English:

```javascript
// Add to TEXT_CONTENT.de and TEXT_CONTENT.en
weekSelector: {
  loading: "Loading weeks...",
  noWeeks: "No weeks available",
  week: "Week",
  latest: "Latest",
  weekChanged: "Switched to week {week}"
},
history: {
  title: "History",
  subtitle: "Analyze data trends across multiple weeks",
  // ... more keys
},
nav: {
  // ... existing items
  history: "History" // or "Historie" for German
}
```

## Implementation Phases

### Phase 1: Data Structure and Loading
- Create the "data" folder structure
- Implement week detection functions
- Modify data loading to support specific weeks
- Add caching for historical data

### Phase 2: Week Selector UI
- Add HTML for the week selector component
- Implement selector population and event handling
- Add week navigation buttons
- Style and position the component

### Phase 3: History View
- Add "History" navigation item
- Create HTML structure for the history view
- Implement data aggregation for historical stats
- Create weekly totals table

### Phase 4: History Charts
- Implement score trend chart
- Implement chests trend chart
- Implement top players performance chart
- Implement category trend chart

### Phase 5: Testing and Refinement
- Test with sample data across multiple weeks
- Test backward compatibility with single data.csv
- Test edge cases (missing weeks, player disparities)
- Optimize loading performance

## Challenges and Solutions

### 1. Server-side File Listing
- **Challenge**: Client-side JavaScript can't directly list server files
- **Solutions**:
  - Create a `weeks.json` index file that lists available weeks
  - Implement a detection algorithm that probes for known week patterns
  - As fallback, use a simple server-side script to list available files

### 2. Loading and Caching Multiple Weeks
- **Challenge**: Loading all weekly data at once could be memory-intensive
- **Solutions**:
  - Load only the currently selected week data
  - Cache recently viewed weeks to avoid redundant fetches
  - Load historical data on-demand when viewing the History section

### 3. Week Selection UI
- **Challenge**: Creating an intuitive date selection interface
- **Solutions**:
  - Use a simple dropdown showing available weeks
  - Add next/previous buttons for quick navigation
  - Show visual indication when viewing the most recent week

### 4. Handling Missing Data
- **Challenge**: Some players might appear in some weeks but not others
- **Solutions**:
  - In week-specific views: Only show players present in that week's data
  - In history view: Treat missing values as 0 or null as appropriate
  - Create logic to properly track player activity across weeks 