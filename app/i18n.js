/**
 * i18n.js
 * 
 * Handles internationalization for the application.
 * This module is responsible for managing language settings, text translation,
 * and updating the UI with the translated content.
 */

// Configuration constants
const DEFAULT_LANGUAGE = "de";
const LANG_STORAGE_KEY = "tbAnalyzerLanguage";

// Current language state
let currentLanguage = DEFAULT_LANGUAGE;

// Language dictionaries
const TEXT_CONTENT = {
  de: {
    appTitle: "Truhenauswertung",
    clanNameLiteral: "- The Chiller",
    nav: {
      dashboard: "Übersicht",
      data: "Daten",
      charts: "Diagramme",
      analytics: "Analytik",
      scoreSystem: "Punktesystem",
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
      statAvgScore: "Punkte Ø",
      statAvgChests: "Truhen Ø",
      rankingTitle: "Gesamtrangliste",
      filterPlaceholder: "Spieler filtern...",
      chartTopSourcesTitle: "Top Quellen (Punkte)",
      chartScoreDistTitle: "Punkteverteilung",
      chartScoreVsChestsTitle: "Punkte vs. Truhen",
      chartFreqSourcesTitle: "Häufigste Quellen (Anzahl)",
      topChestsTitle: "Top 5 (Truhenanzahl)",
    },
    charts: {
      title: "Diagrammübersicht",
      loading: "Lade Diagramm...",
      othersCategory: "Andere",
      sourceLabel: "Quelle",
      notEnoughDataRadar:
        "Nicht genügend Kategoriedaten für Radar-Diagramm (mind. 3).",
      scopeLabel: "Datenumfang:",
      scopeOverall: "Gesamt",
      scopeClan: "Clan (Aggregiert)",
    },
    analytics: {
      title: "Analytik",
      categoryTitle: "Kategorieanalyse",
      selectCategoryLabel: "Kategorie auswählen:",
      selectCategoryDefault: "-- Kategorie wählen --",
      topPlayers: "Top Spieler",
      distribution: "Verteilung",
      selectCategoryPrompt: "Kategorie auswählen für Analyse.",
      playerTitle: "Spieleranalyse",
      playerPlaceholder: "Spielervergleiche / Detailanalysen folgen...",
      clanTitle: "Clananalyse",
      clanPlaceholder: "Aggregierte Clanstatistiken folgen...",
    },
    detailedTable: { title: "Gesamtdatentabelle" },
    playerDetail: {
      title: "Spielerdetails",
      rank: "Rang",
      totalScore: "Gesamtpunkte",
      totalChests: "Gesamttruhen",
      breakdownTitle: "Punkte nach Quelle",
      performanceTitle: "Top Leistungskategorien",
      downloadJson: "JSON Herunterladen",
      noBreakdown: "Keine spezifischen Truhenpunkte vorhanden.",
    },
    scoreSystem: {
      title: "Punktesystem",
      loading: "Lade Punktesystem...",
      headerTyp: "Typ",
      headerLevel: "Level",
      headerPunkte: "Punkte",
    },
    table: {
      headerRank: "Rang",
      headerPlayer: "Spieler",
      headerTotalScore: "Gesamtpunkte",
      headerChestCount: "Truhenanzahl",
      headerScore: "Punkte",
      headerChests: "Truhen",
      noData: "Keine Daten geladen.",
      noFilterMatch: "Keine Spieler entsprechen dem Filter.",
      loading: "Lade...",
      loadingDetailed: "Lade detaillierte Tabelle...",
    },
    status: {
      initializing: "Initialisiere...",
      loading: "Lade...",
      loadingData: "Lade Daten von {0}...",
      parsing: "Verarbeite CSV...",
      processing: "Verarbeite Daten...",
      saving: "Speichere Daten...",
      loadingRules: "Lade Punktesystem von {0}...",
      success: "Erfolgreich {0} Spieler verarbeitet.",
      successRules: "Punktesystem geladen.",
      usingLocalData: "Verwende gespeicherte Daten...",
      error: "Fehler",
      info: "Info",
      dataLoadError:
        "Daten konnten nicht geladen werden. Konsole prüfen oder sicherstellen, dass '{0}' existiert.",
      parseError: "Fehler beim Parsen von {0}.",
      processError: "Fehler bei Datenverarbeitung.",
      renderError: "Fehler bei Anzeige.",
      kvError: "Fehler beim Speichern/Laden.",
      genericLoadError: "Fehler beim Laden der Daten: {0}",
      chartError: "Diagramm konnte nicht geladen werden.",
      generatingCsv: "Generiere CSV...",
      downloadInitiated: "{0} Download gestartet.",
      downloadError: "Fehler beim Generieren von {0} für Download.",
      generatingJson: "Generiere JSON...",
      noPlayerData: "Keine Spielerdaten ausgewählt.",
      lastUpdatedLabel: "Datenstand:",
      lastUpdatedUnavailable: "Datenstand nicht verfügbar",
      dateUnavailable: "Datum nicht verfügbar",
    },
    modal: { close: "Schließen" },
  },
  en: {
    appTitle: "Chest Analytics",
    clanNameLiteral: "- The Chiller",
    nav: {
      dashboard: "Dashboard",
      data: "Data",
      charts: "Charts",
      analytics: "Analytics",
      scoreSystem: "Score System",
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
      filterPlaceholder: "Filter by player...",
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
        "Not enough category data for radar chart (min. 3 needed).",
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
      playerPlaceholder: "Player comparisons and detailed analytics coming soon...",
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
      headerRank: "Rank",
      headerPlayer: "Player",
      headerTotalScore: "Total Score",
      headerChestCount: "Chest Count",
      headerScore: "Score",
      headerChests: "Chests",
      noData: "No data loaded.",
      noFilterMatch: "No players match the filter.",
      loading: "Loading...",
      loadingDetailed: "Loading detailed table...",
    },
    status: {
      initializing: "Initializing...",
      loading: "Loading...",
      loadingData: "Loading data from {0}...",
      parsing: "Processing CSV...",
      processing: "Processing data...",
      saving: "Saving data...",
      loadingRules: "Loading score system from {0}...",
      success: "Successfully processed {0} players.",
      successRules: "Score system loaded.",
      usingLocalData: "Using stored data...",
      error: "Error",
      info: "Info",
      dataLoadError:
        "Could not load analysis data. Check console or ensure '{0}' exists.",
      parseError: "Error parsing {0}.",
      processError: "Error processing data rows.",
      renderError: "Error displaying dashboard.",
      kvError: "Error saving/loading data.",
      genericLoadError: "Failed to load data: {0}",
      chartError: "Could not render chart.",
      generatingCsv: "Generating CSV...",
      downloadInitiated: "{0} download initiated.",
      downloadError: "Failed to generate {0} for download.",
      generatingJson: "Generating JSON...",
      noPlayerData: "No player data selected.",
      lastUpdatedLabel: "Data Last Updated:",
      lastUpdatedUnavailable: "Last update time unavailable",
      dateUnavailable: "Date unavailable",
    },
    modal: { close: "Close" },
  },
};

// These references will be set by the main module
let updateSortIcons;
let displayLastUpdatedTimestamp;
let renderDashboard;
let renderDetailedTable;
let renderChartsView;
let renderCategoryAnalysis;
let renderCategoryChart;
let renderPlayerDetail;
let renderPlayerChart;
let renderScoreRulesTable;

// Function references that will be provided by other modules
let renderFunctions;

/**
 * Sets references to render functions from other modules
 * @param {Object} functions - Object containing render functions
 */
export function setRenderFunctions(functions) {
  renderFunctions = functions;
}

/**
 * Sets the updateSortIcons function reference
 * @param {Function} sortIconsFunction - Function to update sort icons
 */
export function setUpdateSortIcons(sortIconsFunction) {
  updateSortIcons = sortIconsFunction;
}

/**
 * Initialize language settings
 */
export function initLanguage() {
  // Try to get language from localStorage
  const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
  if (storedLang && TEXT_CONTENT[storedLang]) {
    currentLanguage = storedLang;
  }
  
  // Update UI with current language
  updateLanguageUI();
}

/**
 * Set the application language
 * @param {string} lang - Language code ('de' or 'en')
 */
export function setLanguage(lang) {
  if (!TEXT_CONTENT[lang]) {
    console.error(`Invalid language code: ${lang}`);
    return;
  }
  
  currentLanguage = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  
  // Update UI with new language
  updateLanguageUI();
}

/**
 * Get text for a given key in the current language
 * @param {string} key - The text key (e.g. 'nav.dashboard')
 * @param {Object} replacements - Optional object with replacement values
 * @returns {string} The translated text
 */
export function getText(key, replacements = {}) {
  // Split key into parts (e.g. 'nav.dashboard' -> ['nav', 'dashboard'])
  const parts = key.split('.');
  
  // Get text from current language dictionary
  let text = TEXT_CONTENT[currentLanguage];
  for (const part of parts) {
    text = text?.[part];
    if (text === undefined) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
  }
  
  // Replace placeholders with values
  if (typeof text === 'string' && Object.keys(replacements).length > 0) {
    text = text.replace(/\{(\d+)\}/g, (match, num) => {
      return replacements[num] !== undefined ? replacements[num] : match;
    });
  }
  
  return text;
}

/**
 * Update UI with current language
 */
function updateLanguageUI() {
  // Update language switcher buttons
  const langDe = document.getElementById('lang-de');
  const langEn = document.getElementById('lang-en');
  
  if (langDe) {
    langDe.classList.toggle('active', currentLanguage === 'de');
    langDe.classList.toggle('bg-amber-900/30', currentLanguage === 'de');
  }
  if (langEn) {
    langEn.classList.toggle('active', currentLanguage === 'en');
    langEn.classList.toggle('bg-amber-900/30', currentLanguage === 'en');
  }
  
  // Update all elements with data-i18n-key or data-i18n_key attribute
  const elements = document.querySelectorAll('[data-i18n-key], [data-i18n_key]');
  elements.forEach(element => {
    const key = element.dataset.i18n_key || element.dataset.i18nKey;
    if (key) {
      const text = getText(key);
      if (element.tagName.toLowerCase() === 'input' && element.type === 'text') {
        element.placeholder = text;
      } else {
        element.textContent = text;
      }
    }
  });
  
  // Update all elements with data-i18n-title-key or data-i18n_title_key attribute
  const titleElements = document.querySelectorAll('[data-i18n-title-key], [data-i18n_title_key]');
  titleElements.forEach(element => {
    const key = element.dataset.i18n_title_key || element.dataset.i18nTitleKey;
    if (key) {
      element.title = getText(key);
    }
  });
  
  // Update all elements with data-i18n-placeholder-key or data-i18n_placeholder_key attribute
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder-key], [data-i18n_placeholder_key]');
  placeholderElements.forEach(element => {
    const key = element.dataset.i18n_placeholder_key || element.dataset.i18nPlaceholderKey;
    if (key) {
      element.placeholder = getText(key);
    }
  });
  
  // Force update document title
  document.title = getText('appTitle');
}

/**
 * Updates all UI elements with data-i18n-key attributes based on the current language.
 * @param {Object} sortState - Current sort state for the main ranking table
 * @param {Object} detailedTableSortState - Current sort state for the detailed table
 * @param {Object} scoreRulesSortState - Current sort state for score rules table
 * @param {string} currentView - Current view name
 * @param {Object|null} currentPlayerData - Current player data being viewed
 * @param {HTMLElement|null} categorySelect - Category select dropdown element
 */
export function updateUIText(
  sortState,
  detailedTableSortState,
  scoreRulesSortState,
  currentView,
  currentPlayerData,
  categorySelect
) {
  console.log(`Updating UI text for language: ${currentLanguage}`);
  document.title = getText("appTitle");

  // Get references to key elements
  const statusMessage = document.getElementById("status-message");
  const breadcrumbNav = document.getElementById("breadcrumb-nav");
  const breadcrumbCurrentPageName = document.getElementById("breadcrumb-current-page-name");
  const lastUpdatedInfo = document.getElementById("last-updated-info");

  // Update all elements with data-i18n-key
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    const key = el.dataset.i18nKey;
    let replacements = {};
    if (el.dataset.i18nReplacements) {
      try {
        replacements = JSON.parse(el.dataset.i18nReplacements);
      } catch (e) {
        console.error(
          `Invalid JSON in data-i18n-replacements for key '${key}':`,
          el.dataset.i18nReplacements,
          e
        );
      }
    }
    const text = getText(key, replacements);

    if (key === "clanNameLiteral") {
      el.textContent =
        TEXT_CONTENT[currentLanguage]?.clanNameLiteral ||
        TEXT_CONTENT[DEFAULT_LANGUAGE]?.clanNameLiteral ||
        "";
    } else if (
      el !== statusMessage && // Avoid overwriting dynamic status
      el !== breadcrumbCurrentPageName && // Avoid overwriting dynamic breadcrumb part
      el !== lastUpdatedInfo && // Avoid overwriting dynamic timestamp
      !el.closest("#ranking-table-body") && // Avoid overwriting dynamic table content
      !el.closest("#top-chests-table-body") &&
      !el.closest("#detailed-table-container tbody") &&
      !el.closest("#category-ranking-body") &&
      !el.closest("#score-rules-table-container tbody") &&
      !el.closest("#player-breakdown-list")
    ) {
      // More careful update for other elements like headers, titles, labels
      if (
        el.children.length === 0 ||
        el.closest(
          'h1, h2, h3, h4, p, label, div[role="dialog"] h3, #category-name-table, #category-name-chart'
        )
      ) {
        // If no children OR it's a simple text container OR specific IDs, update directly
        el.textContent = text;
      } else {
        // If it has children (like icons in h3), try to update the main text node
        let textNode = Array.from(el.childNodes).find(
          (node) =>
            node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim().length > 0
        );
        if (textNode) {
          textNode.textContent = ` ${text}`; // Add space before text if icon is present usually
        } else if (el.querySelector("span[data-i18n-key]")) {
          // If the target is explicitly a span inside, let it handle itself
        }
      }
    }
  });

  // Update titles
  document.querySelectorAll("[data-i18n-title-key]").forEach((el) => {
    el.title = getText(el.dataset.i18nTitleKey);
  });

  // Update sort icons (important after text updates which might clear them)
  if (sortState && typeof updateSortIcons === 'function') {
    updateSortIcons(
      sortState.column,
      sortState.direction,
      "#ranking-section thead th[data-column]"
    );
  }
  
  if (detailedTableSortState && typeof updateSortIcons === 'function') {
    updateSortIcons(
      detailedTableSortState.column,
      detailedTableSortState.direction,
      "#detailed-table-container thead th[data-column]"
    );
  }
  
  if (scoreRulesSortState && typeof updateSortIcons === 'function') {
    updateSortIcons(
      scoreRulesSortState.column,
      scoreRulesSortState.direction,
      "#score-rules-table-container thead th[data-column]"
    );
  }

  // Update dynamic breadcrumb text if visible
  if (breadcrumbNav && !breadcrumbNav.classList.contains("hidden")) {
    const viewKeyMap = {
      "detailed-table": "nav.data",
      charts: "nav.charts",
      analytics: "nav.analytics",
      "score-system": "nav.scoreSystem",
      detail: null, // Handled separately
    };
    const currentKey = viewKeyMap[currentView];
    if (currentKey) {
      breadcrumbCurrentPageName.textContent = getText(currentKey);
    } else if (currentView === "detail" && currentPlayerData) {
      breadcrumbCurrentPageName.textContent = currentPlayerData.PLAYER; // Use player name for detail view
    }
  }
  // Ensure timestamp is updated if needed
  if (typeof displayLastUpdatedTimestamp === 'function') {
    displayLastUpdatedTimestamp();
  }
}

/**
 * Updates the visual state of the language switcher buttons.
 */
export function updateLanguageSwitcherUI() {
  const langDeButton = document.getElementById("lang-de");
  const langEnButton = document.getElementById("lang-en");
  
  if (langDeButton) langDeButton.classList.toggle("active", currentLanguage === "de");
  if (langEnButton) langEnButton.classList.toggle("active", currentLanguage === "en");
}

// Export constants and TEXT_CONTENT for potential use by other modules
export const constants = {
  DEFAULT_LANGUAGE,
  LANG_STORAGE_KEY,
  TEXT_CONTENT
};

// Export current language for access by other modules
export function getCurrentLanguage() {
  return currentLanguage;
}
