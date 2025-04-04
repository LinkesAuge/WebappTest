# Chest Analyzer - Documentation

## 1. Overview

**Purpose:**

The Chest Analyzer is a single-page web application designed for players and members of the "The Chiller" clan in the game "Total Battle". Its primary goal is to load, process, analyze, and visualize player chest data exported from the game in CSV format. This tool allows users to gain insights into individual and comparative performance based on chest collection metrics.
In the browser game "Total Battle" players can collect chests which can be of many different types, each of which can have various different sources and that all get a score based on rules set by our site.

**Version Type:**

This specific version operates **entirely client-side**. It fetches its primary dataset (`data/data.csv`) and scoring rules (`data/rules.csv`) from static files hosted alongside the main `index.html` file. It uses the user's web browser to perform all calculations and rendering. Data persistence across browser sessions relies on the static nature of the hosted CSV files (updated by the website owner) and `localStorage` for user preferences like language selection.

**Target Audience:**

*   Players of "Total Battle", particularly members of "The Chiller" clan.
*   Clan leadership or analysts looking to track member activity and scoring.

## 2. Core Features

*   **Static Data Loading:** Automatically fetches and parses predefined `data/data.csv` and `data/rules.csv` files on page load.
*   **Week Selection:** Allows viewing data for specific weeks stored in `data/week/week_X.csv` files.
*   **Multilingual Interface:**
    *   Defaults to German (`de`).
    *   Provides a simple switcher in the header to toggle between German (`DE`) and English (`EN`).
    *   User's language preference is stored in `localStorage`.
    *   Dates and timestamps adapt to the selected language format.
*   **Structured Navigation:** A persistent top navigation bar allows easy access to different views:
    *   Übersicht / Dashboard
    *   Daten / Data (Full Table)
    *   Diagramme / Charts
    *   Analytik / Analytics
    *   Punktesystem / Score System
*   **Dashboard View (`Übersicht`):**
    *   **Aggregated Statistics:** Displays cards showing total players analyzed, total overall score, total chests collected, average score per player, and average chests per player from the loaded data.
    *   **Overall Player Ranking:** A primary table showing all players ranked by Total Score (default). Supports sorting by Rank, Player Name, Total Score, and Chest Count. Includes visual highlighting for the top 3 ranks. Provides text-based filtering by Player Name.
    *   **Visualizations:**
        *   *Top Sources by Score:* Donut chart showing the top 7 chest sources contributing most to the total score across all players (plus an 'Others' category).
        *   *Score Distribution:* Histogram (bar chart) showing the number of players within dynamically calculated score brackets.
        *   *Score vs. Chests:* Scatter plot visualizing the relationship between total chests collected and total score for each player.
        *   *Most Frequent Sources:* Horizontal bar chart showing the top 10 chest sources opened by the highest number of unique players.
    *   **Top 5 by Chest Count:** A small summary table listing the players with the highest `CHEST_COUNT`. Rows are clickable to navigate to the player's detail view.
    *   **Chart Modal:** An "expand" icon on each dashboard chart card allows viewing a larger version of the chart in a modal window.
*   **Full Data Table View (`Daten`):**
    *   Displays a comprehensive table containing *all* columns (core stats + all chest sources) from the loaded data for *all* players.
    *   Supports sorting by clicking any column header (ascending/descending toggle).
    *   Horizontally scrollable to accommodate numerous columns.
*   **Charts View (`Diagramme`):**
    *   Displays larger versions of the main dashboard charts (Top Sources, Score Distribution, Score vs Chests, Frequent Sources).
*   **Analytics View (`Analytik`):**
    *   **Clan Analysis:** Shows aggregated clan-level metrics and visualizations.
    *   **Category Analysis:** Allows selecting a specific chest source category from a dropdown. Displays a table ranking players by score within that category and a bar chart visualizing the score distribution for that category.
*   **Score System View (`Punktesystem`):**
    *   Fetches data from `data/rules.csv`.
    *   Displays a sortable table showing the scoring rules (Typ/Type, Level, Punkte/Points). Supports sorting by each column.
*   **Player Detail View:**
    *   Accessed by clicking a player row in the main ranking or top chests tables.
    *   Displays the player's name, rank, total score, and total chests.
    *   Shows a detailed list of all chest sources where the player has a score greater than zero, sorted descending by score.
    *   Presents a Radar chart visualizing the player's top 8 scoring categories.
    *   Provides a button to download the specific player's data (all their columns/scores) as a formatted JSON file.
*   **Data Downloads:**
    *   **Processed CSV:** A button in the header allows downloading the entire processed player dataset (`allPlayersData`) as a CSV file.
    *   **Player JSON:** Download individual player data from the detail view.
    *   **Charts:** Download charts as PNG/SVG via the ApexCharts toolbar menu on each chart.
*   **Theming:** Uses a dark fantasy theme inspired by "Total Battle", implemented with Tailwind CSS utility classes and CSS variables.

## 3. Technology Stack

*   **HTML5:** Provides the structure and semantic markup for the single-page application.
*   **CSS3 / Tailwind CSS (v3 via CDN):** Used for all styling and layout. A utility-first approach allows for rapid development and customization. Base styles and theme colors are defined using CSS variables within a `<style>` block.
*   **JavaScript (Vanilla ES6+):** Handles all client-side logic, including:
    *   Fetching static CSV files (`fetch` API).
    *   Parsing CSV data (using PapaParse library).
    *   Data cleaning and transformation.
    *   State management (tracking current view, language, loaded data, sort states).
    *   DOM manipulation (updating text, showing/hiding sections, building tables).
    *   Event handling (clicks, input changes).
    *   Calculations for aggregate statistics.
    *   Chart rendering (using ApexCharts library).
    *   Internationalization (i18n).
    *   Generating downloads.
*   **PapaParse:** A robust client-side JavaScript CSV parsing library used to convert the fetched CSV text into usable JavaScript objects.
*   **ApexCharts:** A modern JavaScript charting library used to generate interactive and customizable SVG charts (Donut, Bar, Scatter, Radar).
*   **Flatpickr:** A lightweight, powerful date picker library used for week selection.

## 4. Architecture and Module Structure

This application follows a modular architecture with the following components:

```
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
```

## 5. Key Features in Detail

### Internationalization System

The application implements a robust internationalization system supporting German and English:

1. **Translation Management:**
   - All text is stored in translation dictionaries in `i18n.js`
   - Support for parameterized text using `{0}`, `{1}` placeholders
   - Dynamic UI updates when language is changed without page reload

2. **Date and Number Formatting:**
   - Language-specific date formats:
     - German: DD.MM-DD.MM.YYYY (e.g., '31.03-06.04.2025')
     - English: MM/DD-MM/DD/YYYY (e.g., '03/31-04/06/2025')
   - Number formatting adapts to locale conventions
   - Timestamps are preserved during language switches

### Week Selection

The application supports viewing data from different weeks:

1. **Calendar Interface:**
   - Uses Flatpickr library for date/week selection
   - Shows date range and week number
   - Highlights only weeks with available data
   - Calendar is styled to match the application theme

2. **Data Loading:**
   - Loads data from specific `week_X.csv` files
   - Updates all visualizations and tables with the new data
   - Maintains the current view when switching weeks

### Chart System

The application features a comprehensive chart system:

1. **Chart Types:**
   - Donut charts for proportional data
   - Bar charts for rankings and distributions
   - Scatter plots for correlation analysis
   - Radar charts for multi-dimensional player data

2. **Modal Expansion:**
   - Charts can be expanded to full-screen modal view
   - Robust data access mechanisms ensure charts always have data
   - Fallback systems prevent "no data available" errors

3. **ApexCharts Integration:**
   - Consistent theme across all chart types
   - Interactive tooltips with custom formatting
   - Download options for charts (PNG/SVG)

## 6. Recent Improvements

1. **Internationalization Enhancements:**
   - Fixed date format translation issues for week date ranges
   - Improved handling of timestamps during language switches
   - Enhanced storage and retrieval of timestamp data

2. **Chart Rendering Stability:**
   - Implemented robust fallback logic for modal chart data access
   - Added comprehensive logging for debugging chart rendering
   - Exposed critical data references for emergency access
   - Enhanced chart container references for reliability

3. **Week Selection Implementation:**
   - Added support for loading data from different weeks
   - Created calendar interface for week selection
   - Implemented date range formatting for selected weeks

4. **Analytics Page Improvements:**
   - Reordered sections for better information flow
   - Fixed chart tooltip rendering issues
   - Improved data labeling in visualizations

## 7. Project Status

### Current Status:
- ✅ Core application functionality complete and stable
- ✅ Internationalization system fully implemented with robust date handling
- ✅ Week selection feature implemented
- ✅ Chart system enhanced with reliable modal rendering
- ✅ Analytics page reorganized for better user experience
- ✅ Testing infrastructure setup complete
- ⚠️ Some tests are still failing and need fixes
- 🔄 Ongoing work to implement fixes and complete the testing framework

### Next Steps:
- 🔲 Complete test coverage for all modules
- 🔲 Implement advanced analytics features
- 🔲 Enhance mobile responsiveness
- 🔲 Add time-based comparisons between weeks

## 8. Development Infrastructure

The project uses the following development tools:

```
/
├── app/                   # Application source code
├── scripts/               # Utility scripts 
├── tests/                 # Test files
├── memory-bank/           # Project documentation
├── .babelrc               # Babel configuration
├── .eslintrc              # ESLint configuration
└── package.json           # Package dependencies
```

Testing is implemented using Jest with the following setup:
- Unit tests for individual modules
- Integration tests for cross-module functionality
- Mock objects for browser APIs
