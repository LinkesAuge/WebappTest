/**
 * Tests for week detection and data loading functionality.
 * 
 * These tests cover the functionality for:
 * 1. Detecting available weeks from weeks.json or through file pattern matching
 * 2. Loading data for a specific week
 * 3. Determining the most recent week
 */

// Mock the fetch function for testing
global.fetch = jest.fn();

describe('Week Detection', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch.mockReset();
    
    // Clear DOM
    document.body.innerHTML = '';
    
    // Mock error/status functions
    global.setStatus = jest.fn();
    global.showLoading = jest.fn();
    global.hideLoading = jest.fn();
  });

  test('loadAvailableWeeks should load weeks from weeks.json', async () => {
    // Mock the successful fetch of weeks.json
    const mockWeeksData = {
      weeks: [
        { week: 13, file: 'data_week_13.csv', start_date: '2023-03-27', end_date: '2023-04-02' },
        { week: 14, file: 'data_week_14.csv', start_date: '2023-04-03', end_date: '2023-04-09' },
        { week: 15, file: 'data_week_15.csv', start_date: '2023-04-10', end_date: '2023-04-16', is_current: true }
      ]
    };
    
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeeksData)
      })
    );
    
    // Import the module to test
    const script = require('../../../script.js');
    
    // Call the function
    const result = await script.loadAvailableWeeks();
    
    // Assertions
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('./data/weeks.json?t=expect.any(Number)');
    expect(script.availableWeeks).toHaveLength(3);
    expect(script.availableWeeks[0].week).toBe(13);
    expect(script.availableWeeks[2].is_current).toBe(true);
    expect(script.mostRecentWeek).toEqual(mockWeeksData.weeks[2]);
  });

  test('loadAvailableWeeks should fallback to detectAvailableWeeks when weeks.json is not available', async () => {
    // Mock a failed fetch for weeks.json
    global.fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 404
      })
    );
    
    // Mock detectAvailableWeeks to return success
    const script = require('../../../script.js');
    script.detectAvailableWeeks = jest.fn().mockResolvedValue(true);
    script.availableWeeks = [
      { week: 13, file: 'data_week_13.csv' },
      { week: 14, file: 'data_week_14.csv' }
    ];
    script.mostRecentWeek = { week: 14, file: 'data_week_14.csv' };
    
    // Call the function
    const result = await script.loadAvailableWeeks();
    
    // Assertions
    expect(result).toBe(true);
    expect(script.detectAvailableWeeks).toHaveBeenCalled();
  });

  test('determineLatestWeek should identify the most recent week', () => {
    const script = require('../../../script.js');
    
    const weeks = [
      { week: 13, file: 'data_week_13.csv' },
      { week: 15, file: 'data_week_15.csv' },
      { week: 14, file: 'data_week_14.csv' }
    ];
    
    const result = script.determineLatestWeek(weeks);
    
    expect(result).toEqual({ week: 15, file: 'data_week_15.csv' });
  });

  test('determineLatestWeek should handle explicit is_current flag', () => {
    const script = require('../../../script.js');
    
    const weeks = [
      { week: 13, file: 'data_week_13.csv' },
      { week: 14, file: 'data_week_14.csv', is_current: true },
      { week: 15, file: 'data_week_15.csv' }
    ];
    
    const result = script.determineLatestWeek(weeks);
    
    expect(result).toEqual({ week: 14, file: 'data_week_14.csv', is_current: true });
  });
});

describe('Week Data Loading', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch.mockReset();
    
    // Clear DOM
    document.body.innerHTML = '';
    
    // Mock error/status functions
    global.setStatus = jest.fn();
    global.showLoading = jest.fn();
    global.hideLoading = jest.fn();
  });

  test('loadWeekData should load data for a specific week', async () => {
    const script = require('../../../script.js');
    
    // Mock available weeks
    script.availableWeeks = [
      { week: 13, file: 'data_week_13.csv' },
      { week: 14, file: 'data_week_14.csv' },
      { week: 15, file: 'data_week_15.csv', is_current: true }
    ];
    script.mostRecentWeek = { week: 15, file: 'data_week_15.csv', is_current: true };
    
    // Mock loadStaticCsvData to return success
    script.loadStaticCsvData = jest.fn().mockResolvedValue(true);
    
    // Call function with specified week
    const result = await script.loadWeekData(14);
    
    // Assertions
    expect(result).toBe(true);
    expect(script.loadStaticCsvData).toHaveBeenCalledWith('./data/data_week_14.csv');
  });

  test('loadWeekData should load most recent week when no week is specified', async () => {
    const script = require('../../../script.js');
    
    // Mock available weeks
    script.availableWeeks = [
      { week: 13, file: 'data_week_13.csv' },
      { week: 14, file: 'data_week_14.csv' },
      { week: 15, file: 'data_week_15.csv', is_current: true }
    ];
    script.mostRecentWeek = { week: 15, file: 'data_week_15.csv', is_current: true };
    
    // Mock loadStaticCsvData to return success
    script.loadStaticCsvData = jest.fn().mockResolvedValue(true);
    
    // Call function with no specified week
    const result = await script.loadWeekData();
    
    // Assertions
    expect(result).toBe(true);
    expect(script.loadStaticCsvData).toHaveBeenCalledWith('./data/data_week_15.csv');
  });

  test('loadWeekData should fallback to data.csv if no weeks are available', async () => {
    const script = require('../../../script.js');
    
    // Mock empty available weeks
    script.availableWeeks = [];
    script.mostRecentWeek = null;
    
    // Mock loadStaticCsvData to return success
    script.loadStaticCsvData = jest.fn().mockResolvedValue(true);
    
    // Call function with no specified week
    const result = await script.loadWeekData();
    
    // Assertions
    expect(result).toBe(true);
    expect(script.loadStaticCsvData).toHaveBeenCalledWith('./data.csv');
  });
}); 