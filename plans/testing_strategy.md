# Testing Strategy for Modular Refactoring

This document outlines the testing strategy for the script.js refactoring project. It covers how to update existing tests and create new tests specifically for the modular architecture.

## Overall Approach

The testing strategy follows these core principles:

1. **Test-Driven Development**: Write tests before implementing features
2. **Incremental Testing**: Test each module as it's developed
3. **Comprehensive Coverage**: Aim for at least 95% code coverage
4. **Parallel Test Suites**: Maintain both original and refactored tests during transition
5. **Automated Verification**: Use automated tests to verify behavior consistency

## Test Types

### Unit Tests

Unit tests focus on individual functions and modules in isolation:

- **Module Tests**: Test each ES6 module independently
- **Function Tests**: Test individual functions with different inputs
- **Edge Case Tests**: Cover boundary conditions and error handling

### Integration Tests

Integration tests verify that modules work together correctly:

- **Module Integration**: Test interactions between modules
- **Data Flow Tests**: Verify data flows correctly through the system
- **State Management Tests**: Test the pub/sub system with multiple subscribers

### End-to-End Tests

End-to-end tests verify the entire application functionality:

- **User Flow Tests**: Test complete user scenarios
- **UI Behavior Tests**: Verify UI behavior matches the original application
- **Performance Tests**: Compare performance before and after refactoring

## Test Directory Structure

```
tests/
├── unit/
│   ├── config/
│   ├── utils/
│   ├── state/
│   ├── i18n/
│   ├── dom/
│   ├── dataLoading/
│   ├── dataProcessing/
│   ├── uiUpdates/
│   ├── charts/
│   └── listeners/
├── integration/
│   ├── core-modules/
│   ├── data-handling/
│   ├── ui-interaction/
│   └── chart-system/
└── e2e/
    ├── user-flows/
    ├── performance/
    └── compatibility/
```

## Module-Specific Test Approaches

### config.js Tests

```javascript
// config.test.js
import * as config from '../js/config.js';

describe('Config Module', () => {
  test('exports all required constants', () => {
    expect(config.CSV_PATH).toBeDefined();
    expect(config.RULES_PATH).toBeDefined();
    expect(config.DEFAULT_LANGUAGE).toBeDefined();
    expect(config.CHART_COLORS).toBeDefined();
  });
  
  test('getChartBaseOptions returns valid configuration', () => {
    const options = config.getChartBaseOptions('pie');
    expect(options).toHaveProperty('chart');
    expect(options).toHaveProperty('colors');
    expect(options).toHaveProperty('theme');
  });
});
```

### utils.js Tests

```javascript
// utils.test.js
import * as utils from '../js/utils.js';

describe('Utils Module', () => {
  test('formatNumber adds thousand separators', () => {
    expect(utils.formatNumber(1000)).toBe('1.000');
    expect(utils.formatNumber(1000, 'en')).toBe('1,000');
  });
  
  test('formatDateRange formats dates correctly', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2023-01-31');
    expect(utils.formatDateRange(start, end, 'de'))
      .toBe('01.01.2023 - 31.01.2023');
  });
  
  test('triggerDownload creates correct download link', () => {
    // Mock document.createElement and click
    // Test triggerDownload functionality
  });
});
```

### state.js Tests

```javascript
// state.test.js
import * as state from '../js/state.js';

describe('State Module', () => {
  beforeEach(() => {
    // Reset state before each test
    state.resetState();
  });
  
  test('setState and getState work with simple values', () => {
    state.setState('testKey', 'testValue');
    expect(state.getState('testKey')).toBe('testValue');
  });
  
  test('setState and getState work with nested paths', () => {
    state.setState('parent.child', 'nestedValue');
    expect(state.getState('parent.child')).toBe('nestedValue');
    expect(state.getState('parent')).toEqual({ child: 'nestedValue' });
  });
  
  test('subscribe notifies of state changes', () => {
    const mockCallback = jest.fn();
    state.subscribe('watchedKey', mockCallback);
    state.setState('watchedKey', 'newValue');
    
    expect(mockCallback).toHaveBeenCalledWith('newValue', undefined, 'watchedKey');
  });
  
  test('localStorage integration saves and loads state', () => {
    // Mock localStorage
    const mockStorage = {};
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(
      (key, value) => { mockStorage[key] = value; }
    );
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(
      (key) => mockStorage[key]
    );
    
    state.setState('testKey', 'storageValue');
    state.saveStateToStorage();
    state.resetState();
    state.loadStateFromStorage();
    
    expect(state.getState('testKey')).toBe('storageValue');
  });
});
```

## Testing ApexCharts Integration

Since we're standardizing on ApexCharts, we need to create appropriate mocks:

```javascript
// apexcharts.mock.js
class ApexChartsMock {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.rendered = false;
  }
  
  render() {
    this.rendered = true;
    return Promise.resolve(this);
  }
  
  updateOptions(newOptions, redraw, animate) {
    this.options = {...this.options, ...newOptions};
    return this;
  }
  
  updateSeries(newSeries, animate) {
    this.options.series = newSeries;
    return this;
  }
  
  destroy() {
    this.destroyed = true;
    return undefined;
  }
}

global.ApexCharts = ApexChartsMock;
```

Using this mock in chart tests:

```javascript
// charts.test.js
import * as charts from '../js/charts.js';
import * as state from '../js/state.js';

// Import the mock
import '../mocks/apexcharts.mock.js';

describe('Charts Module', () => {
  beforeEach(() => {
    // Set up DOM element for chart container
    document.body.innerHTML = `
      <div id="chart-container"></div>
    `;
    
    // Reset state
    state.resetState();
    
    // Set sample data in state
    state.setState('data.allPlayersData', [
      { playerName: 'Player 1', score: 100 },
      { playerName: 'Player 2', score: 150 }
    ]);
  });
  
  test('createTopSourcesChart renders chart correctly', () => {
    const chart = charts.createTopSourcesChart('chart-container', 
      state.getState('data.allPlayersData'));
    
    expect(chart).toBeDefined();
    expect(chart.rendered).toBe(true);
    expect(chart.options.chart.type).toBe('pie');
  });
  
  test('charts update when state changes', () => {
    // Create chart
    const chart = charts.createTopSourcesChart('chart-container', 
      state.getState('data.allPlayersData'));
    
    // Store reference for verification
    const updateSeriesSpy = jest.spyOn(chart, 'updateSeries');
    
    // Add chart instance to state
    state.setState('charts.instances.topSources', chart);
    
    // Update data in state
    state.setState('data.allPlayersData', [
      { playerName: 'Player 1', score: 200 },
      { playerName: 'Player 2', score: 250 },
      { playerName: 'Player 3', score: 300 }
    ]);
    
    // Verify chart was updated
    expect(updateSeriesSpy).toHaveBeenCalled();
  });
});
```

## Updating Existing Tests

For existing tests that rely on global functions from script.js:

1. **Import Module Functions**: Replace global function calls with imports
2. **Mock Dependencies**: Use Jest's mock functionality for dependencies
3. **Preserve Test Logic**: Keep the core test logic the same

Example of updating an existing test:

```javascript
// Before
describe('Score Calculation', () => {
  test('calculates correct total score', () => {
    const player = { points: 100, bonus: 50 };
    const result = calculateTotalScore(player);
    expect(result).toBe(150);
  });
});

// After
import { calculateTotalScore } from '../js/dataProcessing.js';

describe('Score Calculation', () => {
  test('calculates correct total score', () => {
    const player = { points: 100, bonus: 50 };
    const result = calculateTotalScore(player);
    expect(result).toBe(150);
  });
});
```

## Integration Test Strategy

Integration tests should focus on the connections between modules:

```javascript
// data-flow.test.js
import * as dataLoading from '../js/dataLoading.js';
import * as dataProcessing from '../js/dataProcessing.js';
import * as state from '../js/state.js';

describe('Data Flow Integration', () => {
  test('data loads, processes, and updates state', async () => {
    // Mock CSV response
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve('playerName,score\nPlayer 1,100\nPlayer 2,150')
      })
    );
    
    // Setup state change listener
    const stateChangedMock = jest.fn();
    state.subscribe('data.allPlayersData', stateChangedMock);
    
    // Load data
    await dataLoading.loadCsvData('test.csv');
    
    // Verify state was updated
    expect(stateChangedMock).toHaveBeenCalled();
    expect(state.getState('data.allPlayersData')).toHaveLength(2);
    
    // Process data
    dataProcessing.processPlayerData(state.getState('data.allPlayersData'));
    
    // Verify processed data
    const processedData = state.getState('data.processedData');
    expect(processedData).toBeDefined();
  });
});
```

## E2E Testing

End-to-end tests should verify that the entire application works as expected:

```javascript
// app-flow.test.js
describe('Application End-to-End', () => {
  beforeAll(async () => {
    // Load the application in a headless browser
    await page.goto('http://localhost:8080');
  });
  
  test('application loads and displays data', async () => {
    // Wait for data to load
    await page.waitForSelector('#ranking-table-body tr');
    
    // Check that ranking table has data
    const rowCount = await page.$$eval('#ranking-table-body tr', rows => rows.length);
    expect(rowCount).toBeGreaterThan(0);
  });
  
  test('switching views works', async () => {
    // Click the data view tab
    await page.click('#nav-data');
    
    // Verify detailed table is visible
    const isVisible = await page.$eval('#detailed-table-container', 
      el => window.getComputedStyle(el).display !== 'none');
    expect(isVisible).toBe(true);
  });
});
```

## Test Coverage Goals

For each module, aim for the following minimum coverage:

| Module | Line Coverage | Function Coverage | Branch Coverage |
|--------|--------------|------------------|----------------|
| config.js | 90% | 100% | 90% |
| utils.js | 95% | 100% | 95% |
| state.js | 95% | 100% | 95% |
| i18n.js | 95% | 100% | 95% |
| dom.js | 90% | 100% | 90% |
| dataLoading.js | 95% | 100% | 95% |
| dataProcessing.js | 95% | 100% | 95% |
| uiUpdates.js | 90% | 100% | 90% |
| charts.js | 90% | 100% | 90% |
| listeners.js | 90% | 100% | 90% |
| main.js | 90% | 100% | 90% |

## Running Tests

Update the existing test scripts in package.json:

```json
"scripts": {
  "test": "jest",
  "test:unit": "jest tests/unit",
  "test:integration": "jest tests/integration",
  "test:e2e": "jest tests/e2e",
  "test:coverage": "jest --coverage",
  "test:watch": "jest --watch"
}
```

## Test Migration Sequence

1. Set up Jest to handle ES6 modules
2. Create unit tests for independent modules first (config, utils)
3. Add tests for state management
4. Add tests for core modules (dom, i18n)
5. Add tests for data modules
6. Add tests for UI and chart modules
7. Add integration tests
8. Add end-to-end tests
9. Update existing tests to work with the new modular structure

## Final Test Verification

Before completing the refactoring, the test suite should verify:

1. All features from the original application work correctly
2. No regressions have been introduced
3. Performance is at least as good as the original
4. Code coverage meets or exceeds targets
5. All supported browsers work correctly

## Architectural Updates

The testing strategy has been updated to reflect the removal of week data selection and history comparison features from the application. This simplification:

1. **Eliminates Tests For**:
   - Week selection UI components
   - Week-to-week data comparison
   - Historical data navigation
   - Week state management

2. **Simplifies Test Cases For**:
   - Data loading (single dataset only)
   - UI rendering (no week selector)
   - State management (no week tracking)
   - Chart visualization (single dataset views)

This architectural change reduces testing complexity while maintaining robust coverage of core application features.

## Test Scope Modifications

| Module | Test Focus | Test Count |
|--------|------------|------------|
| csvParser.js | Data parsing accuracy, error handling | 8-10 |
| dataLoader.js | Loading mechanisms, error states | 6-8 |
| dataProcessing.js | Data transformation, aggregation (single dataset) | 10-12 |
| state.js | State operations, event publishing | 8-10 |
| dom.js | Element references, UI manipulation | 10-12 |
| i18n.js | Text loading, language switching | 6-8 |
| tableController.js | Table rendering, sorting, filtering | 12-15 |
| chartController.js | Chart creation, updates | 10-12 |
| main.js | Application initialization, module orchestration | 6-8 |
| **Total** | **Core functionality** | **76-95** | 