# Testing Strategy

## Test Directory Structure

The testing framework for the application is organized as follows:

```
/tests
├── __init__.js                 # Directory initialization
├── setup.js                    # Jest setup file
├── README.md                   # Testing documentation
├── unit/                       # Unit tests
│   ├── __init__.js             # Unit tests initialization
│   ├── app.test.js             # Tests for app module
│   ├── dataLoader.test.js      # Tests for dataLoader module
│   ├── domManager.test.js      # Tests for domManager module
│   ├── i18n.test.js            # Tests for i18n module
│   └── utils.test.js           # Tests for utils module
└── integration/                # Integration tests
    ├── __init__.js             # Integration tests initialization
    └── app.test.js             # Integration tests for the application
```

## Test Types

The application uses two primary types of tests:

1. **Unit Tests**: Focus on testing individual functions and modules in isolation, with all dependencies mocked.
2. **Integration Tests**: Test how different modules work together, with fewer mocks.

## Running Tests

Tests can be run using the following npm scripts:

```bash
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run test:unit      # Run only unit tests
npm run test:integration # Run only integration tests
```

## Key Testing Tools & Frameworks

- **Jest**: Main testing framework
- **JSDOM**: DOM simulation environment
- **babel-jest**: For transpiling JavaScript code for testing
- **Mock implementations**: For simulating browser APIs and external dependencies

## Special Test Features

### Mock Implementation of Browser APIs

To test browser-dependent code, we've created mock implementations for:

- **localStorage**: For persistent storage testing
- **fetch**: For API call testing
- **Document methods**: For DOM manipulation testing
- **ApexCharts**: For chart rendering testing

### Test Setup

The `tests/setup.js` file initializes the test environment before all tests run:

1. Imports and sets up Jest DOM
2. Mocks global browser objects (fetch, localStorage, etc.)
3. Mocks external libraries (PapaParse, ApexCharts)
4. Cleans up mocks after each test

## Common Test Fixtures

Key test fixtures include:

1. **Sample player data**: Consistent test data for player records
2. **Sample rules data**: Test data for scoring rules
3. **DOM Structure**: HTML structure for testing DOM manipulation

## Test Patterns

### Unit Test Pattern

```javascript
describe('Module or function name', () => {
  // Setup before tests
  beforeEach(() => {
    // Reset mocks, create test data
  });
  
  test('specific functionality being tested', () => {
    // Arrange: Set up test conditions
    // Act: Call the function being tested
    // Assert: Verify the expected outcomes
  });
});
```

### Integration Test Pattern

```javascript
describe('Integration scenario', () => {
  // Setup before tests
  beforeEach(() => {
    // Create more complex test environment
  });
  
  test('modules working together correctly', () => {
    // Arrange: Set up test data and conditions
    // Act: Exercise multiple modules together
    // Assert: Verify the combined behavior
  });
});
```

## Specialized Test Cases

1. **Asynchronous operations**: Tests for data loading, API calls
2. **Event handling**: Tests for UI interactions
3. **Internationalization**: Tests for language switching and text rendering
4. **State management**: Tests for application state transitions

## Common Test Scenarios

1. **Data loading flow**: Testing the complete data loading process
2. **Navigation between views**: Testing view transitions and state changes
3. **Data sorting and filtering**: Testing data manipulation functions
4. **UI updates**: Testing DOM updates in response to data changes
5. **Error handling**: Testing application behavior during error conditions

## Best Practices

1. **Test isolation**: Each test should be independent
2. **Proper mocking**: Mock external dependencies but not the code being tested
3. **Coverage goals**: Aim for at least 95% test coverage
4. **Test readability**: Use clear descriptions and organized test structure
5. **Fail-fast approach**: Test the most critical functionality first
6. **Test edge cases**: Include tests for boundary conditions and error scenarios

## Current Status and Next Steps

Currently, the test suite is in development with the following status:

- Basic test structure is in place
- Unit tests are created for all modules
- Integration tests demonstrate cross-module functionality
- Several tests are failing due to DOM mocking issues

Planned improvements:

1. Fix DOM element mocking in tests
2. Improve localStorage mocking
3. Add more comprehensive test coverage for edge cases
4. Add end-to-end tests for critical user flows
5. Add performance tests for data-intensive operations 