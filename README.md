# Chest Analyzer

A single-page web application for analyzing and visualizing player chest data from the "Total Battle" game.

## Overview

The Chest Analyzer allows players and clan members of "The Chiller" clan to view, analyze, and compare performance metrics based on chest collection data. The application features various visualizations, detailed player statistics, and analytical tools to provide insights into individual and comparative performance.

## Key Features

- Dashboard with key statistics and player rankings
- Interactive charts (donut, bar, scatter, radar)
- Detailed player information and breakdowns
- Week selection for viewing data from different time periods
- Category-specific analysis and comparisons
- Multilingual support (German and English)
- Responsive design for mobile and desktop
- Scoring system reference and documentation

## Technology Stack

- HTML5 / CSS3 / JavaScript (ES6+)
- Tailwind CSS for styling
- ApexCharts for data visualization
- PapaParse for CSV parsing
- Flatpickr for date/week selection
- Jest for testing

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/chest-analyzer.git
cd chest-analyzer
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Data Files

The application requires CSV data files to function:
- `data/data.csv` - Main player data file
- `data/rules.csv` - Scoring rules data
- `data/week/week_XX.csv` - Weekly data files (where XX is the week number)

## Development

### Testing
Run the test suite with:
```bash
npm test
```

### Folder Structure
```
app/                  # Application source code
  ├── renderer/       # Chart and view rendering modules
  └── ...             # Core modules
tests/                # Test files
scripts/              # Utility scripts
memory-bank/          # Project documentation
docs/                 # User documentation
```

## Documentation

For detailed documentation, see the [docs folder](./docs/Readme.md) or the [memory-bank](./memory-bank/) folder for development context.

## License

[MIT](LICENSE) 