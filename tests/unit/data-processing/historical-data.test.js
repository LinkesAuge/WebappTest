/**
 * Tests for historical data processing functionality.
 * 
 * These tests cover the functionality for:
 * 1. Loading data from multiple weeks for historical analysis
 * 2. Calculating aggregate statistics across weeks
 * 3. Tracking player data across weeks
 */

// Mock the fetch function for testing
global.fetch = jest.fn();

// Mock the needed DOM elements for charts and tables
function setupDOM() {
  document.body.innerHTML = `
    <div id="weekly-totals-body"></div>
    <div id="score-trend-chart-container"></div>
    <div id="chests-trend-chart-container"></div>
    <div id="top-players-chart-container"></div>
    <div id="category-trend-chart-container"></div>
    <div id="trend-category-select"></div>
    <div id="history-section" class="hidden"></div>
  `;
}

describe('Historical Data Loading', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch.mockReset();
    
    // Setup DOM
    setupDOM();
    
    // Mock status functions
    global.setStatus = jest.fn();
    global.showLoading = jest.fn();
    global.hideLoading = jest.fn();
  });

  test('loadHistoricalData should load data from all available weeks', async () => {
    const script = require('../../../script.js');
    
    // Mock available weeks
    script.availableWeeks = [
      { week: 13, file: 'data_week_13.csv' },
      { week: 14, file: 'data_week_14.csv' },
      { week: 15, file: 'data_week_15.csv', is_current: true }
    ];
    
    // Mock CSV data for each week
    const mockWeek13CSV = 'PLAYER,TOTAL_SCORE,CHEST_COUNT\nPlayer1,1000,100\nPlayer2,2000,200';
    const mockWeek14CSV = 'PLAYER,TOTAL_SCORE,CHEST_COUNT\nPlayer1,1500,150\nPlayer2,2500,250';
    const mockWeek15CSV = 'PLAYER,TOTAL_SCORE,CHEST_COUNT\nPlayer1,2000,200\nPlayer2,3000,300';
    
    // Mock fetch responses for each week's CSV
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockWeek13CSV)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockWeek14CSV)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockWeek15CSV)
      }));
    
    // Mock Papa.parse (CSV parsing library)
    global.Papa = {
      parse: jest.fn().mockImplementation((csv, options) => {
        const headers = csv.split('\n')[0].split(',');
        const rows = csv.split('\n').slice(1);
        const data = rows.map(row => {
          const values = row.split(',');
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        });
        
        options.complete({
          data,
          errors: [],
          meta: { fields: headers }
        });
      })
    };
    
    // Call the function
    const result = await script.loadHistoricalData();
    
    // Assertions
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(script.historicalData).toBeDefined();
    expect(script.historicalData.length).toBe(3);
    expect(script.historicalData[0].week).toBe(13);
    expect(script.historicalData[0].data).toHaveLength(2);
    expect(script.historicalData[2].week).toBe(15);
  });
});

describe('Historical Data Analysis', () => {
  beforeEach(() => {
    // Setup DOM
    setupDOM();
  });

  test('calculateHistoricalStats should compute statistics across weeks', () => {
    const script = require('../../../script.js');
    
    // Mock historical data
    script.historicalData = [
      {
        week: 13,
        data: [
          { PLAYER: 'Player1', TOTAL_SCORE: 1000, CHEST_COUNT: 100 },
          { PLAYER: 'Player2', TOTAL_SCORE: 2000, CHEST_COUNT: 200 }
        ]
      },
      {
        week: 14,
        data: [
          { PLAYER: 'Player1', TOTAL_SCORE: 1500, CHEST_COUNT: 150 },
          { PLAYER: 'Player2', TOTAL_SCORE: 2500, CHEST_COUNT: 250 },
          { PLAYER: 'Player3', TOTAL_SCORE: 3000, CHEST_COUNT: 300 }
        ]
      },
      {
        week: 15,
        data: [
          { PLAYER: 'Player1', TOTAL_SCORE: 2000, CHEST_COUNT: 200 },
          { PLAYER: 'Player2', TOTAL_SCORE: 3000, CHEST_COUNT: 300 }
        ]
      }
    ];
    
    // Call the function
    const stats = script.calculateHistoricalStats();
    
    // Assertions
    expect(stats).toBeDefined();
    expect(stats.weeklyStats).toHaveLength(3);
    expect(stats.weeklyStats[0].week).toBe(13);
    expect(stats.weeklyStats[0].totalPlayers).toBe(2);
    expect(stats.weeklyStats[0].totalScore).toBe(3000);
    expect(stats.weeklyStats[0].totalChests).toBe(300);
    expect(stats.weeklyStats[1].totalPlayers).toBe(3);
    
    // Check player tracking
    expect(stats.playerStats).toBeDefined();
    expect(Object.keys(stats.playerStats)).toHaveLength(3); // 3 unique players
    expect(stats.playerStats.Player1.weeks).toHaveLength(3); // Player1 appears in all 3 weeks
    expect(stats.playerStats.Player3.weeks).toHaveLength(1); // Player3 only appears in week 14
    
    // Check trend data
    expect(stats.trendData).toBeDefined();
    expect(stats.trendData.totalScore).toHaveLength(3);
    expect(stats.trendData.totalChests).toHaveLength(3);
  });

  test('renderWeeklyTotalsTable should create a table with weekly stats', () => {
    const script = require('../../../script.js');
    
    // Create a weekly stats object
    script.historicalStats = {
      weeklyStats: [
        { 
          week: 13, 
          startDate: '2023-03-27', 
          endDate: '2023-04-02', 
          totalPlayers: 2, 
          totalScore: 3000, 
          totalChests: 300,
          avgScore: 1500,
          avgChests: 150
        },
        { 
          week: 14, 
          startDate: '2023-04-03', 
          endDate: '2023-04-09', 
          totalPlayers: 3, 
          totalScore: 7000, 
          totalChests: 700,
          avgScore: 2333,
          avgChests: 233
        }
      ]
    };
    
    // Call the function
    script.renderWeeklyTotalsTable();
    
    // Get the updated DOM element
    const tableBody = document.getElementById('weekly-totals-body');
    
    // Assertions
    expect(tableBody.innerHTML).toBeTruthy();
    expect(tableBody.querySelectorAll('tr').length).toBe(2);
    expect(tableBody.querySelectorAll('td').length).toBe(14); // 7 columns * 2 rows
    
    // Check one of the values
    const firstRow = tableBody.querySelector('tr');
    expect(firstRow.textContent).toContain('13');
    expect(firstRow.textContent).toContain('3000');
    expect(firstRow.textContent).toContain('300');
  });
}); 