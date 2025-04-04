// Unit tests for utils
import { 
  constants,
  setI18n,
  setStatus,
  showLoading,
  hideLoading,
  sortData,
  updateSortIcons,
  getCssVariableValue,
  formatNumber,
  triggerDownload
} from '../../app/utils.js';

// Get constants from the import
const { NUMERIC_FORMATTER, CORE_COLUMNS } = constants;

// Mock DOM elements
const mockStatusElement = document.createElement('div');
const mockLoadingSpinner = document.createElement('div');

const mockElements = {
  statusElement: mockStatusElement,
  loadingSpinner: mockLoadingSpinner,
  tableHeader: {
    playerList: document.createElement('div'),
    scoreRules: document.createElement('div')
  }
};

// Mock DOM methods
const mockDom = {
  elements: mockElements
};

// Mock getText function for i18n
const mockGetText = jest.fn().mockImplementation((key, replacements = {}) => {
  return `Translated: ${key}`;
});

// Setup before all tests
beforeAll(() => {
  // Set i18n function reference
  setI18n(mockGetText);
  
  // Create a mock URL.createObjectURL
  URL.createObjectURL = jest.fn().mockReturnValue('blob://mock-url');
  URL.revokeObjectURL = jest.fn();
  
  // Mock Blob creation
  global.Blob = jest.fn().mockImplementation((content, options) => {
    return { content, options };
  });
  
  // Setup document.documentElement.style object
  document.documentElement.style = {
    getPropertyValue: jest.fn().mockImplementation((prop) => {
      if (prop === '--chart-color-1') return '#ff0000';
      if (prop === '--chart-color-2') return '#00ff00';
      return null;
    })
  };
  
  // Setup createObjectURL method on URL
  global.URL.createObjectURL = jest.fn().mockImplementation(() => 'blob:test-url');
  
  // Setup document.createElement for anchor creation in triggerDownload
  const originalCreateElement = document.createElement;
  document.createElement = jest.fn().mockImplementation((tagName) => {
    if (tagName === 'a') {
      const anchor = {
        href: '',
        download: '',
        style: { display: 'none' },
        click: jest.fn(),
        remove: jest.fn()
      };
      return anchor;
    }
    return originalCreateElement(tagName);
  });
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockGetText.mockClear();
  
  // Reset element properties
  mockStatusElement.className = '';
  mockStatusElement.textContent = '';
  mockStatusElement.style.display = 'none';
  
  mockLoadingSpinner.style.display = 'none';
});

describe('constants', () => {
  test('CORE_COLUMNS contains expected column names', () => {
    expect(CORE_COLUMNS).toEqual(["PLAYER", "TOTAL_SCORE", "CHEST_COUNT"]);
  });
  
  test('NUMERIC_FORMATTER is an Intl.NumberFormat', () => {
    expect(NUMERIC_FORMATTER).toBeInstanceOf(Intl.NumberFormat);
  });
});

describe('setStatus', () => {
  test('sets status message with info type by default', () => {
    // Create necessary DOM elements
    const statusArea = document.createElement('div');
    statusArea.id = 'status-area';
    document.body.appendChild(statusArea);
    
    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusArea.appendChild(statusMessage);
    
    setStatus('test.message');
    
    expect(statusMessage.textContent).toBe('test.message');
    expect(statusArea.classList.contains('text-blue-500')).toBe(true);
    
    // Clean up
    document.body.removeChild(statusArea);
  });
  
  test('sets status message with error type', () => {
    // Create necessary DOM elements
    const statusArea = document.createElement('div');
    statusArea.id = 'status-area';
    document.body.appendChild(statusArea);
    
    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusArea.appendChild(statusMessage);
    
    setStatus('test.error', 'error');
    
    expect(statusMessage.textContent).toBe('test.error');
    expect(statusArea.classList.contains('text-red-500')).toBe(true);
    
    // Clean up
    document.body.removeChild(statusArea);
  });
  
  test('sets status message with success type', () => {
    // Create necessary DOM elements
    const statusArea = document.createElement('div');
    statusArea.id = 'status-area';
    document.body.appendChild(statusArea);
    
    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusArea.appendChild(statusMessage);
    
    setStatus('test.success', 'success');
    
    expect(statusMessage.textContent).toBe('test.success');
    expect(statusArea.classList.contains('text-green-500')).toBe(true);
    
    // Clean up
    document.body.removeChild(statusArea);
  });
  
  test('clears status after duration', () => {
    jest.useFakeTimers();
    
    // Create necessary DOM elements
    const statusArea = document.createElement('div');
    statusArea.id = 'status-area';
    document.body.appendChild(statusArea);
    
    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    statusArea.appendChild(statusMessage);
    
    setStatus('test.message', 'info', 1000);
    
    expect(statusMessage.textContent).toBe('test.message');
    
    // Fast-forward time
    jest.advanceTimersByTime(1100);
    
    expect(statusMessage.textContent).toBe('');
    
    // Clean up
    document.body.removeChild(statusArea);
    jest.useRealTimers();
  });
});

describe('showLoading and hideLoading', () => {
  test('showLoading shows the spinner and sets message', () => {
    // Create necessary DOM elements
    const loadingSpinner = document.createElement('div');
    loadingSpinner.id = 'loading-spinner';
    loadingSpinner.classList.add('hidden');
    document.body.appendChild(loadingSpinner);
    
    const statusMessage = document.createElement('div');
    statusMessage.id = 'status-message';
    document.body.appendChild(statusMessage);
    
    showLoading('Loading data...');
    
    expect(loadingSpinner.classList.contains('hidden')).toBe(false);
    expect(statusMessage.textContent).toBe('Loading data...');
    
    // Clean up
    document.body.removeChild(loadingSpinner);
    document.body.removeChild(statusMessage);
  });
  
  test('hideLoading hides the spinner', () => {
    // Create necessary DOM elements
    const loadingSpinner = document.createElement('div');
    loadingSpinner.id = 'loading-spinner';
    document.body.appendChild(loadingSpinner);
    
    hideLoading();
    
    expect(loadingSpinner.classList.contains('hidden')).toBe(true);
    
    // Clean up
    document.body.removeChild(loadingSpinner);
  });
});

describe('sortData', () => {
  const testData = [
    { PLAYER: 'Charlie', TOTAL_SCORE: 100, CHEST_COUNT: 5 },
    { PLAYER: 'Alice', TOTAL_SCORE: 300, CHEST_COUNT: 15 },
    { PLAYER: 'Bob', TOTAL_SCORE: 200, CHEST_COUNT: 10 }
  ];
  
  const scoreRulesData = [
    { Typ: 'Gold', Level: 2, Punkte: 20 },
    { Typ: 'Silver', Level: 1, Punkte: 10 },
    { Typ: 'Bronze', Level: 3, Punkte: 5 }
  ];
  
  test('sorts string data in ascending order', () => {
    const result = sortData('PLAYER', 'asc', false, [...testData]);
    
    expect(result[0].PLAYER).toBe('Alice');
    expect(result[1].PLAYER).toBe('Bob');
    expect(result[2].PLAYER).toBe('Charlie');
  });
  
  test('sorts string data in descending order', () => {
    const result = sortData('PLAYER', 'desc', false, [...testData]);
    
    expect(result[0].PLAYER).toBe('Charlie');
    expect(result[1].PLAYER).toBe('Bob');
    expect(result[2].PLAYER).toBe('Alice');
  });
  
  test('sorts numeric data in ascending order', () => {
    const result = sortData('TOTAL_SCORE', 'asc', false, [...testData]);
    
    expect(result[0].TOTAL_SCORE).toBe(100);
    expect(result[1].TOTAL_SCORE).toBe(200);
    expect(result[2].TOTAL_SCORE).toBe(300);
  });
  
  test('sorts numeric data in descending order', () => {
    const result = sortData('TOTAL_SCORE', 'desc', false, [...testData]);
    
    expect(result[0].TOTAL_SCORE).toBe(300);
    expect(result[1].TOTAL_SCORE).toBe(200);
    expect(result[2].TOTAL_SCORE).toBe(100);
  });
  
  test('sorts score rules by type correctly', () => {
    const result = sortData('Typ', 'asc', false, [...scoreRulesData]);
    
    expect(result[0].Typ).toBe('Bronze');
    expect(result[1].Typ).toBe('Gold');
    expect(result[2].Typ).toBe('Silver');
  });
  
  test('updates sort state reference when updateState is true', () => {
    const sortState = { column: '', direction: '' };
    sortData('TOTAL_SCORE', 'desc', true, [...testData], sortState);
    
    expect(sortState.column).toBe('TOTAL_SCORE');
    expect(sortState.direction).toBe('desc');
  });
  
  test('handles empty data array gracefully', () => {
    const result = sortData('PLAYER', 'asc', false, []);
    
    expect(result).toEqual([]);
  });
});

describe('updateSortIcons', () => {
  test('updates sort icons based on active column and direction', () => {
    // Create table headers with sort icons
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th data-column="PLAYER">Player <span class="sort-icon"></span></th>
          <th data-column="TOTAL_SCORE">Total Score <span class="sort-icon"></span></th>
        </tr>
      </thead>
    `;
    document.body.appendChild(table);
    
    // Update icons for PLAYER column, ascending
    updateSortIcons('PLAYER', 'asc', 'th[data-column]');
    
    const playerIcon = table.querySelector('th[data-column="PLAYER"] .sort-icon');
    const scoreIcon = table.querySelector('th[data-column="TOTAL_SCORE"] .sort-icon');
    
    expect(playerIcon.textContent).toBe('▲');
    expect(playerIcon.classList.contains('text-primary')).toBe(true);
    expect(scoreIcon.textContent).toBe('');
    expect(scoreIcon.classList.contains('text-primary')).toBe(false);
    
    // Clean up
    document.body.removeChild(table);
  });
});

describe('getCssVariableValue', () => {
  test('returns CSS variable value with fallback', () => {
    // Mock getPropertyValue to return test values
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = jest.fn().mockReturnValue({
      getPropertyValue: jest.fn().mockImplementation((varName) => {
        if (varName === '--test-var') return ' #123456 ';
        return '';
      })
    });
    
    expect(getCssVariableValue('test-var')).toBe('#123456');
    expect(getCssVariableValue('non-existent', '#default')).toBe('#default');
    
    // Restore original
    window.getComputedStyle = originalGetComputedStyle;
  });
});

describe('formatNumber', () => {
  test('formats number with German thousands separators', () => {
    expect(formatNumber(1000)).toBe('1.000');
    expect(formatNumber(1234567)).toBe('1.234.567');
  });
  
  test('rounds to integers by default', () => {
    expect(formatNumber(1234.56)).toBe('1.235');
    expect(formatNumber(1234.34)).toBe('1.234');
  });
  
  test('formats with exact decimal places specified', () => {
    expect(formatNumber(1234.567, 1)).toBe('1.234,6');
    expect(formatNumber(1234.5, 2)).toBe('1.234,50');
  });
});

describe('triggerDownload', () => {
  test('creates a blob and triggers download', () => {
    // Mock DOM elements and methods
    const mockAnchor = {
      href: '',
      download: '',
      style: { display: '' },
      click: jest.fn(),
    };
    document.createElement = jest.fn().mockReturnValue(mockAnchor);
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    
    // Execute function
    triggerDownload('test content', 'test.txt', 'text/plain');
    
    // Verify blob created with correct content
    expect(global.Blob).toHaveBeenCalledWith(['test content'], { type: 'text/plain' });
    
    // Verify URL created
    expect(URL.createObjectURL).toHaveBeenCalled();
    
    // Verify anchor properties
    expect(mockAnchor.download).toBe('test.txt');
    expect(mockAnchor.style.display).toBe('none');
    
    // Verify anchor clicked
    expect(mockAnchor.click).toHaveBeenCalled();
    
    // Fast-forward to verify cleanup
    jest.useFakeTimers();
    jest.advanceTimersByTime(200);
    
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
    expect(URL.revokeObjectURL).toHaveBeenCalled();
    
    jest.useRealTimers();
  });
});
