# ChefScore Analytics Dashboard - Scripts

This directory contains utility scripts for the ChefScore Analytics Dashboard.

## Test Runners

### JavaScript Test Runner

`run-tests.js` - A Node.js script for running JavaScript tests with Jest.

```bash
# Run via Node.js directly
node scripts/run-tests.js [options]

# Or using npm scripts
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage
```

Options:
- `--unit` - Run only unit tests
- `--integration` - Run only integration tests
- `--e2e` - Run only end-to-end tests
- `--all` - Run all tests (default)
- `--coverage` - Generate coverage report
- `--watch` - Run tests in watch mode
- `--verbose` - Show detailed test output

### Python Test Runner

`run_pytest.py` - A Python script for running Python tests with pytest.

```bash
# Run directly with Python
python scripts/run_pytest.py [options]

# Or using npm scripts
npm run test:py
npm run test:py:unit
npm run test:py:integration
npm run test:py:validation
npm run test:py:coverage
```

Options:
- `--unit` - Run only unit tests
- `--integration` - Run only integration tests
- `--validation` - Run only validation tests
- `--all` - Run all tests (default)
- `--coverage` - Generate coverage report
- `--verbose` - Show detailed test output
- `--html` - Generate HTML test report
- `--setup` - Only set up test directories, don't run tests

### Combined Test Runner

`run_all_tests.py` - A Python script for running both JavaScript and Python tests.

```bash
# Run directly with Python
python scripts/run_all_tests.py [options]

# Or using npm scripts
npm run test:all
npm run test:all:coverage
```

Options:
- `--js-only` - Run only JavaScript tests
- `--python-only` - Run only Python tests
- `--coverage` - Generate coverage reports
- `--html-report` - Generate HTML test reports
- `--verbose` - Show detailed test output

## Continuous Integration

`ci.js` - A Node.js script for continuous integration that runs linting, tests, coverage, and HTML validation.

```bash
node scripts/ci.js
```

This script:
1. Verifies the codebase formatting with ESLint
2. Runs all tests (unit, integration, e2e)
3. Generates code coverage reports
4. Performs basic HTML validation

## Requirements

### JavaScript Scripts
- Node.js 14+
- npm

### Python Scripts
- Python 3.6+
- pytest (installed automatically if missing)
- pytest-cov (for coverage reports, installed automatically if missing)
- pytest-html (for HTML reports, installed automatically if missing) 