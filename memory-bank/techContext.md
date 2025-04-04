# Technology Context

## Core Technologies

The Chest Analyzer is built using the following technologies:

### Frontend

- **HTML5**: Provides the structure and content of the application.
- **CSS3 / Tailwind CSS**: For styling and responsive design. Tailwind provides utility classes that are used extensively throughout the application.
- **JavaScript (ES6+)**: Powers all client-side logic, DOM manipulation, and dynamic features.
- **Modules**: Uses ES6 modules for code organization and separation of concerns.

### Data Handling

- **PapaParse**: For CSV parsing and data transformation.
- **Fetch API**: For loading data files.
- **localStorage**: For storing user preferences and session data.

### Visualization

- **ApexCharts**: For creating interactive charts (bar, donut, scatter, radar).

### UI Components

- **Flatpickr**: Lightweight date picker used for week selection.

### Development & Testing

- **Jest**: JavaScript testing framework.
- **Babel**: JavaScript compiler for using next-gen JavaScript.
- **ESLint**: For code quality and consistency.
- **http-server**: Simple development server for local testing.

## Technical Constraints

1. **Browser Compatibility**: The application targets modern browsers and uses features like ES6 modules, which require relatively recent browser versions.
2. **Client-side Only**: All processing happens in the browser without server-side components.
3. **Static Data Source**: Primary data comes from CSV files that must be pre-generated.
4. **No Build Process**: The application is designed to run directly in the browser without compilation.

## Application State Management

### Global State

The application manages state through several key objects:

1. **Data State**:
   - `allPlayersData`: Array containing all player data objects.
   - `displayData`: Filtered/sorted version of player data for display.
   - `allColumnHeaders`: Column headers from the CSV.
   - `scoreRulesData`: Scoring rules data.
   - `currentWeek`: Currently selected week number.
   - `availableWeeks`: Array of available week numbers.

2. **UI State**:
   - `dashboardSortState`: Tracks sort column and direction for dashboard tables.
   - `detailedTableSortState`: Tracks sort column and direction for detailed data table.
   - `scoreRulesSortState`: Tracks sort column and direction for score rules table.

3. **Emergent State Access Patterns**:
   - Core data is exposed to window object for emergency access.
   - Provides fallback mechanisms for components that might lose reference to data.

### LocalStorage Usage

The application uses localStorage for several purposes:

1. **Language Preference**: Stored under a language-specific key.
2. **Last Viewed Data**: Cached for faster reloads.
3. **Last Modified Timestamp**: Cached to display "Last Updated" status.

### State Persistence During Language Switches

The application includes mechanisms to preserve timestamps and UI state when switching languages:

1. **Timestamp Storage**: "Last updated" timestamps are stored in localStorage.
2. **Reformatting Mechanism**: During language switches, timestamps are preserved and reformatted.
3. **View State Preservation**: Active view and selected data remain consistent across language changes.

## Data Flow

1. **Data Loading**: CSV files are fetched and parsed into JavaScript objects.
2. **Data Processing**: Raw data is cleaned, transformed, and prepared for display.
3. **View Rendering**: Processed data is used to render tables and charts.
4. **User Interaction**: User actions trigger state changes and UI updates.
5. **View Switching**: Different views display different aspects of the data.

## Internationalization

The application supports German and English through a comprehensive internationalization system:

1. **Translation Dictionary**: All text content is stored in language-specific objects in `i18n.js`.
2. **Dynamic Text Substitution**: UI elements are updated when language changes.
3. **Language-Specific Formatting**:
   - Dates follow locale-specific formats:
     - German: DD.MM-DD.MM.YYYY (e.g., '31.03-06.04.2025')
     - English: MM/DD-MM/DD/YYYY (e.g., '03/31-04/06/2025')
   - Numbers are formatted according to locale conventions.
4. **Language Preference Persistence**: User's language choice is stored in localStorage.
5. **Dynamic Content Updates**: All UI elements update without page reload when language changes.

## Performance Considerations

1. **DOM Caching**: Element references are cached to reduce DOM queries.
2. **Single-pass Data Processing**: Data is processed once after loading.
3. **Lazy Rendering**: Components are rendered only when needed.
4. **Chart Cleanup**: Charts are properly destroyed when not in use to prevent memory leaks.
5. **Efficient State Updates**: Changes only affect necessary parts of the UI.

## Modal Chart Rendering

The application uses a robust approach to ensure chart data is available in modal views:

1. **Primary Data Path**: Charts access player data via `domManager.playerDataRef`.
2. **Fallback Mechanism**: If the primary reference is unavailable, charts can access `window.allPlayersData`.
3. **Error Handling**: Comprehensive checks prevent "no data available" errors.
4. **Debugging Support**: Detailed logging helps identify data access issues.

## Week Selection Implementation

The week selection feature uses several technologies and patterns:

1. **Flatpickr Integration**: Calendar widget for date selection.
2. **Week Detection**: Automatically identifies available data files.
3. **Dynamic Data Loading**: Loads specific week data files on demand.
4. **Date Range Formatting**: Converts week numbers to human-readable date ranges.
5. **View Persistence**: Maintains current view when switching weeks.

## Error Handling Strategy

1. **Defensive Programming**: Comprehensive null/undefined checks prevent runtime errors.
2. **Fallback Content**: User-friendly messages displayed when expected data is missing.
3. **Console Logging**: Detailed logging for debugging purposes.
4. **Try/Catch Blocks**: Critical operations are wrapped in try/catch for graceful failure.
5. **Multiple Data Access Paths**: Ensures UI components can recover from temporary data loss.

## Testing Approach

1. **Jest Framework**: Used for unit and integration testing.
2. **DOM Mocking**: JSDOM provides a simulated browser environment.
3. **Module Testing**: Individual modules are tested in isolation.
4. **Integration Testing**: Verifies correct behavior between modules.
5. **Mock Objects**: Browser APIs have test equivalents.

## Development Environment

1. **No Build Process**: Application runs directly in browser without compilation.
2. **Local Server**: Simple HTTP server for development testing.
3. **Browser Developer Tools**: Primary debugging interface.
4. **Source Control**: Git for version management.

## Deployment Strategy

1. **Static Hosting**: Application can be deployed on any static web server.
2. **No Backend Requirements**: No server-side components needed.
3. **Data Updates**: New CSV files are added manually or through automated processes.

## Technical Challenges

1. **Chart Data Access**: Ensuring modal charts always have access to player data.
2. **Internationalization Complexity**: Managing date formats and preserving state during language switches.
3. **Module Dependencies**: Handling circular references and initialization order.
4. **Browser Compatibility**: Ensuring consistent behavior across browsers.
5. **Testing DOM Interactions**: Creating proper mocks for DOM elements and browser APIs.

## Development Setup

### Required Tools
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Code editor (VS Code recommended)
- Git for version control
- Node.js and npm/uv for dependency management

### Local Development
1. Clone the repository
2. Install dependencies with `npm install` or `uv install`
3. For development, use a local server like Python's `http.server` or any static file server
4. Test on different device sizes for responsive behavior

### Current Project Structure
```
/
├── app/                        # Application source code
│   ├── index.html              # Main application HTML
│   ├── app.js                  # Core application logic and integration
│   ├── dataLoader.js           # Data loading and processing
│   ├── domManager.js           # DOM management functions
│   ├── eventListeners.js       # Event handling
│   ├── i18n.js                 # Internationalization
│   ├── utils.js                # Utility functions
│   ├── index.js                # Entry point
│   ├── renderer/               # Rendering modules
│   │   ├── analyticsRenderer.js # Analytics visualization
│   │   ├── chartRenderer.js    # Chart creation and management
│   │   ├── dashboardRenderer.js # Dashboard components
│   │   ├── playerDetailRenderer.js # Player details
│   │   └── tableRenderer.js    # Table rendering
│   ├── styles/                 # CSS styles 
│   └── assets/                 # Static assets (icons, etc.)
├── data/                       # Data files
│   ├── data.csv                # Player chest data
│   └── rules.csv               # Scoring rules
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── setup/                  # Test setup
├── memory-bank/                # Project documentation
├── .babelrc                    # Babel configuration
├── .eslintrc                   # ESLint configuration
└── package.json                # Package dependencies
```

## Development Guidelines

### Code Style
- ES6+ JavaScript features
- Modular approach with clear separation of concerns
- Functional programming approach
- Clear variable and function names
- Comments for complex logic
- ESLint rules for consistent style

### JavaScript Standards
- Prefer const and let over var
- Use arrow functions where appropriate 
- Leverage modern array methods (map, filter, reduce)
- Handle errors with try/catch blocks
- Use optional chaining (?.) and nullish coalescing (??) for safer property access
- Follow ESLint configuration

### DOM Manipulation
- DOM management via dedicated module
- DOM element references stored in variables
- Event delegation for dynamically created elements
- Status indicators for loading and operations
- Clear separation between DOM management and business logic

### Data Processing
- Load CSV data with PapaParse
- Clean and transform data for visualization
- Sort and filter based on user selections
- Calculate aggregate statistics from raw data
- Centralized data management

### Charts and Visualizations
- Consistent color scheme using CSS variables
- Clear labels and tooltips with comprehensive safety checks
- Interactive features (expandable charts, tooltips)
- Responsive sizing for all device types
- Error handling to prevent "Cannot read properties of undefined" errors

## Integration Points

### Module Integration
- Clear module APIs with minimal cross-module dependencies
- Explicit function exports and imports
- State management via the app module
- Event-driven communication between modules

### Data Files
- data.csv: Contains player names, scores, chest counts, and chest sources
- rules.csv: Contains scoring rules for different chest types

### Localization
- Translation keys in dedicated JavaScript objects
- UI elements reference i18n keys
- Language preference stored in localStorage
- German (de) and English (en) supported

### Responsiveness
- Tailwind CSS utility classes for responsive layout
- Mobile-first navigation with hamburger menu
- Flexible chart sizing
- Scrollable tables for small screens

### Error Handling
- Comprehensive safety checks in chart tooltips
- Fallback options for missing data
- Defensive programming approach to prevent runtime errors
- Clear error messages in UI and console 