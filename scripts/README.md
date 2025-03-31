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

### Website Test Runner (Python)

`run_website_tests.py` - A Python script specifically for running JavaScript tests for the website.

```bash
# Run directly with Python
python scripts/run_website_tests.py [options]

# Or using npm scripts
npm run test:website
npm run test:website:unit
npm run test:website:integration
npm run test:website:e2e
npm run test:website:coverage

# Using the Windows batch file (from Command Prompt)
run-tests [options]

# Using the Windows batch file (from PowerShell)
.\run-tests.bat [options]

# Using the PowerShell script
.\run-tests.ps1 [options]
```

Options:
- `--unit` - Run only unit tests
- `--integration` - Run only integration tests
- `--e2e` - Run only end-to-end tests
- `--coverage` - Run tests with coverage reporting
- `--watch` - Run tests in watch mode
- `--verbose` - Show detailed test output
- `--setup` - Only check and set up dependencies without running tests

This script automatically checks for Node.js and npm, installs dependencies if needed, and runs the tests in a single command.

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

### Troubleshooting

If you encounter issues running the tests:

1. **Node.js/npm not found**: Ensure both Node.js and npm are installed and in your PATH
   - Run `.\scripts\fix-npm.ps1` to diagnose and fix npm path issues
   - If npm is not available, you can use one of these alternatives:
     - Python script with flag: `python scripts/run_website_tests.py --force-node-only`
     - Direct Jest runner: `.\scripts\node-direct.ps1`

2. **PowerShell execution error**: Run `.\run-tests.ps1` instead of just `run-tests`

3. **Permission issues**: You may need to run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in PowerShell to allow script execution

## Utility Scripts

### npm Path Fixer

`fix-npm.ps1` - A PowerShell script to diagnose and fix npm PATH issues.

```powershell
# Run the script
.\scripts\fix-npm.ps1
```

The script will:
- Check if Node.js is installed and accessible
- Verify if npm is in your PATH
- Locate npm on your system if it's not in the PATH
- Offer to add the correct directory to your PATH for the current session
- Provide recommendations to fix npm installation issues

### PowerShell Direct Jest Runner

`node-direct.ps1` - A PowerShell script that runs Jest directly using Node.js, without requiring npm.

```powershell
# Run all tests with the direct runner
.\scripts\node-direct.ps1

# Run specific test types
.\scripts\node-direct.ps1 --unit
.\scripts\node-direct.ps1 --integration
.\scripts\node-direct.ps1 --e2e
.\scripts\node-direct.ps1 --coverage

# Add Jest options
.\scripts\node-direct.ps1 --verbose --watch
```

This script is especially useful when:
- npm is not available in your PATH
- You have Node.js installed but npm is missing or not working
- You want to bypass npm to run tests directly

The script automatically:
- Detects if Node.js is installed
- Checks if the node_modules directory exists
- Verifies Jest is available 
- Runs Jest directly with Node.js 