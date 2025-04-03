# Tests Directory

This directory contains all tests for the application.

## Structure

- `/tests/unit/`: Contains unit tests for individual modules
- `/tests/integration/`: Contains integration tests for combined functionality
- `/tests/setup.js`: Contains setup code that runs before all tests

## Running Tests

Run all tests:
```bash
npm run test
```

Run tests in watch mode (automatically re-run on file changes):
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm run test:coverage
```

Run only unit tests:
```bash
npm run test:unit
```

Run only integration tests:
```bash
npm run test:integration
```

## Test Patterns

### Unit Tests

Unit tests should:
- Test one module/function at a time
- Mock all dependencies
- Have clear assertions
- Be fast and isolated

### Integration Tests

Integration tests should:
- Test how modules work together
- Use fewer mocks
- Test real interactions between components

## Test Naming

Test files should follow the naming pattern:
- `moduleName.test.js`

## Coverage Goals

We aim for at least 95% code coverage across:
- Statements
- Branches
- Functions
- Lines 