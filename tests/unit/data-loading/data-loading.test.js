/**
 * Data Loading Tests
 * 
 * Tests for the data loading functionality of the ChefScore Analytics Dashboard.
 */

// Mock fetch API
global.fetch = jest.fn();

// Mock DOM manipulation functions used by data loading
global.showLoading = jest.fn();
global.hideLoading = jest.fn();
global.showError = jest.fn();

// Mock state objects
global.availableWeeks = [];
global.currentWeek = {};
global.historicalData = [];

describe('Data Loading Functions', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset state
    global.availableWeeks = [];
    global.currentWeek = {};
    global.historicalData = [];
    
    // Default fetch mock implementation
    fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(''),
        json: () => Promise.resolve([])
      })
    );
  });

  describe('loadAvailableWeeks()', () => {
    test('should load and parse weeks.json correctly', async () => {
      // Mock the fetch response for weeks.json
      const mockWeeksData = [
        { week: '12', file: 'data_week_12.csv' },
        { week: '13', file: 'data_week_13.csv' },
        { week: '14', file: 'data_week_14.csv' }
      ];
      
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(JSON.stringify(mockWeeksData)),
          json: () => Promise.resolve(mockWeeksData)
        })
      );
      
      // Import the function to test
      const { loadAvailableWeeks } = require('../../../js/dataLoading');
      
      // Execute the function
      const result = await loadAvailableWeeks();
      
      // Assertions
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith('./data/weeks.json');
      expect(global.availableWeeks.length).toBe(3);
      expect(global.availableWeeks[0].week).toBe('12');
      expect(global.availableWeeks[0].file).toBe('data_week_12.csv');
      expect(global.availableWeeks[0].startDate).toBeDefined();
      expect(global.availableWeeks[0].endDate).toBeDefined();
    });
    
    test('should handle missing weeks.json file gracefully', async () => {
      // Mock a 404 response for weeks.json
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          status: 404
        })
      );
      
      // Import the function to test
      const { loadAvailableWeeks } = require('../../../js/dataLoading');
      
      // Execute the function
      const result = await loadAvailableWeeks();
      
      // Assertions
      expect(result).toBe(false);
      expect(fetch).toHaveBeenCalledWith('./data/weeks.json');
      expect(global.availableWeeks.length).toBe(0);
    });
    
    test('should handle malformed JSON in weeks.json', async () => {
      // Mock a malformed JSON response
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('{ malformed json }')
        })
      );
      
      // Import the function to test
      const { loadAvailableWeeks } = require('../../../js/dataLoading');
      
      // Execute the function
      const result = await loadAvailableWeeks();
      
      // Assertions
      expect(result).toBe(false);
      expect(fetch).toHaveBeenCalledWith('./data/weeks.json');
      expect(global.availableWeeks.length).toBe(0);
    });
  });
  
  describe('loadWeekData()', () => {
    test('should load CSV data for a specific week', async () => {
      // Mock the fetch response for a week's CSV data
      const mockCsvData = 'PLAYER,SCORE,CHESTS\nPlayer1,100,5\nPlayer2,200,10';
      
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(mockCsvData)
        })
      );
      
      // Import the function to test
      const { loadWeekData } = require('../../../js/dataLoading');
      
      // Execute the function
      const result = await loadWeekData('data_week_12.csv');
      
      // Assertions
      expect(result).toBeTruthy();
      expect(fetch).toHaveBeenCalledWith('./data/data_week_12.csv');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].PLAYER).toBeDefined();
    });
    
    test('should handle missing week file gracefully', async () => {
      // Mock a 404 response for the week file
      fetch.mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          status: 404
        })
      );
      
      // Import the function to test
      const { loadWeekData } = require('../../../js/dataLoading');
      
      // Execute the function
      const result = await loadWeekData('data_week_999.csv');
      
      // Assertions
      expect(result).toBeNull();
      expect(fetch).toHaveBeenCalledWith('./data/data_week_999.csv');
    });
  });
  
  describe('initializeWeeklyData()', () => {
    test('should initialize weekly data system with available weeks', async () => {
      // Mock successful loading of available weeks
      const mockWeeksData = [
        { week: '12', file: 'data_week_12.csv' },
        { week: '13', file: 'data_week_13.csv' },
        { week: '14', file: 'data_week_14.csv' }
      ];
      
      // Mock loadAvailableWeeks function
      const mockLoadAvailableWeeks = jest.fn(() => {
        global.availableWeeks = mockWeeksData;
        return Promise.resolve(true);
      });
      
      // Mock loadWeekData function
      const mockLoadWeekData = jest.fn(() => 
        Promise.resolve([{ PLAYER: 'Player1', SCORE: 100, CHESTS: 5 }])
      );
      
      // Mock the necessary DOM elements
      document.body.innerHTML = `
        <select id="weekSelector"></select>
      `;
      
      // Import the module to test with mocks
      jest.mock('../../../js/dataLoading', () => ({
        loadAvailableWeeks: mockLoadAvailableWeeks,
        loadWeekData: mockLoadWeekData
      }));
      
      const { initializeWeeklyData } = require('../../../js/history');
      
      // Execute the function
      const result = await initializeWeeklyData();
      
      // Assertions
      expect(result).toBe(true);
      expect(mockLoadAvailableWeeks).toHaveBeenCalled();
      expect(mockLoadWeekData).toHaveBeenCalled();
      expect(global.currentWeek).toBeDefined();
      expect(global.currentWeek.id).toBeDefined();
    });
    
    test('should handle case when no weeks are available', async () => {
      // Mock loadAvailableWeeks returning no weeks
      const mockLoadAvailableWeeks = jest.fn(() => Promise.resolve(false));
      
      // Mock the necessary DOM elements
      document.body.innerHTML = `
        <select id="weekSelector"></select>
      `;
      
      // Import the module to test with mocks
      jest.mock('../../../js/dataLoading', () => ({
        loadAvailableWeeks: mockLoadAvailableWeeks
      }));
      
      const { initializeWeeklyData } = require('../../../js/history');
      
      // Execute the function
      const result = await initializeWeeklyData();
      
      // Assertions
      expect(result).toBe(false);
      expect(mockLoadAvailableWeeks).toHaveBeenCalled();
      expect(document.getElementById('weekSelector').disabled).toBe(true);
    });
  });
}); 