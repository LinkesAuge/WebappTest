/**
 * language-switching.test.js
 * 
 * Integration tests for language switching functionality in the ChefScore Analytics Dashboard
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the DOMContentLoaded event
global.document.dispatchEvent(new Event('DOMContentLoaded'));

// Import functionality from main script
const { 
  setLanguage, 
  getLanguagePreference,
  updateUIText,
  setupEventListeners
} = require('../../../script.js');

describe('Language Switching Integration', () => {
  beforeEach(() => {
    // Setup mock DOM structure with UI elements and language switchers
    document.body.innerHTML = `
      <div id="app">
        <header>
          <div id="app-title">App Title</div>
          <div id="language-switcher">
            <button id="lang-switch-de" class="lang-button">DE</button>
            <button id="lang-switch-en" class="lang-button">EN</button>
          </div>
        </header>
        <div id="dashboard" class="view active-view">
          <h2 id="stats-title">Stats Title</h2>
          <h2 id="ranking-title">Ranking Title</h2>
          <div id="filter-container">
            <input id="player-filter" type="text" placeholder="Filter placeholder...">
          </div>
          <div id="chart-sections">
            <div class="chart-container">
              <h3 id="top-sources-title">Top Sources Title</h3>
            </div>
            <div class="chart-container">
              <h3 id="score-dist-title">Score Distribution Title</h3>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Reset mocks and state
    jest.clearAllMocks();
    localStorage.clear();
    
    // Setup event listeners
    setupEventListeners();
  });

  describe('Language Selection UI', () => {
    test('should update language switcher buttons when language changes', () => {
      // Set language to German
      setLanguage('de');
      
      // German button should be active
      expect(document.getElementById('lang-switch-de').classList.contains('active')).toBe(true);
      expect(document.getElementById('lang-switch-en').classList.contains('active')).toBe(false);
      
      // Change to English
      setLanguage('en');
      
      // English button should be active
      expect(document.getElementById('lang-switch-de').classList.contains('active')).toBe(false);
      expect(document.getElementById('lang-switch-en').classList.contains('active')).toBe(true);
    });
    
    test('should trigger language change when clicking language buttons', () => {
      // Set initial language to German
      setLanguage('de');
      
      // Setup spy for setLanguage
      const setLanguageSpy = jest.spyOn(global, 'setLanguage');
      
      // Click English button
      document.getElementById('lang-switch-en').click();
      
      // setLanguage should be called with 'en'
      expect(setLanguageSpy).toHaveBeenCalledWith('en');
      
      // English button should now be active
      expect(document.getElementById('lang-switch-en').classList.contains('active')).toBe(true);
    });
  });

  describe('UI Text Updates', () => {
    test('should update all UI elements when language changes', () => {
      // Set language to German and update UI
      setLanguage('de');
      updateUIText();
      
      // Check that dashboard elements have German text
      expect(document.getElementById('app-title').textContent).toBe('Truhenauswertung');
      expect(document.getElementById('stats-title').textContent).toBe('Gesamtstatistik');
      expect(document.getElementById('ranking-title').textContent).toBe('Gesamtrangliste');
      expect(document.getElementById('player-filter').placeholder).toBe('Spieler filtern...');
      expect(document.getElementById('top-sources-title').textContent).toBe('Top Quellen (Punkte)');
      expect(document.getElementById('score-dist-title').textContent).toBe('Punkteverteilung');
      
      // Change to English and update UI
      setLanguage('en');
      updateUIText();
      
      // Elements should now have English text
      expect(document.getElementById('app-title').textContent).toBe('Chest Analysis');
      expect(document.getElementById('stats-title').textContent).toBe('Overall Statistics');
      expect(document.getElementById('ranking-title').textContent).toBe('Overall Ranking');
      expect(document.getElementById('player-filter').placeholder).toBe('Filter by Player Name...');
      expect(document.getElementById('top-sources-title').textContent).toBe('Top Sources by Score');
      expect(document.getElementById('score-dist-title').textContent).toBe('Score Distribution');
    });
  });

  describe('Language Persistence', () => {
    test('should save language preference to localStorage', () => {
      // Set language to English
      setLanguage('en');
      
      // LocalStorage should have the preference saved
      expect(localStorage.setItem).toHaveBeenCalledWith('tbAnalyzerLanguage', 'en');
      
      // Set language to German
      setLanguage('de');
      
      // LocalStorage should have the updated preference
      expect(localStorage.setItem).toHaveBeenCalledWith('tbAnalyzerLanguage', 'de');
    });
    
    test('should load language preference from localStorage on initialization', () => {
      // Set a preference in localStorage
      localStorage.setItem('tbAnalyzerLanguage', 'en');
      
      // Get the language preference
      const language = getLanguagePreference();
      
      // Should retrieve 'en' from localStorage
      expect(language).toBe('en');
      expect(localStorage.getItem).toHaveBeenCalledWith('tbAnalyzerLanguage');
    });
    
    test('should use default language when no preference is stored', () => {
      // Clear any existing preference
      localStorage.removeItem('tbAnalyzerLanguage');
      
      // Get the language preference
      const language = getLanguagePreference();
      
      // Should return the default language (German/de)
      expect(language).toBe('de');
      expect(localStorage.getItem).toHaveBeenCalledWith('tbAnalyzerLanguage');
    });
  });

  describe('Full Language Switching Flow', () => {
    test('should perform complete language switch when user clicks language button', () => {
      // Set initial language to German
      setLanguage('de');
      updateUIText();
      
      // Verify German text is showing
      expect(document.getElementById('app-title').textContent).toBe('Truhenauswertung');
      
      // Click English button to switch language
      document.getElementById('lang-switch-en').click();
      
      // Verify language is saved in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('tbAnalyzerLanguage', 'en');
      
      // Verify UI is updated with English text
      expect(document.getElementById('app-title').textContent).toBe('Chest Analysis');
      expect(document.getElementById('stats-title').textContent).toBe('Overall Statistics');
      
      // Reload the page (simulate by calling initialization again)
      localStorage.clear();
      localStorage.setItem('tbAnalyzerLanguage', 'en');
      getLanguagePreference();
      updateUIText();
      
      // Verify English text is still showing after reload
      expect(document.getElementById('app-title').textContent).toBe('Chest Analysis');
    });
  });
}); 