# Technical Context

## Technologies Used

### Core Technologies
- **JavaScript (ES6+)**: Primary programming language for client-side logic
- **HTML5**: Document structure and semantic elements
- **CSS3 / Tailwind CSS**: Styling via Tailwind CSS utility classes with custom variables
- **ApexCharts**: Data visualization library for interactive charts
- **PapaParse**: CSV parsing library

### Development Environment
- **VS Code**: Primary IDE
- **Chrome DevTools**: Debugging and performance analysis
- **Git**: Version control
- **GitHub**: Code repository hosting

### Key Dependencies
- **ApexCharts**: 
  - Used for all data visualizations (donut, bar, scatter, radar charts)
  - Provides consistent styling and interaction options
  - Supports responsive sizing and theming
- **PapaParse**: 
  - Handles CSV parsing with header support
  - Enables dynamic typing and error handling

## Development Setup

### Required Tools
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Code editor (VS Code recommended)
- Git for version control

### Local Development
1. Clone the repository
2. No build process required - open index.html directly in a browser
3. For local server (optional), use any simple HTTP server

### Project Structure
```
/
├── index.html         # Main application HTML
├── script.js          # Application JavaScript (all client-side logic)
├── icon.png           # Application icon
├── icon_xl.png        # Larger application icon
├── data/
│   ├── data.csv       # Player chest data
│   └── rules.csv      # Scoring rules
└── Readme.md          # Project documentation
```

## Technical Constraints

### Browser Support
- Modern browsers (Chrome, Firefox, Edge, Safari)
- Mobile browser support required

### Performance Requirements
- Handle the clan's player dataset efficiently
- Initial load under 3 seconds
- Chart rendering and interactions must be smooth
- Responsive on various device sizes

### Security Considerations
- Client-side application with no server components
- No authentication required
- Data handled entirely in the browser
- No sensitive data processing

### Hosting Requirements
- Static file hosting only
- No backend/server requirements
- All processing happens client-side

## Development Guidelines

### Code Style
- ES6+ JavaScript features
- Functional programming approach
- Clear variable and function names
- Comments for complex logic

### JavaScript Standards
- Prefer const and let over var
- Use arrow functions where appropriate 
- Leverage modern array methods (map, filter, reduce)
- Handle errors with try/catch blocks

### DOM Manipulation
- Direct DOM manipulation (no frameworks)
- DOM element references stored in variables
- Event delegation for dynamically created elements
- Status indicators for loading and operations

### Data Processing
- Load CSV data with PapaParse
- Clean and transform data for visualization
- Sort and filter based on user selections
- Calculate aggregate statistics from raw data

### Charts and Visualizations
- Consistent color scheme using CSS variables
- Clear labels and tooltips
- Interactive features (expandable charts, tooltips)
- Responsive sizing for all device types

## Integration Points

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