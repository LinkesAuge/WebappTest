/**
 * languageService.js
 * 
 * Service for handling internationalization in the TB Chest Analyzer.
 * Manages text content for different languages and provides translation functionality.
 */

/**
 * LanguageService - Handles internationalization
 */
export class LanguageService {
  /**
   * Initialize the language service
   */
  constructor() {
    this._currentLanguage = 'en'; // Default language
    this._translations = {}; // Will hold all translations
    this._languageChangeListeners = new Set();
  }
  
  /**
   * Initialize the language service with translations
   * @returns {Promise<void>}
   */
  async initialize() {
    // Set up default translations
    this._translations = {
      en: this._getEnglishTranslations(),
      de: this._getGermanTranslations()
    };
    
    // Set initial language based on browser preference or stored preference
    this._currentLanguage = this._getPreferredLanguage();
    
    // Trigger initial language setup
    this._notifyLanguageChanged();
  }
  
  /**
   * Get translation for a key
   * @param {string} key - Translation key
   * @param {Object} [params={}] - Parameters to substitute in the translation
   * @returns {string} Translated text
   */
  translate(key, params = {}) {
    const lang = this._currentLanguage;
    const translation = this._getTranslation(lang, key);
    
    if (!translation) {
      console.warn(`Missing translation: ${key} for language: ${lang}`);
      
      // Fall back to English
      if (lang !== 'en') {
        const englishTranslation = this._getTranslation('en', key);
        if (englishTranslation) {
          return this._replaceParams(englishTranslation, params);
        }
      }
      
      return key; // Last resort
    }
    
    return this._replaceParams(translation, params);
  }
  
  /**
   * Change the current language
   * @param {string} language - Language code ('en', 'de', etc.)
   * @returns {boolean} Success status
   */
  setLanguage(language) {
    if (!this._translations[language]) {
      console.error(`Language not supported: ${language}`);
      return false;
    }
    
    this._currentLanguage = language;
    
    // Save preference
    localStorage.setItem('preferred_language', language);
    
    // Notify listeners
    this._notifyLanguageChanged();
    
    return true;
  }
  
  /**
   * Get the current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this._currentLanguage;
  }
  
  /**
   * Get list of available languages
   * @returns {Array<Object>} List of available languages with code and name
   */
  getAvailableLanguages() {
    return [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'Deutsch' }
    ];
  }
  
  /**
   * Add a listener for language changes
   * @param {Function} callback - Function to call when language changes
   * @returns {Function} Function to remove the listener
   */
  onLanguageChanged(callback) {
    this._languageChangeListeners.add(callback);
    
    // Call immediately with current language
    callback(this._currentLanguage);
    
    // Return unsubscribe function
    return () => {
      this._languageChangeListeners.delete(callback);
    };
  }
  
  /**
   * Get translation for a key in a specific language
   * @param {string} language - Language code
   * @param {string} key - Translation key
   * @returns {string|null} Translation or null if not found
   * @private
   */
  _getTranslation(language, key) {
    const keyParts = key.split('.');
    let current = this._translations[language];
    
    for (const part of keyParts) {
      if (!current || typeof current !== 'object') {
        return null;
      }
      current = current[part];
    }
    
    return current;
  }
  
  /**
   * Replace parameters in a translation string
   * @param {string} text - Translation string with placeholders
   * @param {Object} params - Parameters to substitute
   * @returns {string} Text with substituted parameters
   * @private
   */
  _replaceParams(text, params) {
    return text.replace(/{{([^{}]*)}}/g, (match, param) => {
      const value = params[param];
      return value !== undefined ? value : match;
    });
  }
  
  /**
   * Get the preferred language from storage or browser settings
   * @returns {string} Language code
   * @private
   */
  _getPreferredLanguage() {
    // Check if user has a stored preference
    const storedLanguage = localStorage.getItem('preferred_language');
    if (storedLanguage && this._translations[storedLanguage]) {
      return storedLanguage;
    }
    
    // Check browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (this._translations[browserLanguage]) {
      return browserLanguage;
    }
    
    // Default to English
    return 'en';
  }
  
  /**
   * Notify all listeners of language change
   * @private
   */
  _notifyLanguageChanged() {
    for (const listener of this._languageChangeListeners) {
      try {
        listener(this._currentLanguage);
      } catch (error) {
        console.error('Error in language change listener:', error);
      }
    }
    
    // Update the document language attribute
    document.documentElement.lang = this._currentLanguage;
    
    // Update text content in the UI
    this._updateUIText();
  }
  
  /**
   * Update all text elements in the UI with translated content
   * @private
   */
  _updateUIText() {
    // Find all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    
    for (const element of elements) {
      const key = element.getAttribute('data-i18n');
      const translation = this.translate(key);
      
      // Check if we should update HTML or text content
      if (element.hasAttribute('data-i18n-html')) {
        element.innerHTML = translation;
      } else {
        element.textContent = translation;
      }
    }
    
    // Update title
    document.title = this.translate('app.title');
  }
  
  /**
   * Get English translations
   * @returns {Object} English translations
   * @private
   */
  _getEnglishTranslations() {
    return {
      app: {
        title: 'TB Chest Analyzer',
        subtitle: 'Analytics for Total Battle',
        loading: 'Loading data...'
      },
      navigation: {
        overview: 'Overview',
        players: 'Players',
        analytics: 'Analytics',
        charts: 'Charts',
        score: 'Score System',
        settings: 'Settings'
      },
      tables: {
        player: 'Player',
        alliance: 'Alliance',
        server: 'Server',
        score: 'Score',
        chests: 'Chests',
        ratio: 'Ratio',
        rank: 'Rank',
        actions: 'Actions'
      },
      charts: {
        playerDistribution: 'Player Distribution',
        chestComparison: 'Chest Comparison',
        alliancePerformance: 'Alliance Performance',
        serverActivity: 'Server Activity',
        topPlayers: 'Top Players'
      },
      player: {
        details: 'Player Details',
        history: 'Chest History',
        comparison: 'Player Comparison',
        statistics: 'Statistics'
      },
      actions: {
        view: 'View',
        compare: 'Compare',
        analyze: 'Analyze',
        download: 'Download',
        refresh: 'Refresh',
        close: 'Close',
        confirm: 'Confirm',
        cancel: 'Cancel'
      },
      filters: {
        search: 'Search',
        timeRange: 'Time Range',
        server: 'Server',
        alliance: 'Alliance',
        apply: 'Apply Filters',
        reset: 'Reset Filters'
      },
      settings: {
        language: 'Language',
        theme: 'Theme',
        darkMode: 'Dark Mode',
        dataPreferences: 'Data Preferences',
        updateFrequency: 'Update Frequency',
        displaySettings: 'Display Settings'
      },
      errors: {
        dataLoad: 'Failed to load data',
        processing: 'Error processing data',
        invalidInput: 'Invalid input',
        missingSelection: 'Please make a selection',
        serverError: 'Server error',
        chartRendering: 'Failed to render chart'
      },
      modals: {
        closeConfirmation: 'Are you sure you want to close? Any unsaved changes will be lost.',
        downloadOptions: 'Download Options',
        playerDetails: 'Player Details',
        settings: 'Settings'
      }
    };
  }
  
  /**
   * Get German translations
   * @returns {Object} German translations
   * @private
   */
  _getGermanTranslations() {
    return {
      app: {
        title: 'TB Truhen-Analysator',
        subtitle: 'Analysetool für Total Battle',
        loading: 'Daten werden geladen...'
      },
      navigation: {
        overview: 'Übersicht',
        players: 'Spieler',
        analytics: 'Analytik',
        charts: 'Diagramme',
        score: 'Punktesystem',
        settings: 'Einstellungen'
      },
      tables: {
        player: 'Spieler',
        alliance: 'Allianz',
        server: 'Server',
        score: 'Punkte',
        chests: 'Truhen',
        ratio: 'Verhältnis',
        rank: 'Rang',
        actions: 'Aktionen'
      },
      charts: {
        playerDistribution: 'Spielerverteilung',
        chestComparison: 'Truhenvergleich',
        alliancePerformance: 'Allianzleistung',
        serverActivity: 'Serveraktivität',
        topPlayers: 'Top-Spieler'
      },
      player: {
        details: 'Spielerdetails',
        history: 'Truhenhistorie',
        comparison: 'Spielervergleich',
        statistics: 'Statistiken'
      },
      actions: {
        view: 'Ansehen',
        compare: 'Vergleichen',
        analyze: 'Analysieren',
        download: 'Herunterladen',
        refresh: 'Aktualisieren',
        close: 'Schließen',
        confirm: 'Bestätigen',
        cancel: 'Abbrechen'
      },
      filters: {
        search: 'Suchen',
        timeRange: 'Zeitraum',
        server: 'Server',
        alliance: 'Allianz',
        apply: 'Filter anwenden',
        reset: 'Filter zurücksetzen'
      },
      settings: {
        language: 'Sprache',
        theme: 'Thema',
        darkMode: 'Dunkelmodus',
        dataPreferences: 'Dateneinstellungen',
        updateFrequency: 'Aktualisierungshäufigkeit',
        displaySettings: 'Anzeigeeinstellungen'
      },
      errors: {
        dataLoad: 'Fehler beim Laden der Daten',
        processing: 'Fehler bei der Datenverarbeitung',
        invalidInput: 'Ungültige Eingabe',
        missingSelection: 'Bitte treffen Sie eine Auswahl',
        serverError: 'Serverfehler',
        chartRendering: 'Fehler beim Rendern des Diagramms'
      },
      modals: {
        closeConfirmation: 'Sind Sie sicher, dass Sie schließen möchten? Nicht gespeicherte Änderungen gehen verloren.',
        downloadOptions: 'Download-Optionen',
        playerDetails: 'Spielerdetails',
        settings: 'Einstellungen'
      }
    };
  }
} 