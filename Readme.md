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

A web-based analytics dashboard for tracking and visualizing player performance data.

## Features

- 📊 **Real-time Data Visualization:** Interactive charts and graphs for player performance metrics.
- 📱 **Responsive Design:** Optimized for both desktop and mobile devices.
- 🔍 **Advanced Filtering:** Customize views based on various criteria.
- 📅 **Multi-Week Support:** Track and analyze data across multiple weeks.
- 📈 **Historical Analysis:** View trends and performance changes over time.
- 🔄 **Auto-Update Tools:** Easily manage weekly data files.

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Local development server (optional for testing)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/chefscore-analytics.git
   ```

2. Open `index.html` in your browser or serve with a local server.

## Usage

### Basic Navigation

- **Dashboard:** Overview of key performance metrics
- **Detailed Tables:** In-depth analysis with sorting and filtering
- **History:** Track performance trends across multiple weeks

### Weekly Data Selection

Use the week selector dropdown to switch between different weeks of data. The most recent week is selected by default.

### History View

Access the History view to see:
- Weekly performance trends
- Player tracking across multiple weeks
- Comparative analysis of key metrics

## Managing Weekly Data

### Data Files

Weekly data files should follow the naming convention:
```
data_week_XX.csv
```

Where XX is the week number (e.g., `data_week_13.csv`).

### Auto-Updating weeks.json

When adding new weekly data files:

1. Add your new CSV file to the `data` directory following the naming convention
2. Run the update script:
   - Windows: Double-click on `scripts/update_weeks.bat`
   - Command line: Run `node scripts/update_weeks_json.js`

The script will automatically:
- Detect all weekly data files
- Update the `weeks.json` index file
- Mark the most recent file as current

## Development

### Project Structure

```
chefscore-analytics/
├── css/                 # Stylesheets
├── data/                # Data files and index
│   ├── data.csv         # Main data file
│   ├── data_week_13.csv # Weekly data files
│   ├── data_week_14.csv
│   ├── data_week_15.csv
│   └── weeks.json       # Weekly data index
├── js/                  # JavaScript files
├── scripts/             # Utility scripts
│   ├── update_weeks_json.js  # Auto-update script
│   └── update_weeks.bat      # Windows batch file
├── tests/               # Test files
├── index.html           # Main application
└── README.md            # This file
```

### Adding New Features

Refer to our development guidelines in the `docs` folder for information on adding new features and maintaining code quality.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# ChefScore Dashboard

A web-based dashboard for visualizing chef performance data across multiple weeks, with trend analysis and historical comparisons.

## Overview

ChefScore Dashboard provides comprehensive analysis of chef performance data, including:
- Overall statistics and rankings
- Detailed performance breakdowns
- Interactive charts and visualizations
- Multi-week historical data tracking
- Trend analysis across time periods

## Data Structure

### Weekly Data Files

The application uses CSV files for weekly data with the following naming convention:
```
data/data_week_{XX}.csv
```

Where `{XX}` is the week number (e.g., `data_week_12.csv`).

Each CSV file should contain player performance data with columns like:
- PLAYER: The player's name
- TOTAL_SCORE: The player's total score
- CHEST_COUNT: Number of chests collected
- Additional performance metrics

### Week Configuration

Available weeks are configured in `data/weeks.json` with this structure:
```json
[
  {
    "week": "12",
    "file": "data_week_12.csv"
  },
  {
    "week": "13",
    "file": "data_week_13.csv"
  }
]
```

Each entry requires:
- `week`: The week number (string)
- `file`: The CSV filename for this week

Date ranges are calculated automatically based on the week number.

### Fallback Mechanisms

The application includes robust fallback mechanisms:
1. If `weeks.json` cannot be loaded, hardcoded fallback data is used
2. If individual week data files are missing, appropriate error messages are shown
3. Multiple checks ensure proper initialization of data structures

## Week Selection System

The week selection system follows this workflow:
1. `loadAvailableWeeks()` loads the week configuration from `weeks.json`
2. `initializeWeeklyData()` determines the latest week and sets it as default
3. `populateWeekSelector()` builds the week selector dropdown
4. `switchWeek()` handles changing the active week
5. Week data is loaded from the corresponding CSV file
6. The UI is updated to reflect the selected week's data

## Adding New Weeks

To add a new week:
1. Create a CSV file named `data_week_{XX}.csv` where `{XX}` is the week number
2. Place it in the `data/` directory
3. Add a new entry to `data/weeks.json` with the week number and filename
4. The application will automatically detect and include the new week

## Troubleshooting

If week data isn't loading properly:
1. Verify `data/weeks.json` has the correct format
2. Ensure CSV files exist in the specified locations
3. Check CSV files have the expected column headers
4. Review browser console for specific error messages

## Technical Implementation

The week system is implemented across several modules:
- `dataLoading.js`: Handles loading week data from files
- `history.js`: Manages historical data and week switching
- `utils.js`: Provides date calculation utilities
- `main.js`: Orchestrates the initialization process

Date ranges for weeks are calculated automatically using the ISO week standard.