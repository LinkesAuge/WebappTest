/**
 * state.test.js
 * Unit tests for state.js module
 */

// Mocking browser environment for localStorage
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  },
  clear() {
    this.data = {};
  }
};

// Mock console to track output
global.console = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Import the module to test (with mocking)
jest.mock('../../../js/config.js', () => ({
  LOCALSTORAGE_DATA_KEY: 'test_app_data'
}));

// Import the state module - use dynamic import for ES modules
let stateModule;

describe('State Module', () => {
  beforeAll(async () => {
    // Import the module dynamically
    stateModule = await import('../../../js/state.js');
  });

  beforeEach(() => {
    // Reset state before each test
    stateModule.resetState();
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('setState updates a valid property', () => {
    // Arrange
    const testData = [{ player: 'Test Player', score: 100 }];
    
    // Act
    const result = stateModule.setState('allPlayersData', testData);
    
    // Assert
    expect(result).toBe(true);
    expect(stateModule.allPlayersData).toEqual(testData);
    expect(console.log).toHaveBeenCalledWith('State property "allPlayersData" updated');
  });

  test('setState rejects an invalid property', () => {
    // Act
    const result = stateModule.setState('invalidProperty', 'test');
    
    // Assert
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Property "invalidProperty" does not exist in state module');
  });

  test('setState rejects a non-string property name', () => {
    // Act
    const result = stateModule.setState({}, 'test');
    
    // Assert
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Property name must be a string');
  });

  test('saveDataToLocalStorage stores data correctly', () => {
    // Arrange
    stateModule.setState('allPlayersData', [{ player: 'Test Player', score: 100 }]);
    stateModule.setState('scoreRules', [{ rule: 'Rule 1', points: 10 }]);
    
    // Act
    stateModule.saveDataToLocalStorage();
    
    // Assert
    const storedData = JSON.parse(localStorage.getItem('test_app_data'));
    expect(storedData.allPlayersData).toEqual([{ player: 'Test Player', score: 100 }]);
    expect(storedData.scoreRules).toEqual([{ rule: 'Rule 1', points: 10 }]);
  });

  test('loadDataFromLocalStorage loads data correctly', () => {
    // Arrange
    const testData = {
      allPlayersData: [{ player: 'Test Player', score: 100 }],
      scoreRules: [{ rule: 'Rule 1', points: 10 }],
      dateUpdated: new Date().toISOString()
    };
    localStorage.setItem('test_app_data', JSON.stringify(testData));
    
    // Act
    const result = stateModule.loadDataFromLocalStorage();
    
    // Assert
    expect(result).toBe(true);
    expect(stateModule.allPlayersData).toEqual(testData.allPlayersData);
    expect(stateModule.scoreRules).toEqual(testData.scoreRules);
  });
}); 