# TB Chest Analyzer - Documentation (Client-Side Static Data Version)

## 1. Overview

**Purpose:**

The TB Chest Analyzer is a single-page web application designed for players and members of the "The Chiller" clan in the game "Total Battle". Its primary goal is to load, process, analyze, and visualize player chest data exported from the game in CSV format. This tool allows users to gain insights into individual and comparative performance based on chest collection metrics.

**Version Type:**

This specific version operates **entirely client-side**. It fetches its primary dataset (`data.csv`) and scoring rules (`rules.csv`) from static files hosted alongside the main `index.html` file. It uses the user's web browser to perform all calculations and rendering. Data persistence across browser sessions relies on the static nature of the hosted CSV files (updated by the website owner) and `localStorage` for user preferences like language selection.

**Target Audience:**

*   Players of "Total Battle", particularly members of "The Chiller" clan.
*   Clan leadership or analysts looking to track member activity and scoring.

## 2. Core Features

*   **Static Data Loading:** Automatically fetches and parses predefined `data.csv` and `rules.csv` files on page load.
*   **Multilingual Interface:**
    *   Defaults to German (`de`).
    *   Provides a simple switcher in the header to toggle between German (`DE`) and English (`EN`).
    *   User's language preference is stored in `localStorage`.
*   **Structured Navigation:** A persistent top navigation bar allows easy access to different views:
    *   Übersicht / Dashboard
    *   Daten / Data (Full Table)
    *   Diagramme / Charts
    *   Analytik / Analytics
    *   Punktesystem / Score System
*   **Dashboard View (`Übersicht`):**
    *   **Aggregated Statistics:** Displays cards showing total players analyzed, total overall score, total chests collected, average score per player, and average chests per player from the loaded `data.csv`.
    *   **Overall Player Ranking:** A primary table showing all players ranked by Total Score (default). Supports sorting by Rank, Player Name, Total Score, and Chest Count. Includes visual highlighting for the top 3 ranks. Provides text-based filtering by Player Name.
    *   **Visualizations:**
        *   *Top Sources by Score:* Donut chart showing the top 7 chest sources contributing most to the total score across all players (plus an 'Others' category).
        *   *Score Distribution:* Histogram (bar chart) showing the number of players within dynamically calculated score brackets.
        *   *Score vs. Chests:* Scatter plot visualizing the relationship between total chests collected and total score for each player.
        *   *Most Frequent Sources:* Horizontal bar chart showing the top 10 chest sources opened by the highest number of unique players.
    *   **Top 5 by Chest Count:** A small summary table listing the players with the highest `CHEST_COUNT`. Rows are clickable to navigate to the player's detail view.
    *   **Chart Modal:** An "expand" icon on each dashboard chart card allows viewing a larger version of the chart in a modal window.
*   **Full Data Table View (`Daten`):**
    *   Displays a comprehensive table containing *all* columns (core stats + all chest sources) from `data.csv` for *all* players.
    *   Supports sorting by clicking any column header (ascending/descending toggle).
    *   Horizontally scrollable to accommodate numerous columns.
*   **Charts View (`Diagramme`):**
    *   Displays larger versions of the main dashboard charts (Top Sources, Score Distribution, Score vs Chests, Frequent Sources).
    *   (Future Enhancement Placeholder: Could include options for "Clan Aggregate" data views or user-defined charts).
*   **Analytics View (`Analytik`):**
    *   **Category Analysis:** Allows selecting a specific chest source category from a dropdown. Displays a table ranking players by score within that category and a bar chart visualizing the score distribution for that category.
    *   **Placeholders:** Includes designated areas for future "Player Analysis" (e.g., comparisons) and "Clan Analysis" (e.g., aggregate trends) features.
*   **Score System View (`Punktesystem`):**
    *   Fetches data from `rules.csv`.
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

## 4. File Structure (Hosted)

This version requires only two or three files to be hosted together:

# ChefScore Analytics Dashboard

A web application for analyzing chef performance data, scores, and trends.

## Project Status

The ChefScore Analytics Dashboard is currently in development. We've set up the testing infrastructure and are working on implementing the core features.

### Current Status:
- ✅ Testing infrastructure setup complete
- ✅ Test types defined (Unit, Integration, E2E)
- ✅ Basic test structure implemented
- ⚠️ Some tests are still failing and need fixes
- 🔄 Ongoing work to implement fixes and complete the testing framework

## Project Structure

```
/
├── app/                   # Application source code
├── scripts/               # Utility scripts 
├── tests/                 # Test files
│   ├── e2e/               # End-to-end tests
│   ├── fixtures/          # Test data and fixtures
│   ├── helpers/           # Test utilities and mocks
│   ├── integration/       # Integration tests
│   └── unit/              # Unit tests
├── memory-bank/           # Project documentation
├── .babelrc               # Babel configuration
├── .eslintrc              # ESLint configuration
├── jest.config.js         # Jest configuration
└── package.json           # Package dependencies
```

## Available Scripts

In the project directory, you can run:

### `npm test`

Runs all the tests. The test types include:

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test the full application flow

### `npm run test:unit`

Runs only the unit tests.

### `npm run test:integration`

Runs only the integration tests.

### `npm run test:e2e`

Runs only the end-to-end tests.

### `npm run test:coverage`

Runs all tests and generates a coverage report.

## Testing Status

The testing infrastructure is set up, but several tests are still failing. The main issues are:

1. **Chart Rendering Tests**: Need to properly mock the Chart.js library
2. **Data Processing Tests**: Some type conversion issues in the test mocks
3. **Mock Functions**: Need to ensure all mock functions are properly implemented

## Testing Architecture

The test architecture follows the approach outlined in `memory-bank/testing.md`. Key features include:

- **Mocking Strategy**: Using Jest mock functions for API calls, localStorage, and external libraries
- **Test Fixtures**: Sample data in JSON/CSV format for consistent test scenarios
- **DOM Testing**: Using JSDOM for simulating browser environment

## Troubleshooting

If you encounter issues with running tests:

1. Check that all dependencies are installed (`npm install`)
2. Ensure your Node.js version is compatible (v14+ recommended)
3. If encountering path issues on Windows, try using the `--no-cache` flag

## Next Steps

1. Fix failing tests
2. Implement missing mock functions
3. Increase test coverage to reach 95%+
4. Integrate tests with CI/CD pipeline