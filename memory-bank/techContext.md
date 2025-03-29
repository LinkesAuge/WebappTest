# Technical Context

## Technologies Used

### Core Technologies
- **HTML5**: Provides the structure and semantic markup for the single-page application
- **CSS3 / Tailwind CSS**: Used for styling and layout with utility-first approach
- **JavaScript (Vanilla ES6+)**: Handles all client-side logic
- **PapaParse**: JavaScript CSV parsing library
- **ApexCharts**: JavaScript charting library for interactive visualizations

### Frontend Components
- **Tailwind CSS (v3 via CDN)**: Utility-first CSS framework that allows for rapid styling
- **Font Awesome (v6.2.0)**: Icon library for UI elements
- **Google Fonts**: Custom typography (Cinzel Decorative, Inter, Merriweather)

### Data Handling
- **Fetch API**: Used to request CSV files
- **PapaParse**: Parses CSV text into JavaScript objects
- **LocalStorage API**: Stores user preferences (language selection)

## Development Setup
The application is entirely frontend-based with no build process required. It can be developed and tested using any standard web server.

### Required Files
- **index.html**: The main HTML document
- **data.csv**: Contains player chest data
- **rules.csv**: Contains scoring rules
- **icon.png**: Favicon
- **icon_xl.png**: Larger version of the clan logo

### Development Tools
- Any code editor (VS Code, Sublime Text, etc.)
- Web browser with developer tools
- Local web server for testing

## Technical Constraints

### Browser Support
- Requires modern browsers with support for:
  - ES6+ JavaScript features
  - CSS Grid and Flexbox
  - Fetch API
  - LocalStorage API
  - SVG rendering (for charts)

### Performance Considerations
- All data processing happens client-side
- Large datasets may impact performance on less powerful devices
- Chart rendering requires adequate system resources

### Data Constraints
- CSV files must follow expected structure:
  - `data.csv` must include the columns "PLAYER", "TOTAL_SCORE", and "CHEST_COUNT"
  - Additional columns represent different chest sources
  - `rules.csv` must include the columns "Typ", "Level", and "Punkte"

## Dependencies

### External CDN Dependencies
```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Inter:wght@400;600&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">

<!-- PapaParse CSV Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>

<!-- ApexCharts Library -->
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
```

### Version Information
- Tailwind CSS: v3.x (via CDN)
- Font Awesome: v6.2.0
- PapaParse: v5.3.2
- ApexCharts: Latest version from CDN

## Code Organization

### State Management
The application uses global variables to maintain state:
- `allPlayersData`: Complete dataset of all players
- `displayData`: Filtered/sorted data for current view
- `allColumnHeaders`: Column headers from the CSV
- `scoreRulesData`: Scoring system rules
- `currentLanguage`: Current UI language
- `currentView`: Active view being displayed
- `sortState`: Current sorting configuration
- `aggregateStats`: Calculated statistics
- `chartInstances`: References to active chart objects

### Main JavaScript Modules/Functions
1. **Initialization**:
   - `initializeApp()`: Main entry point
   - `assignElementReferences()`: Gets DOM references
   - `setupEventListeners()`: Sets up UI interactions
   
2. **Data Processing**:
   - `loadStaticCsvData()`: Fetches and processes the main CSV
   - `loadScoreRulesData()`: Fetches and processes rules CSV
   - `calculateAggregateStats()`: Computes statistics
   - `calculateCategoryAverages()`: Computes category averages
   
3. **UI Management**:
   - `switchView()`: Changes the active view
   - `updateUIText()`: Updates text based on language
   - `setStatus()`: Shows status messages to the user
   
4. **Rendering**:
   - `renderDashboard()`: Main dashboard view
   - `renderDetailedTable()`: Data table view
   - `renderChartsView()`: Charts view
   - `renderPlayerDetail()`: Player details view
   - Various chart rendering functions
   
5. **User Interactions**:
   - `handleTableRowClick()`: Handles table row clicks
   - `handleSortClick()`: Handles sort header clicks
   - `handleFilter()`: Handles search filtering
   - `handleCategorySelect()`: Handles category selection
   - `handlePlayerComparison()`: Handles player comparison

## File Structure
```
.
├── index.html             # Main application HTML
├── data.csv               # Player chest data
├── rules.csv              # Scoring system rules
├── icon.png               # Favicon
└── icon_xl.png            # Larger clan logo
```

## Deployment Requirements
- A static web server or hosting service
- Proper MIME types for .csv files
- CORS configuration if files are hosted across different domains 