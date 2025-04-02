/**
 * i18n.js
 *
 * Description: Internationalization module for handling multiple languages
 * Usage:
 *     Import directly: import { getText, setLanguage, getCurrentLanguage } from './i18n.js';
 */

import { getState, setState, subscribe } from './state.js';

/**
 * Default language to use if no preference is set
 * @type {string}
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Local storage key for saving language preference
 * @type {string}
 */
const LANGUAGE_STORAGE_KEY = 'chefscore_language_preference';

/**
 * Translation dictionaries for supported languages
 * @type {Object}
 */
const translations = {
  en: {
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.lastUpdated': 'Last updated: {0}',
    'dashboard.totalPlayers': 'Total Players',
    'dashboard.totalScore': 'Total Score',
    'dashboard.totalChests': 'Total Chests',
    'dashboard.avgScore': 'Avg. Score',
    'dashboard.avgChests': 'Avg. Chests',
    'dashboard.rank': 'Rank',
    'dashboard.player': 'Player',
    'dashboard.score': 'Score',
    'dashboard.chests': 'Chests',
    'dashboard.filter.placeholder': 'Filter players...',
    'dashboard.filter.noResults': 'No players found. Try a different filter.',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.table': 'Detailed Table',
    'nav.charts': 'Charts',
    'nav.analytics': 'Analytics',
    'nav.scoreSystem': 'Score System',
    
    // Chart labels
    'charts.topSources': 'Top Point Sources',
    'charts.scoreDistribution': 'Score Distribution',
    'charts.scoreVsChests': 'Score vs Chests',
    'charts.frequentSources': 'Most Frequent Sources',
    'charts.playerSkills': 'Player Skills',
    
    // Player details
    'player.details': 'Player Details',
    'player.premium': 'Premium',
    'player.breakdown': 'Score Breakdown',
    'player.backToDashboard': 'Back to Dashboard',
    'player.downloadJson': 'Download Player Data',
    
    // Table view
    'table.title': 'Detailed Data',
    'table.downloadCsv': 'Download CSV',
    
    // Status messages
    'status.loading': 'Loading data...',
    'status.error': 'Error loading data. Please try again.',
    'status.success': 'Data loaded successfully!',
    
    // Empty state
    'empty.title': 'No Data Available',
    'empty.message': 'Please upload a CSV file to see player statistics.',
    
    // Common actions
    'action.close': 'Close',
    'action.download': 'Download',
    'action.view': 'View',
    'action.sort': 'Sort',
    'action.filter': 'Filter'
  },
  de: {
    // Dashboard
    'dashboard.title': 'Übersicht',
    'dashboard.lastUpdated': 'Zuletzt aktualisiert: {0}',
    'dashboard.totalPlayers': 'Spieler Gesamt',
    'dashboard.totalScore': 'Punkte Gesamt',
    'dashboard.totalChests': 'Truhen Gesamt',
    'dashboard.avgScore': 'Ø Punkte',
    'dashboard.avgChests': 'Ø Truhen',
    'dashboard.rank': 'Rang',
    'dashboard.player': 'Spieler',
    'dashboard.score': 'Punkte',
    'dashboard.chests': 'Truhen',
    'dashboard.filter.placeholder': 'Spieler filtern...',
    'dashboard.filter.noResults': 'Keine Spieler gefunden. Versuchen Sie einen anderen Filter.',
    
    // Navigation
    'nav.dashboard': 'Übersicht',
    'nav.table': 'Detaillierte Tabelle',
    'nav.charts': 'Diagramme',
    'nav.analytics': 'Analysen',
    'nav.scoreSystem': 'Punktesystem',
    
    // Chart labels
    'charts.topSources': 'Top Punktequellen',
    'charts.scoreDistribution': 'Punkteverteilung',
    'charts.scoreVsChests': 'Punkte vs Truhen',
    'charts.frequentSources': 'Häufigste Quellen',
    'charts.playerSkills': 'Spielerfähigkeiten',
    
    // Player details
    'player.details': 'Spielerdetails',
    'player.premium': 'Premium',
    'player.breakdown': 'Punkteaufschlüsselung',
    'player.backToDashboard': 'Zurück zur Übersicht',
    'player.downloadJson': 'Spielerdaten herunterladen',
    
    // Table view
    'table.title': 'Detaillierte Daten',
    'table.downloadCsv': 'CSV herunterladen',
    
    // Status messages
    'status.loading': 'Lade Daten...',
    'status.error': 'Fehler beim Laden der Daten. Bitte versuchen Sie es erneut.',
    'status.success': 'Daten erfolgreich geladen!',
    
    // Empty state
    'empty.title': 'Keine Daten verfügbar',
    'empty.message': 'Bitte laden Sie eine CSV-Datei hoch, um Spielerstatistiken zu sehen.',
    
    // Common actions
    'action.close': 'Schließen',
    'action.download': 'Herunterladen',
    'action.view': 'Ansehen',
    'action.sort': 'Sortieren',
    'action.filter': 'Filtern'
  }
};

/**
 * Gets the currently active language
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
  // Check state first
  const stateLanguage = getState('language');
  if (stateLanguage) {
    return stateLanguage;
  }
  
  // Check localStorage
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && translations[storedLanguage]) {
      // Update state with stored preference
      setState('language', storedLanguage);
      return storedLanguage;
    }
  } catch (error) {
    console.warn('Could not read language preference from localStorage:', error);
  }
  
  // Default fallback
  setState('language', DEFAULT_LANGUAGE);
  return DEFAULT_LANGUAGE;
}

/**
 * Sets the active language and updates UI
 * @param {string} language - Language code (e.g., 'en', 'de')
 * @returns {boolean} Success indicator
 */
export function setLanguage(language) {
  // Validate language
  if (!translations[language]) {
    console.warn(`Unsupported language: ${language}. Falling back to ${DEFAULT_LANGUAGE}`);
    language = DEFAULT_LANGUAGE;
  }
  
  // Update state (triggers subscribers)
  setState('language', language);
  
  // Save preference to localStorage
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Could not save language preference to localStorage:', error);
  }
  
  // Update the language buttons UI
  updateLanguageButtons(language);
  
  // Update text in all UI elements
  updateUITextElements();
  
  return true;
}

/**
 * Gets a translated text string for the current language
 * @param {string} key - Translation key
 * @param {...string} replacements - Optional replacement values
 * @returns {string} Translated text
 */
export function getText(key, ...replacements) {
  const language = getCurrentLanguage();
  let text = translations[language][key] || translations[DEFAULT_LANGUAGE][key] || key;
  
  // Apply replacements if any
  if (replacements.length > 0) {
    replacements.forEach((replacement, index) => {
      text = text.replace(`{${index}}`, replacement);
    });
  }
  
  return text;
}

/**
 * Updates the active state of language buttons based on current language
 * @param {string} language - Current language code
 * @returns {boolean} Success indicator
 */
function updateLanguageButtons(language) {
  try {
    const enButton = document.getElementById("lang-en");
    const deButton = document.getElementById("lang-de");
    
    if (enButton) {
      enButton.classList.toggle("active", language === "en");
    }
    
    if (deButton) {
      deButton.classList.toggle("active", language === "de");
    }
    
    return true;
  } catch (error) {
    console.error("Error updating language buttons:", error);
    return false;
  }
}

/**
 * Updates all UI elements with translated text based on data-i18n attributes
 * @returns {boolean} Success indicator
 */
function updateUITextElements() {
  try {
    // Find all elements with data-i18n attribute
    const i18nElements = document.querySelectorAll('[data-i18n]');
    
    i18nElements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = getText(key);
    });
    
    // Handle placeholder texts for inputs
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = getText(key);
    });
    
    return true;
  } catch (error) {
    console.error("Error updating UI text elements:", error);
    return false;
  }
}

/**
 * Initializes language switcher buttons event handlers
 * @returns {boolean} Success indicator
 */
export function initLanguageSwitchers() {
  try {
    const enButton = document.getElementById("lang-en");
    const deButton = document.getElementById("lang-de");
    
    if (enButton) {
      enButton.addEventListener("click", function(e) {
        e.preventDefault();
        setLanguage("en");
      });
    }
    
    if (deButton) {
      deButton.addEventListener("click", function(e) {
        e.preventDefault();
        setLanguage("de");
      });
    }
    
    // Set initial state for language buttons
    updateLanguageButtons(getCurrentLanguage());
    
    return true;
  } catch (error) {
    console.error("Error initializing language switchers:", error);
    return false;
  }
}

// Subscribe to language changes in state
subscribe('language', (newLanguage) => {
  updateLanguageButtons(newLanguage);
  updateUITextElements();
}); 