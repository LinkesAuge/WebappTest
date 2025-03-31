# Technical Context

## Technologies Used

### Core Technologies
- **JavaScript (ES6+)**: Primary programming language
- **HTML5**: Document structure and semantic elements
- **CSS3**: Styling with Flexbox and Grid layouts
- **Chart.js**: Data visualization library for interactive charts
- **PapaParse**: CSV parsing library

### Development Environment
- **VS Code**: Primary IDE
- **Chrome DevTools**: Debugging and performance analysis
- **Git**: Version control
- **GitHub**: Code repository hosting

### Key Dependencies
- **Chart.js**: v4.x
  - Used for all data visualizations
  - Extended with custom plugins for additional functionality
- **PapaParse**: v5.x  
  - Handles CSV parsing with support for various formats
  - Streaming capabilities for large files

## Development Setup

### Required Tools
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Code editor (VS Code recommended)
- Git for version control

### Local Development
1. Clone the repository:
   ```
   git clone https://github.com/username/chefscore.git
   ```
2. No build process required - open index.html directly or use a local server
3. For local server (optional):
   ```
   npx serve
   ```

### Project Structure
```
/
├── index.html         # Main application HTML
├── script.js          # Application JavaScript
├── data.csv           # Sample player data
├── rules.csv          # Scoring rules
├── Readme.md          # Project documentation
├── .vscode/           # Editor settings
└── node_modules/      # Dependencies (minimal)
```

## Technical Constraints

### Browser Support
- Modern browsers (last 2 versions)
- No IE11 support required
- Mobile browser support required

### Performance Requirements
- Handle up to 10,000 player records
- Initial load under 3 seconds for typical datasets
- Chart rendering under 500ms
- Smooth scrolling and interactions

### Security Considerations
- Client-side application with no server components
- No authentication required
- Data handled entirely in the browser
- No sensitive data processing

### Hosting Requirements
- Static file hosting only
- No backend/server requirements
- Small footprint (<500KB total excluding sample data)

## Development Guidelines

### Code Style
- ES6+ JavaScript features
- Consistent indentation (2 spaces)
- Descriptive variable and function names
- Comments for complex logic
- Function-based organization

### JavaScript Standards
- Prefer const and let over var
- Use arrow functions where appropriate
- Leverage modern array methods (map, filter, reduce)
- Employ destructuring for cleaner code
- Use optional chaining and nullish coalescing for safer property access

### DOM Manipulation
- Prefer direct DOM manipulation over frameworks
- Use data attributes for JavaScript hooks
- Create elements with document.createElement
- Update classes with classList API
- Employ event delegation for dynamically created elements

### Data Processing
- Validate CSV data structure before processing
- Transform data into optimal format for each visualization
- Cache processed results to avoid redundant calculations
- Handle edge cases (empty data, malformed entries)

### Charts and Visualizations
- Consistent color scheme across all charts
- Clear labels and legends
- Interactive tooltips for data exploration
- Responsive sizing for all device types
- Appropriate chart types for each data relationship

## Integration Points

### Data Files
- CSV files with specific column structures
- Column names must match expected format
- Data validation checks structure on load

### Localization
- Translation keys in dedicated objects
- All UI text references translation system
- RTL layout support not currently implemented

### Responsiveness
- CSS media queries for layout adaptation
- Flexible grid system for component sizing
- Touch-friendly targets for mobile devices
- Alternative views for small screens where needed 