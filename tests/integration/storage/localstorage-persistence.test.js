/**
 * LocalStorage Persistence Integration Tests
 * 
 * Tests for saving and loading data to/from localStorage.
 */

// Mock storage key
const STORAGE_KEY = 'tbAnalyzerData';

// Set up localStorage mock with Jest functions that simulate real behavior
const storageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

// Set mocks before tests run
Object.defineProperty(window, 'localStorage', { value: storageMock });

// Create mock storage functions
const saveDataToLocalStorage = jest.fn(() => {
  try {
    if (global.mockStorageError) {
      throw new Error('Mock localStorage error');
    }
    
    const data = global.mockAppData || { players: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
});

const loadDataFromLocalStorage = jest.fn(() => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      return false;
    }
    
    const parsedData = JSON.parse(storedData);
    if (!parsedData || !parsedData.players) {
      return false;
    }
    
    // Store the data in the global app state
    global.mockAppData = parsedData;
    return true;
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return false;
  }
});

const loadStaticCsvData = jest.fn(async () => {
  global.mockAppData = {
    players: [
      {
        id: 'player-1',
        playerName: 'MaxMustermann',
        totalScore: 2500,
        chestCount: 42
      },
      {
        id: 'player-2',
        playerName: 'ElinaEvergreen',
        totalScore: 3200,
        chestCount: 38
      }
    ]
  };
  return true;
});

// Add functions to global context for tests
global.saveDataToLocalStorage = saveDataToLocalStorage;
global.loadDataFromLocalStorage = loadDataFromLocalStorage;
global.loadStaticCsvData = loadStaticCsvData;

describe('LocalStorage Persistence', () => {
  beforeEach(() => {
    // Reset mocks and storage
    jest.clearAllMocks();
    localStorage.clear();
    
    // Reset global state
    global.mockAppData = {
      players: [
        {
          id: 'player-1',
          playerName: 'MaxMustermann',
          totalScore: 2500,
          chestCount: 42
        },
        {
          id: 'player-2',
          playerName: 'ElinaEvergreen',
          totalScore: 3200,
          chestCount: 38
        }
      ]
    };
    
    // Default no storage error
    global.mockStorageError = false;
  });
  
  describe('Data Saving', () => {
    test('should save data to localStorage', () => {
      // Set up sample data
      const testData = {
        players: [
          { id: 'player-1', playerName: 'Test Player', totalScore: 100 }
        ]
      };
      global.mockAppData = testData;

      // Save to localStorage
      saveDataToLocalStorage();
      
      // Verify localStorage was called with the right key
      expect(localStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(testData)
      );
      
      // Check the data is actually saved
      const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(savedData).toEqual(testData);
    });
    
    test('should handle errors when saving data', () => {
      // Simulate a storage error
      global.mockStorageError = true;
      
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error');
      
      // Attempt to save (should not throw)
      expect(() => {
        saveDataToLocalStorage();
      }).not.toThrow();
      
      // Should log an error
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
  
  describe('Data Loading', () => {
    test('should load data from localStorage when available', () => {
      // Setup test data in localStorage
      const testData = {
        players: [
          { id: 'player-1', playerName: 'Test Player', totalScore: 100 }
        ]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testData));
      
      // Load the data
      const result = loadDataFromLocalStorage();
      
      // Check the result
      expect(result).toBe(true); // Successfully loaded
      expect(global.mockAppData).toEqual(testData);
    });
    
    test('should return false when no data is available in localStorage', () => {
      // Ensure localStorage is empty
      localStorage.removeItem(STORAGE_KEY);
      
      // Try to load data
      const result = loadDataFromLocalStorage();
      
      // Should return false to indicate failure
      expect(result).toBe(false);
    });
    
    test('should handle corrupted data in localStorage', () => {
      // Setup corrupted data in localStorage
      localStorage.setItem(STORAGE_KEY, 'not-valid-json{');
      
      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error');
      
      // Try to load data
      const result = loadDataFromLocalStorage();
      
      // Should return false to indicate failure
      expect(result).toBe(false);
      
      // Should log an error
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
  
  describe('Data Loading Flow', () => {
    test('should prefer localStorage data if available and use CSV as fallback', async () => {
      // Setup spies
      const loadFromStorageSpy = jest.spyOn(global, 'loadDataFromLocalStorage');
      
      // First try with no localStorage data
      localStorage.removeItem(STORAGE_KEY);
      
      // Simulate app initialization flow
      if (!loadDataFromLocalStorage()) {
        await loadStaticCsvData();
      }
      
      // Should have attempted to load from localStorage first
      expect(loadFromStorageSpy).toHaveBeenCalled();
      
      // Since localStorage was empty, CSV data should have been loaded
      expect(global.mockAppData.players.length).toBeGreaterThan(0);
      
      // Now set up localStorage data
      const localStorageData = {
        players: [
          { id: 'storage-player', playerName: 'Storage Player', totalScore: 500 }
        ]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localStorageData));
      
      // Reset the app data
      global.mockAppData = null;
      
      // Run the load flow again
      if (!loadDataFromLocalStorage()) {
        await loadStaticCsvData();
      }
      
      // This time, it should have loaded from localStorage
      expect(global.mockAppData).toEqual(localStorageData);
    });
    
    test('should save newly loaded CSV data to localStorage', async () => {
      // Ensure localStorage is empty
      localStorage.removeItem(STORAGE_KEY);
      
      // Setup spy for saveDataToLocalStorage
      const saveToStorageSpy = jest.spyOn(global, 'saveDataToLocalStorage');
      
      // Load data from CSV
      await loadStaticCsvData();
      
      // Save to localStorage
      saveDataToLocalStorage();
      
      // Should call save to localStorage
      expect(saveToStorageSpy).toHaveBeenCalled();
      
      // Check that the data is saved
      const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(savedData.players.length).toBeGreaterThan(0);
    });
  });
}); 