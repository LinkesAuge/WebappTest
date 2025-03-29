# System Patterns

## Architecture Overview

The TB Chest Analyzer application is being refactored from a monolithic structure to a modular, maintainable architecture following modern JavaScript practices.

## Current Architecture (Pre-Refactoring)

The current architecture is monolithic:
- All code contained in a single HTML file with inline JavaScript
- Uses global variables for state management
- Relies on direct DOM manipulation
- Has tightly coupled components
- Uses traditional promise chains

## Target Architecture (Post-Refactoring)

### Module Structure
```
/js
  /services         // Data handling, API interaction
  /controllers      // UI state, route handling
  /models           // Data structures
  /utils            // Helper functions
  /charts           // Chart-specific code
  /views            // UI components
  main.js           // Entry point
```

### Key Design Patterns

1. **Module Pattern**
   - ES6 modules for code organization
   - Explicit imports/exports
   - Encapsulated functionality

2. **MVC/MVVM Pattern**
   - Models: Data structures (PlayerData, ScoreRules)
   - Views: UI components (Dashboard, DataTable)
   - Controllers: Coordinate between models and views

3. **Observer Pattern**
   - State changes notify observers
   - Views update in response to state changes
   - Decouples data from presentation

4. **Builder Pattern**
   - Used for complex object construction (chart configurations)
   - Fluent interface for readability
   - Ensures valid configurations

5. **Factory Pattern**
   - ChartFactory for creating chart instances
   - Abstracts chart creation details
   - Allows for future chart type extensions

6. **Service Pattern**
   - DataService for data operations
   - LanguageService for translations
   - ErrorService for centralized error handling

7. **State Management**
   - Centralized state
   - Immutable state updates
   - State subscriptions for reactivity

### Error Handling Strategy

1. **Centralized Error Handler**
   - Consistent error logging
   - User-friendly error messages
   - Recovery mechanisms where possible

2. **Error Classification**
   - Data errors (loading, parsing)
   - UI errors (rendering)
   - Chart errors (visualization)

3. **Graceful Degradation**
   - Fallback content when components fail
   - Default values when data is missing
   - Informative user feedback

### Event Handling

1. **Event Delegation**
   - Reduced event listeners
   - Centralized event handling
   - Improved performance

2. **Declarative Event Binding**
   - Clear relationship between elements and handlers
   - Consistent event registration
   - Easy to maintain

### Async Operations

1. **Async/Await Pattern**
   - Replaces promise chains
   - Cleaner error handling
   - More readable asynchronous code

2. **Loading States**
   - Explicit loading indicators
   - Consistent user feedback
   - Prevent interaction during operations

## Transition Strategy

The refactoring will follow an incremental approach:
1. Set up the module structure
2. Extract core services (data, language)
3. Implement state management
4. Migrate UI components one by one
5. Replace direct DOM manipulation with component-based approach
6. Add comprehensive error handling
7. Optimize performance

## Core Technical Decisions
1. **Pure Client-Side Processing**: The application operates entirely in the client browser, with no server-side dependencies.
2. **Vanilla JavaScript**: No frameworks are used, keeping the codebase simple and lightweight.
3. **Static CSV Data Sources**: Data is loaded from pre-defined static CSV files hosted alongside the application.
4. **Local Storage for Preferences**: User preferences (like language selection) are stored in the browser's localStorage.
5. **Modular JavaScript Structure**: Code is organized into logical functions with clear responsibilities.

## Design Patterns

### State Management
- **Global State Objects**: Main state is managed through global variables (`allPlayersData`, `displayData`, `currentView`, etc.)
- **Event-Driven Updates**: UI updates in response to user actions (clicks, filtering, sorting)
- **View Switching**: Different views (dashboard, detailed table, etc.) are shown/hidden based on the current state

### Data Processing
- **Data Transformation**: CSV data is parsed and transformed into structured JavaScript objects
- **Sorting and Filtering**: Data can be sorted by different columns and filtered by player name
- **Derived Data**: Aggregate statistics and visualizations are calculated from the base data

### UI Components
- **Section-Based Layout**: The application is divided into distinct sections that are shown/hidden based on navigation
- **Reusable Rendering Functions**: Functions like `renderTable` are used across different views
- **Modal Pattern**: Used for expanded chart views
- **Component Initialization**: Elements are initialized once and then updated as needed

### Internationalization (i18n)
- **Text Content Dictionary**: All text is stored in language-specific dictionaries
- **Language Switching**: UI can switch between languages (German/English) dynamically
- **Persistent Language Preference**: Selected language is stored in localStorage

## Component Relationships

### Data Flow
1. **CSV Loading** → **Data Parsing** → **Data Processing** → **UI Rendering**
2. **User Interaction** → **State Update** → **UI Re-rendering**

### Core Functions and Their Responsibilities
- **Data Loading**:
  - `loadStaticCsvData()`: Fetches and parses the main data CSV
  - `loadScoreRulesData()`: Fetches and parses the scoring rules CSV
  
- **Data Processing**:
  - `calculateAggregateStats()`: Computes overall statistics from player data
  - `calculateCategoryAverages()`: Computes average scores for each category
  - `sortData()`: Sorts data arrays based on specified columns

- **View Management**:
  - `switchView()`: Controls which view is displayed
  - `renderDashboard()`: Renders the main dashboard view
  - `renderDetailedTable()`: Renders the full data table
  - `renderChartsView()`: Renders the charts view
  - `renderPlayerDetail()`: Renders a specific player's detail view

- **Charts**:
  - Various rendering functions for different chart types using ApexCharts
  
- **Internationalization**:
  - `setLanguage()`: Changes the application language
  - `getText()`: Retrieves text in the current language
  - `updateUIText()`: Updates all UI elements with text in the current language

## Error Handling Strategy
- **Error Detection**: Try/catch blocks for critical operations
- **User Feedback**: Status messages display operation progress and errors
- **Graceful Degradation**: If data loading fails, the application shows an empty state

## Optimization Techniques
- **Selective Rendering**: Only render components that need updates
- **Cached Data**: Process data once and reuse for multiple views
- **Chart Creation Controls**: Create charts on demand rather than all at once
- **Lazy Loading**: Some complex elements are only initialized when their view is activated

## Technical Constraints
- **Browser Compatibility**: Relies on modern JavaScript features
- **Local Processing Limits**: Performance depends on client device capabilities
- **Static Data Updates**: CSV files must be manually updated by the site owner 