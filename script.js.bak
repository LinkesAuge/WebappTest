/**
 * script.js
 *
 * Description: Client-side JavaScript logic for the TB Chest Analyzer.
 *              Handles data loading, processing, UI rendering, interactions,
 *              chart generation, i18n, and mobile responsiveness.
 * Usage:
 *     Included in index.html via <script src="script.js" defer></script>
 */

// Define TEXT_CONTENT globally to be accessible throughout the script
const TEXT_CONTENT = {
  de: {
    no_weeks_found: "Keine Wochendaten gefunden. Bitte überprüfen Sie das Datenverzeichnis.",
    no_current_week: "Keine aktuelle Woche identifiziert.",
    init_weekly_data_error: "Fehler bei der Initialisierung der Wochendaten.",
    loading_week_data: "Lade Daten für Woche {week}...",
    week_data_load_error: "Fehler beim Laden der Daten für Woche {week}."
  },
  en: {
    no_weeks_found: "No weekly data found. Please check data directory.",
    no_current_week: "No current week identified.",
    init_weekly_data_error: "Error initializing weekly data.",
    loading_week_data: "Loading data for week {week}...",
    week_data_load_error: "Error loading data for week {week}."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURATION CONSTANTS ---
  const CSV_FILE_PATH = "./data.csv";
  const RULES_CSV_FILE_PATH = "./rules.csv";
  const DEFAULT_LANGUAGE = "de";
  const LANG_STORAGE_KEY = "tbAnalyzerLanguage";
  const LOCALSTORAGE_DATA_KEY = "tbAnalyzerStoredData_Client_v2_Static";
  const CORE_COLUMNS = ["PLAYER", "TOTAL_SCORE", "CHEST_COUNT"]; // Non-analyzable columns
  
  // --- MULTI-WEEK CONFIGURATION CONSTANTS ---
  const DATA_FOLDER_PATH = "./data";
  const WEEKS_JSON_PATH = "./data/weeks.json";
  const WEEK_FILE_PATTERN = "data_week_";
  const DEFAULT_CSV_FILE_PATH = "./data.csv";

  // --- STATE VARIABLES ---
  let allPlayersData = []; // Holds the raw, cleaned data for all players
  let displayData = []; // Holds the data currently being displayed (can be filtered/sorted)
  let allColumnHeaders = []; // Holds all column names from the CSV
  let scoreRulesData = []; // Holds the data from rules.csv
  let currentLanguage = DEFAULT_LANGUAGE; // Tracks the currently selected language
  let currentView = "loading"; // Tracks the currently visible section/view
  let sortState = { column: "TOTAL_SCORE", direction: "desc" }; // Sort state for the main ranking table
  let detailedTableSortState = { column: "PLAYER", direction: "asc" }; // Sort state for the detailed data table
  let scoreRulesSortState = { column: "Typ", direction: "asc" }; // Sort state for the score rules table
  let aggregateStats = {}; // Holds calculated overall statistics
  let currentPlayerData = null; // Holds data for the player being viewed in detail
  let dataLastModifiedTimestamp = null; // Timestamp from the 'Last-Modified' header of data.csv
  
  // --- MULTI-WEEK STATE VARIABLES ---
  let availableWeeks = []; // Holds the list of available weeks
  let mostRecentWeek = null; // Holds the most recent week object
  let currentWeek = null; // Holds the currently selected week
  let currentWeekNumber = null; // Holds the current week number
  let playerData = []; // Holds the current week's player data
  let historicalData = []; // Holds data from all weeks for historical analysis
  let historicalStats = null; // Holds calculated statistics across all weeks
  
  // --- GLOBAL VARIABLES AND STATE ---
  // let playerData = [];
  // let availableWeeks = []; // Array to store available weeks
  // let currentWeekNumber = null; // Current week number
  
  // Holds references to active ApexCharts instances for proper updates/destruction
  let chartInstances = {
    player: null,
    category: null,
    topSources: null,
    scoreDistribution: null,
    scoreVsChests: null,
    frequentSources: null,
    modalChart: null,
    // Add keys for charts page instances to avoid conflicts
    topSourcesChartsPage: null,
    scoreDistributionChartsPage: null,
    scoreVsChestsChartsPage: null,
    frequentSourcesChartsPage: null,
    // Add keys for history charts
    scoreTrendChart: null,
    chestsTrendChart: null,
    topPlayersChart: null,
    categoryTrendChart: null,
  };
  let isInitialized = false; // Flag to prevent actions before the app is ready

  // --- UTILITIES ---
  // Consistent number formatting (using US locale for consistency, display is language-agnostic here)
  const NUMERIC_FORMATTER = new Intl.NumberFormat("en-US");

  // --- i18n TEXT CONTENT ---
  // Merge additional translations into the existing TEXT_CONTENT object
  // Beginning of file
Object.assign(TEXT_CONTENT.de, {
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
  // ... other German translations ...
  week_data_load_error: "Fehler beim Laden der Daten für Woche {{week}}",
  week_data_empty_error: "Keine Daten für Woche {{week}} verfügbar",
  initialization_error: "Fehler bei der Initialisierung der Anwendung",
  weekSelector: {
    loading: "Lade Wochen...",
    select: "Woche auswählen:"
  },
  // Add these lines from the bottom of the file
  no_weeks_found: "Keine Wochendaten gefunden. Bitte überprüfen Sie das Datenverzeichnis.",
  no_current_week: "Keine aktuelle Woche identifiziert.",
  init_weekly_data_error: "Fehler bei der Initialisierung der Wochendaten.",
  loading_week_data: "Lade Daten für Woche {week}...",
  week_data_load_error: "Fehler beim Laden der Daten für Woche {week}."
}, en: {
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
        loadingData: "Loading data from {0}...",
        parsing: "Parsing CSV...",
        processing: "Processing data...",
        saving: "Saving data...",
        loadingRules: "Loading score system from {0}...",
        success: "Successfully processed {0} players.",
        successRules: "Score system loaded.",
        error: "Error",
        info: "Info",
        initError: "Error initializing application",
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
        lastUpdatedUnavailable: "Last updated time unavailable",
      },
      modal: { close: "Close" },
      history: {
        title: "Historical Data Analysis",
        loading: "Loading historical data...",
        totalWeeks: "Total Weeks",
        totalPlayers: "Total Players",
        totalPoints: "Total Points",
        totalChests: "Total Chests",
        avgPointsPerPlayer: "Avg. Points/Player",
        avgChestsPerPlayer: "Avg. Chests/Player",
        weeklyTotals: "Weekly Totals"
      },
      week: "Week",
      date_range: "Date Range",
      player_count: "Player Count",
      total_points: "Total Points",
      total_chests: "Total Chests",
      avg_points_per_player: "Avg. Points/Player",
      avg_chests_per_player: "Avg. Chests/Player",
      score_trend_title: "Score Trend Over Time",
      chests_trend_title: "Chests Trend Over Time",
      top_players_all_time: "Top Players (All Time)",
      category_trends_title: "Category Trends",
      points: "Points",
      chests: "Chests",
      player: "Player",
      value: "Value",
      week_data_load_error: "Error loading data for week {{week}}",
      week_data_empty_error: "No data available for week {{week}}",
      initialization_error: "Error initializing application",
      week: {
        loading: "Loading weeks...",
        select: "Select Week:"
      },
    },
  // Add these lines from the bottom of the file
  no_weeks_found: "No weekly data found. Please check data directory.",
  no_current_week: "No current week identified.",
  init_weekly_data_error: "Error initializing weekly data.",
  loading_week_data: "Loading data for week {week}...",
  week_data_load_error: "Error loading data for week {week}."
});

  // Update TEXT_CONTENT to include all necessary error messages
  TEXT_CONTENT.en.no_weeks_found = "No weekly data found. Please check data directory.";
  TEXT_CONTENT.en.no_current_week = "No current week identified.";
  TEXT_CONTENT.en.init_weekly_data_error = "Error initializing weekly data.";
  TEXT_CONTENT.en.loading_week_data = "Loading data for week {week}...";
  TEXT_CONTENT.en.week_data_load_error = "Error loading data for week {week}.";

  TEXT_CONTENT.de.no_weeks_found = "Keine Wochendaten gefunden. Bitte überprüfen Sie das Datenverzeichnis.";
  TEXT_CONTENT.de.no_current_week = "Keine aktuelle Woche identifiziert.";
  TEXT_CONTENT.de.init_weekly_data_error = "Fehler bei der Initialisierung der Wochendaten.";
  TEXT_CONTENT.de.loading_week_data = "Lade Daten für Woche {week}...";
  TEXT_CONTENT.de.week_data_load_error = "Fehler beim Laden der Daten für Woche {week}.";
});
  

  // --- DOM ELEMENT REFERENCES ---
  // Declared globally, assigned in assignElementReferences
  let statusArea,
    loadingSpinner,
    statusMessage,
    downloadCsvHeaderButton,
    breadcrumbNav,
    breadcrumbDashboardLink,
    breadcrumbCurrentPageItem,
    breadcrumbCurrentPageName,
    emptyStateSection,
    dashboardSection,
    historySection,
    
    // History section elements
    historyLoadingIndicator,
    historyContent,
    historyTotalWeeks,
    historyTotalPlayers,
    historyTotalPoints,
    historyTotalChests,
    historyAvgPointsPerPlayer,
    historyAvgChestsPerPlayer,
    weeklyTotalsTable,
    scoreTrendChart,
    chestsTrendChart,
    topPlayersChart,
    categoryTrendChart,
    
    statTotalPlayers,
    statTotalScore,
    statTotalChests,
    statAvgScore,
    statAvgChests,
    lastUpdatedInfo,
    topSourcesChartContainer,
    scoreDistributionChartContainer,
    scoreVsChestsChartContainer,
    frequentSourcesChartContainer,
    topChestsTableBody,
    rankingSection,
    filterInput,
    rankingTableBody,
    detailedTableSection,
    detailedTableContainer,
    backToDashboardFromDetailedTable,
    chartsSection,
    chartsTopSourcesContainer,
    chartsDistributionContainer,
    chartsScoreVsChestsContainer,
    chartsFrequentSourcesContainer,
    analyticsSection,
    scoreSystemSection,
    scoreRulesTableContainer,
    detailSection,
    backToDashboardFromDetail,
    downloadPlayerJsonButton,
    playerNameDetail,
    playerScoreDetail,
    playerChestsDetail,
    playerRankDetail,
    playerBreakdownList,
    playerChartContainer,
    backToDashboardFromAnalytics,
    categorySelect,
    categoryAnalysisContent,
    categoryRankingBody,
    categoryNameTable,
    categoryNameChart,
    categoryChartContainer,
    categoryPrompt,
    navLinks,
    desktopNavLinks,
    langDeButton,
    langEnButton,
    chartModal,
    modalChartTitle,
    modalChartContainer,
    modalCloseButton,
    mobileMenuButton,
    mobileMenu,
    mobileNavLinks,
    downloadCsvMobileButton,
    mobileDownloadContainer,
    iconMenuClosed,
    iconMenuOpen;

  /**
   * Assigns references to frequently used DOM elements to variables.
   */
  function assignElementReferences() {
    console.log("Assigning DOM Element References...");
    try {
      statusArea = document.getElementById("status-area");
      loadingSpinner = document.getElementById("loading-spinner");
      statusMessage = document.getElementById("status-message");
      downloadCsvHeaderButton = document.getElementById(
        "download-csv-header-button"
      );
      breadcrumbNav = document.getElementById("breadcrumb-nav");
      breadcrumbDashboardLink = document.getElementById(
        "breadcrumb-dashboard-link"
      );
      breadcrumbCurrentPageItem = document.getElementById(
        "breadcrumb-current-page-item"
      );
      breadcrumbCurrentPageName = document.getElementById(
        "breadcrumb-current-page-name"
      );
      emptyStateSection = document.getElementById("empty-state-section");
      dashboardSection = document.getElementById("dashboard-section");
      historySection = document.getElementById("history-section");
      
      // History section elements
      historyLoadingIndicator = document.getElementById("history-loading-indicator");
      historyContent = document.getElementById("history-content");
      historyTotalWeeks = document.getElementById("history-total-weeks");
      historyTotalPlayers = document.getElementById("history-total-players");
      historyTotalPoints = document.getElementById("history-total-points");
      historyTotalChests = document.getElementById("history-total-chests");
      historyAvgPointsPerPlayer = document.getElementById("history-avg-points-per-player");
      historyAvgChestsPerPlayer = document.getElementById("history-avg-chests-per-player");
      weeklyTotalsTable = document.getElementById("weekly-totals-table");
      scoreTrendChart = document.getElementById("score-trend-chart");
      chestsTrendChart = document.getElementById("chests-trend-chart");
      topPlayersChart = document.getElementById("top-players-chart");
      categoryTrendChart = document.getElementById("category-trend-chart");
      
      statTotalPlayers = document.getElementById("stat-total-players");
      statTotalScore = document.getElementById("stat-total-score");
      statTotalChests = document.getElementById("stat-total-chests");
      statAvgScore = document.getElementById("stat-avg-score");
      statAvgChests = document.getElementById("stat-avg-chests");
      lastUpdatedInfo = document.getElementById("last-updated-info");
      topSourcesChartContainer = document.getElementById(
        "top-sources-chart-container"
      );
      scoreDistributionChartContainer = document.getElementById(
        "score-distribution-chart-container"
      );
      scoreVsChestsChartContainer = document.getElementById(
        "score-vs-chests-chart-container"
      );
      frequentSourcesChartContainer = document.getElementById(
        "frequent-sources-chart-container"
      );
      topChestsTableBody = document.getElementById("top-chests-table-body");
      rankingSection = document.getElementById("ranking-section");
      filterInput = document.getElementById("filter-input");
      rankingTableBody = document.getElementById("ranking-table-body");
      detailedTableSection = document.getElementById("detailed-table-section");
      detailedTableContainer = document.getElementById(
        "detailed-table-container"
      );
      backToDashboardFromDetailedTable = document.getElementById(
        "back-to-dashboard-from-detail"
      );
      chartsSection = document.getElementById("charts-section");
      chartsTopSourcesContainer = document.getElementById(
        "charts-top-sources-container"
      );
      chartsDistributionContainer = document.getElementById(
        "charts-distribution-container"
      );
      chartsScoreVsChestsContainer = document.getElementById(
        "charts-score-vs-chests-container"
      );
      chartsFrequentSourcesContainer = document.getElementById(
        "charts-frequent-sources-container"
      );
      analyticsSection = document.getElementById("analytics-section");
      scoreSystemSection = document.getElementById("score-system-section");
      scoreRulesTableContainer = document.getElementById(
        "score-rules-table-container"
      );
      detailSection = document.getElementById("detail-section");
      backToDashboardFromDetail = document.getElementById(
        "back-to-dashboard-from-detail"
      );
      downloadPlayerJsonButton = document.getElementById(
        "download-player-json-button"
      );
      playerNameDetail = document.getElementById("player-name-detail");
      playerScoreDetail = document.getElementById("player-score-detail");
      playerChestsDetail = document.getElementById("player-chests-detail");
      playerRankDetail = document.getElementById("player-rank-detail");
      playerBreakdownList = document.getElementById("player-breakdown-list");
      playerChartContainer = document.getElementById("player-chart-container");
      backToDashboardFromAnalytics = document.getElementById(
        "back-to-dashboard-from-analytics"
      );
      categorySelect = document.getElementById("category-select");
      categoryAnalysisContent = document.getElementById(
        "category-analysis-content"
      );
      categoryRankingBody = document.getElementById("category-ranking-body");
      categoryNameTable = document.getElementById("category-name-table");
      categoryNameChart = document.getElementById("category-name-chart");
      categoryChartContainer = document.getElementById(
        "category-chart-container"
      );
      categoryPrompt = document.getElementById("category-prompt");
      navLinks = document.querySelectorAll(".nav-link"); // All nav links (desktop + mobile)

      // --- CORRECTED SELECTOR for Desktop Links ---
      desktopNavLinks = document.querySelectorAll(
        "header nav a.nav-link" // Use descendant selector (space) instead of direct child (>)
      );

      langDeButton = document.getElementById("lang-de");
      langEnButton = document.getElementById("lang-en");
      chartModal = document.getElementById("chart-modal");
      modalChartTitle = document.getElementById("modal-chart-title");
      modalChartContainer = document.getElementById("modal-chart-container");
      modalCloseButton = document.getElementById("modal-close-button");
      // Mobile Menu Elements
      mobileMenuButton = document.getElementById("mobile-menu-button");
      mobileMenu = document.getElementById("mobile-menu");
      mobileNavLinks = mobileMenu
        ? mobileMenu.querySelectorAll(".nav-link")
        : []; // Links within mobile menu
      downloadCsvMobileButton = document.getElementById(
        "download-csv-mobile-button"
      );
      mobileDownloadContainer = document.getElementById(
        "mobile-download-container"
      ); // Container for the mobile download button
      iconMenuClosed = document.getElementById("icon-menu-closed");
      iconMenuOpen = document.getElementById("icon-menu-open");

      console.log("DOM Element References assigned.");
    } catch (error) {
      console.error("Error assigning DOM element references:", error);
      if (statusMessage)
        statusMessage.textContent = "Critical error: UI elements missing.";
      if (statusArea) statusArea.classList.add("text-red-500");
      throw error;
    }
  }

  // --- INITIALIZATION ---
  /**
   * Delays execution slightly, then assigns references, sets up listeners, and initializes the app.
   */
  setTimeout(() => {
    console.log("Starting initialization after timeout...");
    try {
      assignElementReferences();
      setupEventListeners();
      initializeApp();
      console.log("Initialization timeout finished successfully.");
    } catch (initError) {
      console.error("CRITICAL ERROR during initialization:", initError);
      if (statusMessage) {
        statusMessage.textContent =
          "Failed to initialize application. Please check the console.";
        statusArea?.classList.add("text-red-500");
      } else {
        alert("Failed to initialize application. Check console for errors.");
      }
    }
  }, 0);

  /**
   * Main application initialization function.
   */
  async function initializeApp() {
    console.log("Initializing application...");
    
    // Set initial state
    setStatus(getText("status.initializing"), "info");
    
    // Load language preference and initialize translations
    currentLanguage = getLanguagePreference(); // Use the existing function instead
    console.log(`Setting initial language to: ${currentLanguage}`);
    document.documentElement.lang = currentLanguage;
    updateLanguageSwitcherUI();
    
    initializeTranslations();
    
    // Set up event listeners
    setupEventListeners();
    
    try {
      // Start with empty view
      switchView("empty");
      
      // Initialize the weekly data system - this also loads allPlayersData
      await initWeeklyDataSystem();
      
      // Load score rules data if needed
      if (scoreRulesData.length === 0) {
        await loadScoreRulesData();
      }
      
      // Load historical data in the background
      loadHistoricalDataInBackground();
      
      // If data loaded successfully, go to dashboard view
      if (allPlayersData.length > 0) {
        switchView("dashboard");
      } else {
        // If no data, show empty state
        switchView("empty");
      }
    } catch (error) {
      console.error("Error during initialization:", error);
      setStatus(getText("status.initError"), "error");
      switchView("empty");
    }
    
    // Set initialized flag
    isInitialized = true;
  }

  // --- i18n Functions ---
  /**
   * Sets the application language, updates UI text, and re-renders components.
   * @param {string} lang - The language code ('de' or 'en').
   */
  function setLanguage(lang) {
    if (!isInitialized || lang === currentLanguage || !TEXT_CONTENT[lang])
      return;
    console.log(`Setting language to: ${lang}`);
    currentLanguage = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    updateLanguageSwitcherUI();
    updateUIText(); // Update all static text first

    // Re-render dynamic components if data is loaded
    if (allPlayersData.length > 0) {
      displayLastUpdatedTimestamp();
      if (currentView === "dashboard") renderDashboard();
      if (currentView === "detailed-table") renderDetailedTable();
      if (currentView === "charts") renderChartsView();
      if (currentView === "analytics" && categorySelect?.value) {
        renderCategoryAnalysis(categorySelect.value);
        renderCategoryChart(allPlayersData, categorySelect.value);
      }
      if (currentView === "detail" && currentPlayerData) {
        const rank = playerRankDetail?.textContent || "N/A";
        renderPlayerDetail(currentPlayerData, rank);
        renderPlayerChart(currentPlayerData);
      }
    }
    if (currentView === "score-system" && scoreRulesData.length > 0) {
      renderScoreRulesTable();
    }
  }

  /**
   * Retrieves the user's language preference from localStorage or defaults.
   * @returns {string} The preferred language code.
   */
  function getLanguagePreference() {
    return localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANGUAGE;
  }

  /**
   * Gets translated text for a given key, performing replacements if provided.
   * @param {string} key - The i18n key (e.g., 'nav.dashboard').
   * @param {object} [replacements={}] - An object of placeholder keys and their values.
   * @returns {string} The translated text or the key itself if not found.
   */
  function getText(key, replacements = {}) {
    const langContent =
      TEXT_CONTENT[currentLanguage] || TEXT_CONTENT[DEFAULT_LANGUAGE];
    let text = key.split(".").reduce((o, i) => o?.[i], langContent);
    if (text === undefined) {
      console.warn(`i18n key not found for lang '${currentLanguage}': ${key}`);
      const defaultContent = TEXT_CONTENT[DEFAULT_LANGUAGE];
      text = key.split(".").reduce((o, i) => o?.[i], defaultContent);
      if (text === undefined) {
        console.error(`i18n key "${key}" missing in both languages!`);
        return `[${key}]`;
      }
    }
    Object.entries(replacements).forEach(([rKey, rValue]) => {
      const placeholder = `{${rKey}}`;
      text = text.replace(
        new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
        String(rValue)
      );
    });
    return text;
  }

  /**
   * Updates all UI elements with data-i18n-key attributes based on the current language.
   */
  function updateUIText() {
    console.log(`Updating UI text for language: ${currentLanguage}`);
    document.title = getText("appTitle");

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
      } else if (el.tagName === "INPUT" && el.placeholder !== undefined) {
        el.placeholder = text;
      } else if (el.tagName === "OPTION" && el.value === "") {
        el.textContent = text;
      } else if (el.tagName === "BUTTON") {
        // Try to update only the text span inside buttons, preserving icons
        let textContainer = el.querySelector("span:not(.sr-only)");
        if (
          textContainer &&
          (key.startsWith("button.") ||
            key === "playerDetail.downloadJson" ||
            key === "nav.dashboard") // Add other keys that target button spans
        ) {
          textContainer.textContent = text;
        } else if (!el.querySelector("i") && !textContainer) {
          // Fallback for simple text buttons
          el.textContent = text;
        }
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
          // else { console.warn("Could not find text node to update in element:", el); }
        }
      }
    });

    // Update titles
    document.querySelectorAll("[data-i18n-title-key]").forEach((el) => {
      el.title = getText(el.dataset.i18nTitleKey);
    });

    // Update sort icons (important after text updates which might clear them)
    updateSortIcons(
      sortState.column,
      sortState.direction,
      "#ranking-section thead th[data-column]"
    );
    updateSortIcons(
      detailedTableSortState.column,
      detailedTableSortState.direction,
      "#detailed-table-container thead th[data-column]"
    );
    updateSortIcons(
      scoreRulesSortState.column,
      scoreRulesSortState.direction,
      "#score-rules-table-container thead th[data-column]"
    );

    // Update dynamic breadcrumb text if visible
    if (breadcrumbNav && !breadcrumbNav.classList.contains("hidden")) {
      const viewKeyMap = {
        "detailed-table": "nav.data",
        charts: "nav.charts",
        analytics: "nav.analytics",
        "score-system": "nav.scoreSystem",
        detail: null, // Handled separately
        history: "nav.history"
      };
      const currentKey = viewKeyMap[currentView];
      if (currentKey) {
        breadcrumbCurrentPageName.textContent = getText(currentKey);
      } else if (currentView === "detail" && params.playerName) {
        breadcrumbCurrentPageName.textContent = currentPlayerData.PLAYER; // Use player name for detail view
      }
    }
    // Ensure timestamp is updated if needed
    displayLastUpdatedTimestamp();
  }

  /**
   * Updates the visual state of the language switcher buttons.
   */
  function updateLanguageSwitcherUI() {
    langDeButton?.classList.toggle("active", currentLanguage === "de");
    langEnButton?.classList.toggle("active", currentLanguage === "en");
  }

  // --- EVENT LISTENERS SETUP ---
  /**
   * Attaches all necessary event listeners to DOM elements.
   */
  function setupEventListeners() {
    console.log("Setting up event listeners...");
    /**
     * Helper to safely add event listeners.
     * @param {Element|null} element - The DOM element.
     * @param {string} eventType - The event type.
     * @param {Function} handler - The event handler function.
     * @param {string} elementName - A descriptive name for logging.
     */
    function safeAddListener(element, eventType, handler, elementName) {
      if (element) {
        element.addEventListener(eventType, handler);
      } else {
        console.error(
          `Listener Setup Error: Element "${elementName}" not found.`
        );
      }
    }

    // General Controls
    safeAddListener(
      downloadCsvHeaderButton,
      "click",
      downloadFullDataCSV,
      "downloadCsvHeaderButton"
    );
    safeAddListener(filterInput, "input", handleFilter, "filterInput");
    safeAddListener(
      langDeButton,
      "click",
      () => setLanguage("de"),
      "langDeButton"
    );
    safeAddListener(
      langEnButton,
      "click",
      () => setLanguage("en"),
      "langEnButton"
    );

    // Table Interactions
    safeAddListener(
      rankingTableBody,
      "click",
      handleTableRowClick,
      "rankingTableBody"
    );
    safeAddListener(
      topChestsTableBody,
      "click",
      handleTableRowClick,
      "topChestsTableBody"
    );
    const rankingThead = rankingSection
      ? rankingSection.querySelector("thead")
      : null;
    safeAddListener(
      rankingThead,
      "click",
      handleSortClick,
      "Ranking Table Header"
    );
    safeAddListener(
      detailedTableContainer,
      "click",
      handleDetailedTableSortClick,
      "Detailed Table Container"
    );
    safeAddListener(
      scoreRulesTableContainer,
      "click",
      handleScoreRulesTableSortClick,
      "Score Rules Table Container"
    );

    // --- Navigation ---
    console.log("Desktop Nav Links Found:", desktopNavLinks.length); // DEBUG
    desktopNavLinks.forEach((link) => {
      console.log(
        "Attaching listener to desktop link:",
        link.id || link.dataset.view
      ); // DEBUG
      safeAddListener(
        link,
        "click",
        (e) => {
          e.preventDefault();
          if (!isInitialized) {
            console.log("Navigation blocked during initialization.");
            return;
          }
          const view = link.dataset.view;
          if (view) {
            console.log("Desktop nav click executing for view:", view); // DEBUG
            switchView(view);
          } else {
            console.warn(
              "Desktop nav link clicked with no data-view attribute:",
              link
            );
          }
        },
        `Desktop Nav Link (${link.id || link.dataset.view || "NoView"})`
      );
    });

    console.log("Mobile Nav Links Found:", mobileNavLinks.length); // DEBUG
    mobileNavLinks.forEach((link) => {
      console.log(
        "Attaching listener to mobile link:",
        link.id || link.dataset.view
      ); // DEBUG
      safeAddListener(
        link,
        "click",
        (e) => {
          e.preventDefault();
          if (!isInitialized) return;
          const view = link.dataset.view;
          if (view) {
            console.log("Mobile nav click executing for view:", view); // DEBUG
            switchView(view);
          } else {
            console.warn(
              "Mobile nav link clicked with no data-view attribute:",
              link
            );
          }
        },
        `Mobile Nav Link (${link.id || link.dataset.view || "NoView"})`
      );
    });
    safeAddListener(
      mobileMenuButton,
      "click",
      () => {
        if (
          !mobileMenuButton ||
          !mobileMenu ||
          !iconMenuClosed ||
          !iconMenuOpen
        )
          return;
        const isExpanded =
          mobileMenuButton.getAttribute("aria-expanded") === "true";
        mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
        mobileMenu.classList.toggle("hidden");
        iconMenuClosed.classList.toggle("hidden");
        iconMenuClosed.classList.toggle("block");
        iconMenuOpen.classList.toggle("hidden");
        iconMenuOpen.classList.toggle("block");
      },
      "mobileMenuButton"
    );
    safeAddListener(
      downloadCsvMobileButton,
      "click",
      () => {
        downloadFullDataCSV();
        // Close the menu manually
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
          if (mobileMenuButton)
            mobileMenuButton.setAttribute("aria-expanded", "false");
          if (
            iconMenuClosed &&
            iconMenuOpen &&
            iconMenuClosed.classList.contains("hidden")
          ) {
            iconMenuClosed.classList.remove("hidden");
            iconMenuClosed.classList.add("block");
            iconMenuOpen.classList.add("hidden");
            iconMenuOpen.classList.remove("block");
          }
        }
      },
      "downloadCsvMobileButton"
    );
    safeAddListener(
      breadcrumbDashboardLink,
      "click",
      (e) => {
        e.preventDefault();
        if (!isInitialized) return;
        switchView("dashboard");
      },
      "breadcrumbDashboardLink"
    );
    safeAddListener(
      backToDashboardFromDetail,
      "click",
      () => switchView("dashboard"),
      "backToDashboardFromDetail"
    );
    safeAddListener(
      backToDashboardFromDetailedTable,
      "click",
      () => switchView("dashboard"),
      "backToDashboardFromDetailedTable"
    );
    safeAddListener(
      backToDashboardFromAnalytics,
      "click",
      () => switchView("dashboard"),
      "backToDashboardFromAnalytics"
    );

    // Detail View
    safeAddListener(
      downloadPlayerJsonButton,
      "click",
      () => {
        if (currentPlayerData) {
          downloadPlayerDataJSON(currentPlayerData);
        }
      },
      "downloadPlayerJsonButton"
    );

    // Analytics View
    safeAddListener(
      categorySelect,
      "change",
      handleCategorySelect,
      "categorySelect"
    );

    // Chart Interactions
    safeAddListener(
      modalCloseButton,
      "click",
      handleModalClose,
      "modalCloseButton"
    );
    safeAddListener(
      chartModal,
      "click",
      (e) => {
        if (e.target === chartModal) handleModalClose();
      },
      "chartModalBackdrop"
    );
    safeAddListener(
      dashboardSection,
      "click",
      handleExpandChartClick,
      "dashboardSection"
    );
    safeAddListener(
      chartsSection,
      "click",
      handleExpandChartClick,
      "chartsSection"
    );

    console.log("Event listeners setup complete.");
  }

  // --- VIEW MANAGEMENT ---
  /**
   * Switches to the specified view
   * @param {string} viewName Name of the view to switch to
   * @param {Object} [params] Optional parameters for the view
   */
  function switchView(viewName, params = {}) {
    console.log(`Switching to view: ${viewName}`);
    
    // Close mobile menu if open
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      if (mobileMenuButton) {
        mobileMenuButton.setAttribute("aria-expanded", "false");
      }
      if (iconMenuClosed && iconMenuOpen && iconMenuClosed.classList.contains("hidden")) {
        iconMenuClosed.classList.remove("hidden");
        iconMenuClosed.classList.add("block");
        iconMenuOpen.classList.add("hidden");
        iconMenuOpen.classList.remove("block");
      }
    }
    
    // Update current view
    currentView = viewName;
    
    // Hide all view sections
    const sections = [
      dashboardSection,
      detailSection,
      analyticsSection,
      chartsSection,
      scoreSystemSection,
      detailedTableSection,
      historySection
    ];
    
    sections.forEach(section => {
      if (section) {
        section.classList.add("hidden");
      }
    });
    
    // Show breadcrumb for all views except dashboard and empty
    if (breadcrumbNav) {
      if (viewName === "dashboard" || viewName === "empty") {
        breadcrumbNav.classList.add("hidden");
      } else {
        breadcrumbNav.classList.remove("hidden");
        // Update breadcrumb text
        if (breadcrumbCurrentPageName) {
          const viewTextMap = {
            "detailed-table": "nav.data",
            "charts": "nav.charts",
            "analytics": "nav.analytics",
            "score-system": "nav.scoreSystem",
            "history": "nav.history"
          };
          
          if (viewTextMap[viewName]) {
            breadcrumbCurrentPageName.textContent = getText(viewTextMap[viewName]);
          } else if (viewName === "detail" && params.playerName) {
            breadcrumbCurrentPageName.textContent = params.playerName;
          }
        }
      }
    }
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.classList.remove("active");
    });
    
    // Set active class on relevant nav links
    const desktopNavId = getNavIdForView(viewName, false);
    const mobileNavId = getNavIdForView(viewName, true);
    
    const desktopNavElement = document.getElementById(desktopNavId);
    const mobileNavElement = document.getElementById(mobileNavId);
    
    if (desktopNavElement) {
      desktopNavElement.classList.add("active");
    }
    
    if (mobileNavElement) {
      mobileNavElement.classList.add("active");
    }

    // Show and render the appropriate view
    switch (viewName) {
      case "dashboard":
        if (dashboardSection) {
          dashboardSection.classList.remove("hidden");
        }
        if (allPlayersData.length > 0) {
          renderDashboard();
        } else {
          displayError(getText("table.noData"));
        }
        break;
      case "detailed-table":
        if (detailedTableSection) {
          detailedTableSection.classList.remove("hidden");
        }
        if (allPlayersData.length > 0) {
          renderDetailedTable();
        } else {
          displayError(getText("table.noData"));
        }
        break;
      case "charts":
        if (chartsSection) {
          chartsSection.classList.remove("hidden");
        }
        if (allPlayersData.length > 0) {
          renderChartsView();
        } else {
          displayError(getText("table.noData"));
        }
        break;
      case "analytics":
        if (analyticsSection) {
          analyticsSection.classList.remove("hidden");
        }
        if (allPlayersData.length > 0) {
          if (categorySelect?.value) {
            handleCategorySelect({ target: categorySelect });
          } else {
            // Reset analytics view if no category selected
            resetAnalyticsView();
          }
        } else {
          displayError(getText("table.noData"));
        }
        break;
      case "score-system":
        if (scoreSystemSection) {
          scoreSystemSection.classList.remove("hidden");
        }
        if (scoreRulesData.length > 0) {
          renderScoreRulesTable();
        } else {
          loadScoreRulesData().then(loaded => {
            if (loaded) {
              renderScoreRulesTable();
            } else {
              displayError(getText("scoreSystem.loading") + " Failed.");
            }
          });
        }
        break;
      case "detail":
        if (params.playerName) {
          const playerData = allPlayersData.find(p => p.PLAYER === params.playerName);
          if (playerData && detailSection) {
            currentPlayerData = playerData;
            detailSection.classList.remove("hidden");
            renderPlayerDetail(playerData, params.rank || "N/A");
            renderPlayerChart(playerData);
          } else {
            console.error("Player not found:", params.playerName);
            switchView("dashboard");
            displayError(`Could not load details for ${params.playerName}`);
          }
        } else {
          console.error("No player name provided for detail view");
          switchView("dashboard");
        }
        break;
      case "history":
        if (historySection) {
          historySection.classList.remove("hidden");
        }
        renderHistoryView();
        break;
      case "empty":
        // No specific rendering needed
        break;
      default:
        console.warn(`Unknown view: ${viewName}`);
        switchView("dashboard");
        return;
    }
    
    // Update status area
    if (!statusArea?.classList.contains("text-red-500")) {
      setStatus("");
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update UI text after view switch
    setTimeout(updateUIText, 0);
  }
  
  /**
   * Gets the nav element ID for a given view
   * @param {string} viewName The view name
   * @param {boolean} isMobile Whether to get mobile or desktop ID
   * @returns {string} The nav element ID
   */
  function getNavIdForView(viewName, isMobile) {
    const prefix = isMobile ? "mobile-nav-" : "nav-";
    const viewNavMap = {
      "dashboard": "dashboard",
      "detailed-table": "data",
      "charts": "charts",
      "analytics": "analytics",
      "score-system": "score-system",
      "history": "history",
      "detail": "",
      "empty": ""
    };
    
    const suffix = viewNavMap[viewName] || "";
    return suffix ? `${prefix}${suffix}` : "";
  }
  
  /**
   * Renders the history view with weekly stats and trend charts
   */
  function renderHistoryView() {
    console.log("Rendering history view");
    
    // Show loading indicator
    if (historyLoadingIndicator) {
      historyLoadingIndicator.style.display = "block";
    }
    
    // Hide main content until data is ready
    if (historyContent) {
      historyContent.style.display = "none";
    }
    
    // Return if no historical data loaded yet
    if (!historicalData || historicalData.length === 0 || !historicalStats) {
      console.log("Historical data not loaded yet, loading now");
      
      // Load historical data if not already loaded
      loadHistoricalDataInBackground().then(() => {
        // Check if still on history view after data loaded
        if (currentView === "history") {
          renderHistoryViewContent();
        }
      });
      return;
    }
    
    renderHistoryViewContent();
  }
  
  /**
   * Renders the content of the history view once data is available
   */
  function renderHistoryViewContent() {
    console.log("Rendering history view content");
    
    // Hide loading indicator
    if (historyLoadingIndicator) {
      historyLoadingIndicator.style.display = "none";
    }
    
    // Show main content
    if (historyContent) {
      historyContent.style.display = "block";
    }
    
    // Render weekly totals table
    renderWeeklyTotalsTable(historicalStats.weeklyTotals);
    
    // Render charts
    renderScoreTrendChart(historicalStats.weeklyTotals);
    renderChestsTrendChart(historicalStats.weeklyTotals);
    renderTopPlayersChart(historicalStats.playerTracking);
    renderCategoryTrendChart(historicalStats.categoryTrends);
    
    // Update summary statistics
    updateHistorySummary();
  }
  
  /**
   * Updates the summary section on the history page
   */
  function updateHistorySummary() {
    if (!historicalStats) return;
    
    // Update summary boxes
    updateValueDisplay("history-total-weeks", historicalStats.weeklyTotals.length);
    updateValueDisplay("history-total-players", historicalStats.totalPlayers);
    updateValueDisplay("history-total-points", historicalStats.totalPointsAllWeeks);
    updateValueDisplay("history-total-chests", historicalStats.totalChestsAllWeeks);
    
    // Calculate and display average points per player
    const avgPointsPerPlayer = historicalStats.totalPlayers > 0
      ? (historicalStats.totalPointsAllWeeks / historicalStats.totalPlayers).toFixed(2)
      : 0;
    updateValueDisplay("history-avg-points-per-player", avgPointsPerPlayer);
    
    // Calculate and display average chests per player
    const avgChestsPerPlayer = historicalStats.totalPlayers > 0
      ? (historicalStats.totalChestsAllWeeks / historicalStats.totalPlayers).toFixed(2)
      : 0;
    updateValueDisplay("history-avg-chests-per-player", avgChestsPerPlayer);
  }

  // --- STATUS/LOADING/ERROR HANDLING ---
  /**
   * Sets a status message with optional type and duration.
   * @param {string} message - The message to display.
   * @param {string} type - The status type ('info', 'success', 'warning', 'error').
   * @param {number} duration - Optional duration in ms, 0 for persistent.
   */
  function setStatus(message, type = "info", duration = 0) {
    if (!statusMessage || !loadingSpinner || !statusArea) return;
    loadingSpinner.classList.add("hidden");
    statusMessage.textContent = message;
    statusArea.className = "text-center py-4 min-h-[2.5rem]"; // Reset classes
    if (type === "error") statusArea.classList.add("text-red-500");
    else if (type === "success") statusArea.classList.add("text-green-500");
    else statusArea.classList.add("text-slate-400");
    
    if ((type === "success" || type === "info") && duration > 0) {
      setTimeout(() => {
        if (statusMessage.textContent === message) setStatus("");
      }, duration);
    }
  }
  
  /**
   * Display an error message in the status area
   * @param {string} message - The error message to display
   */
  function displayError(message) {
    console.error("Error:", message);
    setStatus(message, "error", 0);
  }
  
  /**
   * Display a warning message in the status area
   * @param {string} message - The warning message to display
   */
  function displayWarningMessage(message) {
    console.warn("Warning:", message);
    setStatus(message, "warning", 5000);
  }
  /** Displays the loading spinner and message. */
  function showLoading(message = "Loading...") {
    if (!statusMessage || !loadingSpinner) return;
    setStatus(message, "info");
    loadingSpinner.classList.remove("hidden");
  }
  /** Hides the loading spinner and clears non-error status messages. */
  function hideLoading() {
    if (!statusMessage || !loadingSpinner || !statusArea) return;
    loadingSpinner.classList.add("hidden");
    if (
      !statusArea.classList.contains("text-red-500") &&
      !statusArea.classList.contains("text-green-500")
    ) {
      statusMessage.textContent = "";
    }
  }

  // --- LOCALSTORAGE FLAG ---
  /** Saves a flag indicating data has been loaded. */
  function saveDataToLocalStorage() {
    try {
      if (allPlayersData.length > 0) {
        localStorage.setItem(LOCALSTORAGE_DATA_KEY, "true");
        console.log("LocalStorage flag set: Data loaded.");
      } else {
        localStorage.removeItem(LOCALSTORAGE_DATA_KEY);
        console.log("LocalStorage flag removed: No data loaded.");
      }
    } catch (e) {
      console.warn("Could not access localStorage to save flag:", e);
    }
  }
  /** Checks if the data loaded flag exists. */
  function loadDataFromLocalStorage() {
    try {
      const flag = localStorage.getItem(LOCALSTORAGE_DATA_KEY) === "true";
      console.log(`LocalStorage flag check: ${flag}`);
      return flag;
    } catch (e) {
      console.warn("Could not access localStorage to load flag:", e);
      return false;
    }
  }

  // --- DATA TIMESTAMP ---
  /** Displays the 'Last-Modified' timestamp of the data file. */
  function displayLastUpdatedTimestamp() {
    if (!lastUpdatedInfo) return;
    if (dataLastModifiedTimestamp) {
      try {
        const date = new Date(dataLastModifiedTimestamp);
        if (isNaN(date.getTime()))
          throw new Error("Invalid Date parsed from header");
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const formattedDate = new Intl.DateTimeFormat(
          currentLanguage,
          options
        ).format(date);
        lastUpdatedInfo.textContent = `${getText(
          "status.lastUpdatedLabel"
        )} ${formattedDate}`;
      } catch (error) {
        console.error("Error formatting Last-Modified timestamp:", error);
        lastUpdatedInfo.textContent = getText("status.lastUpdatedUnavailable");
      }
    } else {
      lastUpdatedInfo.textContent = getText("status.lastUpdatedUnavailable");
    }
  }

  // --- STATIC CSV LOADING & PARSING ---
  /**
   * Fetches, parses, and processes the main data CSV file.
   * @returns {Promise<boolean>} True if data loaded successfully, false otherwise.
   */
  async function loadStaticCsvData() {
    console.log(`Fetching static CSV: ${CSV_FILE_PATH}`);
    showLoading(getText("status.loadingData", { 0: CSV_FILE_PATH }));
    dataLastModifiedTimestamp = null;
    try {
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`${CSV_FILE_PATH}${cacheBuster}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      dataLastModifiedTimestamp = response.headers.get("Last-Modified");
      if (dataLastModifiedTimestamp)
        console.log(`Got Last-Modified header: ${dataLastModifiedTimestamp}`);
      else console.warn("Last-Modified header not found in response.");
      const csvText = await response.text();
      console.log(
        `Fetched CSV text (first 500 chars): ${csvText.substring(0, 500)}...`
      );
      showLoading(getText("status.parsing"));
      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false, // Parse everything as string initially for cleaner handling
          complete: (results) => {
            console.log("PapaParse complete for static CSV.");
            if (
              results.errors.length > 0 ||
              !results.data ||
              results.data.length === 0 ||
              !results.meta.fields ||
              !results.meta.fields.includes("PLAYER") ||
              !results.meta.fields.includes("TOTAL_SCORE") // Ensure core columns exist
            ) {
              console.error(
                "Static CSV parsing errors or invalid structure:",
                results.errors
              );
              setStatus(
                getText("status.parseError", { 0: CSV_FILE_PATH }),
                "error",
                5000
              );
              resetStateAndUI();
              resolve(false);
              return;
            }

            allColumnHeaders = results.meta.fields;
            showLoading(getText("status.processing"));

            try {
              allPlayersData = results.data
                .map((player) => {
                  const cleanedPlayer = {};
                  allColumnHeaders.forEach((key) => {
                    let value = player[key];
                    if (key === "PLAYER") {
                      // Ensure player name is a string and trimmed
                      cleanedPlayer[key] = String(value || "").trim();
                    } else if (
                      value !== undefined &&
                      value !== null &&
                      value !== ""
                    ) {
                      // Explicitly attempt number conversion, defaulting to 0 if invalid
                      const num = Number(String(value).replace(/,/g, "")); // Remove commas before conversion
                      cleanedPlayer[key] =
                        !isNaN(num) && isFinite(num) ? num : 0;
                    } else {
                      // Default missing numeric values to 0
                      cleanedPlayer[key] = 0;
                    }
                  });
                  // Ensure core numeric columns are definitely numbers
                  cleanedPlayer.TOTAL_SCORE =
                    Number(cleanedPlayer.TOTAL_SCORE) || 0;
                  cleanedPlayer.CHEST_COUNT =
                    Number(cleanedPlayer.CHEST_COUNT) || 0;
                  return cleanedPlayer;
                })
                .filter((p) => p.PLAYER); // Filter out rows with empty player names
            } catch (mapError) {
              console.error("Error during data mapping/cleaning:", mapError);
              setStatus(getText("status.processError"), "error", 5000);
              resetStateAndUI();
              resolve(false);
              return;
            }

            console.log(`Cleaned data rows: ${allPlayersData.length}.`);
            if (allPlayersData.length === 0) {
              console.warn("No valid player data found after cleaning.");
              setStatus(
                getText("status.processError") + " (No valid rows)",
                "error",
                5000
              );
              resetStateAndUI();
              resolve(false);
              return;
            }

            displayData = [...allPlayersData]; // Initialize display data
            sortData(sortState.column, sortState.direction, false, displayData); // Apply initial sort

            try {
              saveDataToLocalStorage(); // Save flag indicating data loaded
              console.log("Static data processed successfully.");
              resolve(true); // Indicate success
            } catch (storageError) {
              console.error("Error saving to localStorage:", storageError);
              setStatus(getText("status.kvError"), "error", 5000);
              // Still resolve true as data processing itself succeeded
              resolve(true);
            }
          },
          error: (error) => {
            console.error("PapaParse failed for static CSV:", error);
            setStatus(
              getText("status.parseError", { 0: CSV_FILE_PATH }),
              "error",
              5000
            );
            resetStateAndUI();
            resolve(false);
          },
        });
      });
    } catch (error) {
      console.error("Failed to fetch or process static CSV:", error);
      setStatus(
        getText("status.dataLoadError", { 0: CSV_FILE_PATH }),
        "error",
        5000
      );
      resetStateAndUI();
      return false;
    }
  }

  // --- SCORE SYSTEM DATA LOADING ---
  /**
   * Fetches and parses the scoring rules CSV file.
   * @returns {Promise<boolean>} True if rules loaded successfully, false otherwise.
   */
  async function loadScoreRulesData() {
    if (scoreRulesData.length > 0) return true; // Already loaded
    console.log(`Fetching score rules CSV: ${RULES_CSV_FILE_PATH}`);

    try {
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`${RULES_CSV_FILE_PATH}${cacheBuster}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const csvText = await response.text();

      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false, // Parse as strings initially
          complete: (results) => {
            if (results.errors.length > 0 || !results.data) {
              console.error("Score rules CSV parsing errors:", results.errors);
              setStatus(
                getText("status.parseError", { 0: RULES_CSV_FILE_PATH }),
                "error",
                5000
              );
              resolve(false);
              return;
            }
            // Process and type-cast rules data
            scoreRulesData = results.data
              .map((row) => ({
                Typ: String(row.Typ || "").trim(),
                Level: Number(row.Level) || 0,
                Punkte: Number(row.Punkte) || 0,
              }))
              .filter((rule) => rule.Typ); // Filter out rows without a Type

            console.log(`Loaded ${scoreRulesData.length} score rules.`);
            // Apply initial sort to rules data
            sortData(
              scoreRulesSortState.column,
              scoreRulesSortState.direction,
              false,
              scoreRulesData
            );
            resolve(true);
          },
          error: (error) => {
            console.error("PapaParse failed for rules CSV:", error);
            setStatus(
              getText("status.parseError", { 0: RULES_CSV_FILE_PATH }),
              "error",
              5000
            );
            resolve(false);
          },
        });
      });
    } catch (error) {
      console.error("Failed to fetch or process rules CSV:", error);
      setStatus(
        getText("status.genericLoadError", { 0: error.message }),
        "error",
        5000
      );
      return false;
    }
  }

  // --- RESET & UPDATE UI ---
  /** Resets application state and clears UI elements. */
  function resetStateAndUI() {
    console.log("Resetting state and UI...");
    allPlayersData = [];
    displayData = [];
    allColumnHeaders = [];
    currentPlayerData = null;
    aggregateStats = {};
    dataLastModifiedTimestamp = null;
    resetDashboardUI(); // Reset dashboard specific elements
    updateHeaderButtonsVisibility(); // Hide download buttons if no data

    // Clear other dynamic sections
    if (detailedTableContainer)
      detailedTableContainer.innerHTML = `<div class="text-center py-12 text-slate-500">${getText(
        "table.noData"
      )}</div>`;
    if (scoreRulesTableContainer)
      scoreRulesTableContainer.innerHTML = `<div class="text-center py-12 text-slate-500">${getText(
        "scoreSystem.loading" // Or noData if appropriate after failed load
      )}</div>`;

    // Reset Analytics section
    if (categorySelect) {
      // Clear existing options except the default one
      while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
      }
      categorySelect.value = ""; // Ensure default is selected
    }
    if (categoryAnalysisContent)
      categoryAnalysisContent.classList.add("hidden");
    if (categoryPrompt) categoryPrompt.classList.remove("hidden");
    if (categoryRankingBody)
      categoryRankingBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500">${getText(
        "analytics.selectCategoryPrompt"
      )}</td></tr>`;
    if (categoryNameTable) categoryNameTable.textContent = "[Category Name]";
    if (categoryNameChart) categoryNameChart.textContent = "[Category Name]";

    // Reset Player Detail section
    if (playerBreakdownList)
      playerBreakdownList.innerHTML = `<p class="text-slate-500">${getText(
        "table.loading" // Or "No Data"
      )}</p>`;
    if (playerNameDetail) playerNameDetail.textContent = "[Player Name]";
    if (playerScoreDetail) playerScoreDetail.textContent = "[Score]";
    if (playerChestsDetail) playerChestsDetail.textContent = "[Chests]";
    if (playerRankDetail) playerRankDetail.textContent = "[Rank]";

    // Reset filter input
    if (filterInput) filterInput.value = "";

    // Reset sort states
    sortState = { column: "TOTAL_SCORE", direction: "desc" };
    detailedTableSortState = { column: "PLAYER", direction: "asc" };
    scoreRulesSortState = { column: "Typ", direction: "asc" };

    // Destroy all charts and clear containers
    Object.keys(chartInstances).forEach((key) => {
      if (chartInstances[key]) {
        try {
          chartInstances[key].destroy();
        } catch (e) {
          console.warn(`Error destroying chart ${key}:`, e);
        }
        chartInstances[key] = null;
      }
    });
    [
      topSourcesChartContainer,
      scoreDistributionChartContainer,
      scoreVsChestsChartContainer,
      frequentSourcesChartContainer,
      playerChartContainer,
      categoryChartContainer,
      modalChartContainer,
      chartsTopSourcesContainer,
      chartsDistributionContainer,
      chartsScoreVsChestsContainer,
      chartsFrequentSourcesContainer,
    ].forEach((c) => {
      if (c) c.innerHTML = "";
    }); // Clear HTML content

    if (lastUpdatedInfo) lastUpdatedInfo.textContent = ""; // Clear timestamp
    console.log("State and UI reset complete.");
  }

  /** Updates visibility of header download buttons based on data availability. */
  function updateHeaderButtonsVisibility() {
    const shouldHide = allPlayersData.length === 0;
    // Desktop Button - hide if no data OR if on smaller screen where it's meant to be hidden
    if (downloadCsvHeaderButton) {
      downloadCsvHeaderButton.classList.toggle(
        "hidden",
        shouldHide ||
          !downloadCsvHeaderButton.classList.contains("md:inline-flex")
      );
      downloadCsvHeaderButton.disabled = shouldHide;
    }
    // Mobile Button Container - hide if no data
    if (mobileDownloadContainer) {
      mobileDownloadContainer.classList.toggle("hidden", shouldHide);
    }
    // Mobile Button - disable if no data
    if (downloadCsvMobileButton) {
      downloadCsvMobileButton.disabled = shouldHide;
    }
  }
  /** Resets dashboard specific UI elements to their default state. */
  function resetDashboardUI() {
    console.log("Resetting Dashboard UI elements...");
    if (statTotalPlayers) statTotalPlayers.textContent = "-";
    if (statTotalScore) statTotalScore.textContent = "-";
    if (statTotalChests) statTotalChests.textContent = "-";
    if (statAvgScore) statAvgScore.textContent = "-";
    if (statAvgChests) statAvgChests.textContent = "-";
    if (rankingTableBody)
      rankingTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-12 text-slate-500">${getText(
        "table.noData"
      )}</td></tr>`;
    if (topChestsTableBody)
      topChestsTableBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500 text-xs">${getText(
        "table.noData"
      )}</td></tr>`;
    if (lastUpdatedInfo) lastUpdatedInfo.textContent = "";
    console.log("Dashboard UI elements reset.");
  }

  // --- AGGREGATE STATS & DASHBOARD RENDERING ---
  /** Calculates overall statistics from the loaded player data. */
  function calculateAggregateStats() {
    const playerCount = allPlayersData.length;
    let totalScore = 0;
    let totalChests = 0;
    allPlayersData.forEach((player) => {
      totalScore += player.TOTAL_SCORE || 0;
      totalChests += player.CHEST_COUNT || 0;
    });
    aggregateStats = {
      playerCount,
      totalScore,
      totalChests,
      avgScore: playerCount > 0 ? Math.round(totalScore / playerCount) : 0,
      avgChests: playerCount > 0 ? Math.round(totalChests / playerCount) : 0,
    };
    console.log("Aggregate stats calculated:", aggregateStats);
  }
  /** Updates the statistics display bar. */
  function updateStatsBar() {
    console.log("Starting updateStatsBar...");
    try {
      if (
        !statTotalPlayers ||
        !statTotalScore ||
        !statTotalChests ||
        !statAvgScore ||
        !statAvgChests
      )
        return;
      statTotalPlayers.textContent = NUMERIC_FORMATTER.format(
        aggregateStats.playerCount || 0
      );
      statTotalScore.textContent = NUMERIC_FORMATTER.format(
        aggregateStats.totalScore || 0
      );
      statTotalChests.textContent = NUMERIC_FORMATTER.format(
        aggregateStats.totalChests || 0
      );
      statAvgScore.textContent = NUMERIC_FORMATTER.format(
        aggregateStats.avgScore || 0
      );
      statAvgChests.textContent = NUMERIC_FORMATTER.format(
        aggregateStats.avgChests || 0
      );
      console.log("Finished updateStatsBar.");
    } catch (error) {
      console.error("Error in updateStatsBar:", error);
      setStatus(getText("status.renderError"), "error", 5000);
    }
  }
  /** Renders all components of the main dashboard view. */
  function renderDashboard() {
    console.log("renderDashboard called.");
    try {
      updateStatsBar();
      displayLastUpdatedTimestamp();
      // Ensure displayData reflects current filter and sort state
      handleFilter({ target: filterInput }); // Apply current filter
      // sortData is called within renderRankingTable based on sortState
      renderRankingTable(displayData); // Render main table
      // Render all dashboard charts
      renderTopSourcesChart();
      renderScoreDistributionChart();
      renderScoreVsChestsChart();
      renderFrequentSourcesChart(); // This one might fail silently now due to catch block
      renderTopChestsTable(); // Render top 5 table
      console.log("renderDashboard finished successfully.");
    } catch (dashboardRenderError) {
      console.error(
        "Critical Error within renderDashboard orchestration:",
        dashboardRenderError
      );
      setStatus(getText("status.renderError"), "error", 5000);
      resetDashboardUI();
    }
  }

  // --- RANKING TABLE & CONTROLS ---
  /**
   * Renders the main player ranking table.
   * @param {Array} data - The player data array to display.
   */
  function renderRankingTable(data) {
    console.log(`Starting renderRankingTable with ${data.length} rows...`);
    try {
      if (!rankingTableBody) {
        console.error("Ranking table body not found");
        return;
      }
      rankingTableBody.innerHTML = ""; // Clear previous content
      if (data.length === 0) {
        const messageKey = filterInput?.value
          ? "table.noFilterMatch"
          : "table.noData";
        rankingTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-12 text-slate-500">${getText(
          messageKey
        )}</td></tr>`;
        return;
      }
      const fragment = document.createDocumentFragment();
      data.forEach((player, index) => {
        const rank = index + 1;
        const row = document.createElement("tr");
        row.setAttribute("data-player-id", player.PLAYER);
        row.setAttribute("data-player-rank", rank.toString()); // Store rank for detail view context
        row.className =
          "odd:bg-transparent even:bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors duration-150";
        row.innerHTML = `
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-400 w-16">${rank}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-card-foreground w-2/5 max-w-xs truncate" title="${
                    player.PLAYER
                  }">${player.PLAYER}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-right text-card-foreground w-1/5">${NUMERIC_FORMATTER.format(
                    player.TOTAL_SCORE ?? 0
                  )}</td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-right text-card-foreground w-1/5">${NUMERIC_FORMATTER.format(
                    player.CHEST_COUNT ?? 0
                  )}</td>
              `;
        fragment.appendChild(row);
      });
      rankingTableBody.appendChild(fragment);
      updateSortIcons(
        sortState.column,
        sortState.direction,
        "#ranking-section thead th[data-column]"
      );
      console.log("Finished renderRankingTable.");
    } catch (error) {
      console.error("Error in renderRankingTable:", error);
      setStatus(getText("status.renderError"), "error", 5000);
      if (rankingTableBody)
        rankingTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-12 text-red-500">${getText(
          "status.renderError"
        )}</td></tr>`;
    }
  }

  /** Handles input changes in the filter field. */
  function handleFilter(event) {
    if (!allPlayersData) return;
    const searchTerm =
      event?.target?.value?.toLowerCase().trim() || // From event if available
      filterInput?.value?.toLowerCase().trim() || // Fallback to current input value
      ""; // Default to empty string
    console.log("Filtering data with term:", searchTerm);

    displayData = allPlayersData.filter(
      (player) =>
        player.PLAYER && player.PLAYER.toLowerCase().includes(searchTerm)
    );

    // Re-sort the filtered data based on current sort state
    sortData(sortState.column, sortState.direction, false, displayData); // false = don't update state

    // Re-render the ranking table ONLY if the current view is the dashboard
    if (currentView === "dashboard") {
      renderRankingTable(displayData);
    }
  }

  /** Handles clicks on the main ranking table header for sorting. */
  function handleSortClick(event) {
    if (!allPlayersData) return;
    const header = event.target.closest("th[data-column]");
    if (!header) return;

    const column = header.dataset.column;
    let direction = "desc"; // Default direction for most columns

    // Determine next sort direction
    if (sortState.column === column) {
      // If clicking the same column, toggle direction
      direction = sortState.direction === "desc" ? "asc" : "desc";
    } else {
      // If clicking a new column, set default direction
      direction = column === "PLAYER" ? "asc" : "desc"; // Player name defaults to ASC
    }

    // Update the main sort state
    sortState.column = column;
    sortState.direction = direction;

    // Sort displayData (which might be filtered) using the new state
    sortData(column, direction, false, displayData); // false = don't update state here, done above

    // Re-render the ranking table
    renderRankingTable(displayData);
  }

  /**
   * Sorts a data array in place and optionally updates the corresponding sort state object.
   * @param {string} column - The column key to sort by.
   * @param {string} direction - 'asc' or 'desc'.
   * @param {boolean} [updateState=true] - Whether to update the relevant global sort state object.
   * @param {Array} dataToSort - The array to sort. Modifies this array directly.
   * @returns {Array} The sorted data array (same instance as input).
   */
  function sortData(column, direction, updateState = true, dataToSort) {
    if (!dataToSort || dataToSort.length === 0) return dataToSort; // Nothing to sort

    let sortTargetState = null;

    // Determine which state object to update if requested
    if (updateState) {
      if (dataToSort === displayData) {
        // Check if it's the main ranking data
        sortTargetState = sortState;
      } else if (dataToSort === scoreRulesData) {
        // Check if it's score rules data
        sortTargetState = scoreRulesSortState;
      } else if (dataToSort === allPlayersData) {
        // Check if it's the detailed table data (before copy)
        // Assume detailed table if it's not displayData or scoreRulesData AND has many columns
        // This is a heuristic, might need refinement if more sortable tables are added
        if (Object.keys(dataToSort[0]).length > 5) {
          sortTargetState = detailedTableSortState;
        }
      } else {
        // Check if it's a copy of allPlayersData (used for detailed table rendering)
        // A simple check might be if it has the same length and similar structure
        if (
          Array.isArray(dataToSort) &&
          dataToSort.length === allPlayersData.length &&
          dataToSort !== allPlayersData &&
          dataToSort !== displayData &&
          dataToSort !== scoreRulesData &&
          Object.keys(dataToSort[0]).length > 5
        ) {
          sortTargetState = detailedTableSortState;
        } else {
          console.warn(
            "Attempting to update sort state for an unrecognized data array. State not updated."
          );
        }
      }

      if (sortTargetState) {
        sortTargetState.column = column;
        sortTargetState.direction = direction;
        const stateName =
          sortTargetState === sortState
            ? "main ranking"
            : sortTargetState === scoreRulesSortState
            ? "score rules"
            : sortTargetState === detailedTableSortState
            ? "detailed table"
            : "unknown";
        console.log(
          `Sort state updated for ${stateName}: ${JSON.stringify(
            sortTargetState
          )}`
        );
      }
    }

    // Perform the sort
    dataToSort.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];

      // Determine if the column should be treated as numeric
      // Check first few rows for numeric type, fallback to string compare
      let isNumericComparison = false;
      // Check the first element for type if data exists
      if (dataToSort.length > 0 && typeof dataToSort[0][column] === "number") {
        isNumericComparison = true;
      } else if (typeof valA === "number" || typeof valB === "number") {
        // Fallback: check current comparison elements
        isNumericComparison = true;
      }

      // Handle null/undefined values - push them to the end for asc, beginning for desc
      const defaultValA = isNumericComparison
        ? direction === "desc"
          ? -Infinity
          : Infinity
        : "";
      const defaultValB = isNumericComparison
        ? direction === "desc"
          ? -Infinity
          : Infinity
        : "";

      valA = valA === undefined || valA === null ? defaultValA : valA;
      valB = valB === undefined || valB === null ? defaultValB : valB;

      let comparison = 0;
      if (isNumericComparison) {
        // Ensure both are treated as numbers for comparison
        const numA = Number(valA);
        const numB = Number(valB);
        // Handle potential NaN values resulting from conversion
        comparison =
          (isNaN(numA) ? defaultValA : numA) -
          (isNaN(numB) ? defaultValB : numB);
      } else {
        // String comparison (case-insensitive)
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA < valB) comparison = -1;
        if (valA > valB) comparison = 1;
      }

      return direction === "desc" ? comparison * -1 : comparison;
    });

    return dataToSort; // Return the mutated array
  }

  /**
   * Updates the sort indicator icons in a table header.
   * @param {string} activeColumn - The currently sorted column.
   * @param {string} activeDirection - The current sort direction ('asc' or 'desc').
   * @param {string} tableHeaderSelector - CSS selector for the table headers (e.g., '#ranking-section thead th[data-column]').
   */
  function updateSortIcons(activeColumn, activeDirection, tableHeaderSelector) {
    try {
      const headers = document.querySelectorAll(tableHeaderSelector);
      if (!headers || headers.length === 0) {
        // console.warn(`No headers found for selector: ${tableHeaderSelector}`);
        return;
      }

      headers.forEach((th) => {
        let iconSpan = th.querySelector(".sort-icon");
        // Ensure the icon span exists
        if (!iconSpan) {
          const newIconSpan = document.createElement("span");
          newIconSpan.className = "sort-icon inline-block w-3";
          th.appendChild(newIconSpan);
          iconSpan = newIconSpan; // Use the newly created span
        }

        // Clear previous icon content
        iconSpan.textContent = "";

        // Set icon for the active column
        if (th.dataset.column === activeColumn) {
          iconSpan.textContent = activeDirection === "desc" ? " ▼" : " ▲";
        }
      });
    } catch (error) {
      console.error(
        `Error updating sort icons for selector "${tableHeaderSelector}":`,
        error
      );
    }
  }

  // --- DETAILED TABLE VIEW ---
  /** Renders the full data table with all columns and players. */
  function renderDetailedTable() {
    console.log("Starting renderDetailedTable...");
    if (!detailedTableContainer) {
      console.error("Detailed table container not found.");
      return;
    }

    // Show loading state immediately
    detailedTableContainer.innerHTML = `<div class="spinner"></div><div class="text-center text-slate-400">${getText(
      "table.loadingDetailed"
    )}</div>`;

    // Defer heavy processing slightly to allow UI update
    setTimeout(() => {
      try {
        if (allPlayersData.length === 0 || allColumnHeaders.length === 0) {
          detailedTableContainer.innerHTML = `<div class="text-center py-12 text-slate-500">${getText(
            "table.noData"
          )}</div>`;
          return;
        }

        // Define header order: Core columns first, then others alphabetically
        const sortedHeaders = [
          ...CORE_COLUMNS.filter((h) => allColumnHeaders.includes(h)),
          ...allColumnHeaders.filter((h) => !CORE_COLUMNS.includes(h)).sort(),
        ];

        // Get current sort state for this table
        const currentSortCol = detailedTableSortState.column || "PLAYER";
        const currentSortDir = detailedTableSortState.direction || "asc";

        // Create a copy of the data to sort for this view without affecting allPlayersData
        const detailedDataCopy = [...allPlayersData];

        // Sort the copy based on the detailed table's sort state
        const sortedData = sortData(
          currentSortCol,
          currentSortDir,
          false, // Don't update the state object here, just use it
          detailedDataCopy
        );

        // Build the table structure
        const table = document.createElement("table");
        table.className = "min-w-full w-full divide-y divide-slate-700 text-xs";

        const thead = document.createElement("thead");
        thead.className = "bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10"; // Sticky header
        const headerRow = document.createElement("tr");

        sortedHeaders.forEach((header) => {
          const th = document.createElement("th");
          th.scope = "col";
          th.dataset.column = header; // Set data attribute for sorting clicks

          // Determine alignment (heuristic: non-PLAYER columns are likely numeric)
          const isNumeric = header !== "PLAYER";
          th.className = `px-3 py-2 text-left font-medium text-primary uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors duration-150 ${
            isNumeric ? "text-right" : "text-left"
          }`;
          // Add header text and placeholder for sort icon
          th.innerHTML = `${header.replace(
            /_/g,
            " "
          )} <span class="sort-icon inline-block w-3"></span>`;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        tbody.className = "divide-y divide-slate-700";

        // Use fragment for efficient DOM appending
        const fragment = document.createDocumentFragment();
        sortedData.forEach((player) => {
          const row = document.createElement("tr");
          row.className = "odd:bg-transparent even:bg-slate-800/50";
          sortedHeaders.forEach((header) => {
            const cell = document.createElement("td");
            const value = player[header] ?? ""; // Default to empty string if null/undefined
            const isNumeric = header !== "PLAYER" && typeof value === "number";

            cell.className = `px-3 py-1.5 whitespace-nowrap ${
              isNumeric ? "text-right" : "text-left"
            }`;
            cell.textContent = isNumeric
              ? NUMERIC_FORMATTER.format(value) // Format numbers
              : value; // Display strings as is
            row.appendChild(cell);
          });
          fragment.appendChild(row);
        });
        tbody.appendChild(fragment);
        table.appendChild(tbody);

        // Replace loading spinner with the generated table
        detailedTableContainer.innerHTML = "";
        detailedTableContainer.appendChild(table);

        // Update sort icons after table is in the DOM
        updateSortIcons(
          currentSortCol,
          currentSortDir,
          "#detailed-table-container thead th[data-column]"
        );

        console.log("Finished renderDetailedTable.");
      } catch (error) {
        console.error("Error in renderDetailedTable:", error);
        setStatus(getText("status.renderError"), "error", 5000);
        if (detailedTableContainer)
          detailedTableContainer.innerHTML = `<div class="text-center py-12 text-red-500">${getText(
            "status.renderError"
          )}</div>`;
      }
    }, 50); // Small timeout allows spinner to render
  }

  /** Handles clicks on the detailed table header for sorting. */
  function handleDetailedTableSortClick(event) {
    const header = event.target.closest("th[data-column]");
    // Use allPlayersData for type checking as detailedDataCopy is local to render function
    if (!header || !allPlayersData || allPlayersData.length === 0) return;

    const column = header.dataset.column;
    let direction = "asc"; // Default direction

    // Determine next sort direction
    if (detailedTableSortState.column === column) {
      // Toggle direction if clicking the same column
      direction = detailedTableSortState.direction === "asc" ? "desc" : "asc";
    } else {
      // Set default direction for new column (numeric defaults desc, text defaults asc)
      // Check type from the first row of the main data source
      const isNumeric =
        column !== "PLAYER" && typeof allPlayersData[0][column] === "number";
      direction = isNumeric ? "desc" : "asc";
    }

    // Update the sort state for *this specific table*
    detailedTableSortState.column = column;
    detailedTableSortState.direction = direction;

    // Re-render the detailed table which will use the updated state
    renderDetailedTable();
  }

  // --- SCORE SYSTEM TABLE VIEW ---
  /** Renders the table displaying the scoring rules. */
  function renderScoreRulesTable() {
    console.log("Starting renderScoreRulesTable...");
    if (!scoreRulesTableContainer) {
      console.error("Score rules table container not found.");
      return;
    }
    scoreRulesTableContainer.innerHTML = ""; // Clear previous content

    if (scoreRulesData.length === 0) {
      // Display loading or no data message
      scoreRulesTableContainer.innerHTML = `<div class="text-center py-12 text-slate-500">${getText(
        "scoreSystem.loading"
      )}</div>`; // Or noData if load failed
      // Optionally try loading again if it wasn't loaded initially
      // loadScoreRulesData().then(loaded => if(loaded) renderScoreRulesTable());
      return;
    }

    try {
      // Get current sort state for this table
      const currentSortCol = scoreRulesSortState.column || "Typ";
      const currentSortDir = scoreRulesSortState.direction || "asc";

      // Create a copy to sort (avoids modifying original if needed elsewhere)
      const scoreRulesCopy = [...scoreRulesData];

      // Sort the copy based on the score rules table's sort state
      const sortedData = sortData(
        currentSortCol,
        currentSortDir,
        false, // Don't update the state object here
        scoreRulesCopy
      );

      // Build Table Structure
      const table = document.createElement("table");
      table.className = "min-w-full w-full divide-y divide-slate-700 text-sm";

      const thead = document.createElement("thead");
      thead.className = "bg-slate-800/75 backdrop-blur-sm sticky top-0 z-10";
      const headerRow = document.createElement("tr");

      // Define headers and their keys
      const headers = [
        { key: "Typ", numeric: false },
        { key: "Level", numeric: true },
        { key: "Punkte", numeric: true },
      ];

      headers.forEach((headerInfo) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.dataset.column = headerInfo.key; // For sorting clicks
        const headerText = getText(`scoreSystem.header${headerInfo.key}`); // Get translated text
        th.className = `px-4 py-3 text-left font-medium text-primary uppercase tracking-wider cursor-pointer hover:bg-slate-700 transition-colors duration-150 ${
          headerInfo.numeric ? "text-right" : "text-left"
        }`;
        th.innerHTML = `${headerText} <span class="sort-icon inline-block w-3"></span>`;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      tbody.className = "divide-y divide-slate-700";

      // Populate Table Body
      const fragment = document.createDocumentFragment();
      sortedData.forEach((rule) => {
        const row = document.createElement("tr");
        row.className = "odd:bg-transparent even:bg-slate-800/50";
        row.innerHTML = `
                <td class="px-4 py-2 whitespace-nowrap">${rule.Typ}</td>
                <td class="px-4 py-2 whitespace-nowrap text-right">${NUMERIC_FORMATTER.format(
                  rule.Level
                )}</td>
                <td class="px-4 py-2 whitespace-nowrap text-right">${NUMERIC_FORMATTER.format(
                  rule.Punkte
                )}</td>
            `;
        fragment.appendChild(row);
      });
      tbody.appendChild(fragment);
      table.appendChild(tbody);

      // Append table to container
      scoreRulesTableContainer.appendChild(table);

      // Update sort icons
      updateSortIcons(
        currentSortCol,
        currentSortDir,
        "#score-rules-table-container thead th[data-column]"
      );

      console.log("Finished renderScoreRulesTable.");
    } catch (error) {
      console.error("Error rendering score rules table:", error);
      setStatus(getText("status.renderError"), "error", 5000);
      if (scoreRulesTableContainer)
        scoreRulesTableContainer.innerHTML = `<div class="text-center py-12 text-red-500">${getText(
          "status.renderError"
        )}</div>`;
    }
  }
  /** Handles clicks on the score rules table header for sorting. */
  function handleScoreRulesTableSortClick(event) {
    const header = event.target.closest("th[data-column]");
    if (!header || !scoreRulesData || scoreRulesData.length === 0) return; // Ignore if no header or no data

    const column = header.dataset.column;
    let direction = "asc"; // Default direction

    // Determine next sort direction
    if (scoreRulesSortState.column === column) {
      // Toggle direction if clicking the same column
      direction = scoreRulesSortState.direction === "asc" ? "desc" : "asc";
    } else {
      // Set default direction for new column (numeric defaults desc, text defaults asc)
      const isNumeric = column === "Level" || column === "Punkte";
      direction = isNumeric ? "desc" : "asc";
    }

    // Update the sort state for *this specific table*
    scoreRulesSortState.column = column;
    scoreRulesSortState.direction = direction;

    // Re-render the score rules table which will use the updated state
    renderScoreRulesTable();
  }

  // --- PLAYER DETAIL VIEW ---
  /** Handles clicks on table rows in ranking or top chests tables to show player detail. */
  function handleTableRowClick(event) {
    const row = event.target.closest("tr[data-player-id]");
    if (!row || !row.dataset.playerId || !row.closest("tbody")) return; // Ensure click is on a valid row with data

    const playerId = row.dataset.playerId;
    // Get rank from data attribute (set during table render)
    const playerRank = row.dataset.playerRank || "N/A"; // Use stored rank

    console.log(
      `Table row clicked for player: ${playerId}, Rank: ${playerRank}`
    );
    switchView("detail", { playerName: playerId, rank: playerRank });
  }
  /**
   * Renders the player detail section.
   * @param {object} player - The player data object.
   * @param {string|number} rank - The player's rank to display.
   */
  function renderPlayerDetail(player, rank) {
    console.log("Starting renderPlayerDetail for:", player?.PLAYER);
    try {
      if (
        !playerNameDetail ||
        !playerScoreDetail ||
        !playerChestsDetail ||
        !playerRankDetail ||
        !playerBreakdownList
      ) {
        console.error("Player detail elements not found");
        return;
      }
      // Update basic info
      playerNameDetail.textContent = player.PLAYER;
      playerScoreDetail.textContent = NUMERIC_FORMATTER.format(
        player.TOTAL_SCORE ?? 0
      );
      playerChestsDetail.textContent = NUMERIC_FORMATTER.format(
        player.CHEST_COUNT ?? 0
      );
      playerRankDetail.textContent = rank; // Display the passed rank

      // Build score breakdown list
      playerBreakdownList.innerHTML = ""; // Clear previous list

      // Get category keys with scores > 0, excluding core columns
      const categoryKeys = Object.keys(player)
        .filter(
          (key) =>
            !CORE_COLUMNS.includes(key) &&
            typeof player[key] === "number" &&
            player[key] > 0
        )
        .sort((keyA, keyB) => (player[keyB] ?? 0) - (player[keyA] ?? 0)); // Sort by score descending

      if (categoryKeys.length === 0) {
        // Display message if no breakdown data exists
        playerBreakdownList.innerHTML = `<p class="text-slate-500">${getText(
          "playerDetail.noBreakdown"
        )}</p>`;
        return;
      }

      // Create list items for each category
      const fragment = document.createDocumentFragment();
      categoryKeys.forEach((category) => {
        const score = player[category];
        const p = document.createElement("p");
        p.className = "flex justify-between items-baseline"; // Align items nicely

        // Format category name (replace underscores)
        const displayName = category.replace(/_/g, " ");

        p.innerHTML = `
            <span class="font-medium text-slate-400 inline-block max-w-[70%] truncate pr-2" title="${displayName}">${displayName}:</span>
            <span class="text-right text-card-foreground">${NUMERIC_FORMATTER.format(
              score
            )}</span>
        `;
        fragment.appendChild(p);
      });
      playerBreakdownList.appendChild(fragment);
      console.log("Finished renderPlayerDetail.");
    } catch (error) {
      console.error("Error in renderPlayerDetail:", error);
      setStatus(getText("status.renderError"), "error", 5000);
      if (playerBreakdownList)
        playerBreakdownList.innerHTML = `<p class="text-red-500">${getText(
          "status.renderError"
        )}</p>`;
    }
  }

  // --- CATEGORY ANALYSIS VIEW ---
  /** Populates the category selection dropdown. */
  function populateCategoryDropdown(headers) {
    if (!categorySelect) {
      console.error("Category select dropdown not found.");
      return;
    }
    // Ensure the default option is always present and first
    categorySelect.innerHTML = `<option value="" data-i18n-key="analytics.selectCategoryDefault">${getText(
      "analytics.selectCategoryDefault"
    )}</option>`;

    // Get only analyzable categories, sort them alphabetically
    const analyzableCategories = headers
      .filter((header) => !CORE_COLUMNS.includes(header))
      .sort();

    // Create and append options for each category
    const fragment = document.createDocumentFragment();
    analyzableCategories.forEach((header) => {
      const option = document.createElement("option");
      option.value = header;
      option.textContent = header.replace(/_/g, " "); // Make it readable
      fragment.appendChild(option);
    });
    categorySelect.appendChild(fragment);

    console.log("Category dropdown populated.");
  }
  /** Handles changes in the category selection dropdown. */
  function handleCategorySelect(event) {
    const selectedCategory = event.target.value;

    if (selectedCategory) {
      // A category was selected
      console.log(`Category selected: ${selectedCategory}`);
      categoryPrompt?.classList.add("hidden"); // Hide prompt message
      categoryAnalysisContent?.classList.remove("hidden"); // Show analysis section

      // Render the table and chart for the selected category
      renderCategoryAnalysis(selectedCategory);
      renderCategoryChart(allPlayersData, selectedCategory);
    } else {
      // No category selected (default "-- Select Category --" option)
      console.log("No category selected.");
      categoryAnalysisContent?.classList.add("hidden"); // Hide analysis section
      categoryPrompt?.classList.remove("hidden"); // Show prompt message

      // Clear previous analysis results
      if (chartInstances.category) {
        try {
          chartInstances.category.destroy();
        } catch (e) {
          console.warn("Error destroying category chart:", e);
        }
        chartInstances.category = null;
        if (categoryChartContainer) categoryChartContainer.innerHTML = "";
      }
      if (categoryRankingBody)
        categoryRankingBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500">${getText(
          "analytics.selectCategoryPrompt"
        )}</td></tr>`;

      // Reset titles
      if (categoryNameTable) categoryNameTable.textContent = "[Category Name]";
      if (categoryNameChart) categoryNameChart.textContent = "[Category Name]";
    }
  }
  /** Renders the table for the selected category analysis. */
  function renderCategoryAnalysis(category) {
    console.log("Starting renderCategoryAnalysis for:", category);
    try {
      const readableCategory = category.replace(/_/g, " "); // For display

      // Update titles
      if (categoryNameTable) categoryNameTable.textContent = readableCategory;
      if (categoryNameChart) categoryNameChart.textContent = readableCategory;

      if (!categoryRankingBody) {
        console.error("Category ranking table body not found.");
        return;
      }
      categoryRankingBody.innerHTML = ""; // Clear previous content

      // Filter players with a score > 0 in this category and sort descending
      const categoryData = allPlayersData
        .filter(
          (player) =>
            player.hasOwnProperty(category) &&
            typeof player[category] === "number" &&
            player[category] > 0
        )
        .sort((a, b) => (b[category] ?? 0) - (a[category] ?? 0)); // Sort by category score

      if (categoryData.length === 0) {
        // Display message if no players have scores in this category
        categoryRankingBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500">${getText(
          "table.noData" // "No Data" might be better than "Select Category" here
        )}</td></tr>`;
        return;
      }

      // Build table rows
      const fragment = document.createDocumentFragment();
      categoryData.forEach((player) => {
        const row = document.createElement("tr");
        row.className = "odd:bg-transparent even:bg-slate-800/50";
        row.innerHTML = `
            <td class="px-4 py-2 whitespace-nowrap font-medium">${
              player.PLAYER
            }</td>
            <td class="px-4 py-2 whitespace-nowrap text-right">${NUMERIC_FORMATTER.format(
              player[category] ?? 0
            )}</td>
        `;
        fragment.appendChild(row);
      });
      categoryRankingBody.appendChild(fragment);
      console.log("Finished renderCategoryAnalysis.");
    } catch (error) {
      console.error("Error in renderCategoryAnalysis:", error);
      setStatus(getText("status.renderError"), "error", 5000);
      if (categoryRankingBody)
        categoryRankingBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-red-500">${getText(
          "status.renderError"
        )}</td></tr>`;
    }
  }

  // --- CHARTS VIEW ---
  /** Renders the dedicated charts overview section. */
  function renderChartsView() {
    console.log("Rendering Charts View...");
    const container = chartsSection;
    if (!container) {
      console.error("Charts section container not found!");
      return;
    }

    if (allPlayersData.length === 0) {
      // Display "No Data" message if data isn't loaded
      container.innerHTML = `<h2 class="text-xl font-semibold font-serif text-amber-300 border-l-4 border-primary pl-4" data-i18n-key="charts.title">${getText(
        "charts.title"
      )}</h2><p class="text-center text-slate-400 py-10">${getText(
        "table.noData"
      )}</p>`;
      return;
    }

    // Ensure the basic structure for charts exists (in case it was cleared)
    // This rebuilds the grid if the "No Data" message was previously shown
    if (!document.getElementById("charts-top-sources-container")) {
      container.innerHTML = `
        <h2 class="text-xl font-semibold font-serif text-amber-300 border-l-4 border-primary pl-4" data-i18n-key="charts.title">${getText(
          "charts.title"
        )}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div class="bg-card border border-border rounded-lg shadow-lg p-4 md:p-6 relative">
                <button class="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-primary focus-visible:ring-0" data-i18n-title-key="button.viewLarger" title="${getText(
                  "button.viewLarger"
                )}" data-chart-type="topSources"><i class="fas fa-expand fa-fw"></i></button>
                <h3 class="text-base font-semibold text-amber-300 mb-3" data-i18n-key="dashboard.chartTopSourcesTitle">${getText(
                  "dashboard.chartTopSourcesTitle"
                )}</h3>
                <div id="charts-top-sources-container" class="min-h-[350px]"></div>
            </div>
            <div class="bg-card border border-border rounded-lg shadow-lg p-4 md:p-6 relative">
                 <button class="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-primary focus-visible:ring-0" data-i18n-title-key="button.viewLarger" title="${getText(
                   "button.viewLarger"
                 )}" data-chart-type="scoreDistribution"><i class="fas fa-expand fa-fw"></i></button>
                <h3 class="text-base font-semibold text-amber-300 mb-3" data-i18n-key="dashboard.chartScoreDistTitle">${getText(
                  "dashboard.chartScoreDistTitle"
                )}</h3>
                <div id="charts-distribution-container" class="min-h-[350px]"></div>
            </div>
            <div class="bg-card border border-border rounded-lg shadow-lg p-4 md:p-6 relative">
                 <button class="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-primary focus-visible:ring-0" data-i18n-title-key="button.viewLarger" title="${getText(
                   "button.viewLarger"
                 )}" data-chart-type="scoreVsChests"><i class="fas fa-expand fa-fw"></i></button>
                <h3 class="text-base font-semibold text-amber-300 mb-3" data-i18n-key="dashboard.chartScoreVsChestsTitle">${getText(
                  "dashboard.chartScoreVsChestsTitle"
                )}</h3>
                <div id="charts-score-vs-chests-container" class="min-h-[350px]"></div>
            </div>
            <div class="bg-card border border-border rounded-lg shadow-lg p-4 md:p-6 relative">
                 <button class="absolute top-2 right-2 p-2 rounded-md text-slate-400 hover:text-primary focus-visible:ring-0" data-i18n-title-key="button.viewLarger" title="${getText(
                   "button.viewLarger"
                 )}" data-chart-type="frequentSources"><i class="fas fa-expand fa-fw"></i></button>
                <h3 class="text-base font-semibold text-amber-300 mb-3" data-i18n-key="dashboard.chartFreqSourcesTitle">${getText(
                  "dashboard.chartFreqSourcesTitle"
                )}</h3>
                <div id="charts-frequent-sources-container" class="min-h-[350px]"></div>
            </div>
        </div>`;
      // Re-assign references as innerHTML change invalidates old ones
      assignElementReferences(); // Call this again to ensure chart containers are referenced correctly
    }

    // Render charts into their specific containers within the Charts view
    renderTopSourcesChart("charts-top-sources-container");
    renderScoreDistributionChart("charts-distribution-container");
    renderScoreVsChestsChart("charts-score-vs-chests-container");
    renderFrequentSourcesChart("charts-frequent-sources-container"); // This might fail silently

    // Update text content for the newly potentially created elements
    updateUIText();
  }

  // --- DASHBOARD WIDGETS RENDERING ---
  /** Renders the 'Top 5 by Chest Count' table. */
  function renderTopChestsTable() {
    console.log("Starting renderTopChestsTable...");
    try {
      if (!topChestsTableBody) {
        console.error("Top chests table body not found.");
        return;
      }
      topChestsTableBody.innerHTML = ""; // Clear previous content

      // Sort a copy of the data by chest count and take the top 5
      const topPlayers = [...allPlayersData]
        .sort((a, b) => (b.CHEST_COUNT || 0) - (a.CHEST_COUNT || 0))
        .slice(0, 5);

      if (topPlayers.length === 0) {
        // Display message if no players have chests
        topChestsTableBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500 text-xs">${getText(
          "table.noData"
        )}</td></tr>`;
        return;
      }

      // Build table rows
      const fragment = document.createDocumentFragment();
      topPlayers.forEach((player) => {
        const row = document.createElement("tr");
        row.className =
          "odd:bg-transparent even:bg-slate-800/50 hover:bg-slate-800 cursor-pointer transition-colors duration-150";
        row.setAttribute("data-player-id", player.PLAYER);

        // Find the player's overall rank from the *currently sorted displayData* (main ranking)
        const overallRankIndex = displayData.findIndex(
          (p) => p.PLAYER === player.PLAYER
        );
        const overallRank =
          overallRankIndex !== -1 ? overallRankIndex + 1 : "N/A";
        row.setAttribute("data-player-rank", overallRank.toString()); // Store overall rank for detail view

        row.innerHTML = `
            <td class="px-3 py-2 whitespace-nowrap font-medium truncate" title="${
              player.PLAYER
            }">${player.PLAYER}</td>
            <td class="px-3 py-2 whitespace-nowrap text-right">${NUMERIC_FORMATTER.format(
              player.CHEST_COUNT || 0
            )}</td>
        `;
        fragment.appendChild(row);
      });
      topChestsTableBody.appendChild(fragment);
      console.log("Finished renderTopChestsTable.");
    } catch (error) {
      console.error("Error in renderTopChestsTable:", error);
      setStatus(getText("status.renderError"), "error", 5000);
      if (topChestsTableBody)
        topChestsTableBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-red-500 text-xs">${getText(
          "status.renderError"
        )}</td></tr>`;
    }
  }

  // --- CHARTING ---
  /**
   * Gets the computed value of a CSS variable.
   * @param {string} variableName - The CSS variable name (e.g., '--primary').
   * @returns {string} The computed HSL value string or a fallback.
   */
  function getCssVariableValue(variableName) {
    try {
      // Get the raw HSL value string (e.g., "40.7 92.9% 56.1%")
      const hslValue = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
      // Return it directly if it contains spaces (likely the HSL components)
      if (hslValue.includes(" ")) {
        return hslValue;
      }
      // Otherwise, try parsing it as a color name or hex (less likely needed here)
      // This part might need a more robust color parsing library if complex fallbacks are needed
      console.warn(
        `CSS variable ${variableName} returned non-HSL value: ${hslValue}. Returning default.`
      );
      // Fallbacks based on the expected HSL structure
      if (variableName === "--primary") return "40.7 92.9% 56.1%";
      if (variableName === "--foreground") return "210 40% 96.1%";
      if (variableName === "--secondary") return "346.8 77.2% 49.8%";
      if (variableName === "--border") return "35.1 70% 45%";
      return "0 0% 100%"; // Default to white
    } catch (e) {
      console.error(`Error getting CSS variable ${variableName}:`, e);
      // Provide fallbacks matching the theme if lookup fails
      if (variableName === "--primary") return "40.7 92.9% 56.1%";
      if (variableName === "--foreground") return "210 40% 96.1%";
      if (variableName === "--secondary") return "346.8 77.2% 49.8%";
      if (variableName === "--border") return "35.1 70% 45%";
      return "0 0% 100%"; // Default fallback
    }
  }

  /**
   * Generates base configuration options for ApexCharts, using CSS variables.
   * @returns {object} Base ApexCharts options object.
   */
  function getChartBaseOptions() {
    try {
      // Fetch HSL values from CSS variables
      const foregroundHsl = getCssVariableValue("--foreground");
      const primaryHsl = getCssVariableValue("--primary");
      const secondaryHsl = getCssVariableValue("--secondary");
      const borderHsl = getCssVariableValue("--border");
      const backgroundHsl = getCssVariableValue("--background"); // Although background is transparent

      // Construct full HSL color strings
      const foregroundColor = `hsl(${foregroundHsl})`;
      const primaryColor = `hsl(${primaryHsl})`;
      const secondaryColor = `hsl(${secondaryHsl})`;
      const borderColor = `hsl(${borderHsl})`;
      const backgroundColor = "transparent"; // Use transparent for chart background

      // Create semi-transparent border color for grid lines
      const gridBorderColor = `hsla(${borderHsl}, 0.3)`;

      return {
        chart: {
          foreColor: foregroundColor,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
          },
          background: backgroundColor,
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          padding: { top: 5, right: 10, bottom: 5, left: 10 },
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 400,
            animateGradually: { enabled: true, delay: 100 },
            dynamicAnimation: { enabled: true, speed: 250 },
          },
          dropShadow: { enabled: false }, // Keep it clean
        },
        theme: {
          mode: "dark",
          palette: "palette1", // Apex predefined palette, overridden by colors array
        },
        grid: {
          borderColor: gridBorderColor, // Use semi-transparent border color
          xaxis: { lines: { show: false } }, // Cleaner look
          yaxis: { lines: { show: true } }, // Show horizontal lines
          padding: { left: 5, right: 5 },
        },
        tooltip: {
          theme: "dark", // Use Apex dark theme tooltip
          style: { fontSize: "12px", fontFamily: "Inter, sans-serif" },
          x: { formatter: (val) => val }, // Default X formatter
          y: {
            // Default Y formatter (can be overridden per chart)
            formatter: (val) =>
              val !== undefined && val !== null
                ? NUMERIC_FORMATTER.format(val)
                : "",
          },
        },
        // Define a consistent color palette using HSL theme colors
        colors: [
          primaryColor, // Amber 500
          secondaryColor, // Rose 600
          "hsl(199, 89%, 57%)", // Sky 500
          "hsl(145, 63%, 49%)", // Emerald 500
          "hsl(26, 83%, 56%)", // Orange 600
          "hsl(48, 96%, 53%)", // Yellow 500
          "hsl(262, 52%, 58%)", // Violet 500
          "hsl(340, 82%, 52%)", // Pink 600
        ],
        xaxis: {
          labels: {
            style: { colors: foregroundColor, fontSize: "10px" },
            trim: true,
            rotate: -45,
            rotateAlways: false,
            hideOverlappingLabels: true,
            maxHeight: 80, // Allow more space for rotated labels
          },
          tooltip: { enabled: false }, // Usually redundant with main tooltip
          axisBorder: { show: true, color: borderColor },
          axisTicks: { show: true, color: borderColor },
          // Add title placeholder (can be overridden)
          title: {
            text: undefined,
            style: {
              fontSize: "10px",
              color: foregroundColor,
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          labels: {
            style: { colors: foregroundColor, fontSize: "10px" },
            // Default Y-axis label formatter (abbreviate large numbers)
            formatter: function (val) {
              if (val === null || val === undefined) return "";
              if (Math.abs(val) >= 1000000)
                return (val / 1000000).toFixed(1) + "M";
              if (Math.abs(val) >= 1000) return (val / 1000).toFixed(0) + "K";
              return NUMERIC_FORMATTER.format(Math.round(val)); // Round integers for cleaner display
            },
          },
          axisBorder: { show: false }, // Hide Y axis line for cleaner look
          axisTicks: { show: false }, // Hide Y axis ticks
          // Add title placeholder (can be overridden)
          title: {
            text: undefined,
            style: {
              fontSize: "10px",
              color: foregroundColor,
              fontWeight: 400,
            },
          },
        },
        dataLabels: { enabled: false }, // Keep charts clean by default
        legend: {
          position: "bottom",
          fontSize: "11px",
          fontFamily: "Inter, sans-serif",
          labels: { colors: foregroundColor },
          markers: { radius: 3, width: 8, height: 8 },
          itemMargin: { horizontal: 8, vertical: 3 },
          offsetY: 5,
        },
        stroke: {
          // Default stroke settings (can be overridden)
          show: true,
          curve: "smooth",
          lineCap: "butt",
          width: 2,
          dashArray: 0,
        },
        markers: {
          // Default marker settings (for line/scatter/radar)
          size: 0, // Hide markers by default on line charts
          hover: { sizeOffset: 4 },
        },
      };
    } catch (e) {
      console.error("Error in getChartBaseOptions:", e);
      // Return minimal defaults if CSS variable lookup fails
      return {
        chart: { toolbar: { show: true, tools: { download: true } } },
        theme: { mode: "dark" },
      };
    }
  }

  /** Renders the 'Top Sources by Score' donut chart. */
  function renderTopSourcesChart(containerId = "top-sources-chart-container") {
    const instanceKey =
      containerId === "modal-chart-container"
        ? "modalChart"
        : containerId.startsWith("charts-")
        ? "topSourcesChartsPage" // Unique key for charts page instance
        : "topSources"; // Key for dashboard instance

    console.log(
      `Starting renderTopSourcesChart in #${containerId} (key: ${instanceKey})`
    );
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
      }

      // --- Modified Destroy Logic ---
      const existingChart = chartInstances[instanceKey];
      if (existingChart) {
        try {
          existingChart.destroy();
          console.log(`Chart instance ${instanceKey} destroyed.`);
        } catch (e) {
          console.warn(
            `Error destroying previous chart ${instanceKey}: ${e.message}`
          );
        }
        chartInstances[instanceKey] = null;
      }
      // --- End Modified Destroy Logic ---

      // Show spinner immediately
      container.innerHTML = '<div class="spinner mx-auto my-8"></div>';

      // --- Wrap chart logic in setTimeout ---
      setTimeout(() => {
        try {
          // Add inner try/catch for async errors
          if (!allPlayersData || allPlayersData.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
              "table.noData"
            )}</p>`;
            return;
          }
          // --- Start of chart logic ---
          // Aggregate scores by category
          const categoryScores = {};
          allPlayersData.forEach((player) => {
            Object.keys(player).forEach((key) => {
              if (
                !CORE_COLUMNS.includes(key) &&
                typeof player[key] === "number" &&
                player[key] > 0
              )
                categoryScores[key] = (categoryScores[key] || 0) + player[key];
            });
          });

          // Sort categories by score and prepare data for chart
          const sortedCategories = Object.entries(categoryScores).sort(
            ([, scoreA], [, scoreB]) => scoreB - scoreA
          );

          const topN = 7; // Number of top categories to show individually
          let topCategoriesData = sortedCategories.slice(0, topN);
          let otherScore = sortedCategories
            .slice(topN)
            .reduce((sum, [, score]) => sum + score, 0);

          let chartLabels = topCategoriesData.map(
            ([key]) => key.replace(/_/g, " ") // Make labels readable
          );
          let chartSeries = topCategoriesData.map(([, score]) => score);

          // Add "Others" category if necessary
          if (otherScore > 0) {
            chartLabels.push(getText("charts.othersCategory"));
            chartSeries.push(otherScore);
          }

          console.log("TopSourcesChart Data:", {
            labels: chartLabels,
            series: chartSeries,
          });

          if (chartLabels.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
              "table.noData"
            )}</p>`;
            return;
          }

          const baseOptions = getChartBaseOptions();
          const options = {
            ...baseOptions,
            chart: {
              ...baseOptions.chart,
              type: "donut",
              height:
                containerId.startsWith("charts-") ||
                containerId === "modal-chart-container"
                  ? 350 // Larger height for dedicated views/modal
                  : 280, // Smaller height for dashboard widget
            },
            series: chartSeries,
            labels: chartLabels,
            plotOptions: {
              pie: {
                donut: {
                  size: "75%", // Increase donut size to create more space in center
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      label: getText("table.headerTotalScore"),
                      color: `hsl(${getCssVariableValue("--foreground")})`, // Use foreground color
                      fontSize: "12px", // Reduce font size
                      fontWeight: 600,
                      offsetY: -35, // Move total label significantly higher
                      formatter: (w) => {
                        // Calculate sum from series totals
                        // Guard against potential errors if w or w.globals is undefined
                        if (!w || !w.globals || !w.globals.seriesTotals)
                          return "0";
                        return NUMERIC_FORMATTER.format(
                          w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                        );
                      },
                    },
                    value: {
                      color: `hsl(${getCssVariableValue("--foreground")})`, // Use foreground color
                      fontSize: "18px",
                      fontWeight: 600,
                      offsetY: -3, // Adjust value position
                      formatter: (val) => NUMERIC_FORMATTER.format(val), // Format individual value
                    },
                    name: {
                      offsetY: 30, // Move names further down
                      fontSize: "12px", // Smaller font for category name
                      color: `hsl(${getCssVariableValue("--foreground")})`,
                    },
                  },
                },
              },
            },
            legend: {
              ...baseOptions.legend,
              position: "bottom",
              horizontalAlign: "center",
              itemMargin: { horizontal: 5, vertical: 2 },
              markers: { width: 8, height: 8 },
              formatter: function (seriesName, opts) {
                const maxLength = 18; // Adjust max length as needed
                return seriesName.length > maxLength
                  ? seriesName.substring(0, maxLength - 1) + "…"
                  : seriesName;
              },
            },
            xaxis: undefined,
            yaxis: undefined,
            tooltip: {
              ...baseOptions.tooltip,
              y: {
                formatter: (value) => NUMERIC_FORMATTER.format(value),
                title: {
                  formatter: (seriesName, opts) =>
                    opts?.w?.globals?.labels?.[opts.seriesIndex] ?? seriesName,
                },
              },
              marker: { show: true },
            },
            dataLabels: {
              enabled: false,
            },
          };

          // Create and render the chart
          chartInstances[instanceKey] = new ApexCharts(container, options);
          try {
            chartInstances[instanceKey].render();
            // Remove spinner after rendering
            container.querySelector(".spinner")?.remove();
          } catch (e) {
            // Catch render errors
            console.error(
              `Failed to render TopSourcesChart in #${containerId}:`,
              e
            );
            container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
            chartInstances[instanceKey] = null; // Clear instance on error
          }
          // --- End of chart logic ---
        } catch (innerError) {
          // Catch errors inside setTimeout
          console.error(
            `Error processing/rendering chart in #${containerId} (async):`,
            innerError
          );
          const targetContainer = document.getElementById(containerId); // Re-fetch container just in case
          if (targetContainer)
            targetContainer.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
          if (chartInstances[instanceKey]) {
            try {
              chartInstances[instanceKey].destroy();
            } catch (destroyError) {}
            chartInstances[instanceKey] = null;
          }
        }
      }, 0); // Delay of 0ms
    } catch (e) {
      // Catch synchronous errors (e.g., finding container)
      console.error(
        `Error setting up top sources chart in #${containerId}:`,
        e
      );
      const container = document.getElementById(containerId);
      if (container)
        container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
          "status.chartError"
        )}</p>`;
      if (chartInstances[instanceKey]) {
        try {
          chartInstances[instanceKey].destroy();
        } catch (destroyError) {}
        chartInstances[instanceKey] = null;
      }
    }
  }

  /** Renders the 'Score Distribution' bar chart. */
  function renderScoreDistributionChart(
    containerId = "score-distribution-chart-container"
  ) {
    const instanceKey =
      containerId === "modal-chart-container"
        ? "modalChart"
        : containerId.startsWith("charts-")
        ? "scoreDistributionChartsPage"
        : "scoreDistribution";
    console.log(
      `Starting renderScoreDistributionChart in #${containerId} (key: ${instanceKey})`
    );
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
      }

      // --- Modified Destroy Logic ---
      const existingChart = chartInstances[instanceKey];
      if (existingChart) {
        try {
          existingChart.destroy();
          console.log(`Chart instance ${instanceKey} destroyed.`);
        } catch (e) {
          console.warn(
            `Error destroying previous chart ${instanceKey}: ${e.message}`
          );
        }
        chartInstances[instanceKey] = null;
      }
      // --- End Modified Destroy Logic ---

      // Show spinner immediately
      container.innerHTML = '<div class="spinner mx-auto my-8"></div>';

      // --- Wrap in setTimeout ---
      setTimeout(() => {
        try {
          // Inner try/catch
          if (!allPlayersData || allPlayersData.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
              "table.noData"
            )}</p>`;
            return;
          }
          // --- Original data processing ---
          const scores = allPlayersData.map((p) => p.TOTAL_SCORE || 0);
          const maxScore = Math.max(...scores, 0);
          let bracketSize;
          if (maxScore <= 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
              "table.noData"
            )}</p>`;
            return;
          }
          if (maxScore > 1000000) bracketSize = 200000;
          else if (maxScore > 500000) bracketSize = 100000;
          else if (maxScore > 100000) bracketSize = 50000;
          else if (maxScore > 20000) bracketSize = 10000;
          else if (maxScore > 5000) bracketSize = 2500;
          else if (maxScore > 1000) bracketSize = 1000;
          else if (maxScore > 100) bracketSize = 100;
          else bracketSize = Math.max(10, Math.ceil(maxScore / 10));
          const numBrackets = Math.max(1, Math.ceil(maxScore / bracketSize));
          const brackets = Array.from({ length: numBrackets }, (_, i) => ({
            min: i * bracketSize,
            max: (i + 1) * bracketSize,
            count: 0,
          }));
          scores.forEach((score) => {
            for (let i = 0; i < brackets.length; i++) {
              if (
                (i === brackets.length - 1 && score >= brackets[i].min) ||
                (score >= brackets[i].min && score < brackets[i].max)
              ) {
                brackets[i].count++;
                break;
              }
            }
          });
          const chartLabels = brackets.map((b) => {
            const minK = (b.min / 1000).toFixed(
              b.min < 1000 && b.min > 0 ? 1 : 0
            );
            const maxK = (b.max / 1000).toFixed(
              b.max < 1000 && b.max > 0 ? 1 : 0
            );
            return `${minK}k-${maxK}k`;
          });
          const chartSeries = brackets.map((b) => b.count);
          console.log("ScoreDistributionChart Data:", {
            labels: chartLabels,
            series: chartSeries,
          });

          // --- Original options ---
          const baseOptions = getChartBaseOptions();
          const options = {
            ...baseOptions,
            chart: {
              ...baseOptions.chart,
              type: "bar",
              height:
                containerId.startsWith("charts-") ||
                containerId === "modal-chart-container"
                  ? 350
                  : 280,
            },
            series: [
              { name: getText("dashboard.statPlayers"), data: chartSeries },
            ],
            xaxis: {
              ...baseOptions.xaxis,
              categories: chartLabels, // Use formatted bracket labels
              labels: {
                ...baseOptions.xaxis.labels,
                rotate: -60, // Rotate labels for better fit
                style: { fontSize: "10px" },
              },
              title: {
                text: getText("table.headerTotalScore"), // X-axis represents score ranges
                style: {
                  fontSize: "10px",
                  color: baseOptions.chart.foreColor,
                  fontWeight: 400,
                },
              },
            },
            yaxis: {
              ...baseOptions.yaxis,
              title: {
                text: getText("dashboard.statPlayers"), // Y-axis represents player count
                style: {
                  fontSize: "10px",
                  color: baseOptions.chart.foreColor,
                  fontWeight: 400,
                },
              },
              labels: {
                ...baseOptions.yaxis.labels,
                // Use simple number formatting for player count
                formatter: (val) =>
                  val !== undefined && val !== null
                    ? NUMERIC_FORMATTER.format(Math.round(val))
                    : "",
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 2, // Slight rounding
                columnWidth: "80%", // Adjust bar width
                dataLabels: { position: "top" }, // Show data labels on top if enabled
              },
            },
            tooltip: {
              // Customize tooltip
              ...baseOptions.tooltip,
              x: {
                // Show the score range in the tooltip
                formatter: (val, { dataPointIndex, w }) =>
                  w?.globals?.categories?.[dataPointIndex] !== undefined
                    ? `${getText("table.headerScore")}: ${
                        w.globals.categories[dataPointIndex]
                      }`
                    : "",
              },
              y: {
                // Show the player count in the tooltip
                formatter: (val) =>
                  val !== undefined && val !== null
                    ? `${NUMERIC_FORMATTER.format(val)} ${getText(
                        "dashboard.statPlayers"
                      ).toLowerCase()}`
                    : "",
                title: { formatter: (seriesName) => seriesName }, // Keep "Players" as title
              },
            },
            dataLabels: {
              // Keep disabled by default, but configure if enabled later
              enabled: false,
              offsetY: -15,
              style: { fontSize: "9px", colors: [baseOptions.chart.foreColor] },
              formatter: (val) => NUMERIC_FORMATTER.format(val),
            },
          };

          // --- Original render ---
          chartInstances[instanceKey] = new ApexCharts(container, options);
          try {
            chartInstances[instanceKey].render();
            // Remove spinner after rendering
            container.querySelector(".spinner")?.remove();
          } catch (e) {
            console.error(
              `Failed to render ScoreDistributionChart in #${containerId}:`,
              e
            );
            container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
            chartInstances[instanceKey] = null; // Clear instance on error
          }
        } catch (innerError) {
          console.error(
            `Error processing/rendering chart in #${containerId} (async):`,
            innerError
          );
          const targetContainer = document.getElementById(containerId);
          if (targetContainer)
            targetContainer.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
          if (chartInstances[instanceKey]) {
            try {
              chartInstances[instanceKey].destroy();
            } catch (destroyError) {}
            chartInstances[instanceKey] = null;
          }
        }
      }, 0);
    } catch (e) {
      console.error(
        `Error setting up score distribution chart in #${containerId}:`,
        e
      );
      const container = document.getElementById(containerId);
      if (container)
        container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
          "status.chartError"
        )}</p>`;
      if (chartInstances[instanceKey]) {
        try {
          chartInstances[instanceKey].destroy();
        } catch (destroyError) {}
        chartInstances[instanceKey] = null;
      }
    }
  }

  /** Renders the 'Score vs Chests' scatter plot. */
  function renderScoreVsChestsChart(
    containerId = "score-vs-chests-chart-container"
  ) {
    const instanceKey =
      containerId === "modal-chart-container"
        ? "modalChart"
        : containerId.startsWith("charts-")
        ? "scoreVsChestsChartsPage"
        : "scoreVsChests";
    console.log(
      `Starting renderScoreVsChestsChart in #${containerId} (key: ${instanceKey})`
    );
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
      }

      // --- Modified Destroy Logic ---
      const existingChart = chartInstances[instanceKey];
      if (existingChart) {
        try {
          existingChart.destroy();
          console.log(`Chart instance ${instanceKey} destroyed.`);
        } catch (e) {
          console.warn(
            `Error destroying previous chart ${instanceKey}: ${e.message}`
          );
        }
        chartInstances[instanceKey] = null;
      }
      // --- End Modified Destroy Logic ---

      // Show spinner immediately
      container.innerHTML = '<div class="spinner mx-auto my-8"></div>';

      // --- Wrap in setTimeout ---
      setTimeout(() => {
        try {
          // Inner try/catch
          if (!allPlayersData || allPlayersData.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
              "table.noData"
            )}</p>`;
            return;
          }
          // --- Original data processing ---
          const seriesData = allPlayersData.map((player) => ({
            x: player.CHEST_COUNT || 0,
            y: player.TOTAL_SCORE || 0,
            name: player.PLAYER, // Include player name for tooltip
          }));
          console.log(`ScoreVsChestsChart Data Points: ${seriesData.length}`);

          // --- Original options ---
          const baseOptions = getChartBaseOptions();
          const options = {
            ...baseOptions,
            chart: {
              ...baseOptions.chart,
              type: "scatter",
              height:
                containerId.startsWith("charts-") ||
                containerId === "modal-chart-container"
                  ? 350
                  : 280,
              zoom: { enabled: true, type: "xy" }, // Enable zooming
              toolbar: {
                // Customize toolbar for scatter
                show: true,
                tools: {
                  download: true,
                  selection: true,
                  zoom: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  reset: true,
                },
              },
            },
            series: [{ name: getText("table.headerPlayer"), data: seriesData }],
            xaxis: {
              ...baseOptions.xaxis,
              tickAmount: 8, // Adjust number of ticks on x-axis
              title: {
                text: getText("table.headerChestCount"),
                style: {
                  fontSize: "10px",
                  color: baseOptions.chart.foreColor,
                  fontWeight: 400,
                },
              },
              labels: {
                ...baseOptions.xaxis.labels,
                // Format X-axis labels (chest count) as numbers
                formatter: (val) =>
                  val !== undefined
                    ? NUMERIC_FORMATTER.format(Math.round(val))
                    : "",
                rotate: 0, // No rotation needed for scatter plot axis usually
              },
            },
            yaxis: {
              ...baseOptions.yaxis,
              tickAmount: 6, // Adjust number of ticks on y-axis
              title: {
                text: getText("table.headerTotalScore"),
                style: {
                  fontSize: "10px",
                  color: baseOptions.chart.foreColor,
                  fontWeight: 400,
                },
              },
              // Y-axis formatter comes from baseOptions (handles K/M abbreviation)
            },
            tooltip: {
              // Custom tooltip to show player name, chests, and score
              theme: "dark",
              intersect: false, // Show tooltip even when not directly hovering over marker
              custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                // Get the data point for the hovered element
                const dataPoint =
                  w.globals.initialSeries[seriesIndex]?.data[dataPointIndex];
                if (!dataPoint) return ""; // Exit if no data point found

                const pointColor =
                  w.globals.colors[seriesIndex] || baseOptions.colors[0];
                const bgColor = `hsl(${getCssVariableValue("--card")})`;
                const textColor = `hsl(${getCssVariableValue(
                  "--card-foreground"
                )})`;
                const borderColor = `hsl(${getCssVariableValue("--border")})`;

                return `
                        <div class="apexcharts-tooltip-custom" style="background-color: ${bgColor}; border: 1px solid ${borderColor}; padding: 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-size: 12px; color: ${textColor};">
                        <div style="font-weight: 600; margin-bottom: 4px;">${
                          dataPoint.name || ""
                        }</div>
                        <div>
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${pointColor}; margin-right: 5px;"></span>
                            <span>${getText(
                              "table.headerChests"
                            )}: ${NUMERIC_FORMATTER.format(dataPoint.x)}</span>
                        </div>
                        <div>
                            <span style="display: inline-block; width: 10px; height: 10px; margin-right: 5px;"></span> <!-- Spacer -->
                            <span>${getText(
                              "table.headerScore"
                            )}: ${NUMERIC_FORMATTER.format(dataPoint.y)}</span>
                        </div>
                        </div>`;
              },
            },
            markers: {
              // Configure markers for scatter plot
              size: 5, // Visible marker size
              strokeWidth: 0, // No border on markers
              hover: { size: 7 }, // Enlarge marker on hover
            },
            grid: {
              // Show both X and Y grid lines for scatter
              ...baseOptions.grid,
              xaxis: { lines: { show: true } },
              yaxis: { lines: { show: true } },
            },
          };

          // --- Original render ---
          chartInstances[instanceKey] = new ApexCharts(container, options);
          try {
            chartInstances[instanceKey].render();
            // Remove spinner after rendering
            container.querySelector(".spinner")?.remove();
          } catch (e) {
            console.error(
              `Failed to render ScoreVsChestsChart in #${containerId}:`,
              e
            );
            container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
            chartInstances[instanceKey] = null; // Clear instance on error
          }
        } catch (innerError) {
          console.error(
            `Error processing/rendering chart in #${containerId} (async):`,
            innerError
          );
          const targetContainer = document.getElementById(containerId);
          if (targetContainer)
            targetContainer.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
          if (chartInstances[instanceKey]) {
            try {
              chartInstances[instanceKey].destroy();
            } catch (destroyError) {}
            chartInstances[instanceKey] = null;
          }
        }
      }, 0);
    } catch (e) {
      console.error(
        `Error setting up score vs chests chart in #${containerId}:`,
        e
      );
      const container = document.getElementById(containerId);
      if (container)
        container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
          "status.chartError"
        )}</p>`;
      if (chartInstances[instanceKey]) {
        try {
          chartInstances[instanceKey].destroy();
        } catch (destroyError) {}
        chartInstances[instanceKey] = null;
      }
    }
  }

  /** Renders the 'Most Frequent Sources' horizontal bar chart. */
  function renderFrequentSourcesChart(
    containerId = "frequent-sources-chart-container"
  ) {
    const instanceKey =
      containerId === "modal-chart-container"
        ? "modalChart"
        : containerId.startsWith("charts-")
        ? "frequentSourcesChartsPage"
        : "frequentSources";
    console.log(
      `Starting renderFrequentSourcesChart in #${containerId} (key: ${instanceKey})`
    );
    try {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
      }

      // --- Modified Destroy Logic ---
      const existingChart = chartInstances[instanceKey];
      if (existingChart) {
        try {
          existingChart.destroy();
          console.log(`Chart instance ${instanceKey} destroyed.`);
        } catch (e) {
          console.warn(
            `Error destroying previous chart ${instanceKey}: ${e.message}`
          );
        }
        chartInstances[instanceKey] = null;
      }
      // --- End Modified Destroy Logic ---

      // Show spinner immediately
      container.innerHTML = '<div class="spinner mx-auto my-8"></div>';

      // --- Wrap in setTimeout ---
      setTimeout(() => {
        try {
          // Inner try/catch
          if (!allPlayersData || allPlayersData.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
              "table.noData"
            )}</p>`;
            return;
          }
          // --- Original data processing ---
          const categoryCounts = {};
          allPlayersData.forEach((player) => {
            Object.keys(player).forEach((key) => {
              if (
                !CORE_COLUMNS.includes(key) &&
                typeof player[key] === "number" &&
                player[key] > 0
              )
                categoryCounts[key] = (categoryCounts[key] || 0) + 1;
            });
          });
          const sortedCategories = Object.entries(categoryCounts).sort(
            ([, countA], [, countB]) => countB - countA
          );
          const topN = 10;
          const topCategoriesData = sortedCategories.slice(0, topN);
          const chartLabels =
            topCategoriesData.map(([key]) => key.replace(/_/g, " ")) || [];
          const chartSeries = topCategoriesData.map(([, count]) => count) || [];
          console.log("FrequentSourcesChart Data:", {
            labels: chartLabels,
            series: chartSeries,
          });
          if (chartLabels.length === 0) {
            container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
              "table.noData"
            )}</p>`;
            return;
          }

          // --- Original options (Further Simplified) ---
          const baseOptions = getChartBaseOptions();
          const options = {
            series: [
              { name: getText("dashboard.statPlayers"), data: chartSeries },
            ],
            chart: {
              ...baseOptions.chart,
              type: "bar",
              height:
                containerId.startsWith("charts-") ||
                containerId === "modal-chart-container"
                  ? 350
                  : 280,
            },
            plotOptions: {
              bar: {
                horizontal: true,
                borderRadius: 2,
                barHeight: "60%",
                distributed: false, // Explicitly false
                dataLabels: { position: "center" },
              },
            },
            xaxis: {
              // Let ApexCharts handle the numeric axis based on series data
              // Remove categories from xaxis for horizontal bar
              title: {
                text: getText("dashboard.statPlayers"),
                style: {
                  fontSize: "10px",
                  color: baseOptions.chart.foreColor,
                  fontWeight: 400,
                },
              },
              labels: {
                style: {
                  colors: baseOptions.chart.foreColor,
                  fontSize: "10px",
                },
                formatter: (val) =>
                  val !== undefined
                    ? NUMERIC_FORMATTER.format(Math.round(val))
                    : "",
              },
              axisBorder: {
                show: true,
                color: `hsl(${getCssVariableValue("--border")})`,
              },
              axisTicks: {
                show: true,
                color: `hsl(${getCssVariableValue("--border")})`,
              },
              tooltip: { enabled: false },
            },
            yaxis: {
              // Set the category labels for the y-axis
              categories: chartLabels,
              title: { text: undefined }, // Remove Y axis title
              labels: {
                style: {
                  colors: baseOptions.chart.foreColor,
                  fontSize: "11px",
                },
                align: "left",
                //formatter: undefined, // Let ApexCharts use categories
              },
              axisBorder: { show: false },
              axisTicks: { show: false },
            },
            grid: {
              // Keep base grid settings
              ...baseOptions.grid,
              xaxis: { lines: { show: true } },
              yaxis: { lines: { show: false } },
            },
            dataLabels: { enabled: false },
            // Use default tooltip - it should work correctly with yaxis.categories set
            tooltip: {
              theme: "dark", // Use Apex dark theme tooltip
              style: { fontSize: "12px", fontFamily: "Inter, sans-serif" },
              // Default X formatter will show the count
              x: {
                formatter: (val) =>
                  `${NUMERIC_FORMATTER.format(val)} ${getText(
                    "dashboard.statPlayers"
                  ).toLowerCase()}`,
              },
              // Default Y formatter should pick up the category name
              y: {
                title: {
                  formatter: (seriesName) => seriesName, // Show "Players"
                },
              },
            },
            colors: baseOptions.colors,
            legend: baseOptions.legend,
          };

          // --- Original render ---
          chartInstances[instanceKey] = new ApexCharts(container, options);
          try {
            chartInstances[instanceKey].render();
            // Remove spinner after rendering
            container.querySelector(".spinner")?.remove();
            console.log(
              `Finished renderFrequentSourcesChart in #${containerId}.`
            );
          } catch (renderError) {
            console.error(
              `Failed to render FrequentSourcesChart in #${containerId} (render stage):`,
              renderError
            );
            container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
            chartInstances[instanceKey] = null; // Clear instance on error
          }
        } catch (innerError) {
          console.error(
            `Error processing/rendering chart in #${containerId} (async):`,
            innerError
          );
          const targetContainer = document.getElementById(containerId);
          if (targetContainer)
            targetContainer.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
              "status.chartError"
            )}</p>`;
          if (chartInstances[instanceKey]) {
            try {
              chartInstances[instanceKey].destroy();
            } catch (destroyError) {}
            chartInstances[instanceKey] = null;
          }
        }
      }, 0);
    } catch (e) {
      console.error(
        `Error setting up frequent sources chart in #${containerId}:`,
        e
      );
      const container = document.getElementById(containerId);
      if (container)
        container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
          "status.chartError"
        )}</p>`;
      if (chartInstances[instanceKey]) {
        try {
          chartInstances[instanceKey].destroy();
        } catch (destroyError) {}
        chartInstances[instanceKey] = null;
      }
    }
  }

  // --- Chart Modal Logic ---
  /** Handles clicks on chart expand buttons using event delegation. */
  function handleExpandChartClick(event) {
    // Find the closest button with the data-chart-type attribute
    const button = event.target.closest("button[data-chart-type]");
    if (!button) return; // Exit if the click wasn't on an expand button

    const chartType = button.dataset.chartType;
    console.log(`Expanding chart: ${chartType}`);

    // Ensure modal elements are available
    if (!modalChartContainer || !modalChartTitle || !chartModal) {
      console.error("Modal elements not found!");
      return;
    }

    // Show spinner in modal container and destroy any previous modal chart
    modalChartContainer.innerHTML = '<div class="spinner mx-auto my-8"></div>';
    chartInstances.modalChart
      ?.destroy()
      .catch((e) => console.warn("Error destroying previous modal chart:", e));
    chartInstances.modalChart = null;

    let titleKey = ""; // Key for translated chart title

    // Check if data is available before attempting to render
    if (!allPlayersData || allPlayersData.length === 0) {
      modalChartContainer.innerHTML = `<p class="text-center text-slate-400 py-10">${getText(
        "table.noData"
      )}</p>`;
      titleKey = "table.noData"; // Set title to indicate no data
    } else {
      // Render the appropriate chart type into the modal container
      try {
        switch (chartType) {
          case "topSources":
            titleKey = "dashboard.chartTopSourcesTitle";
            renderTopSourcesChart("modal-chart-container"); // Render function handles its own errors
            break;
          case "scoreDistribution":
            titleKey = "dashboard.chartScoreDistTitle";
            renderScoreDistributionChart("modal-chart-container");
            break;
          case "scoreVsChests":
            titleKey = "dashboard.chartScoreVsChestsTitle";
            renderScoreVsChestsChart("modal-chart-container");
            break;
          case "frequentSources":
            titleKey = "dashboard.chartFreqSourcesTitle";
            renderFrequentSourcesChart("modal-chart-container"); // This might fail silently
            break;
          // Add cases for other expandable charts if needed
          // case "playerPerformance": // Example if player chart was expandable
          //     if (currentPlayerData) {
          //         titleKey = "playerDetail.performanceTitle";
          //         renderPlayerChart(currentPlayerData, "modal-chart-container");
          //     } else {
          //         titleKey = "status.noPlayerData";
          //         modalChartContainer.innerHTML = `<p class="text-center text-red-500">${getText(titleKey)}</p>`;
          //     }
          //     break;
          default:
            console.error(`Unknown chart type for expand: ${chartType}`);
            titleKey = "status.error";
            modalChartContainer.innerHTML = `<p class="text-center text-red-500">Unknown chart type: ${chartType}</p>`;
        }
      } catch (renderError) {
        console.error(`Error rendering modal chart ${chartType}:`, renderError);
        titleKey = "status.chartError";
        modalChartContainer.innerHTML = `<p class="text-center text-red-500">${getText(
          titleKey
        )}</p>`;
      }
    }

    // Set the modal title using the determined key
    modalChartTitle.textContent = getText(titleKey || "Chart"); // Fallback title

    // Show the modal
    chartModal.classList.remove("hidden");
  }

  /** Closes the chart modal and destroys its chart instance. */
  function handleModalClose() {
    console.log("Closing chart modal");
    if (!chartModal || !modalChartContainer) return;

    // Destroy the chart instance inside the modal
    if (chartInstances.modalChart) {
      try {
        chartInstances.modalChart.destroy();
        console.log("Modal chart instance destroyed.");
      } catch (e) {
        console.warn("Error destroying modal chart:", e);
      }
      chartInstances.modalChart = null; // Clear the reference
    }

    // Clear the container and hide the modal
    modalChartContainer.innerHTML = "";
    chartModal.classList.add("hidden");
  }

  // --- DOWNLOAD FUNCTIONS ---
  /** Generates and triggers a download for the full processed data CSV. */
  function downloadFullDataCSV() {
    if (!allPlayersData || allPlayersData.length === 0) {
      setStatus(getText("table.noData"), "error", 3000);
      return;
    }
    try {
      setStatus(getText("status.generatingCsv"), "info"); // Use info type

      // Ensure headers match the actual data structure
      const headers =
        allColumnHeaders.length > 0
          ? allColumnHeaders
          : Object.keys(allPlayersData[0]);

      // Use PapaParse to generate CSV string, ensuring correct headers
      const csv = Papa.unparse(allPlayersData, {
        columns: headers, // Specify headers explicitly
        header: true,
      });

      // Trigger the download
      triggerDownload(
        csv,
        "totalbattle_chest_data_processed.csv", // More descriptive filename
        "text/csv;charset=utf-8;"
      );

      setStatus(
        getText("status.downloadInitiated", { 0: "CSV" }),
        "success",
        3000
      );
    } catch (error) {
      console.error("Error generating CSV:", error);
      setStatus(getText("status.downloadError", { 0: "CSV" }), "error", 3000);
    } finally {
      // Ensure loading status is cleared even if error occurs
      if (statusMessage.textContent === getText("status.generatingCsv")) {
        setStatus(""); // Clear "Generating..." message
      }
    }
  }

  /** Generates and triggers a download for a single player's data in JSON format. */
  function downloadPlayerDataJSON(playerData) {
    if (!playerData || typeof playerData !== "object" || !playerData.PLAYER) {
      setStatus(getText("status.noPlayerData"), "error", 3000);
      return;
    }
    try {
      setStatus(getText("status.generatingJson"), "info");

      // Stringify the player data with pretty printing (2-space indent)
      const jsonString = JSON.stringify(playerData, null, 2);

      // Create a safe filename from the player's name
      const filenameSafePlayerName = String(playerData.PLAYER)
        .replace(/[^a-z0-9_.-]/gi, "_") // Replace invalid chars with underscore
        .toLowerCase();
      const filename = `player_${filenameSafePlayerName}_data.json`;

      // Trigger the download
      triggerDownload(jsonString, filename, "application/json;charset=utf-8;");

      setStatus(
        getText("status.downloadInitiated", { 0: "Player JSON" }),
        "success",
        3000
      );
    } catch (error) {
      console.error("Error generating player JSON:", error);
      setStatus(
        getText("status.downloadError", { 0: "Player JSON" }),
        "error",
        3000
      );
    } finally {
      // Ensure loading status is cleared
      if (statusMessage.textContent === getText("status.generatingJson")) {
        setStatus("");
      }
    }
  }

  /**
   * Creates a blob and triggers a browser download.
   * @param {string} content - The file content.
   * @param {string} filename - The desired filename.
   * @param {string} contentType - The MIME type (e.g., 'text/csv;charset=utf-8;').
   */
  function triggerDownload(content, filename, contentType) {
    try {
      const blob = new Blob([content], { type: contentType });
      const link = document.createElement("a");

      // Use createObjectURL for broader browser compatibility
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);

      // Append link, click, and remove
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(url);

      console.log(`Download triggered for: ${filename}`);
    } catch (error) {
      console.error("Error triggering download:", error);
      setStatus(
        getText("status.downloadError", { 0: filename }),
        "error",
        5000
      );
    }
  }

  /**
   * Renders the player performance radar chart.
   * @param {object} player - The player data object.
   * @param {string} containerId - The ID of the HTML container element.
   */
  function renderPlayerChart(player, containerId = "player-chart-container") {
    console.log(`Starting renderPlayerChart for ${player?.PLAYER} in #${containerId}`);
    const instanceKey = containerId === "modal-chart-container" ? "modalChart" : "playerChart";
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error(`Player chart container #${containerId} not found`);
      return;
    }

    // Ensure previous instance is destroyed safely
    if (chartInstances[instanceKey]) {
      try {
        chartInstances[instanceKey].destroy();
      } catch (e) {
        console.warn(`Error destroying previous chart in #${containerId}:`, e);
      }
      chartInstances[instanceKey] = null;
    }

    // Show loading spinner
    container.innerHTML = '<div class="spinner mx-auto my-8"></div>';
    
    if (!player) {
      console.error("No player data provided for player chart");
      container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText("status.noPlayerData")}</p>`;
      return;
    }

    try {
      // Get category keys with scores > 0, excluding core columns
      const categoryKeys = Object.keys(player)
        .filter(key => !CORE_COLUMNS.includes(key) && 
                typeof player[key] === "number" && 
                player[key] > 0)
        .sort((keyA, keyB) => (player[keyB] ?? 0) - (player[keyA] ?? 0));
      
      // Take top 8 categories for better radar display
      const topCategories = categoryKeys.slice(0, 8);
      
      if (topCategories.length < 3) {
        // Need at least 3 categories for a meaningful radar chart
        container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText("charts.notEnoughDataRadar")}</p>`;
        return;
      }
      
      const chartLabels = topCategories.map(key => key.replace(/_/g, " "));
      const chartSeries = [{ 
        name: player.PLAYER,
        data: topCategories.map(key => player[key] || 0)
      }];
      
      console.log("PlayerChart Data:", {
        labels: chartLabels,
        series: chartSeries,
        categories: topCategories.length
      });
      
      // Get base options and customize for radar chart
      const baseOptions = getChartBaseOptions();
      const options = {
        ...baseOptions,
        chart: {
          ...baseOptions.chart,
          type: 'radar',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: true
            }
          },
          height: 350
        },
        series: chartSeries,
        labels: chartLabels,
        xaxis: {
          labels: {
            style: {
              colors: Array(chartLabels.length).fill(baseOptions.chart.foreColor),
              fontSize: '11px'
            }
          }
        },
        yaxis: {
          show: false
        },
        plotOptions: {
          radar: {
            size: undefined,
            polygons: {
              strokeColors: `hsl(${getCssVariableValue("--border")})`,
              strokeWidth: 1,
              connectorColors: `hsl(${getCssVariableValue("--border")})`,
              fill: {
                colors: undefined
              }
            }
          }
        },
        tooltip: {
          theme: 'dark',
          y: {
            formatter: (val) => NUMERIC_FORMATTER.format(val)
          }
        },
        legend: {
          show: false // Hide legend since it's only one player
        }
      };
      
      // Create and render chart
      chartInstances[instanceKey] = new ApexCharts(container, options);
      chartInstances[instanceKey].render();
      
      // Remove spinner after rendering
      container.querySelector(".spinner")?.remove();
      console.log(`Finished renderPlayerChart for ${player.PLAYER} in #${containerId}`);
    } catch (e) {
      console.error(`Error setting up player chart in #${containerId}:`, e);
      container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText("status.chartError")}</p>`;
      chartInstances[instanceKey] = null;
    }
  }

  // --- HISTORICAL DATA FUNCTIONS ---
  
  /**
   * Loads data from all available weeks for historical analysis
   * @returns {Promise<Array>} Promise resolving to an array of weekly data objects
   */
  async function loadHistoricalData() {
    if (availableWeeks.length === 0) {
      console.error("No weekly data available for historical analysis");
      return [];
    }
    
    const historicalDataArray = [];
    
    // Load data for each week
    for (const week of availableWeeks) {
      try {
        const weekData = await loadWeekData(week);
        if (weekData && weekData.length > 0) {
          historicalDataArray.push({
            week: week,
            data: weekData
          });
        }
      } catch (error) {
        console.error(`Error loading historical data for week ${week.weekNumber}:`, error);
      }
    }
    
    // Sort by week number (ascending)
    return historicalDataArray.sort((a, b) => a.week.weekNumber - b.week.weekNumber);
  }
  
  /**
   * Calculates statistics across all weeks
   * @param {Array} historicalData Array of weekly data objects
   * @returns {Object} Object containing statistics across weeks
   */
  function calculateHistoricalStats(historicalData) {
    if (!historicalData || historicalData.length === 0) {
      return null;
    }
    
    // Initialize stats object
    const stats = {
      weeklyTotals: [], // Stats per week
      playerTracking: {}, // Track players across weeks
      totalPlayers: 0, // Unique players across all weeks
      totalPointsAllWeeks: 0, // Sum of all points across all weeks
      totalChestsAllWeeks: 0, // Sum of all chests across all weeks
      categoryTrends: {}, // Trend data for each category across weeks
    };
    
    // Process each week's data
    historicalData.forEach(weekObj => {
      const { week, data } = weekObj;
      
      // Weekly totals
      const weekStats = {
        weekNumber: week.weekNumber,
        startDate: week.startDate,
        endDate: week.endDate,
        playerCount: data.length,
        totalPoints: 0,
        totalChests: 0,
        avgPointsPerPlayer: 0,
        avgChestsPerPlayer: 0,
        categories: {}
      };
      
      // Process player data for this week
      data.forEach(player => {
        // Add to weekly totals
        weekStats.totalPoints += parseInt(player.TOTAL_SCORE, 10) || 0;
        weekStats.totalChests += parseInt(player.CHEST_COUNT, 10) || 0;
        
        // Track players across weeks
        if (!stats.playerTracking[player.PLAYER]) {
          stats.playerTracking[player.PLAYER] = {
            weeks: [],
            totalScore: 0,
            totalChests: 0
          };
        }
        
        // Add this week's data to player tracking
        stats.playerTracking[player.PLAYER].weeks.push({
          weekNumber: week.weekNumber,
          score: parseInt(player.TOTAL_SCORE, 10) || 0,
          chests: parseInt(player.CHEST_COUNT, 10) || 0
        });
        
        // Update player's total stats
        stats.playerTracking[player.PLAYER].totalScore += parseInt(player.TOTAL_SCORE, 10) || 0;
        stats.playerTracking[player.PLAYER].totalChests += parseInt(player.CHEST_COUNT, 10) || 0;
        
        // Process category data
        Object.keys(player).forEach(key => {
          // Skip core columns
          if (CORE_COLUMNS.includes(key)) return;
          
          const value = parseInt(player[key], 10) || 0;
          
          // Add to categories for this week
          if (!weekStats.categories[key]) {
            weekStats.categories[key] = 0;
          }
          weekStats.categories[key] += value;
          
          // Add to category trends
          if (!stats.categoryTrends[key]) {
            stats.categoryTrends[key] = [];
          }
          
          // Find or create category data for this week
          const existingWeekData = stats.categoryTrends[key].find(
            item => item.weekNumber === week.weekNumber
          );
          
          if (existingWeekData) {
            existingWeekData.value += value;
          } else {
            stats.categoryTrends[key].push({
              weekNumber: week.weekNumber,
              weekLabel: `${i18n.t('week')} ${week.weekNumber}`,
              value: value
            });
          }
        });
      });
      
      // Calculate averages
      weekStats.avgPointsPerPlayer = weekStats.playerCount > 0 
        ? (weekStats.totalPoints / weekStats.playerCount).toFixed(2) 
        : 0;
      weekStats.avgChestsPerPlayer = weekStats.playerCount > 0 
        ? (weekStats.totalChests / weekStats.playerCount).toFixed(2) 
        : 0;
      
      // Add to weekly totals array
      stats.weeklyTotals.push(weekStats);
      
      // Add to overall totals
      stats.totalPointsAllWeeks += weekStats.totalPoints;
      stats.totalChestsAllWeeks += weekStats.totalChests;
    });
    
    // Calculate total unique players
    stats.totalPlayers = Object.keys(stats.playerTracking).length;
    
    // Sort category trends by week number
    Object.keys(stats.categoryTrends).forEach(category => {
      stats.categoryTrends[category].sort((a, b) => a.weekNumber - b.weekNumber);
    });
    
    return stats;
  }
  
  /**
   * Renders the weekly totals table on the history page
   * @param {Array} weeklyTotals Array of weekly statistics
   */
  function renderWeeklyTotalsTable(weeklyTotals) {
    const tableContainer = document.getElementById("weekly-totals-table");
    if (!tableContainer) return;
    
    // Create table
    const table = document.createElement("table");
    table.classList.add("min-w-full", "border-collapse", "bg-card");
    
    // Create header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    
    const headers = [
      { id: "weekNumber", text: i18n.t('week') },
      { id: "dateRange", text: i18n.t('date_range') },
      { id: "playerCount", text: i18n.t('player_count') },
      { id: "totalPoints", text: i18n.t('total_points') },
      { id: "totalChests", text: i18n.t('total_chests') },
      { id: "avgPointsPerPlayer", text: i18n.t('avg_points_per_player') },
      { id: "avgChestsPerPlayer", text: i18n.t('avg_chests_per_player') }
    ];
    
    headers.forEach(header => {
      const th = document.createElement("th");
      th.textContent = header.text;
      th.dataset.column = header.id;
      th.classList.add("py-2", "px-4", "text-left", "font-medium", "text-sm", "bg-slate-800", "text-white", "sticky", "top-0");
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement("tbody");
    
    weeklyTotals.forEach((week, index) => {
      const row = document.createElement("tr");
      row.classList.add(index % 2 === 0 ? "bg-slate-800/20" : "bg-slate-800/10");
      
      // Week number cell
      const weekCell = document.createElement("td");
      weekCell.textContent = `${i18n.t('week')} ${week.weekNumber}`;
      weekCell.classList.add("py-2", "px-4", "text-sm");
      row.appendChild(weekCell);
      
      // Date range cell
      const dateRangeCell = document.createElement("td");
      const startDate = new Date(week.startDate).toLocaleDateString(
        currentLanguage === "de" ? "de-DE" : "en-US",
        { day: '2-digit', month: '2-digit', year: 'numeric' }
      );
      const endDate = new Date(week.endDate).toLocaleDateString(
        currentLanguage === "de" ? "de-DE" : "en-US",
        { day: '2-digit', month: '2-digit', year: 'numeric' }
      );
      dateRangeCell.textContent = `${startDate} - ${endDate}`;
      dateRangeCell.classList.add("py-2", "px-4", "text-sm");
      row.appendChild(dateRangeCell);
      
      // Player count cell
      const playerCountCell = document.createElement("td");
      playerCountCell.textContent = week.playerCount;
      playerCountCell.classList.add("py-2", "px-4", "text-sm", "text-right");
      row.appendChild(playerCountCell);
      
      // Total points cell
      const totalPointsCell = document.createElement("td");
      totalPointsCell.textContent = formatNumber(week.totalPoints);
      totalPointsCell.classList.add("py-2", "px-4", "text-sm", "text-right", "font-medium", "text-primary");
      row.appendChild(totalPointsCell);
      
      // Total chests cell
      const totalChestsCell = document.createElement("td");
      totalChestsCell.textContent = formatNumber(week.totalChests);
      totalChestsCell.classList.add("py-2", "px-4", "text-sm", "text-right", "font-medium");
      row.appendChild(totalChestsCell);
      
      // Average points per player cell
      const avgPointsCell = document.createElement("td");
      avgPointsCell.textContent = formatNumber(week.avgPointsPerPlayer);
      avgPointsCell.classList.add("py-2", "px-4", "text-sm", "text-right");
      row.appendChild(avgPointsCell);
      
      // Average chests per player cell
      const avgChestsCell = document.createElement("td");
      avgChestsCell.textContent = formatNumber(week.avgChestsPerPlayer);
      avgChestsCell.classList.add("py-2", "px-4", "text-sm", "text-right");
      row.appendChild(avgChestsCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    
    // Clear container and append table
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
  }
  
  /**
   * Renders the score trend chart on the history page
   * @param {Array} weeklyTotals Array of weekly statistics
   */
  function renderScoreTrendChart(weeklyTotals) {
    const chartElement = document.getElementById("score-trend-chart");
    if (!chartElement) return;
    
    // Prepare data
    const categories = weeklyTotals.map(week => `${i18n.t('week')} ${week.weekNumber}`);
    const seriesData = weeklyTotals.map(week => week.totalPoints);
    
    // Destroy existing chart if it exists
    if (chartInstances.scoreTrendChart) {
      chartInstances.scoreTrendChart.destroy();
    }
    
    // Create chart options
    const options = {
      series: [{
        name: i18n.t('total_points'),
        data: seriesData
      }],
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: false
        },
        background: 'transparent',
        toolbar: {
          show: false
        }
      },
      theme: {
        mode: 'dark'
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#f59e0b'], // amber-500 for primary
      dataLabels: {
        enabled: true,
        formatter: function(value) {
          return formatNumber(value);
        }
      },
      markers: {
        size: 5
      },
      title: {
        text: i18n.t('score_trend_title'),
        align: 'center',
        style: {
          fontSize: '16px',
          color: '#f59e0b' // amber-500 for primary
        }
      },
      grid: {
        borderColor: '#4b5563', // gray-600
        row: {
          colors: ['#1f2937', 'transparent'], // gray-800, transparent
          opacity: 0.5
        }
      },
      xaxis: {
        categories: categories,
        title: {
          text: i18n.t('week')
        }
      },
      yaxis: {
        title: {
          text: i18n.t('total_points')
        },
        labels: {
          formatter: function(value) {
            return formatNumber(value);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return formatNumber(value) + " " + i18n.t('points');
          }
        }
      }
    };
    
    // Create chart
    chartInstances.scoreTrendChart = new ApexCharts(chartElement, options);
    chartInstances.scoreTrendChart.render();
  }
  
  /**
   * Renders the chests trend chart on the history page
   * @param {Array} weeklyTotals Array of weekly statistics
   */
  function renderChestsTrendChart(weeklyTotals) {
    const chartElement = document.getElementById("chests-trend-chart");
    if (!chartElement) return;
    
    // Prepare data
    const categories = weeklyTotals.map(week => `${i18n.t('week')} ${week.weekNumber}`);
    const seriesData = weeklyTotals.map(week => week.totalChests);
    
    // Destroy existing chart if it exists
    if (chartInstances.chestsTrendChart) {
      chartInstances.chestsTrendChart.destroy();
    }
    
    // Create chart options
    const options = {
      series: [{
        name: i18n.t('total_chests'),
        data: seriesData
      }],
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: false
        },
        background: 'transparent',
        toolbar: {
          show: false
        }
      },
      theme: {
        mode: 'dark'
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#f97316'], // orange-500
      dataLabels: {
        enabled: true,
        formatter: function(value) {
          return formatNumber(value);
        }
      },
      markers: {
        size: 5
      },
      title: {
        text: i18n.t('chests_trend_title'),
        align: 'center',
        style: {
          fontSize: '16px',
          color: '#f59e0b' // amber-500 for primary
        }
      },
      grid: {
        borderColor: '#4b5563', // gray-600
        row: {
          colors: ['#1f2937', 'transparent'], // gray-800, transparent
          opacity: 0.5
        }
      },
      xaxis: {
        categories: categories,
        title: {
          text: i18n.t('week')
        }
      },
      yaxis: {
        title: {
          text: i18n.t('total_chests')
        },
        labels: {
          formatter: function(value) {
            return formatNumber(value);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return formatNumber(value) + " " + i18n.t('chests');
          }
        }
      }
    };
    
    // Create chart
    chartInstances.chestsTrendChart = new ApexCharts(chartElement, options);
    chartInstances.chestsTrendChart.render();
  }
  
  /**
   * Renders the top players chart on the history page
   * @param {Object} playerTracking Object tracking players across weeks
   */
  function renderTopPlayersChart(playerTracking) {
    const chartElement = document.getElementById("top-players-chart");
    if (!chartElement) return;
    
    // Get top 10 players by total score
    const topPlayers = Object.entries(playerTracking)
      .map(([name, data]) => ({
        name,
        totalScore: data.totalScore
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
    
    // Prepare data
    const categories = topPlayers.map(player => player.name);
    const seriesData = topPlayers.map(player => player.totalScore);
    
    // Destroy existing chart if it exists
    if (chartInstances.topPlayersChart) {
      chartInstances.topPlayersChart.destroy();
    }
    
    // Create chart options
    const options = {
      series: [{
        name: i18n.t('total_points'),
        data: seriesData
      }],
      chart: {
        type: 'bar',
        height: 350,
        background: 'transparent',
        toolbar: {
          show: false
        }
      },
      theme: {
        mode: 'dark'
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      colors: ['#f59e0b'], // amber-500 for primary
      dataLabels: {
        enabled: true,
        formatter: function(value) {
          return formatNumber(value);
        },
        offsetX: 30,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      title: {
        text: i18n.t('top_players_all_time'),
        align: 'center',
        style: {
          fontSize: '16px',
          color: '#f59e0b' // amber-500 for primary
        }
      },
      grid: {
        borderColor: '#4b5563', // gray-600
        row: {
          colors: ['#1f2937', 'transparent'], // gray-800, transparent
          opacity: 0.5
        }
      },
      xaxis: {
        categories: categories,
        title: {
          text: i18n.t('player')
        },
        labels: {
          formatter: function(value) {
            return formatNumber(value);
          }
        }
      },
      yaxis: {
        title: {
          text: i18n.t('total_points')
        }
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return formatNumber(value) + " " + i18n.t('points');
          }
        }
      }
    };
    
    // Create chart
    chartInstances.topPlayersChart = new ApexCharts(chartElement, options);
    chartInstances.topPlayersChart.render();
  }
  
  /**
   * Renders the category trend chart on the history page
   * @param {Object} categoryTrends Object with category trends data
   */
  function renderCategoryTrendChart(categoryTrends) {
    const chartElement = document.getElementById("category-trend-chart");
    if (!chartElement) return;
    
    // Get top 5 categories by total value across all weeks
    const topCategories = Object.entries(categoryTrends)
      .map(([category, data]) => ({
        category,
        totalValue: data.reduce((sum, item) => sum + item.value, 0)
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5)
      .map(item => item.category);
    
    // Prepare series data
    const series = topCategories.map(category => ({
      name: category,
      data: categoryTrends[category].map(item => item.value)
    }));
    
    // Get all week labels from the first category (all categories should have the same weeks)
    const categories = categoryTrends[topCategories[0]].map(item => item.weekLabel);
    
    // Destroy existing chart if it exists
    if (chartInstances.categoryTrendChart) {
      chartInstances.categoryTrendChart.destroy();
    }
    
    // Create chart options
    const options = {
      series: series,
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: false
        },
        background: 'transparent',
        toolbar: {
          show: false
        }
      },
      theme: {
        mode: 'dark'
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      markers: {
        size: 4
      },
      title: {
        text: i18n.t('category_trends_title'),
        align: 'center',
        style: {
          fontSize: '16px',
          color: '#f59e0b' // amber-500 for primary
        }
      },
      grid: {
        borderColor: '#4b5563', // gray-600
        row: {
          colors: ['#1f2937', 'transparent'], // gray-800, transparent
          opacity: 0.5
        }
      },
      xaxis: {
        categories: categories,
        title: {
          text: i18n.t('week')
        }
      },
      yaxis: {
        title: {
          text: i18n.t('value')
        },
        labels: {
          formatter: function(value) {
            return formatNumber(value);
          }
        }
      },
      legend: {
        position: 'top'
      },
      tooltip: {
        y: {
          formatter: function(value) {
            return formatNumber(value) + " " + i18n.t('points');
          }
        }
      }
    };
    
    // Create chart
    chartInstances.categoryTrendChart = new ApexCharts(chartElement, options);
    chartInstances.categoryTrendChart.render();
  }

  /**
   * Initializes the application
   */
  async function init() {
    console.log("Initializing application...");
    
    // Load language preference from localStorage
    currentLanguage = getLanguagePreference(); // Use the existing function instead
    console.log(`Setting initial language to: ${currentLanguage}`);
    document.documentElement.lang = currentLanguage;
    updateLanguageSwitcherUI();
    
    // Initialize i18next with translations
    initializeTranslations();
    
    // Set up UI event listeners
    setupEventListeners();
    
    // Set initial view to loading
    switchView("loading");
    
    try {
      // Initialize weekly data system (this will set allPlayersData)
      await initWeeklyDataSystem();
      
      // Fetch score rules data
      scoreRulesData = await fetchRulesData();
      
      // Store loaded data in localStorage for offline fallback
      storeDataInLocalStorage();
      
      // If we have data, process and display it
      if (allPlayersData.length > 0) {
        // Load historical data in the background for the history page
        loadHistoricalDataInBackground();
        
        // Switch to the overview view and render data
        switchView("overview");
      } else {
        displayError(i18n.t('no_data_error'));
      }
    } catch (error) {
      console.error("Error initializing application:", error);
      displayError(i18n.t('initialization_error'));
    }
    
    // Set initialized flag
    isInitialized = true;
  }
  
  /**
   * Loads historical data in the background for the history page
   */
  async function loadHistoricalDataInBackground() {
    try {
      // Load historical data
      historicalData = await loadHistoricalData();
      
      // Calculate historical statistics
      historicalStats = calculateHistoricalStats(historicalData);
      
      console.log("Historical data loaded and processed");
    } catch (error) {
      console.error("Error loading historical data:", error);
    }
  }

  /**
   * Populates the week selector dropdown with available weeks
   */
  function populateWeekSelector() {
    const weekSelector = document.getElementById("weekSelector");
    const mobileWeekSelector = document.getElementById("mobileWeekSelector");
    
    if (!weekSelector && !mobileWeekSelector) return;
    
    // Clear existing options
    if (weekSelector) {
      weekSelector.innerHTML = "";
    }
    
    if (mobileWeekSelector) {
      mobileWeekSelector.innerHTML = "";
    }
    
    // Add options for each available week
    availableWeeks.forEach(week => {
      // Format dates for display
      const startDate = new Date(week.startDate).toLocaleDateString(
        currentLanguage === "de" ? "de-DE" : "en-US", 
        { day: '2-digit', month: '2-digit', year: 'numeric' }
      );
      const endDate = new Date(week.endDate).toLocaleDateString(
        currentLanguage === "de" ? "de-DE" : "en-US", 
        { day: '2-digit', month: '2-digit', year: 'numeric' }
      );
      
      const optionText = `${i18n.t('week')} ${week.weekNumber} (${startDate} - ${endDate})`;
      
      // Create and add option to desktop selector
      if (weekSelector) {
        const option = document.createElement("option");
        option.value = week.weekNumber;
        option.textContent = optionText;
        
        // Select the current week
        if (currentWeek && week.weekNumber === currentWeek.weekNumber) {
          option.selected = true;
        }
        
        weekSelector.appendChild(option);
      }
      
      // Create and add option to mobile selector
      if (mobileWeekSelector) {
        const mobileOption = document.createElement("option");
        mobileOption.value = week.weekNumber;
        mobileOption.textContent = optionText;
        
        // Select the current week
        if (currentWeek && week.weekNumber === currentWeek.weekNumber) {
          mobileOption.selected = true;
        }
        
        mobileWeekSelector.appendChild(mobileOption);
      }
    });
    
    // Add event listeners for week change
    if (weekSelector) {
      weekSelector.addEventListener("change", handleWeekChange);
    }
    
    if (mobileWeekSelector) {
      mobileWeekSelector.addEventListener("change", handleWeekChange);
    }
  }
  
  /**
   * Handles the week selection change event
   * @param {Event} event The change event
   */
  async function handleWeekChange(event) {
    const selectedWeekNumber = parseInt(event.target.value, 10);
    const selectedWeek = availableWeeks.find(week => week.weekNumber === selectedWeekNumber);
    
    if (selectedWeek) {
      // Set the current week
      currentWeek = selectedWeek;
      
      // Load data for the selected week
      allPlayersData = await loadWeekData(selectedWeek);
      
      // Sync the other selector
      const otherSelector = event.target.id === "weekSelector" 
        ? document.getElementById("mobileWeekSelector") 
        : document.getElementById("weekSelector");
        
      if (otherSelector) {
        otherSelector.value = selectedWeekNumber;
      }
      
      // Re-process and re-render everything
      if (allPlayersData.length > 0) {
        processDataAfterLoad();
        renderCurrentView();
      } else {
        displayError(i18n.t('week_data_empty_error', { week: selectedWeekNumber }));
      }
    }
  }

  /**
   * Updates a value display element with formatted number
   * @param {string} elementId The ID of the element to update
   * @param {number} value The value to display
   */
  function updateValueDisplay(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = formatNumber(value);
    } else {
      console.warn(`Element not found for updating value: ${elementId}`);
    }
  }

  /**
   * Gets a translated text string
   * @param {string} key The translation key
   * @param {Object} [params] Optional parameters for interpolation
   * @returns {string} The translated text
   */
  function getText(key, params = {}) {
    // Use the same implementation as the original getText function
    const langContent =
      TEXT_CONTENT[currentLanguage] || TEXT_CONTENT[DEFAULT_LANGUAGE];
    let text = key.split(".").reduce((o, i) => o?.[i], langContent);
    if (text === undefined) {
      console.warn(`i18n key not found for lang '${currentLanguage}': ${key}`);
      const defaultContent = TEXT_CONTENT[DEFAULT_LANGUAGE];
      text = key.split(".").reduce((o, i) => o?.[i], defaultContent);
      if (text === undefined) {
        console.error(`i18n key "${key}" missing in both languages!`);
        return `[${key}]`;
      }
    }
    
    // Handle replacements if provided
    if (params && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([rKey, rValue]) => {
        const placeholder = `{${rKey}}`;
        text = text.replace(
          new RegExp(placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
          String(rValue)
        );
      });
    }
    
    return text;
  }
  
  /**
   * Initialize translations and i18n functionality
   * This function is a placeholder since we're using our own getText implementation
   * rather than a full i18n library
   */
  function initializeTranslations() {
    console.log("Initializing translations for language:", currentLanguage);
    // In this implementation, we're using the TEXT_CONTENT object directly 
    // rather than initializing an external i18n library
    
    // Create compatibility layer for i18n.t() calls
    window.i18n = {
      t: function(key, params = {}) {
        return getText(key, params);
      }
    };
    
    // Update UI text based on current language
    updateUIText();
  }

  // --- MULTI-WEEK DATA HANDLING FUNCTIONS ---

  /**
   * Detects available weeks data files from weeks.json
   * Returns an array of weeks, with each week having properties:
   * - week: number (the week number)
   * - file: string (the filename for the CSV data)
   * - current: boolean (whether this is the current week)
   * - start: string (optional start date)
   * - end: string (optional end date)
   * @returns {Promise<Array>} Promise resolving to an array of week objects
   */
  async function detectAvailableWeeks() {
    console.log("Detecting available weeks...");
    let weeks = [];
    
    try {
      // Try to load from weeks.json first
      const response = await fetch('./data/weeks.json');
      if (!response.ok) {
        throw new Error(`Failed to fetch weeks.json: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        weeks = data;
        console.log(`Found ${weeks.length} weeks in weeks.json`);
        
        // Find the current week or the most recent one
        availableWeeks = weeks;
        let currentWeek = weeks.find(w => w.current === true);
        
        if (!currentWeek) {
          // Find the week with the highest number
          currentWeek = weeks.reduce((highest, week) => 
            (week.week > highest.week) ? week : highest, weeks[0]);
          console.log(`No current week flagged, using most recent: Week ${currentWeek.week}`);
        } else {
          console.log(`Found current week: Week ${currentWeek.week}`);
        }
        
        // Set the global current week
        currentWeekNumber = currentWeek.week;
        return weeks;
      } else {
        throw new Error("No weeks found in weeks.json or invalid format");
      }
    } catch (error) {
      console.warn(`Error detecting weeks from weeks.json: ${error.message}`);
      console.log("Falling back to probing for week files...");
      
      // Fallback to probing for specific week files
      const weekNumbers = [13, 14, 15]; // Define the weeks we want to check
      
      for (const weekNum of weekNumbers) {
        const filename = `data_week_${weekNum}.csv`;
        try {
          const response = await fetch(`./data/${filename}`);
          
          if (response.ok) {
            console.log(`Found week ${weekNum} file: ${filename}`);
            weeks.push({
              week: weekNum,
              file: filename,
              current: false // We'll set the highest as current later
            });
          }
        } catch (probeError) {
          console.warn(`Error probing for week ${weekNum}: ${probeError.message}`);
        }
      }
      
      if (weeks.length > 0) {
        // Set the highest week number as the current week
        weeks.sort((a, b) => b.week - a.week);
        weeks[0].current = true;
        currentWeekNumber = weeks[0].week;
        console.log(`Set week ${currentWeekNumber} as current week from probing`);
        availableWeeks = weeks;
        return weeks;
      }
      
      console.error("No week data files found through probing");
      return [];
    }
  }

  /**
   * Loads data for a specific week
   * @param {number} weekNumber The week number to load
   * @returns {Promise<boolean>} Promise resolving to true if loading was successful
   */
  async function loadWeekData(weekNumber) {
    if (!weekNumber) {
      console.error("Invalid week number");
      return false; // Fallback to default CSV
    }
    
    try {
      // Find the week object in availableWeeks
      const weekObj = availableWeeks.find(w => w.week === weekNumber);
      
      if (!weekObj || !weekObj.file) {
        console.error(`Week ${weekNumber} not found in available weeks or missing file property`);
        return false;
      }
      
      // Set the CSV_FILE_PATH to the week's file path
      const originalPath = CSV_FILE_PATH;
      CSV_FILE_PATH = `./data/${weekObj.file}`;
      
      // Use the existing loadStaticCsvData function to load the CSV
      const success = await loadStaticCsvData();
      
      // Restore original path
      CSV_FILE_PATH = originalPath;
      
      return success;
    } catch (error) {
      console.error(`Error loading data for week ${weekNumber}:`, error);
      displayWarningMessage(getText('week_data_load_error', {week: weekNumber}));
      return false;
    }
  }

  // Expose functions for testing
  window.tbAnalyzer = {
    detectAvailableWeeks,
    loadWeekData,
    loadHistoricalData,
    calculateHistoricalStats,
    renderWeeklyTotalsTable,
    renderScoreTrendChart,
    renderChestsTrendChart,
    renderTopPlayersChart,
    renderCategoryTrendChart
  };

  /**
   * Resets the analytics view to its initial state
   */
  function resetAnalyticsView() {
    if (categorySelect) {
      categorySelect.value = "";
    }
    if (categoryAnalysisContent) {
      categoryAnalysisContent.classList.add("hidden");
    }
    if (categoryPrompt) {
      categoryPrompt.classList.remove("hidden");
    }
    // Clear any existing data in the ranking table
    if (categoryRankingBody) {
      categoryRankingBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500" data-i18n-key="analytics.selectCategoryPrompt">${getText("analytics.selectCategoryPrompt")}</td></tr>`;
    }
  }

  /**
   * Initialize and load the weekly data
   * Detects available weeks and loads the current week's data
   * @returns {Promise<boolean>} Promise resolving to true if initialization was successful
   */
  async function initWeeklyDataSystem() {
    try {
      // Detect available weeks
      const weeks = await detectAvailableWeeks();
      
      if (!weeks || weeks.length === 0) {
        console.error("No weeks found during initialization");
        displayError(getText('no_weeks_found'));
        return false;
      }
      
      console.log(`Weekly data system initialized with ${weeks.length} weeks`);
      
      // Update week selectors in the UI (if they exist)
      updateWeekSelectors(weeks);
      
      // Load data for the current week
      if (currentWeekNumber) {
        console.log(`Loading data for current week: ${currentWeekNumber}`);
        return await loadWeekData(currentWeekNumber);
      } else {
        console.error("No current week identified");
        displayWarningMessage(getText('no_current_week'));
        return false;
      }
    } catch (error) {
      console.error("Error initializing weekly data system:", error);
      displayError(getText('init_weekly_data_error'));
      return false;
    }
  }
  
  /**
   * Updates week selectors in the UI with available weeks
   * @param {Array} weeks Array of week objects
   */
  function updateWeekSelectors(weeks) {
    // Find all week selector elements
    const weekSelectors = document.querySelectorAll('.week-selector');
    
    if (weekSelectors.length === 0) {
      console.log("No week selectors found in the UI");
      return;
    }
    
    // Sort weeks by week number (descending)
    const sortedWeeks = [...weeks].sort((a, b) => b.week - a.week);
    
    weekSelectors.forEach(selector => {
      // Clear existing options
      selector.innerHTML = '';
      
      // Add options for each week
      sortedWeeks.forEach(week => {
        const option = document.createElement('option');
        option.value = week.week;
        
        // Create label (Week 15: Apr 10-16, 2023)
        let label = `Week ${week.week}`;
        if (week.start && week.end) {
          label += `: ${formatDateRange(week.start, week.end)}`;
        }
        
        option.textContent = label;
        option.selected = week.current === true;
        selector.appendChild(option);
      });
      
      // Add event listener to load selected week
      selector.addEventListener('change', async (e) => {
        const selectedWeek = parseInt(e.target.value, 10);
        if (selectedWeek) {
          displayLoadingMessage(getText('loading_week_data', {week: selectedWeek}));
          await loadWeekData(selectedWeek);
          currentWeekNumber = selectedWeek;
          // Refresh the view with the new data
          refreshCurrentView();
        }
      });
    });
  }
  
  /**
   * Formats a date range for display in the UI
   * @param {string} startDate Start date string
   * @param {string} endDate End date string
   * @returns {string} Formatted date range
   */
  function formatDateRange(startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Format: Apr 10-16, 2023
      const startMonth = start.toLocaleString('en', { month: 'short' });
      const startDay = start.getDate();
      const endDay = end.getDate();
      const year = end.getFullYear();
      
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    } catch (error) {
      console.warn("Error formatting date range:", error);
      return "";
    }
  }
  
  /**
   * Refreshes the current view with updated data
   */
  function refreshCurrentView() {
    // Get the current view
    const currentView = getCurrentView();
    
    // Refresh based on the current view
    if (currentView) {
      switchView(currentView);
    } else {
      // Fallback to dashboard
      switchView('dashboard');
    }
  }

  /**
   * Gets the current active view
   * @returns {string|null} The current view name or null if none found
   */
  function getCurrentView() {
    // Check which view is currently visible
    const views = [
      'dashboard', 
      'detailed-table', 
      'charts', 
      'analytics', 
      'score-system',
      'detail',
      'history'
    ];
    
    for (const view of views) {
      const viewSection = document.getElementById(`${view}-section`);
      if (viewSection && !viewSection.classList.contains('hidden')) {
        return view;
      }
    }
    
    // No view is currently active
    return null;
  }
  

}); // End DOMContentLoaded listener
