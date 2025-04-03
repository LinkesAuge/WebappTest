// Unit tests for data loader
import { loadStaticCsvData, loadScoreRulesData, saveDataToLocalStorage, loadDataFromLocalStorage, constants, setUtils } from '../../app/dataLoader.js';

// Mock the utility functions that dataLoader depends on
const mockUtils = {
  setStatus: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  getText: jest.fn().mockImplementation((key) => key), // Return the key as the text
  resetStateAndUI: jest.fn()
};

// Setup utility functions before tests
beforeAll(() => {
  setUtils(mockUtils);
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  
  // Reset the mock fetch implementation before each test
  global.fetch.mockReset();
});

describe('dataLoader constants', () => {
  test('CSV_FILE_PATH should be correctly defined', () => {
    expect(constants.CSV_FILE_PATH).toBe('../data/data.csv');
  });

  test('RULES_CSV_FILE_PATH should be correctly defined', () => {
    expect(constants.RULES_CSV_FILE_PATH).toBe('../data/rules.csv');
  });

  test('LOCALSTORAGE_DATA_KEY should be correctly defined', () => {
    expect(constants.LOCALSTORAGE_DATA_KEY).toBe('tbAnalyzerStoredData_Client_v2_Static');
  });
});

describe('loadDataFromLocalStorage', () => {
  test('returns null when localStorage is empty', () => {
    localStorage.getItem.mockReturnValueOnce(null);
    
    const result = loadDataFromLocalStorage();
    
    expect(result).toBeNull();
    expect(localStorage.getItem).toHaveBeenCalledWith(constants.LOCALSTORAGE_DATA_KEY);
  });
  
  test('returns parsed data when localStorage has data', () => {
    const mockData = {
      timestamp: 123456789,
      lastModified: 'some-date',
      dataCount: 42,
      headers: ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT']
    };
    
    localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockData));
    
    const result = loadDataFromLocalStorage();
    
    expect(result).toEqual(mockData);
    expect(localStorage.getItem).toHaveBeenCalledWith(constants.LOCALSTORAGE_DATA_KEY);
  });
  
  test('returns null and warns on JSON parse error', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.getItem.mockReturnValueOnce('invalid-json');
    
    const result = loadDataFromLocalStorage();
    
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith(constants.LOCALSTORAGE_DATA_KEY);
    
    consoleSpy.mockRestore();
  });
});

describe('saveDataToLocalStorage', () => {
  test('saves data to localStorage correctly', () => {
    const allPlayersData = [{ PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 10 }];
    const allColumnHeaders = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    const dataLastModifiedTimestamp = 'Thu, 01 Jan 2023 00:00:00 GMT';
    
    saveDataToLocalStorage(allPlayersData, allColumnHeaders, dataLastModifiedTimestamp);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      constants.LOCALSTORAGE_DATA_KEY,
      expect.any(String)
    );
    
    // Verify the JSON structure
    const savedJson = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedJson).toHaveProperty('timestamp');
    expect(savedJson).toHaveProperty('lastModified', dataLastModifiedTimestamp);
    expect(savedJson).toHaveProperty('dataCount', 1);
    expect(savedJson).toHaveProperty('headers', allColumnHeaders);
  });
  
  test('handles localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem.mockImplementationOnce(() => {
      throw new Error('Storage quota exceeded');
    });
    
    saveDataToLocalStorage([], [], null);
    
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});

describe('loadScoreRulesData', () => {
  test('returns true when scoreRulesData is already populated', async () => {
    const scoreRulesData = [{ Typ: 'Test', Level: 1, Punkte: 10 }];
    const mockSortData = jest.fn();
    const mockScoreRulesSortState = { column: 'Typ', direction: 'asc' };
    
    const result = await loadScoreRulesData(scoreRulesData, mockSortData, mockScoreRulesSortState);
    
    expect(result).toBe(true);
    expect(mockSortData).not.toHaveBeenCalled();
  });
  
  test('fetches and processes rules CSV data successfully', async () => {
    // Mock fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Typ,Level,Punkte\nGold,1,10\nSilver,2,5'
    });
    
    // Mock Papa.parse to return successful results
    global.Papa.parse.mockImplementationOnce((csv, options) => {
      options.complete({
        data: [
          { Typ: 'Gold', Level: '1', Punkte: '10' },
          { Typ: 'Silver', Level: '2', Punkte: '5' }
        ],
        errors: [],
        meta: { fields: ['Typ', 'Level', 'Punkte'] }
      });
    });
    
    const scoreRulesData = [];
    const mockSortData = jest.fn();
    const mockScoreRulesSortState = { column: 'Typ', direction: 'asc' };
    
    const result = await loadScoreRulesData(scoreRulesData, mockSortData, mockScoreRulesSortState);
    
    expect(result).toBe(true);
    expect(scoreRulesData).toHaveLength(2);
    expect(scoreRulesData[0]).toEqual({ Typ: 'Gold', Level: 1, Punkte: 10 });
    expect(scoreRulesData[1]).toEqual({ Typ: 'Silver', Level: 2, Punkte: 5 });
    expect(mockSortData).toHaveBeenCalledWith(
      mockScoreRulesSortState.column,
      mockScoreRulesSortState.direction,
      false,
      scoreRulesData
    );
  });
  
  test('handles fetch errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const scoreRulesData = [];
    const mockSortData = jest.fn();
    const mockScoreRulesSortState = { column: 'Typ', direction: 'asc' };
    
    const result = await loadScoreRulesData(scoreRulesData, mockSortData, mockScoreRulesSortState);
    
    expect(result).toBe(false);
    expect(mockUtils.setStatus).toHaveBeenCalledWith(
      'status.genericLoadError',
      'error',
      5000
    );
    expect(scoreRulesData).toHaveLength(0);
  });
  
  test('handles CSV parsing errors gracefully', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => 'Invalid CSV'
    });
    
    global.Papa.parse.mockImplementationOnce((csv, options) => {
      options.error(new Error('Parse error'));
    });
    
    const scoreRulesData = [];
    const mockSortData = jest.fn();
    const mockScoreRulesSortState = { column: 'Typ', direction: 'asc' };
    
    const result = await loadScoreRulesData(scoreRulesData, mockSortData, mockScoreRulesSortState);
    
    expect(result).toBe(false);
    expect(mockUtils.setStatus).toHaveBeenCalledWith(
      'status.parseError',
      'error',
      5000
    );
    expect(scoreRulesData).toHaveLength(0);
  });
});

// Additional tests for loadStaticCsvData would be similar but more extensive
// We've skipped them here for brevity
