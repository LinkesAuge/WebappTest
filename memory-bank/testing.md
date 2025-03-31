# Testing

## Test Directory Structure

```
/tests
├── unit/                  # Unit tests for individual functions
│   ├── data-processing/   # Tests for data processing functions
│   ├── chart-rendering/   # Tests for chart creation functions
│   └── utilities/         # Tests for utility functions
│
├── integration/           # Tests for component interactions
│   ├── views/             # Tests for view transitions
│   ├── language/          # Tests for language switching
│   └── storage/           # Tests for persistence features
│
├── e2e/                   # End-to-end tests for user flows
│   ├── dashboard/         # Dashboard functionality tests
│   ├── player-detail/     # Player detail view tests
│   └── charts/            # Chart interaction tests
│
├── fixtures/              # Test data fixtures
│   ├── small-data.csv     # Small dataset for quick tests
│   ├── large-data.csv     # Large dataset for performance tests
│   └── malformed-data.csv # Broken data for error handling tests
│
└── helpers/               # Test helper functions
    ├── setup.js           # Common test setup
    └── mocks.js           # Mock objects and functions
```

## Test Types

### Manual Testing

Currently, most testing is performed manually. The key test types include:

1. **Functional Testing**
   - Verify all features work as expected
   - Test all navigation paths
   - Validate data display accuracy
   - Confirm interactive elements respond correctly

2. **Cross-Browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

3. **Responsive Testing**
   - Desktop (1920x1080, 1366x768)
   - Tablet (768x1024)
   - Mobile (375x667, 414x896)

4. **Performance Testing**
   - Load time measurement
   - Chart rendering performance
   - Table scrolling smoothness
   - Memory usage monitoring

5. **Error Handling Testing**
   - Malformed CSV data
   - Network failure simulation
   - Missing data fields
   - Edge case data values

### Automated Testing (Planned)

The following test types are planned for future implementation:

1. **Unit Tests**
   - Data processing functions
   - Chart configuration functions
   - Utility functions
   - State management

2. **Integration Tests**
   - View transitions
   - Language switching
   - Data flow between components
   - LocalStorage persistence

3. **End-to-End Tests**
   - Complete user flows
   - Cross-browser functionality
   - Performance benchmarking

## Running Tests

### Manual Test Procedure

1. **Setup**
   - Load the application in target browser
   - Open browser developer tools (F12)
   - Clear localStorage if needed (`localStorage.clear()` in console)

2. **Core Functionality Testing**
   - Verify data loads correctly
   - Check all views can be accessed
   - Confirm tables are sortable
   - Validate chart displays
   - Test player detail view
   - Verify summary statistics

3. **Language Testing**
   - Switch language to German
   - Verify all UI text changes appropriately
   - Check charts update with translated labels
   - Confirm tables show translated headers
   - Switch back to English and verify

4. **Responsive Testing**
   - Resize browser window to various dimensions
   - Use browser DevTools device emulation
   - Verify layout adapts appropriately
   - Confirm all functions remain accessible

### Automated Testing (Future)

The planned automated testing system will use:

```bash
# Run all tests
npm test

# Run specific test suites
npm test:unit
npm test:integration
npm test:e2e

# Run with coverage reporting
npm test -- --coverage
```

## Key Testing Tools & Frameworks

### Current Tools

- **Browser DevTools** - For inspecting DOM, network, and performance
- **Console Logging** - For runtime validation and debugging
- **Manual Test Scripts** - Documented test cases for manual execution

### Planned Tools

- **Jest** - JavaScript testing framework for unit and integration tests
- **Testing Library** - For DOM testing with user-centric queries
- **Cypress** - For end-to-end testing with browser automation
- **Lighthouse** - For performance, accessibility, and best practices auditing

## Special Test Features

### Console Logging

The application includes special console logging for development and testing. These can be viewed in the browser's developer console:

- Data processing logs (prefixed with "[Data]")
- Chart creation logs (prefixed with "[Chart]")
- View transition logs (prefixed with "[View]")
- Error logs (prefixed with "[Error]")

### LocalStorage Testing

To test localStorage functionality:

1. Save a language preference by switching languages
2. Open browser DevTools and navigate to Application > Storage > Local Storage
3. Verify the "language" key exists with the correct value
4. Reload the page and confirm language preference persists

### Chart Testing

For testing chart rendering and interactions:

1. Verify all charts display correctly on initial load
2. Hover over chart elements to confirm tooltips appear
3. Click legend items to toggle data series (where applicable)
4. Test responsiveness by resizing the window

## Common Test Fixtures

### Small Dataset (10 players)
Used for quick functional testing without performance considerations.

### Large Dataset (1000+ players)
Used for performance testing and edge case detection.

### Malformed Dataset
Contains intentionally corrupted data to test error handling:
- Missing required columns
- Invalid data types
- Extreme value ranges
- Empty entries
- Special characters

## Test Patterns

### Data Validation Testing

For data processing functions, test:
1. Normal case with valid data
2. Empty dataset handling
3. Missing fields handling
4. Invalid value types
5. Boundary values (very large/small numbers)

### UI Interaction Testing

For UI components, test:
1. Initial render state
2. Response to user interactions (click, hover)
3. State transitions (view changes)
4. Error state displays
5. Loading state displays

### Error Handling Testing

For testing error handling, verify:
1. User-friendly error messages appear
2. Application doesn't crash on errors
3. Recovery paths work correctly
4. Console provides useful debugging information

## Specialized Test Cases

### Internationalization Testing

Specific tests for language switching:
1. Switch to each supported language
2. Verify all text elements change appropriately
3. Check dynamically generated content (chart labels)
4. Test language-specific formatting (dates, numbers)
5. Confirm no untranslated strings remain

### Chart Rendering Testing

Specific tests for chart functionality:
1. Verify data mapping accuracy
2. Test tooltip content and formatting
3. Check legend functionality
4. Test chart responsiveness
5. Verify chart animations

## Common Test Scenarios

### Basic User Flow Test

1. Load application
2. Wait for data to load
3. Verify dashboard displays correctly
4. Click on a player in the ranking table
5. Verify player detail view displays correctly
6. Navigate back to dashboard
7. Switch to Charts view
8. Verify all charts display correctly
9. Return to dashboard and switch language
10. Verify language changes applied correctly

### Data Interaction Flow

1. Load application
2. Sort main table by different columns
3. Filter table by player name
4. Click on chart legends to toggle data series
5. Expand a chart to modal view
6. Verify chart interactions still work in modal
7. Navigate to Analytics view
8. Select different categories from dropdown
9. Verify category-specific data displays correctly

### Error Handling Flow

1. Simulate network error during data loading
2. Verify error message displays
3. Attempt recovery path if available
4. Test with malformed data
5. Verify appropriate error messages
6. Test with missing data fields
7. Confirm graceful degradation (show what's possible)

## Best Practices

1. **Cross-Browser Testing**
   - Always test in multiple browsers
   - Pay special attention to chart rendering differences
   - Verify event handling consistently works

2. **Clear Cache Testing**
   - Test with both fresh cache and after localStorage is populated
   - Verify correct behavior with cache cleared between sessions
   - Test with localStorage disabled (private browsing mode)

3. **Performance Testing**
   - Always test with both small and large datasets
   - Monitor memory usage during extended sessions
   - Check for performance degradation over time

4. **Edge Case Coverage**
   - Test with extreme data values
   - Verify handling of unexpected data formats
   - Test with empty or nearly empty datasets

5. **Accessibility Verification**
   - Test keyboard navigation
   - Verify color contrast is sufficient
   - Check screen reader compatibility (future) 