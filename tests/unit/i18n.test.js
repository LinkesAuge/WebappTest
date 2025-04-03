// Unit tests for i18n module
import { 
  constants,
  setRenderFunctions, 
  initLanguage, 
  setLanguage, 
  getLanguagePreference, 
  getText, 
  updateUIText, 
  updateLanguageSwitcherUI,
  getCurrentLanguage
} from '../../app/i18n.js';

// Get constants from the import
const { DEFAULT_LANGUAGE, LANG_STORAGE_KEY, TEXT_CONTENT } = constants;

// Set up test DOM elements
beforeAll(() => {
  // Set default language
  document.documentElement.lang = 'de';
  
  // Create language buttons
  const langDeButton = document.createElement('button');
  langDeButton.id = 'lang-de';
  document.body.appendChild(langDeButton);

  const langEnButton = document.createElement('button');
  langEnButton.id = 'lang-en';
  document.body.appendChild(langEnButton);
  
  // Set up elements for updateUIText
  const element1 = document.createElement('div');
  element1.setAttribute('data-i18n-key', 'appTitle');
  document.body.appendChild(element1);
  
  const element2 = document.createElement('div');
  element2.setAttribute('data-i18n-key', 'status.loading');
  document.body.appendChild(element2);
  
  // Create DOM elements needed for status updates
  const statusMessage = document.createElement('div');
  statusMessage.id = 'status-message';
  document.body.appendChild(statusMessage);
  
  const breadcrumbNav = document.createElement('div');
  breadcrumbNav.id = 'breadcrumb-nav';
  document.body.appendChild(breadcrumbNav);
  
  const breadcrumbCurrentPageName = document.createElement('div');
  breadcrumbCurrentPageName.id = 'breadcrumb-current-page-name';
  breadcrumbNav.appendChild(breadcrumbCurrentPageName);
  
  const lastUpdatedInfo = document.createElement('div');
  lastUpdatedInfo.id = 'last-updated-info';
  document.body.appendChild(lastUpdatedInfo);
});

// Mock render functions
const mockRenderFunctions = {
  updateSortIcons: jest.fn(),
  displayLastUpdatedTimestamp: jest.fn(),
  renderDashboard: jest.fn(),
  renderDetailedTable: jest.fn(),
  renderChartsView: jest.fn(),
  renderCategoryAnalysis: jest.fn(),
  renderCategoryChart: jest.fn(),
  renderPlayerDetail: jest.fn(),
  renderPlayerChart: jest.fn(),
  renderScoreRulesTable: jest.fn()
};

// Mock app state
const mockAppState = {
  allPlayersData: [],
  sortState: { column: 'TOTAL_SCORE', direction: 'desc' },
  detailedTableSortState: { column: 'PLAYER', direction: 'asc' },
  scoreRulesSortState: { column: 'Typ', direction: 'asc' },
  currentView: 'dashboard',
  currentPlayerData: null,
  categorySelect: null,
  scoreRulesData: [],
  playerRankDetail: { textContent: '1' }
};

// Set up our render functions before tests
beforeAll(() => {
  setRenderFunctions(mockRenderFunctions);
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.getItem.mockClear();
  localStorage.setItem.mockClear();
  
  // Reset language to default for each test
  document.documentElement.lang = DEFAULT_LANGUAGE;
  document.title = '';
});

describe('i18n constants', () => {
  test('DEFAULT_LANGUAGE should be correctly defined', () => {
    expect(DEFAULT_LANGUAGE).toBe('de');
  });

  test('LANG_STORAGE_KEY should be correctly defined', () => {
    expect(LANG_STORAGE_KEY).toBe('tbAnalyzerLanguage');
  });
  
  test('TEXT_CONTENT should contain both languages', () => {
    expect(TEXT_CONTENT).toHaveProperty('de');
    expect(TEXT_CONTENT).toHaveProperty('en');
  });
  
  test('TEXT_CONTENT should have appTitle in both languages', () => {
    expect(TEXT_CONTENT.de).toHaveProperty('appTitle');
    expect(TEXT_CONTENT.en).toHaveProperty('appTitle');
  });
});

describe('getLanguagePreference', () => {
  test('returns saved language preference when available', () => {
    localStorage.getItem.mockReturnValueOnce('en');
    
    const result = getLanguagePreference();
    
    expect(result).toBe('en');
    expect(localStorage.getItem).toHaveBeenCalledWith(LANG_STORAGE_KEY);
  });
  
  test('returns default language when no preference saved', () => {
    localStorage.getItem.mockReturnValueOnce(null);
    
    const result = getLanguagePreference();
    
    expect(result).toBe(DEFAULT_LANGUAGE);
    expect(localStorage.getItem).toHaveBeenCalledWith(LANG_STORAGE_KEY);
  });
});

describe('getText', () => {
  test('returns correct text for existing key', () => {
    const result = getText('appTitle');
    
    expect(result).toBe(TEXT_CONTENT.de['appTitle']);
  });
  
  test('handles replacements in text content', () => {
    // Create a test with a placeholder
    const testKey = 'status.loadingData';
    const testReplacements = { 0: 'test.csv' };
    
    const result = getText(testKey, testReplacements);
    
    // Should replace {0} with 'test.csv'
    expect(result).toContain('test.csv');
  });
  
  test('falls back to default language when key not in requested language', () => {
    // Temporarily change the current language to test fallback
    const originalLanguage = getCurrentLanguage();
    setLanguage('en', true, mockAppState);
    
    // Create a non-existent key for testing
    const nonExistentKey = 'non.existent.key';
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const result = getText(nonExistentKey);
    
    expect(consoleSpy).toHaveBeenCalled();
    expect(result).toBe(`[${nonExistentKey}]`);
    
    // Restore original language
    setLanguage(originalLanguage, true, mockAppState);
    consoleSpy.mockRestore();
  });
});

describe('setLanguage', () => {
  test('saves language preference to localStorage', () => {
    setLanguage('en', true, mockAppState);
    
    expect(localStorage.setItem).toHaveBeenCalledWith(LANG_STORAGE_KEY, 'en');
    expect(document.documentElement.lang).toBe('en');
  });
  
  test('does nothing when app is not initialized', () => {
    const initialLang = getCurrentLanguage();
    setLanguage('en', false, mockAppState);
    
    expect(getCurrentLanguage()).toBe(initialLang); // Should not change
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });
  
  test('updates UI and re-renders components when data is loaded', () => {
    // Mock app state with data
    const appStateWithData = {
      ...mockAppState,
      allPlayersData: [{ PLAYER: 'Test', TOTAL_SCORE: 100 }]
    };
    
    // Override the render functions to successfully execute
    const displayLastUpdatedMock = jest.fn();
    const renderDashboardMock = jest.fn();
    
    // Create new mock functions specifically for this test
    const testMockRenderFunctions = {
      ...mockRenderFunctions,
      displayLastUpdatedTimestamp: displayLastUpdatedMock,
      renderDashboard: renderDashboardMock
    };
    
    // Set the new render functions
    setRenderFunctions(testMockRenderFunctions);
    
    // Now call setLanguage
    setLanguage('en', true, appStateWithData);
    
    // Check that our specific mock functions were called
    expect(displayLastUpdatedMock).toHaveBeenCalled();
    expect(renderDashboardMock).toHaveBeenCalled();
    
    // Reset to original mock functions for other tests
    setRenderFunctions(mockRenderFunctions);
  });
});

describe('updateUIText', () => {
  test('updates text content for elements with data-i18n-key', () => {
    // Clear any previous calls
    mockRenderFunctions.updateSortIcons.mockClear();
    
    // Ensure we're using German language
    setLanguage('de', true, mockAppState);
    document.title = ''; // Reset title
    
    updateUIText(
      mockAppState.sortState,
      mockAppState.detailedTableSortState,
      mockAppState.scoreRulesSortState,
      mockAppState.currentView,
      mockAppState.currentPlayerData,
      mockAppState.categorySelect
    );
    
    // Check document title is updated with the German title
    expect(document.title).toBe(TEXT_CONTENT.de.appTitle);
    
    // Check updateSortIcons is called exactly 3 times (once for each table)
    const callCount = mockRenderFunctions.updateSortIcons.mock.calls.length;
    expect(callCount).toBe(3);
  });
});

describe('initLanguage', () => {
  test('initializes language from user preference', () => {
    localStorage.getItem.mockReturnValueOnce('en');
    
    const result = initLanguage();
    
    expect(result).toBe('en');
    expect(localStorage.getItem).toHaveBeenCalledWith(LANG_STORAGE_KEY);
  });
});

describe('updateLanguageSwitcherUI', () => {
  test('updates language switcher UI correctly', () => {
    // Get references to the language buttons
    const langDeButton = document.getElementById('lang-de');
    const langEnButton = document.getElementById('lang-en');
    
    // Reset button classes
    langDeButton.className = '';
    langEnButton.className = '';
    
    // Set language to German
    setLanguage('de', true, mockAppState);
    updateLanguageSwitcherUI();
    
    expect(langDeButton.classList.contains('active')).toBe(true);
    expect(langEnButton.classList.contains('active')).toBe(false);
    
    // Set language to English
    setLanguage('en', true, mockAppState);
    updateLanguageSwitcherUI();
    
    expect(langDeButton.classList.contains('active')).toBe(false);
    expect(langEnButton.classList.contains('active')).toBe(true);
  });
});
