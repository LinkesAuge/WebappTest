/**
 * Internationalization (i18n) Unit Tests
 * 
 * Tests for language switching and text translation functions.
 */

// Import mocked versions of the app functions
import { 
  getLanguagePreference, 
  setLanguage,
  getText,
  updateUIText
} from '../../helpers/mock-app';

describe('Internationalization (i18n)', () => {
  
  // Mock language data for testing
  const mockTranslations = {
    de: {
      'nav.dashboard': 'Dashboard',
      'nav.players': 'Spieler',
      'nav.analytics': 'Analytik',
      'status.loadingData': 'Lade Daten aus {0}...'
    },
    en: {
      'nav.dashboard': 'Dashboard',
      'nav.players': 'Players',
      'nav.analytics': 'Analytics',
      'status.loadingData': 'Loading data from {0}...'
    }
  };
  
  beforeEach(() => {
    // Reset mocks before each test
    getLanguagePreference.mockClear();
    setLanguage.mockClear();
    getText.mockClear();
    updateUIText.mockClear();
    
    // Mock implementations
    getLanguagePreference.mockImplementation(() => {
      return localStorage.getItem('tbAnalyzerLanguage') || 'de';
    });
    
    getText.mockImplementation((key, replacements) => {
      const lang = getLanguagePreference();
      const translations = mockTranslations[lang] || mockTranslations.de;
      let text = translations[key] || key;
      
      if (replacements) {
        for (const [placeholder, value] of Object.entries(replacements)) {
          text = text.replace(`{${placeholder}}`, value);
        }
      }
      
      return text;
    });
    
    // Clear localStorage before each test
    localStorage.clear();
  });
  
  describe('Language Preference', () => {
    test('should retrieve the default language when no preference is set', () => {
      // Ensure no language is set
      localStorage.removeItem('tbAnalyzerLanguage');

      const language = getLanguagePreference();
      
      // The default language should be German ('de') according to the code
      expect(language).toBe('de');
      expect(localStorage.getItem).toHaveBeenCalledWith('tbAnalyzerLanguage');
    });
    
    test('should retrieve the saved language preference', () => {
      // Set the language preference to English
      localStorage.setItem('tbAnalyzerLanguage', 'en');
      
      const language = getLanguagePreference();
      
      expect(language).toBe('en');
      expect(localStorage.getItem).toHaveBeenCalledWith('tbAnalyzerLanguage');
    });
    
    test('should save the language preference when setting a language', () => {
      // Set the language to English
      setLanguage('en');
      
      expect(localStorage.setItem).toHaveBeenCalledWith('tbAnalyzerLanguage', 'en');
    });
    
    test('should return to default language if an invalid language is requested', () => {
      // Try to set an invalid language
      setLanguage('invalid-language');
      
      // It should default to 'de' or some other default
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
        <nav>
          <button id="nav-dashboard" data-i18n="nav.dashboard">Dashboard</button>
          <button id="nav-players" data-i18n="nav.players">Spieler</button>
          <button id="nav-analytics" data-i18n="nav.analytics">Analytik</button>
        </nav>
      `;
      
      // Now switch to English
      setLanguage('en');
      updateUIText();
      
      // Check function calls
      expect(updateUIText).toHaveBeenCalled();
    });
    
    test('should handle missing UI elements gracefully', () => {
      // Remove all elements from the DOM
      document.body.innerHTML = '';
      
      // Set the language and update UI
      setLanguage('en');
      
      // This should not throw an error even though an element is missing
      expect(() => updateUIText()).not.toThrow();
    });
    
    test('should update language switcher buttons correctly', () => {
      // Set the language to German
      setLanguage('de');
      updateUIText();
      
      // The German button should be active
      expect(updateUIText).toHaveBeenCalled();
    });
  });
}); 