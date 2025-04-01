/**
 * i18n.js
 * Contains internationalization functionality and text content
 */

import { DEFAULT_LANGUAGE, LANG_STORAGE_KEY } from './config.js';
import { elements } from './dom.js';

// The current language used in the application
export let currentLanguage = DEFAULT_LANGUAGE;

// Text content for internationalization
export const TEXT_CONTENT = {
  de: {
    appTitle: "Truhenauswertung",
    clanNameLiteral: "- The Chiller",
    nav: {
      dashboard: "Übersicht",
      data: "Daten",
      charts: "Diagramme",
      analytics: "Analytik",
      scoreSystem: "Punktesystem",
      history: "Historie"
    },
    button: {
      downloadCsv: "CSV Herunterladen",
      viewLarger: "Vergrößern",
      close: "Schließen",
    },
    dashboard: {
      statsTitle: "Gesamtstatistik",
      statPlayers: "Spieler",
      statTotalScore: "Gesamtpunkte",
      statTotalChests: "Gesamttruhen",
      statAvgScore: "Ø Punkte",
      statAvgChests: "Ø Truhen",
      rankingTitle: "Gesamtrangliste",
      filterPlaceholder: "Nach Spielername filtern...",
      chartTopSourcesTitle: "Top Quellen nach Punkten",
      chartScoreDistTitle: "Punkteverteilung",
      chartScoreVsChestsTitle: "Punkte vs. Truhen",
      chartFreqSourcesTitle: "Häufigste Quellen",
      topChestsTitle: "Top 5 nach Truhenanzahl",
    },
    charts: {
      title: "Diagramme Übersicht",
      loading: "Lade Diagramm...",
      othersCategory: "Sonstige",
      sourceLabel: "Quelle",
      notEnoughDataRadar:
        "Nicht genügend Kategoriedaten für Radardiagramm (Minimum 3).",
      scopeLabel: "Datenbereich:",
      scopeOverall: "Gesamt",
      scopeClan: "Clan (Aggregiert)",
    },
    analytics: {
      title: "Analytik",
      categoryTitle: "Kategorieanalyse",
      selectCategoryLabel: "Kategorie analysieren:",
      selectCategoryDefault: "-- Kategorie auswählen --",
      topPlayers: "Top Spieler",
      distribution: "Verteilung",
      selectCategoryPrompt: "Wähle eine Kategorie zum Analysieren aus.",
      playerTitle: "Spieleranalyse",
      playerPlaceholder:
        "Spielervergleiche / detaillierte Analyse kommen bald...",
      clanTitle: "Clananalyse",
      clanPlaceholder: "Aggregierte Clanstatistiken kommen bald...",
    },
    detailedTable: { title: "Vollständige Datentabelle" },
    playerDetail: {
      title: "Spielerdetails",
      rank: "Rang",
      totalScore: "Gesamtpunkte",
      totalChests: "Gesamttruhen",
      breakdownTitle: "Punkteverteilung nach Quelle",
      performanceTitle: "Top Leistungskategorien",
      downloadJson: "JSON Herunterladen",
      noBreakdown: "Keine spezifischen Truhenpunkte erfasst.",
    },
    scoreSystem: {
      title: "Punktesystem",
      loading: "Lade Punktesystem...",
      headerTyp: "Typ",
      headerLevel: "Stufe",
      headerPunkte: "Punkte",
    },
    table: {
      loading: "Lade...",
      noData: "Keine Daten geladen.",
      headerRank: "Rang",
      headerPlayer: "Spieler",
      headerTotalScore: "Gesamtpunkte",
      headerChestCount: "Truhenanzahl",
      headerScore: "Punkte",
      headerLevel: "Stufe",
      headerType: "Typ",
      headerChests: "Truhen",
      fullTableNotice: "Alle Daten anzeigen",
    },
    status: {
      loading: "Lade Daten...",
      loadingRules: "Lade Punktesystem...",
      dataLoaded: "Daten erfolgreich geladen!",
      dataLoadError: "Fehler beim Laden von {0}. Verwende gespeicherte Daten wenn verfügbar.",
      ruleLoadError: "Fehler beim Laden des Punktesystems.",
      noDataStored: "Keine gespeicherten Daten verfügbar. Bitte überprüfe die Datenquelle.",
      downloadError: "Fehler beim Herunterladen von {0}.",
      chartError: "Fehler beim Erstellen des Diagramms.",
      noPlayerData: "Keine Spielerdaten verfügbar.",
      dataUpdatedAt: "Daten zuletzt aktualisiert: {0}",
    },
    week: {
      loading: "Lade Wochen...",
      select: "Woche auswählen:",
      latest: "Neueste",
    },
    weekSelector: {
      week: "Woche",
      noWeeks: "Keine Wochen verfügbar",
      loading: "Lade Woche-Daten...",
      noData: "Keine Daten für diese Woche"
    },
    history: {
      title: "Historische Datenanalyse",
      loading: "Lade historische Daten...",
      totalWeeks: "Wochen gesamt",
      totalPlayers: "Spieler gesamt",
      totalPoints: "Punkte gesamt",
      totalChests: "Truhen gesamt",
      avgPointsPerPlayer: "Ø Punkte/Spieler",
      avgChestsPerPlayer: "Ø Truhen/Spieler",
      weeklyTotals: "Wöchentliche Summen",
      noHistorical: "Keine historischen Daten verfügbar.",
    },
    // Error messages
    no_weeks_found: "Keine Wochendaten gefunden. Bitte überprüfen Sie das Datenverzeichnis.",
    no_current_week: "Keine aktuelle Woche identifiziert.",
    init_weekly_data_error: "Fehler bei der Initialisierung der Wochendaten.",
    loading_week_data: "Lade Daten für Woche {week}...",
    week_data_load_error: "Fehler beim Laden der Daten für Woche {week}.",
    error: {
      historicalDataLoad: "Fehler beim Laden der historischen Daten. Bitte überprüfen Sie die Wochendaten.",
      weeklyDataSystem: "Fehler bei der Initialisierung des Wochendatensystems."
    }
  },
  en: {
    appTitle: "Chest Analysis",
    clanNameLiteral: "- The Chiller",
    nav: {
      dashboard: "Dashboard",
      data: "Data",
      charts: "Charts",
      analytics: "Analytics",
      scoreSystem: "Score System",
      history: "History"
    },
    button: {
      downloadCsv: "Download CSV",
      viewLarger: "View Larger",
      close: "Close",
    },
    dashboard: {
      statsTitle: "Overall Statistics",
      statPlayers: "Players",
      statTotalScore: "Total Score",
      statTotalChests: "Total Chests",
      statAvgScore: "Avg Score",
      statAvgChests: "Avg Chests",
      rankingTitle: "Overall Ranking",
      filterPlaceholder: "Filter by Player Name...",
      chartTopSourcesTitle: "Top Sources by Score",
      chartScoreDistTitle: "Score Distribution",
      chartScoreVsChestsTitle: "Score vs. Chests",
      chartFreqSourcesTitle: "Most Frequent Sources",
      topChestsTitle: "Top 5 by Chest Count",
    },
    charts: {
      title: "Charts Overview",
      loading: "Loading chart...",
      othersCategory: "Others",
      sourceLabel: "Source",
      notEnoughDataRadar:
        "Not enough category data for radar chart (minimum 3).",
      scopeLabel: "Data Scope:",
      scopeOverall: "Overall",
      scopeClan: "Clan (Aggregated)",
    },
    analytics: {
      title: "Analytics",
      categoryTitle: "Category Analysis",
      selectCategoryLabel: "Analyze Category:",
      selectCategoryDefault: "-- Select Category --",
      topPlayers: "Top Players",
      distribution: "Distribution",
      selectCategoryPrompt: "Select a category to analyze.",
      playerTitle: "Player Analysis",
      playerPlaceholder:
        "Player comparisons / detailed analytics coming soon...",
      clanTitle: "Clan Analysis",
      clanPlaceholder: "Aggregated clan statistics coming soon...",
    },
    detailedTable: { title: "Full Data Table" },
    playerDetail: {
      title: "Player Details",
      rank: "Rank",
      totalScore: "Total Score",
      totalChests: "Total Chests",
      breakdownTitle: "Score Breakdown by Source",
      performanceTitle: "Top Performance Categories",
      downloadJson: "Download JSON",
      noBreakdown: "No specific chest scores recorded.",
    },
    scoreSystem: {
      title: "Scoring System",
      loading: "Loading scoring rules...",
      headerTyp: "Type",
      headerLevel: "Level",
      headerPunkte: "Points",
    },
    table: {
      loading: "Loading...",
      noData: "No data loaded.",
      headerRank: "Rank",
      headerPlayer: "Player",
      headerTotalScore: "Total Score",
      headerChestCount: "Chest Count",
      headerScore: "Score",
      headerLevel: "Level",
      headerType: "Type",
      headerChests: "Chests",
      fullTableNotice: "View All Data",
    },
    status: {
      loading: "Loading data...",
      loadingRules: "Loading scoring rules...",
      dataLoaded: "Data loaded successfully!",
      dataLoadError: "Error loading {0}. Using stored data if available.",
      ruleLoadError: "Error loading scoring rules.",
      noDataStored: "No stored data available. Please check data source.",
      downloadError: "Error downloading {0}.",
      chartError: "Error creating chart.",
      noPlayerData: "No player data available.",
      dataUpdatedAt: "Data last updated: {0}",
    },
    week: {
      loading: "Loading weeks...",
      select: "Select Week:",
      latest: "Latest",
    },
    weekSelector: {
      week: "Week",
      noWeeks: "No weeks available",
      loading: "Loading week data...",
      noData: "No data for this week"
    },
    history: {
      title: "Historical Data Analysis",
      loading: "Loading historical data...",
      totalWeeks: "Total Weeks",
      totalPlayers: "Total Players",
      totalPoints: "Total Points",
      totalChests: "Total Chests",
      avgPointsPerPlayer: "Avg. Points/Player",
      avgChestsPerPlayer: "Avg. Chests/Player",
      weeklyTotals: "Weekly Totals",
      noHistorical: "No historical data available.",
    },
    // Error messages
    no_weeks_found: "No weekly data found. Please check data directory.",
    no_current_week: "No current week identified.",
    init_weekly_data_error: "Error initializing weekly data.",
    loading_week_data: "Loading data for week {week}...",
    week_data_load_error: "Error loading data for week {week}.",
    error: {
      historicalDataLoad: "Error loading historical data. Please check weekly data.",
      weeklyDataSystem: "Error initializing weekly data system."
    }
  }
};

/**
 * Sets the application language and updates the UI
 * @param {string} lang - The language code ('en' or 'de')
 */
export function setLanguage(lang) {
  if (!['en', 'de'].includes(lang)) {
    console.error(`Invalid language: ${lang}`);
    return;
  }
  
  try {
    // Update state
    currentLanguage = lang;
    
    // Store the language preference
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    
    // Update UI elements with the new language
    initializeTranslations();
    updateLanguageSwitcherUI();
    
    console.log(`Language set to ${lang}`);
  } catch (error) {
    console.error('Error setting language:', error);
  }
}

/**
 * Gets the user's language preference from localStorage or defaults to browser language
 * @returns {string} The language code
 */
export function getLanguagePreference() {
  try {
    // Check localStorage first
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (storedLang && ['en', 'de'].includes(storedLang)) {
      return storedLang;
    }
    
    // If no stored preference, check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('de')) {
      return 'de';
    }
    
    // Default to English
    return 'en';
  } catch (error) {
    console.error('Error getting language preference:', error);
    return DEFAULT_LANGUAGE;
  }
}

/**
 * Gets translated text for a given key with optional replacements
 * @param {string} key - The translation key (can be dot-notation path like "nav.dashboard")
 * @param {Object} replacements - Object containing replacement values
 * @returns {string} The translated text
 */
export function getText(key, replacements = {}) {
  try {
    // Handle nested keys with dot notation (e.g., "nav.dashboard")
    const keyParts = key.split('.');
    let value = TEXT_CONTENT[currentLanguage];
    
    // Navigate through the nested object
    for (const part of keyParts) {
      value = value[part];
      // If we can't find the translation at any level, return the key
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Handle string replacements
    let result = value;
    
    // Process replacements like {0}, {1}, or {name}
    if (typeof result === 'string' && Object.keys(replacements).length > 0) {
      // Replace numbered placeholders like {0}, {1} and named placeholders like {key}
      result = result.replace(/{([^{}]*)}/g, (match, placeholder) => {
        const replacement = replacements[placeholder];
        return replacement !== undefined ? replacement : match;
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error getting translation for key: ${key}`, error);
    return key;
  }
}

/**
 * Initializes translations in the UI by updating all elements with data-i18n-key attributes
 */
export function initializeTranslations() {
  try {
    // Update document title
    document.title = getText('appTitle');
    
    // Update all elements with data-i18n-key attribute
    const elementsToTranslate = document.querySelectorAll('[data-i18n-key]');
    elementsToTranslate.forEach(el => {
      const key = el.getAttribute('data-i18n-key');
      
      // Check if there are any replacements specified
      let replacements = {};
      const replacementsAttr = el.getAttribute('data-i18n-replacements');
      if (replacementsAttr) {
        try {
          replacements = JSON.parse(replacementsAttr);
        } catch (e) {
          console.warn(`Invalid replacements JSON for key ${key}:`, replacementsAttr);
        }
      }
      
      // Get the translated text
      const translation = getText(key, replacements);
      
      // Update the element
      if (translation) {
        el.textContent = translation;
      }
    });
    
    // Also handle title attributes with data-i18n-title-key
    const elementsWithTitleAttr = document.querySelectorAll('[data-i18n-title-key]');
    elementsWithTitleAttr.forEach(el => {
      const key = el.getAttribute('data-i18n-title-key');
      const translation = getText(key);
      if (translation) {
        el.setAttribute('title', translation);
      }
    });
    
    console.log('UI translations initialized');
  } catch (error) {
    console.error('Error initializing translations:', error);
  }
}

/**
 * Updates the language switcher UI to reflect the current language
 */
export function updateLanguageSwitcherUI() {
  try {
    // Get the language buttons
    const langDeButton = document.getElementById('lang-de');
    const langEnButton = document.getElementById('lang-en');
    
    if (!langDeButton || !langEnButton) {
      console.warn('Language switcher buttons not found');
      return;
    }
    
    // Remove active class from both buttons
    langDeButton.classList.remove('active');
    langEnButton.classList.remove('active');
    
    // Add active class to the current language button
    if (currentLanguage === 'de') {
      langDeButton.classList.add('active');
    } else {
      langEnButton.classList.add('active');
    }
  } catch (error) {
    console.error('Error updating language switcher UI:', error);
  }
}

// Export default i18n object
export default {
  TEXT_CONTENT,
  currentLanguage,
  setLanguage,
  getLanguagePreference,
  getText,
  initializeTranslations,
  updateLanguageSwitcherUI
}; 