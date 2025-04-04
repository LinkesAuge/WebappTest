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
    appTitle: "Truhenanalyse",
    appDescription: "Analysiere Truhen und Punktzahlen im Clan",
    clanNameLiteral: "The Chiller",
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
      statAvgScore: "Durchschnittspunkte ø",
      statAvgChests: "Durchschnittstruhen ø",
      rankingTitle: "Gesamtrangliste",
      filterPlaceholder: "Nach Spielername filtern...",
      chartTopSourcesTitle: "Top10 Quellen (Punkte)",
      chartScoreDistTitle: "Punkteverteilung",
      chartScoreVsChestsTitle: "Punkte vs. Truhen",
      chartFreqSourcesTitle: "Top10 Häufigste Quellen",
      topChestsTitle: "Top10 nach Truhenanzahl",
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
      lowScore: "Niedrig",
      highScore: "Hoch",
    },
    analytics: {
      title: "Analytik",
      categoryTitle: "Kategorieanalyse",
      selectCategoryLabel: "Kategorie analysieren:",
      selectCategoryDefault: "-- Kategorie auswählen --",
      topPlayers: "Top Spieler",
      distribution: "Verteilung",
      selectCategoryPrompt: "Wähle eine Kategorie aus dem Dropdown-Menü oben, um sie zu analysieren.",
      clanTitle: "Clan-Analyse",
      clanPlaceholder: "Aggregierte Clan-Statistiken und -Analysen kommen bald...",
      sourceDistribution: "Quellenverteilung",
      topPlayersBySource: "Top Spieler nach Quelle",
      sourceTreemap: "Quellenimportanz",
      categoryCorrelation: "Kategoriekorrelation",
      totalPlayers: "Spieler gesamt",
      totalScore: "Punkte gesamt",
      averageScore: "Durchschnittliche Punkte",
      totalChests: "Truhen gesamt",
      clanComposition: "Clan-Zusammensetzung",
      contributionDistribution: "Beitragsverteilung",
      sourceStrength: "Quellenstärke-Analyse",
      playerValueAdded: "Spielerwertbeitrag",
      playerCount: "Spielerzahl",
      scoreContribution: "Punktebeitrag",
      percentagePlayers: "Prozent der Spieler",
      percentageContribution: "Prozent des Beitrags",
      actualContribution: "Tatsächlicher Beitrag",
      perfectEquality: "Perfekte Gleichheit",
      valueAdded: "Wertbeitrag",
      strength: "Stärke",
      sourceImportance: "Quellenimportanz",
      top10SourcesWithPlayers: "Alle Quellen mit Spielerbeiträgen",
      allSourcesByScore: "Alle Quellen nach Punkten",
      others: "Andere",
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
      headerTotalScore: "Punkte",
      headerChestCount: "Truhen",
      headerScore: "Punkte",
      headerChests: "Truhen",
      headerPlayers: "Spieler",
      noData: "Keine Daten geladen.",
      noFilterMatch: "Keine Spieler entsprechen dem Filter.",
      loading: "Lade...",
      loadingDetailed: "Lade detaillierte Tabelle...",
      showMore: "Alle Spieler anzeigen",
      headers: {
        rank: "Rang",
        player: "Spieler",
        total_score: "Punkte",
        chest_count: "Truhen",
        level: "Level",
        punkte: "Punkte",
        score: "Punkte",
        chests: "Truhen",
        typ: "Typ",
        from_: "Quelle",
        source: "Quelle",
        category: "Kategorie",
        count: "Anzahl",
        average: "Durchschnitt",
        min: "Minimum",
        max: "Maximum",
        description: "Beschreibung"
      }
    },
    status: {
      initializing: "Anwendung wird initialisiert...",
      ready: "Bereit",
      loading: "Laden...",
      dataLoaded: "Daten erfolgreich geladen",
      dataLoadError: "Fehler beim Laden der Daten aus {0}",
      error: "Fehler beim Laden der Daten",
      initError: "Initialisierungsfehler",
      weekSelectError: "Fehler bei Wochenauswahl: {0}",
      dateUnavailable: "Datum nicht verfügbar",
      lastUpdatedLabel: "Zuletzt aktualisiert:",
      lastUpdatedUnavailable: "Letztes Update nicht verfügbar",
      noDataToDownload: "Keine Daten zum Herunterladen verfügbar",
      csvDownloaded: "CSV-Datei wurde heruntergeladen",
      jsonDownloaded: "Spielerdaten wurden heruntergeladen",
      playerNotFound: "Spielerdaten nicht gefunden",
      errorDownloading: "Fehler beim Herunterladen der Datei",
      empty: "Keine Daten verfügbar",
      success: "Daten erfolgreich geladen"
    },
    modal: { close: "Schließen" },
    week: {
      label: "Woche",
      selector: "Woche auswählen",
      current: "Aktuelle Woche",
      notAvailable: "Keine Wochen verfügbar",
      select: "Woche auswählen",
      weekNumber: "Woche {0}",
      format: {
        dateRange: "{0}.{1}-{2}.{3}.{4}",
        weekPart: "Woche {0}"
      }
    },
    page: {
      detailedTable: "Detaillierte Daten",
      charts: "Grafiken",
      analytics: "Analysen",
      scoreSystem: "Punktesystem",
      playerDetails: "Spielerdetails"
    },
  },
  en: {
    appTitle: "Chest Analysis",
    appDescription: "Analyze chest collection and scores in the clan",
    clanNameLiteral: "The Chiller",
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
      filterPlaceholder: "Filter by Player Name...",
      chartTopSourcesTitle: "Top Sources by Score",
      chartScoreDistTitle: "Score Distribution",
      chartScoreVsChestsTitle: "Score vs. Chests",
      chartFreqSourcesTitle: "Most Frequent Sources",
      topChestsTitle: "Top Players by Chest Count",
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
      lowScore: "Low",
      highScore: "High",
    },
    analytics: {
      title: "Analytics",
      categoryTitle: "Category Analysis",
      selectCategoryLabel: "Analyze Category:",
      selectCategoryDefault: "-- Select Category --",
      topPlayers: "Top Players",
      distribution: "Distribution",
      selectCategoryPrompt: "Select a category from the dropdown above to analyze.",
      clanTitle: "Clan Analysis",
      clanPlaceholder: "Aggregated clan statistics and analytics coming soon...",
      sourceDistribution: "Source Distribution",
      topPlayersBySource: "Top Players By Source",
      sourceTreemap: "Source Importance",
      categoryCorrelation: "Category Correlation",
      totalPlayers: "Total Players",
      totalScore: "Total Score",
      averageScore: "Average Score",
      totalChests: "Total Chests",
      clanComposition: "Clan Composition",
      contributionDistribution: "Contribution Distribution",
      sourceStrength: "Source Strength Analysis",
      playerValueAdded: "Player Value Added",
      playerCount: "Player Count",
      scoreContribution: "Score Contribution",
      percentagePlayers: "Percentage of Players",
      percentageContribution: "Percentage of Contribution",
      actualContribution: "Actual Contribution",
      perfectEquality: "Perfect Equality",
      valueAdded: "Value Added",
      strength: "Strength",
      sourceImportance: "Source Importance",
      top10SourcesWithPlayers: "Sources with Player Contributions",
      allSourcesByScore: "All Sources by Score",
      others: "Others",
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
      headerPlayers: "Players",
      noData: "No data available",
      noFilterMatch: "No players match the filter.",
      loading: "Loading data...",
      loadingDetailed: "Loading detailed table...",
      showMore: "Show All Players",
      headers: {
        rank: "Rank",
        player: "Player",
        total_score: "Total Score",
        chest_count: "Chest Count",
        level: "Level",
        punkte: "Points",
        score: "Score",
        chests: "Chests",
        typ: "Type",
        from_: "Source",
        source: "Source",
        category: "Category",
        count: "Count",
        average: "Average",
        min: "Minimum",
        max: "Maximum",
        description: "Details"
      }
    },
    status: {
      initializing: "Initializing application...",
      ready: "Ready",
      loading: "Loading...",
      dataLoaded: "Data loaded successfully",
      dataLoadError: "Error loading data from {0}",
      error: "Error loading data",
      initError: "Initialization error",
      weekSelectError: "Week selection error: {0}",
      dateUnavailable: "Date unavailable",
      lastUpdatedLabel: "Last updated:",
      lastUpdatedUnavailable: "Last update unavailable",
      noDataToDownload: "No data available to download",
      csvDownloaded: "CSV file has been downloaded",
      jsonDownloaded: "Player data has been downloaded",
      playerNotFound: "Player data not found",
      errorDownloading: "Error downloading file",
      empty: "No data available",
      success: "Data loaded successfully"
    },
    modal: { close: "Close" },
    week: {
      label: "Week",
      selector: "Select Week",
      current: "Current Week",
      notAvailable: "No weeks available",
      select: "Select Week",
      weekNumber: "Week {0}",
      format: {
        dateRange: "{0}/{1}-{2}/{3}/{4}",
        weekPart: "Week {0}"
      }
    },
    page: {
      detailedTable: "Detailed Data",
      charts: "Charts",
      analytics: "Analytics",
      scoreSystem: "Score System",
      playerDetails: "Player Details"
    },
  },
};

// Ensure all dictionaries have status and week objects
TEXT_CONTENT.de.status = TEXT_CONTENT.de.status || {};
TEXT_CONTENT.en.status = TEXT_CONTENT.en.status || {};
TEXT_CONTENT.de.week = {
  ...TEXT_CONTENT.de.week,
  label: "Woche",
  current: "Aktuelle Woche",
  notAvailable: "Keine Wochen verfügbar",
  select: "Woche auswählen",
  weekNumber: "Woche {0}"
};
TEXT_CONTENT.en.week = {
  ...TEXT_CONTENT.en.week,
  label: "Week", 
  current: "Current Week",
  notAvailable: "No weeks available",
  select: "Select Week",
  weekNumber: "Week {0}"
};

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

  // Update the week selector display with the new language format
  try {
    // Find the week display elements
    const currentWeekDisplayWeek = document.getElementById('current-week-display-week');
    
    if (currentWeekDisplayWeek) {
      // Extract the current week number from the week display
      let weekNum = null;
      
      // Try to get the week number from data-i18n-replacements
      if (currentWeekDisplayWeek.dataset.i18nReplacements) {
        try {
          const replacements = JSON.parse(currentWeekDisplayWeek.dataset.i18nReplacements);
          weekNum = parseInt(replacements['0']);
        } catch (e) {
          console.error('Error parsing week number from replacements:', e);
        }
      }
      
      // If we couldn't get the week number from attributes, try to extract it from the text
      if (!weekNum) {
        const weekText = currentWeekDisplayWeek.textContent;
        const weekMatch = weekText.match(/(\d+)/);
        if (weekMatch && weekMatch[1]) {
          weekNum = parseInt(weekMatch[1]);
        }
      }
      
      if (weekNum) {
        console.log(`Updating week selector for language: ${currentLanguage}, week: ${weekNum}`);
        
        // Use our internal utility function to update the week selector
        updateWeekSelectorWithLanguage(weekNum);
      } else {
        console.warn('Could not determine current week number for selector update');
      }
    }
  } catch (error) {
    console.error('Error updating week selector display during language change:', error);
  }
  
  // Update the "Last updated" timestamp format
  try {
    const lastUpdatedInfo = document.getElementById('last-updated-info');
    
    if (lastUpdatedInfo) {
      // First, try to get the saved display text directly from localStorage
      const savedDisplayText = localStorage.getItem('lastUpdatedDisplayText');
      
      // If we have saved display text, adjust it for the current language
      if (savedDisplayText) {
        // The display text might include a date range for the week, so we need to parse carefully
        const currentLabel = getText('status.lastUpdatedLabel');
        
        // If there's a date range separator " - ", extract the timestamp part
        let timestamp = '';
        if (savedDisplayText.includes(' - ')) {
          // Format: "DD.MM-DD.MM.YYYY - Last updated: DD. MMM. YYYY, HH:MM"
          const parts = savedDisplayText.split(' - ');
          if (parts.length > 1) {
            // Extract just the timestamp from the second part (after old label)
            const oldTimestampPart = parts[1];
            const oldLabelIndex = oldTimestampPart.indexOf(':');
            if (oldLabelIndex !== -1) {
              timestamp = oldTimestampPart.substring(oldLabelIndex + 1).trim();
            }
          }
        } else {
          // Format: "Last updated: DD. MMM. YYYY, HH:MM"
          const oldLabelIndex = savedDisplayText.indexOf(':');
          if (oldLabelIndex !== -1) {
            timestamp = savedDisplayText.substring(oldLabelIndex + 1).trim();
          }
        }
        
        // If we successfully extracted the timestamp
        if (timestamp) {
          console.log('Using timestamp from savedDisplayText:', timestamp);
          
          // Create a Date object from the timestamp
          try {
            // Try to parse different date formats
            let date = null;
            
            // German format: "DD. MMM. YYYY, HH:MM"
            const germanParts = timestamp.match(/(\d+)\.\s+(\w+)\.\s+(\d+),\s+(\d+):(\d+)/);
            if (germanParts) {
              const [_, day, month, year, hours, minutes] = germanParts;
              
              // Create a date object
              date = new Date(year, 0, 1, hours, minutes); // Start with January 1st
              
              // Adjust the month based on the localized month name
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const monthIndex = months.findIndex(m => 
                month.toLowerCase().includes(m.toLowerCase())
              );
              
              if (monthIndex !== -1) {
                date.setMonth(monthIndex);
              }
              
              // Set the day
              date.setDate(parseInt(day));
            } else {
              // American format "MM/DD/YYYY, HH:MM"
              const americanParts = timestamp.match(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+)/);
              if (americanParts) {
                const [_, month, day, year, hours, minutes] = americanParts;
                date = new Date(year, parseInt(month) - 1, parseInt(day), hours, minutes);
              }
            }
            
            // If we have a valid date, format it according to the current language
            if (date && !isNaN(date.getTime())) {
              let formattedDate;
              if (window.dataLoader && typeof window.dataLoader.formatDate === 'function') {
                formattedDate = window.dataLoader.formatDate(date);
                console.log('Reformatted date using dataLoader:', formattedDate);
              } else {
                formattedDate = formatDate(date);
                console.log('Reformatted date using fallback formatter:', formattedDate);
              }
              
              // Get any current week range text
              let weekRangeText = '';
              const currentWeekDisplayWeek = document.getElementById('current-week-display-week');
              if (currentWeekDisplayWeek && currentWeekDisplayWeek.dataset.i18nReplacements) {
                try {
                  const replacements = JSON.parse(currentWeekDisplayWeek.dataset.i18nReplacements);
                  const weekNum = parseInt(replacements['0']);
                  
                  if (!isNaN(weekNum)) {
                    const weekRange = window.utils?.getWeekDateRange ? window.utils.getWeekDateRange(weekNum) : null;
                    if (weekRange && weekRange.formattedRange) {
                      weekRangeText = `${weekRange.formattedRange} - `;
                    }
                  }
                } catch (e) {
                  console.error('Error getting week range during language switch:', e);
                }
              }
              
              // Update the display with the reformatted date
              const newDisplayText = `${weekRangeText}${currentLabel} ${formattedDate}`;
              lastUpdatedInfo.textContent = newDisplayText;
              
              // Save the updated display text
              localStorage.setItem('lastUpdatedDisplayText', newDisplayText);
              return; // Exit early if we successfully updated
            }
          } catch (e) {
            console.error('Error parsing saved timestamp:', e);
          }
        }
      }
      
      // If we couldn't use the saved display text, fall back to the original approach
      let originalText = lastUpdatedInfo.textContent;
      
      // If the text is empty or showing "not available", try to get from localStorage
      if (!originalText || originalText.includes(getText('status.lastUpdatedUnavailable'))) {
        // Try to get saved timestamp from localStorage
        const savedTimestamp = localStorage.getItem('lastModifiedTimestamp');
        if (savedTimestamp) {
          console.log('Retrieved timestamp from localStorage:', savedTimestamp);
          originalText = `${getText('status.lastUpdatedLabel')} ${savedTimestamp}`;
        }
      }
      
      if (originalText && originalText.trim() !== '') {
        // Find the timestamp part - it comes after the label
        const labelKey = 'status.lastUpdatedLabel';
        const label = getText(labelKey);
        
        // Extract the timestamp from the original text
        const timestamp = originalText.includes(label) 
          ? originalText.split(label)[1].trim() 
          : originalText;
        
        if (timestamp && timestamp !== getText('status.lastUpdatedUnavailable')) {
          // Try to parse the date from the timestamp
          try {
            // Format: "DD. MMM. YYYY, HH:MM" - extract parts
            const parts = timestamp.match(/(\d+)\.\s+(\w+)\.\s+(\d+),\s+(\d+):(\d+)/);
            if (parts) {
              const [_, day, month, year, hours, minutes] = parts;
              
              // Create a date object
              const date = new Date(year, 0, 1, hours, minutes); // Start with January 1st
              
              // Adjust the month based on the localized month name
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const monthIndex = months.findIndex(m => 
                month.toLowerCase().includes(m.toLowerCase())
              );
              
              if (monthIndex !== -1) {
                date.setMonth(monthIndex);
              }
              
              // Set the day
              date.setDate(parseInt(day));
              
              // Format the date using dataLoader's formatDate function if available
              let formattedDate;
              if (window.dataLoader && typeof window.dataLoader.formatDate === 'function') {
                formattedDate = window.dataLoader.formatDate(date);
              } else {
                // Fallback to a basic date formatter if dataLoader is not available
                formattedDate = formatDate(date);
              }
              
              // Update the last updated info with the new format
              lastUpdatedInfo.textContent = `${label} ${formattedDate}`;
              console.log('Updated last updated timestamp with new format:', formattedDate);
            } else {
              // Handle American format MM/DD/YYYY, HH:MM
              const amParts = timestamp.match(/(\d+)\/(\d+)\/(\d+),\s+(\d+):(\d+)/);
              if (amParts) {
                const [_, month, day, year, hours, minutes] = amParts;
                
                // Create a date object
                const date = new Date(year, parseInt(month) - 1, parseInt(day), hours, minutes);
                
                // Format the date
                let formattedDate;
                if (window.dataLoader && typeof window.dataLoader.formatDate === 'function') {
                  formattedDate = window.dataLoader.formatDate(date);
                } else {
                  formattedDate = formatDate(date);
                }
                
                // Update the last updated info with the new format
                lastUpdatedInfo.textContent = `${label} ${formattedDate}`;
                console.log('Updated last updated timestamp from American format:', formattedDate);
              } else {
                // If we can't parse the timestamp, just update the label
                lastUpdatedInfo.textContent = `${label} ${timestamp}`;
              }
            }
          } catch (e) {
            console.error('Error reformatting timestamp:', e);
            // If there's an error with reformatting, just update the label
            lastUpdatedInfo.textContent = `${label} ${timestamp}`;
          }
        } else {
          // If no timestamp or it's unavailable, just show the unavailable message
          lastUpdatedInfo.textContent = getText('status.lastUpdatedUnavailable');
        }
      } else {
        // If there's no text at all, show the unavailable message
        lastUpdatedInfo.textContent = getText('status.lastUpdatedUnavailable');
      }
    }
  } catch (error) {
    console.error('Error updating last updated info during language change:', error);
  }
  
  // Force update document title
  document.title = getText('appTitle');
  
  // If we have references to domManager and updateSortIcons, use them to update UI
  if (domManager && typeof domManager.updateElementText === 'function') {
    // Update DOM elements using domManager if available
    console.log('Using domManager to update UI text');
    domManager.updateElementText();
  }
  
  // Update sort icons if the function is available and there are sort headers
  if (updateSortIcons && document.querySelector('[data-column]')) {
    // Get the current sort state from the UI if possible
    const sortHeaders = document.querySelectorAll('[data-column]');
    const activeHeader = Array.from(sortHeaders).find(header => 
      header.classList.contains('sort-asc') || header.classList.contains('sort-desc')
    );
    
    if (activeHeader) {
      const column = activeHeader.dataset.column;
      const direction = activeHeader.classList.contains('sort-asc') ? 'asc' : 'desc';
      console.log('Updating sort icons for', column, direction);
      updateSortIcons(column, direction, '[data-column]');
    }
  }
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
  currentPlayerData
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
  
  // Use domManager if available for additional UI updates
  if (domManager && typeof domManager.updateViewSpecificTexts === 'function') {
    console.log('Using domManager to update view-specific texts');
    domManager.updateViewSpecificTexts(currentView);
  }
  
  // Update sort icons based on the provided sort states
  if (updateSortIcons) {
    // Update main ranking table sort icons
    if (sortState && document.querySelector('#ranking-table-container th[data-column]')) {
      console.log('Updating ranking table sort icons');
      updateSortIcons(sortState.column, sortState.direction, '#ranking-table-container th[data-column]');
    }
    
    // Update detailed table sort icons
    if (detailedTableSortState && document.querySelector('#detailed-table-container th[data-column]')) {
      console.log('Updating detailed table sort icons');
      updateSortIcons(detailedTableSortState.column, detailedTableSortState.direction, '#detailed-table-container th[data-column]');
    }
    
    // Update score rules table sort icons
    if (scoreRulesSortState && document.querySelector('#score-rules-table-container th[data-column]')) {
      console.log('Updating score rules table sort icons');
      updateSortIcons(scoreRulesSortState.column, scoreRulesSortState.direction, '#score-rules-table-container th[data-column]');
    }
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

/**
 * Sets the reference to the DOM manager module for rendering functions
 * @param {Object} domManagerReference - Reference to the domManager module
 */
export function setRenderFunctions(domManagerReference) {
  // Store reference to domManager for potential use in i18n-related rendering
  console.log('Setting render functions reference');
  domManager = domManagerReference;
}

/**
 * Sets the reference to the updateSortIcons function from utils
 * @param {Function} updateSortIconsFunction - Reference to the updateSortIcons function
 */
export function setUpdateSortIcons(updateSortIconsFunction) {
  // Store reference to updateSortIcons function for use in language updates
  console.log('Setting updateSortIcons function reference');
  updateSortIcons = updateSortIconsFunction;
}

// Variables to store module references
let domManager = null;
let updateSortIcons = null;

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

/**
 * Utility function to update week selector display with the proper language formatting
 * @param {number} weekNumber - The week number to display
 */
export function updateWeekSelectorWithLanguage(weekNumber) {
  if (!weekNumber || isNaN(weekNumber)) {
    console.warn('Invalid week number for selector update:', weekNumber);
    return;
  }

  try {
    const currentWeekDisplayDate = document.getElementById('current-week-display-date');
    const currentWeekDisplayWeek = document.getElementById('current-week-display-week');
    
    if (!currentWeekDisplayDate || !currentWeekDisplayWeek) {
      console.warn('Week selector elements not found');
      return;
    }
    
    // Get the current year
    const year = new Date().getFullYear();
    
    // Calculate the date range for this week
    // This replicates the getWeekDateRange function logic for when it's not directly available
    
    // Calculate the date of the first Monday in the target week (Jan 4th is always in week 1)
    const jan4th = new Date(year, 0, 4);
    
    // Find first Monday of week 1
    const firstMondayWeek1 = new Date(jan4th);
    const dayOfWeek = jan4th.getDay() || 7; // Convert Sunday (0) to 7
    firstMondayWeek1.setDate(jan4th.getDate() - dayOfWeek + 1);
    
    // Calculate Monday of target week
    const targetMonday = new Date(firstMondayWeek1);
    targetMonday.setDate(firstMondayWeek1.getDate() + (weekNumber - 1) * 7);
    
    // Set start date (Monday of target week)
    const startDate = new Date(targetMonday);
    
    // Calculate end date (Sunday of target week)
    const endDate = new Date(targetMonday);
    endDate.setDate(targetMonday.getDate() + 6);
    
    // Get date components for formatting
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth() + 1; // JavaScript months are 0-based
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    
    // Format date range based on language
    let formattedRange = '';
    const isGerman = currentLanguage === 'de';
    
    if (isGerman) {
      // German format: DD.MM-DD.MM.YYYY
      formattedRange = getText('week.format.dateRange', [
        startDay.toString().padStart(2, '0'),
        startMonth.toString().padStart(2, '0'),
        endDay.toString().padStart(2, '0'),
        endMonth.toString().padStart(2, '0'),
        year
      ]);
    } else {
      // English format: MM/DD-MM/DD/YYYY
      formattedRange = getText('week.format.dateRange', [
        startMonth.toString().padStart(2, '0'),
        startDay.toString().padStart(2, '0'),
        endMonth.toString().padStart(2, '0'),
        endDay.toString().padStart(2, '0'),
        year
      ]);
    }
    
    // Update the date display
    currentWeekDisplayDate.textContent = formattedRange;
    
    // Update the week text
    const weekText = getText('week.weekNumber', [weekNumber]);
    currentWeekDisplayWeek.textContent = weekText;
    
    // Update the replacements attribute for future reference
    currentWeekDisplayWeek.setAttribute('data-i18n-replacements', JSON.stringify({"0": weekNumber.toString()}));
    
    console.log('Week selector updated with internal function:', {
      weekNumber,
      formattedRange,
      weekText
    });
    
    return true;
  } catch (error) {
    console.error('Error in updateWeekSelectorWithLanguage:', error);
    return false;
  }
}

/**
 * Simple fallback date formatter when dataLoader is not available
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return getText('status.dateUnavailable');
    }
    
    // Use a simple fallback format with the current language
    const isGerman = currentLanguage === 'de';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (isGerman) {
      return `${day}.${month}.${year}, ${hours}:${minutes}`;
    } else {
      return `${month}/${day}/${year}, ${hours}:${minutes}`;
    }
  } catch (error) {
    console.error('Error in fallback formatDate:', error);
    return getText('status.dateUnavailable');
  }
}
