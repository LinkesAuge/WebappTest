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
    ├── mocks.js           # Mock objects and functions
    └── e2e-test-setup.js  # Specialized setup for E2E tests
```

## Test Types

### Manual Testing

Manual testing remains an important aspect of the testing strategy, particularly for usability and visual aspects. The key test types include:

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

### Automated Testing (Implemented)

The project now has a comprehensive suite of automated tests:

1. **Unit Tests**
   - Data processing functions (CSV parsing, data analysis)
   - Chart configuration and creation functions
   - Utility functions (i18n, helper methods)
   - State management

2. **Integration Tests**
   - View transitions between application sections
   - Language switching functionality
   - LocalStorage persistence
   - Data flow between components

3. **End-to-End Tests**
   - Complete user flows
   - Dashboard interactions
   - Chart interactions
   - Player detail view functionality

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

### Automated Testing

The automated testing system uses:

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

Current test metrics:
- **Unit Tests**: 38 tests across 4 test suites
- **Integration Tests**: 21 tests across 3 test suites
- **End-to-End Tests**: 30 tests across 4 test suites
- **Overall**: 94 tests across 11 test suites

## Key Testing Tools & Frameworks

### Current Tools

- **Jest** - JavaScript testing framework for all test types
- **JSDOM** - For simulating DOM environment in Node.js
- **Testing Library** - For DOM testing with user-centric queries
- **Console Logging** - For runtime validation and debugging
- **Custom Mocks** - For Chart.js, localStorage, and other browser APIs

### Testing Utilities

- **e2e-test-setup.js** - Helper for setting up a consistent DOM environment for E2E tests
- **setup.js** - Common test setup for all test types
- **mocks.js** - Common mock objects and functions

## Special Test Features

### Standardized Mock Implementation

The project uses a standardized approach to mocking:

1. **Chart.js Mock**
   - Mock Chart constructor with tracking of chart instances
   - Mock chart methods for update, data display, and destruction
   - Canvas context mocking for Chart.js rendering

2. **LocalStorage Mock**
   - Mock implementation of localStorage get/set/remove/clear
   - Simulated persistence within test runs
   - Error simulation capabilities

3. **DOM Environment**
   - Consistent DOM structure for all tests
   - Element creation and attribute setting
   - Event simulation

### Console Logging

The application includes special console logging for development and testing. These can be viewed in the browser's developer console:

- Data processing logs (prefixed with "[Data]")
- Chart creation logs (prefixed with "[Chart]")
- View transition logs (prefixed with "[View]")
- Error logs (prefixed with "[Error]")

### LocalStorage Testing

The project includes comprehensive testing for localStorage functionality:

1. Saving language preferences
2. Persisting player data
3. Error handling for storage failures
4. Recovery from corrupted data

### Chart Testing

For testing chart rendering and interactions:

1. Verify chart creation with correct configuration
2. Test data updates and visualization
3. Validate interactive features (tooltips, legend toggling)
4. Test chart responsiveness and error handling

## Common Test Fixtures

### Sample Player Data
Standard set of player objects used across tests for consistent verification

### DOM Structure
Standardized DOM structure created for E2E tests:
- Dashboard elements
- Player detail elements
- Chart containers
- Navigation elements

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
2. Verify all UI elements change appropriately
3. Check dynamically generated content (chart labels)
4. Test language-specific formatting (dates, numbers)
5. Confirm language preference persistence

### Chart Rendering Testing

Specific tests for chart functionality:
1. Verify chart creation with correct configuration
2. Test data updates and responsiveness
3. Validate interactive features (tooltips, legends)
4. Test error handling with invalid data or containers

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

1. **Consistent Test Setup**
   - Use standardized helper functions for common setup tasks
   - Create reusable fixtures for test data
   - Reset state between tests to prevent cross-test contamination

2. **Proper Mocking**
   - Create mock implementations that closely match real behavior
   - Track mock function calls for verification
   - Mock only what's necessary - use real implementations when possible

3. **Error Handling Testing**
   - Test both expected success paths and failure scenarios
   - Ensure proper error messages are displayed
   - Verify application continues functioning after errors

4. **DOM Testing**
   - Verify elements exist before attempting to interact
   - Test both element presence and content
   - Mock event handlers to verify correct behavior

5. **Accessibility Verification**
   - Test keyboard navigation
   - Verify color contrast is sufficient
   - Check screen reader compatibility (planned) 