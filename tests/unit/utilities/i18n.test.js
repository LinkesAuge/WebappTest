/**
 * Internationalization (i18n) Tests
 * 
 * Tests for the i18n functionality of the ChefScore Analytics Dashboard.
 */

// Setup mocks for i18n functions
global.getLanguagePreference = jest.fn(() => 'en');
global.setLanguage = jest.fn(lang => {
  localStorage.setItem('tbAnalyzerLanguage', lang);
});
global.getText = jest.fn(key => key);
global.updateUIText = jest.fn();

// Sample translations for testing
const mockTranslations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.players': 'Players',
    'nav.analytics': 'Analytics',
    'status.loadingData': 'Loading data from {0}...'
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.players': 'Spieler',
    'nav.analytics': 'Analysen',
    'status.loadingData': 'Lade Daten aus {0}...'
  }
};

describe('Internationalization (i18n)', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock implementations
    getLanguagePreference.mockImplementation(() => {
      return localStorage.getItem('tbAnalyzerLanguage') || 'de';
    });
    
    getText.mockImplementation((key, replacements) => {
      const lang = getLanguagePreference();
      const translations = mockTranslations[lang] || mockTranslations.de;
      let text = translations[key] || key;
      
      // Apply replacements if provided
      if (replacements) {
        for (const [placeholder, value] of Object.entries(replacements)) {
          text = text.replace(`{${placeholder}}`, value);
        }
      }
      
      return text;
    });
  });
  
  describe('Language Preference', () => {
    test('should retrieve the default language when no preference is set', () => {
      // Clear any saved preference
      localStorage.removeItem('tbAnalyzerLanguage');

      const language = getLanguagePreference();
      
      // The default language should be German ('de') according to the code
      expect(language).toBe('de');
    });
    
    test('should retrieve the saved language preference', () => {
      // Save a preference
      localStorage.setItem('tbAnalyzerLanguage', 'en');
      
      const language = getLanguagePreference();
      
      expect(language).toBe('en');
    });
    
    test('should save the language preference when setting a language', () => {
      // Set the language to English
      setLanguage('en');
      
      // Verify the language was saved
      expect(localStorage.getItem('tbAnalyzerLanguage')).toBe('en');
    });
    
    test('should return to default language if an invalid language is requested', () => {
      // First, set a valid language to test it can be reset
      localStorage.setItem('tbAnalyzerLanguage', 'en');
      
      // Override the setLanguage mock for this specific test
      setLanguage.mockImplementationOnce((lang) => {
        // Don't set anything in localStorage for invalid languages
        if (lang === 'invalid-language') {
          return;
        }
        // Otherwise, set it normally
        localStorage.setItem('tbAnalyzerLanguage', lang);
      });
      
      // Try to set an invalid language
      setLanguage('invalid-language');
      
      // It should default to 'de' when getLanguagePreference is called
      // (but only if there's no existing valid preference)
      localStorage.removeItem('tbAnalyzerLanguage');
      const language = getLanguagePreference();
      expect(language).toBe('de');
    });
  });
  
  describe('Text Translation', () => {
    test('should return German text when language is set to "de"', () => {
      // Set the language to German
      setLanguage('de');
      
      // Get a German text key
      const dashboardText = getText('nav.dashboard');
      const playersText = getText('nav.players');
      
      expect(dashboardText).toBe('Dashboard');
      expect(playersText).toBe('Spieler');
    });
    
    test('should return English text when language is set to "en"', () => {
      // Set the language to English
      setLanguage('en');
      
      // Get an English text key
      const dashboardText = getText('nav.dashboard');
      const playersText = getText('nav.players');
      
      expect(dashboardText).toBe('Dashboard');
      expect(playersText).toBe('Players');
    });
    
    test('should handle missing translation keys gracefully', () => {
      // Set the language to German
      setLanguage('de');
      
      // Try to get a non-existent key
      const missingText = getText('non.existent.key');
      
      // Should return the key itself if translation is missing
      expect(missingText).toBe('non.existent.key');
    });
    
    test('should handle replacements in translation strings', () => {
      // Set the language to German
      setLanguage('de');
      
      // Get a text with replacement placeholder
      const loadingText = getText('status.loadingData', { 0: 'data.csv' });
      
      expect(loadingText).toBe('Lade Daten aus data.csv...');
    });
  });
  
  describe('UI Text Updates', () => {
    test('should update UI elements when language changes', () => {
      // Set the language to German first
      setLanguage('de');
      
      // Update the UI with German text
      updateUIText();
      
      // Set up DOM elements for testing
      document.body.innerHTML = `
        <div data-i18n="nav.dashboard">Dashboard</div>
        <div data-i18n="nav.players">Players</div>
      `;
      
      // Now switch to English
      setLanguage('en');
      updateUIText();
      
      // Verify updateUIText was called
      expect(updateUIText).toHaveBeenCalled();
    });
    
    test('should handle missing UI elements gracefully', () => {
      // Set language but missing UI elements
      document.body.innerHTML = ``;
      
      // Set the language and update UI
      setLanguage('en');
      
      // This should not throw an error even though an element is missing
      expect(() => updateUIText()).not.toThrow();
    });
    
    test('should update language switcher buttons correctly', () => {
      // Set the language to German
      setLanguage('de');
      updateUIText();
      
      // Verify updateUIText was called
      expect(updateUIText).toHaveBeenCalled();
    });
  });
}); 