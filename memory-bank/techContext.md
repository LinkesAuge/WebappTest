# Technical Context

## Technology Stack

- **Frontend Framework**: Vanilla JavaScript with ES6 modules
- **UI Framework**: Custom with Tailwind CSS for styling
- **Visualization**: Chart.js for interactive charts
- **Data Format**: CSV for weekly data, JSON for configuration
- **Testing**: Jest for unit and integration tests
- **Build Tools**: None (direct browser loading)
- **Deployment**: Simple static file serving

## Data Management

The application uses a structured approach to data management with several key components:

### Data Files

1. **Weekly Player Data**:
   - Format: CSV files in `data/` directory
   - Naming pattern: `data_week_{XX}.csv` (e.g., `data_week_12.csv`)
   - Contains player performance metrics for each week
   - Columns typically include: PLAYER, TOTAL_SCORE, CHEST_COUNT, etc.

2. **Week Configuration**:
   - File: `data/weeks.json`
   - Format: JSON array of week objects
   - Each object contains:
     - `week`: The week number (string)
     - `file`: The associated CSV filename
   - Example:
     ```json
     [
       {"week": "12", "file": "data_week_12.csv"},
       {"week": "13", "file": "data_week_13.csv"}
     ]
     ```

3. **Score Rules**:
   - File: `data/rules.csv`
   - Defines the scoring system for chest types and levels

### Data Flow

1. **Initialization**:
   - Application starts by loading `weeks.json`
   - Determines available weeks and latest week
   - Loads current week's data from associated CSV file
   - Populates UI with loaded data

2. **Week Selection**:
   - User selects a week from dropdown
   - Application loads selected week's data
   - UI is updated with new data
   - Charts and tables are refreshed

3. **Historical Data**:
   - All available weeks' data is loaded asynchronously
   - Data is processed for trend analysis
   - Results are displayed in History view

### Fallback Mechanisms

The application includes robust error handling for data loading:

1. **weeks.json Fallbacks**:
   - Hardcoded week data in `main.js` and `history.js`
   - Automatic array initialization for `availableWeeks`
   - Safe access patterns with null checks

2. **CSV Loading Fallbacks**:
   - Empty arrays returned for missing files
   - Warning messages logged to console
   - User-friendly UI messages

3. **Date Calculation**:
   - Dynamic date range calculation based on week numbers
   - Uses ISO week standard for consistency
   - Graceful error handling for invalid week numbers

## Code Organization

The application follows a modular architecture with clear separation of concerns:

### Core Modules

1. **main.js**:
   - Application entry point
   - Orchestrates initialization
   - Manages global application flow

2. **config.js**:
   - Application constants
   - File paths
   - Default settings

3. **state.js**:
   - Global state variables
   - State management functions
   - Data persistence logic

### Data Handling

1. **dataLoading.js**:
   - Functions for loading CSV and JSON files
   - Parsing CSV to JavaScript objects
   - Loading weekly data from files

2. **dataProcessing.js**:
   - Data transformation
   - Aggregation functions
   - Statistical calculations

### UI Management

1. **dom.js**:
   - DOM manipulation utilities
   - View switching logic
   - Loading states and indicators

2. **listeners.js**:
   - Event handler setup
   - User interaction handling
   - UI element event binding

3. **uiUpdates.js**:
   - Functions to update UI with data
   - Table population
   - Statistics display

### Visualization

1. **charts.js**:
   - Chart creation and configuration
   - Data visualization
   - Chart instance management

2. **history.js**:
   - Historical data loading
   - Trend analysis
   - History view management
   - Week selection and navigation

### Internationalization

1. **i18n.js**:
   - Translation management
   - Language switching
   - Text content for all UI elements

## Development Environment

- **Local Development**: Simple HTTP server (Live Server)
- **Testing**: Jest for unit and integration tests
- **Version Control**: Git with GitHub
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Dependencies**: No external JavaScript dependencies except Chart.js

## Implementation Patterns

1. **Asynchronous Loading**:
   - Promises for all data loading operations
   - Async/await for cleaner asynchronous code
   - Loading indicators during async operations

2. **Error Handling**:
   - Try/catch blocks around async operations
   - Fallback values for missing data
   - Detailed error logging for debugging

3. **State Management**:
   - Centralized state in state.js
   - Direct mutation of state objects
   - Event-driven UI updates based on state changes

4. **DOM Manipulation**:
   - Factory functions for creating UI elements
   - Clear separation between data and presentation
   - Utility functions for common DOM operations

## Data Structure Considerations

### Weekly Data CSV Format

The CSV files for weekly data should include at minimum:
- PLAYER: The player's name
- TOTAL_SCORE: The player's score for the week
- CHEST_COUNT: Number of chests collected

Additional columns may include specific score breakdowns by category.

### weeks.json Structure

The `weeks.json` file follows a simple array structure where each object requires:
- `week`: Week number as a string
- `file`: CSV filename for the week's data

Date ranges are calculated dynamically based on the week number, so no need to specify them in the JSON file.

### rules.csv Format

The `rules.csv` file defines the scoring system with columns:
- Typ: The type of chest
- Stufe: The level/tier of the chest
- Punkte: The points awarded for this chest type and level 