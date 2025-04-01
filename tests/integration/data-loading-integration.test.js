/**
 * Data Loading Integration Tests
 * 
 * Tests the entire data loading process from reading weeks.json to populating the UI
 */

// Mocks for fetch API and DOM manipulation
global.fetch = jest.fn();
global.showLoading = jest.fn();
global.hideLoading = jest.fn();
global.showError = jest.fn();

// Setup DOM
document.body.innerHTML = `
  <header>
    <div id="week-selector-container">
      <select id="weekSelector"></select>
    </div>
  </header>
  <main>
    <section id="dashboard-section"></section>
    <section id="history-section" class="hidden">
      <div id="historical-view-container"></div>
    </section>
  </main>
`;

// Import modules
import * as dataLoading from '../../js/dataLoading.js';
import * as history from '../../js/history.js';
import * as state from '../../js/state.js';

// Mock files
const mockWeeksJson = [
  { week: '12', file: 'data_week_12.csv' },
  { week: '13', file: 'data_week_13.csv' },
  { week: '14', file: 'data_week_14.csv' },
  { week: '15', file: 'data_week_15.csv' }
];

const mockWeek12Data = [
  { PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 5 },
  { PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 10 }
];

describe('Data Loading Integration', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset state
    state.availableWeeks = [];
    state.currentWeek = {};
    state.historicalData = [];
    
    // Default fetch mock implementation
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
        json: () => Promise.resolve([])
      })
    );
  });
  
  test('should load weeks and then load data for the latest week', async () => {
    // Mock fetching weeks.json
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockWeeksJson)),
        json: () => Promise.resolve(mockWeeksJson)
      })
    );
    
    // Mock fetching week data
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockWeek12Data))
      })
    );
    
    // Initialize the weekly data system
    const result = await history.initializeWeeklyData();
    
    // Assertions
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith('./data/weeks.json');
    expect(fetch).toHaveBeenCalledWith('./data/data_week_15.csv'); // Should load the latest week
    
    // Check state
    expect(state.availableWeeks.length).toBe(4);
    expect(state.currentWeek.id).toBe('15');
    
    // Check UI
    const weekSelector = document.getElementById('weekSelector');
    expect(weekSelector.options.length).toBe(4);
  });
  
  test('should handle missing weeks.json file gracefully', async () => {
    // Mock 404 for weeks.json
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 404
      })
    );
    
    // Initialize the weekly data system
    const result = await history.initializeWeeklyData();
    
    // Assertions
    expect(result).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('./data/weeks.json');
    
    // Check state
    expect(state.availableWeeks.length).toBe(0);
    
    // Check UI - should have disabled selector
    const weekSelector = document.getElementById('weekSelector');
    expect(weekSelector.disabled).toBe(true);
  });
  
  test('should handle missing week data file gracefully', async () => {
    // Mock fetching weeks.json
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockWeeksJson)),
        json: () => Promise.resolve(mockWeeksJson)
      })
    );
    
    // Mock 404 for week data
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 404
      })
    );
    
    // Initialize the weekly data system
    const result = await history.initializeWeeklyData();
    
    // Assertions
    expect(result).toBe(true); // Should still return true even if week data fails
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenCalledWith('./data/weeks.json');
    expect(fetch).toHaveBeenCalledWith('./data/data_week_15.csv');
    
    // Check state - weeks should be loaded but current week data may be empty
    expect(state.availableWeeks.length).toBe(4);
  });
}); 