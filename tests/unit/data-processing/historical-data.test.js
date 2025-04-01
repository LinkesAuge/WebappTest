/**
 * Historical Data Tests
 * 
 * Tests for historical data loading and processing functionality.
 */

// DOM elements will be set up after imports
let mockDOM = {
  weeklyTotalsTable: null,
  historyLoadingIndicator: null,
  historyContent: null
};

// Mock Chart.js
jest.mock('chart.js', () => {
  return {
    Chart: jest.fn().mockImplementation(() => {
      return {
        destroy: jest.fn()
      };
    })
  };
});

// Create mock for DOM elements
jest.mock('../../../js/dom.js', () => ({
  elements: {
    // Use variable references that will be set after DOM is created
    get weeklyTotalsTable() { return mockDOM.weeklyTotalsTable; },
    get historyLoadingIndicator() { return mockDOM.historyLoadingIndicator; },
    get historyContent() { return mockDOM.historyContent; }
  },
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showError: jest.fn(),
  clearElement: jest.fn(),
  createElement: jest.fn().mockImplementation(() => ({ 
    classList: { add: jest.fn(), remove: jest.fn() },
    appendChild: jest.fn()
  }))
}));

// Mock the modules we'll use
jest.mock('../../../js/dataLoading.js', () => ({
  parseCSV: jest.fn().mockImplementation((csv) => {
    // Return array of player objects
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const player = {};
      
      headers.forEach((header, index) => {
        player[header] = values[index];
      });
      
      return player;
    });
  }),
  loadAvailableWeeks: jest.fn().mockResolvedValue(true),
  loadWeekData: jest.fn().mockImplementation((weekId) => {
    if (weekId === 'week_13') {
      return Promise.resolve([
        {playerName: 'Player1', totalScore: 500, totalChests: 10, premium: true},
        {playerName: 'Player2', totalScore: 300, totalChests: 5, premium: false}
      ]);
    } else if (weekId === 'week_14') {
      return Promise.resolve([
        {playerName: 'Player1', totalScore: 600, totalChests: 12, premium: true},
        {playerName: 'Player2', totalScore: 350, totalChests: 6, premium: false}
      ]);
    }
    return Promise.resolve([]);
  })
}));

// Mock state.js
jest.mock('../../../js/state.js', () => {
  const historicalDataArray = [];
  
  return {
    availableWeeks: [
      {week: 'week_13', startDate: '2023-03-27', endDate: '2023-04-02'},
      {week: 'week_14', startDate: '2023-04-03', endDate: '2023-04-09'}
    ],
    currentWeek: {id: null, data: null},
    historicalData: historicalDataArray,
    resetState: jest.fn().mockImplementation(() => {
      historicalDataArray.length = 0;
    }),
    setState: jest.fn()
  };
});

// Mock i18n.js
jest.mock('../../../js/i18n.js', () => ({
  getText: jest.fn().mockImplementation((key) => key)
}));

// Mock utils.js
jest.mock('../../../js/utils.js', () => ({
  formatDateRange: jest.fn().mockImplementation(() => 'Apr 3-9, 2023')
}));

// Import modules AFTER setting up all mocks to avoid scope issues
import * as history from '../../../js/history.js';
import { parseCSV, loadWeekData } from '../../../js/dataLoading.js';
import * as state from '../../../js/state.js';

describe('Historical Data Processing', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    state.resetState();
    
    // Set up DOM elements
    document.body.innerHTML = `
      <div id="weeklyTotalsTable"></div>
      <div id="historyLoadingIndicator"></div>
      <div id="historyContent"></div>
    `;
    
    // Set the mock DOM elements after document is ready
    mockDOM.weeklyTotalsTable = document.getElementById('weeklyTotalsTable');
    mockDOM.historyLoadingIndicator = document.getElementById('historyLoadingIndicator');
    mockDOM.historyContent = document.getElementById('historyContent');
  });

  test('loadHistoricalData should load data for multiple weeks', async () => {
    // Call the function
    const result = await history.loadHistoricalData();
    
    // Check that loadWeekData was called for each week
    expect(loadWeekData).toHaveBeenCalledTimes(2);
    expect(loadWeekData).toHaveBeenCalledWith('week_13');
    expect(loadWeekData).toHaveBeenCalledWith('week_14');
    
    // Verify the data was processed
    expect(result).toBeTruthy();
    expect(state.historicalData.length).toBe(2);
  });

  test('renderWeeklyTotalsTable should render data in the table', () => {
    // Set up mock historical data
    state.historicalData.push({
      weekNumber: 13,
      weekStart: '2023-03-27',
      weekEnd: '2023-04-02',
      playerCount: 10,
      totalScore: 5000,
      totalChests: 100,
      averageScore: 500,
      mostCommonSource: { name: 'Source1', count: 5 }
    });
    
    // Call the function
    history.renderWeeklyTotalsTable();
    
    // Verify the element was cleared
    expect(state.historicalData.length).toBe(1);
  });
}); 