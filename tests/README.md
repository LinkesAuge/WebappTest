# ChefScore Analytics Dashboard - Testing

This directory contains tests for the ChefScore Analytics Dashboard. The test suite is organized according to the testing pyramid, with unit tests, integration tests, and end-to-end tests.

## Test Structure

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
│   └── malformed-data.csv # Broken data for error handling tests
│
└── helpers/               # Test helper functions
    └── setup.js           # Common test setup
```

## Running Tests

You can run tests using npm scripts:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage reporting
npm run test:coverage
```

## Test Types

### Unit Tests

Unit tests focus on testing individual functions in isolation:

- **Data Processing Tests**: Test CSV parsing, data transformation, and analysis.
- **Chart Rendering Tests**: Test chart configuration and rendering.
- **Utility Tests**: Test internationalization, formatting, and other utility functions.

### Integration Tests

Integration tests verify that components work together correctly:

- **View Transitions**: Test navigation between different application views.
- **Language Switching**: Test language changes and UI updates.
- **Storage Integration**: Test localStorage persistence.

### End-to-End Tests

End-to-end tests simulate real user flows:

- **Dashboard Interactions**: Test filtering, sorting, and dashboard features.
- **Player Detail Flow**: Test player selection and detail view.
- **Chart Interactions**: Test expandable charts and modal views.

## Test Coverage

The test suite aims for high code coverage:
- 95% statement coverage
- 90% branch coverage
- 95% function coverage
- 95% line coverage

Coverage reports can be generated using `npm run test:coverage`.

## Mocking Strategy

The tests use the following mocking approach:

- **DOM Environment**: JSDOM provides a simulated browser environment.
- **Chart.js**: Mocked to avoid actual canvas rendering.
- **LocalStorage**: Mocked with an in-memory implementation.
- **Fetch API**: Mocked to return predefined responses without network calls.

## Adding New Tests

When adding new tests:

1. Place the test in the appropriate directory based on its type.
2. Name the test file with a `.test.js` or `.spec.js` suffix.
3. Use descriptive test names that explain the behavior being tested.
4. Organize tests using `describe` and `test` blocks.
5. Follow the AAA pattern (Arrange, Act, Assert) within test cases.

## Continuous Integration

Tests are automatically run in the CI pipeline on every push to ensure quality is maintained throughout development. 