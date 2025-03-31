/**
 * script.js
 *
 * Description: Client-side JavaScript logic for the TB Chest Analyzer.
 *              Handles data loading, processing, UI rendering, interactions,
 *              chart generation, i18n, and mobile responsiveness.
 * Usage:
 *     Included in index.html via <script src="script.js" defer></script>
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURATION CONSTANTS ---
  const CSV_FILE_PATH = "./data.csv";
  const RULES_CSV_FILE_PATH = "./rules.csv";
  const DEFAULT_LANGUAGE = "de";
  const LANG_STORAGE_KEY = "tbAnalyzerLanguage";
  const LOCALSTORAGE_DATA_KEY = "tbAnalyzerStoredData_Client_v2_Static";
  const CORE_COLUMNS = ["PLAYER", "TOTAL_SCORE", "CHEST_COUNT"]; // Non-analyzable columns

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
  // Holds references to active ApexCharts instances for proper updates/destruction
  let chartInstances = {
    player: null,
    category: null,
    topSources: null,
    scoreDistribution: null,
    scoreVsChests: null,
    frequentSources: null,
    modalChart: null,
  };
  let isInitialized = false; // Flag to prevent actions before the app is ready

  // --- UTILITIES ---
  const NUMERIC_FORMATTER = new Intl.NumberFormat("en-US");

  // --- i18n TEXT CONTENT (Full object defined at the bottom) ---
  const TEXT_CONTENT = {
    /* ... Full i18n object ... */
  }; // (Defined fully at the end)

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
        "back-to-dashboard-from-detailed-table"
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
      navLinks = document.querySelectorAll(".nav-link"); // All nav links
      desktopNavLinks = document.querySelectorAll(
        "header > div > nav a.nav-link"
      ); // Desktop only
      langDeButton = document.getElementById("lang-de");
      langEnButton = document.getElementById("lang-en");
      chartModal = document.getElementById("chart-modal");
      modalChartTitle = document.getElementById("modal-chart-title");
      modalChartContainer = document.getElementById("modal-chart-container");
      modalCloseButton = document.getElementById("modal-close-button");
      mobileMenuButton = document.getElementById("mobile-menu-button");
      mobileMenu = document.getElementById("mobile-menu");
      mobileNavLinks = mobileMenu
        ? mobileMenu.querySelectorAll(".nav-link")
        : [];
      downloadCsvMobileButton = document.getElementById(
        "download-csv-mobile-button"
      );
      mobileDownloadContainer = document.getElementById(
        "mobile-download-container"
      );
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
   * Delays execution slightly, then assigns refs, sets up listeners, and initializes the app.
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
    console.log("initializeApp started");
    isInitialized = false;
    showLoading(getText("status.initializing"));
    currentLanguage = getLanguagePreference();
    updateLanguageSwitcherUI();
    updateUIText();

    console.log("Awaiting data load...");
    const [dataLoaded, rulesLoaded] = await Promise.all([
      loadStaticCsvData(),
      loadScoreRulesData(),
    ]);
    console.log(`Data loaded: ${dataLoaded}, Rules loaded: ${rulesLoaded}`);

    if (dataLoaded) {
      console.log("Data loaded, processing and switching to dashboard...");
      calculateAggregateStats();
      populateCategoryDropdown(allColumnHeaders);
      displayLastUpdatedTimestamp();
      updateHeaderButtonsVisibility();
      switchView("dashboard"); // This triggers the first render
      setStatus(
        getText("status.success", { 0: allPlayersData.length }),
        "success",
        3000
      );
    } else {
      console.log(
        "Data NOT loaded, updating visibility and switching to empty state..."
      );
      updateHeaderButtonsVisibility();
      switchView("empty");
    }
    hideLoading();
    console.log("initializeApp finished");
    isInitialized = true;
  }

  // --- i18n Functions ---
  /**
   * Sets the application language and updates UI.
   * @param {string} lang - 'de' or 'en'.
   */
  function setLanguage(lang) {
    if (!isInitialized || lang === currentLanguage || !TEXT_CONTENT[lang])
      return;
    console.log(`Setting language to: ${lang}`);
    currentLanguage = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    updateLanguageSwitcherUI();
    updateUIText(); // Update static text first

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
   * Retrieves the user's language preference.
   * @returns {string} The language code.
   */
  function getLanguagePreference() {
    return localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANGUAGE;
  }

  /**
   * Gets translated text for a given key.
   * @param {string} key - The i18n key.
   * @param {object} [replacements={}] - Placeholder replacements.
   * @returns {string} Translated text or key.
   */
  function getText(key, replacements = {}) {
    /* ... (implementation as before) ... */
  }

  /**
   * Updates all UI elements with data-i18n-key attributes.
   */
  function updateUIText() {
    /* ... (implementation as before) ... */
  }

  /**
   * Updates the visual state of the language switcher buttons.
   */
  function updateLanguageSwitcherUI() {
    /* ... (implementation as before) ... */
  }

  // --- EVENT LISTENERS SETUP ---
  /**
   * Attaches all necessary event listeners.
   */
  function setupEventListeners() {
    console.log("Setting up event listeners...");
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
    // Desktop Nav Links (Using the specific variable now)
    desktopNavLinks.forEach((link) => {
      safeAddListener(
        link,
        "click",
        (e) => {
          e.preventDefault(); // Prevent default anchor behavior
          if (!isInitialized) {
            console.log("Navigation blocked during initialization.");
            return;
          }
          const view = link.dataset.view;
          if (view) {
            console.log("Desktop nav click detected for view:", view); // Added log
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
    // Mobile Nav Links
    mobileNavLinks.forEach((link) => {
      safeAddListener(
        link,
        "click",
        (e) => {
          e.preventDefault();
          if (!isInitialized) return;
          const view = link.dataset.view;
          if (view) {
            console.log("Mobile nav click detected for view:", view); // Added log
            switchView(view); // switchView now handles closing the menu
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
    // Mobile Menu Toggle Button
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
    // Mobile Download Button
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
    // Breadcrumb Link
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
    // Back Buttons
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
   * Switches the visible content section and updates navigation state.
   * @param {string} viewName - The identifier for the view to display.
   * @param {object|null} [contextData=null] - Optional data for context-specific views.
   */
  function switchView(viewName, contextData = null) {
    console.log(`Switching view to: ${viewName}`);
    if (!isInitialized && viewName !== "loading" && viewName !== "empty") {
      console.warn(`View switch to ${viewName} blocked during initialization.`);
      return;
    }

    // Close mobile menu if open
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

    const previousView = currentView; // Store previous view for potential cleanup/logic
    currentView = viewName;

    // Hide all main sections first
    [
      emptyStateSection,
      dashboardSection,
      detailSection,
      analyticsSection,
      chartsSection,
      scoreSystemSection,
      detailedTableSection,
    ].forEach((section) => section?.classList.add("hidden"));
    breadcrumbNav?.classList.add("hidden");

    // Remove active class from all nav links
    navLinks.forEach((link) => link?.classList.remove("active"));

    let activeDesktopNavLinkId = "";
    let activeMobileNavLinkId = "";

    try {
      switch (viewName) {
        case "dashboard":
          if (dashboardSection) dashboardSection.classList.remove("hidden");
          activeDesktopNavLinkId = "nav-dashboard";
          activeMobileNavLinkId = "mobile-nav-dashboard";
          // Re-render dashboard content only if data exists and initialization is complete
          if (isInitialized && allPlayersData.length > 0) renderDashboard();
          break;
        case "detailed-table":
          if (detailedTableSection)
            detailedTableSection.classList.remove("hidden");
          if (breadcrumbNav) breadcrumbNav.classList.remove("hidden");
          if (breadcrumbCurrentPageName)
            breadcrumbCurrentPageName.textContent = getText("nav.data");
          activeDesktopNavLinkId = "nav-data";
          activeMobileNavLinkId = "mobile-nav-data";
          if (allPlayersData.length > 0) renderDetailedTable();
          else {
            setStatus(getText("table.noData"), "info");
            if (detailedTableContainer)
              detailedTableContainer.innerHTML = `<div class="text-center py-12 text-slate-500">${getText(
                "table.noData"
              )}</div>`;
          }
          break;
        case "charts":
          if (chartsSection) chartsSection.classList.remove("hidden");
          if (breadcrumbNav) breadcrumbNav.classList.remove("hidden");
          if (breadcrumbCurrentPageName)
            breadcrumbCurrentPageName.textContent = getText("nav.charts");
          activeDesktopNavLinkId = "nav-charts";
          activeMobileNavLinkId = "mobile-nav-charts";
          if (allPlayersData.length > 0) renderChartsView();
          else {
            setStatus(getText("table.noData"), "info");
            if (chartsSection) {
              chartsSection.innerHTML = `<h2 class="text-xl font-semibold font-serif text-amber-300 border-l-4 border-primary pl-4" data-i18n-key="charts.title">${getText(
                "charts.title"
              )}</h2><p class="text-center text-slate-400 py-10">${getText(
                "table.noData"
              )}</p>`;
            }
          }
          break;
        case "analytics":
          if (analyticsSection) analyticsSection.classList.remove("hidden");
          if (breadcrumbNav) breadcrumbNav.classList.remove("hidden");
          if (breadcrumbCurrentPageName)
            breadcrumbCurrentPageName.textContent = getText("nav.analytics");
          activeDesktopNavLinkId = "nav-analytics";
          activeMobileNavLinkId = "mobile-nav-analytics";
          if (allPlayersData.length === 0)
            setStatus(getText("table.noData"), "info");
          // Ensure state is correct based on selection
          if (categorySelect?.value)
            handleCategorySelect({ target: categorySelect });
          else {
            /* Reset analytics view */
            categoryAnalysisContent?.classList.add("hidden");
            categoryPrompt?.classList.remove("hidden");
            if (categoryRankingBody)
              categoryRankingBody.innerHTML = `<tr><td colspan="2" class="text-center py-4 text-slate-500">${getText(
                "analytics.selectCategoryPrompt"
              )}</td></tr>`;
            if (categoryChartContainer) categoryChartContainer.innerHTML = "";
            if (categoryNameTable) categoryNameTable.textContent = "";
            if (categoryNameChart) categoryNameChart.textContent = "";
          }
          break;
        case "score-system":
          if (scoreSystemSection) scoreSystemSection.classList.remove("hidden");
          if (breadcrumbNav) breadcrumbNav.classList.remove("hidden");
          if (breadcrumbCurrentPageName)
            breadcrumbCurrentPageName.textContent = getText("nav.scoreSystem");
          activeDesktopNavLinkId = "nav-score-system";
          activeMobileNavLinkId = "mobile-nav-score-system";
          if (scoreRulesData.length > 0) renderScoreRulesTable();
          else {
            if (scoreRulesTableContainer)
              scoreRulesTableContainer.innerHTML = `<div class="spinner"></div><div class="text-center py-12 text-slate-500">${getText(
                "scoreSystem.loading"
              )}</div>`;
            loadScoreRulesData().then((loaded) => {
              if (loaded) renderScoreRulesTable();
              else
                setStatus(getText("scoreSystem.loading") + " Failed.", "error");
            });
          }
          break;
        case "detail":
          if (contextData?.playerName) {
            currentPlayerData = allPlayersData.find(
              (p) => p.PLAYER === contextData.playerName
            );
            if (currentPlayerData) {
              if (detailSection) detailSection.classList.remove("hidden");
              if (breadcrumbNav) breadcrumbNav.classList.remove("hidden");
              if (breadcrumbCurrentPageName)
                breadcrumbCurrentPageName.textContent = contextData.playerName;
              renderPlayerDetail(currentPlayerData, contextData.rank || "N/A");
              renderPlayerChart(currentPlayerData);
            } else {
              console.error("Player not found:", contextData.playerName);
              switchView("dashboard");
              setStatus(
                `Could not load details for ${contextData.playerName}`,
                "error"
              );
            }
          } else {
            console.error("Player name missing for detail view.");
            switchView("dashboard");
          }
          activeDesktopNavLinkId = "";
          activeMobileNavLinkId = "";
          break;
        case "empty":
          if (emptyStateSection) emptyStateSection.classList.remove("hidden");
          activeDesktopNavLinkId = "";
          activeMobileNavLinkId = "";
          break;
        case "chart_modal_active":
          return; // Prevent view change
        default:
          console.warn(
            `Unknown view name: ${viewName}. Switching to dashboard.`
          );
          if (dashboardSection) dashboardSection.classList.remove("hidden");
          activeDesktopNavLinkId = "nav-dashboard";
          activeMobileNavLinkId = "mobile-nav-dashboard";
          if (isInitialized && allPlayersData.length > 0) renderDashboard();
          break;
      }
    } catch (error) {
      console.error(`Error switching view to ${viewName}:`, error);
      setStatus(`Error displaying ${viewName} view.`, "error");
      if (viewName !== "dashboard") {
        try {
          switchView("dashboard");
        } catch (e) {}
      }
    }

    // Set active class for links
    const activeDesktopLink = document.getElementById(activeDesktopNavLinkId);
    if (activeDesktopLink) activeDesktopLink.classList.add("active");
    const activeMobileLink = document.getElementById(activeMobileNavLinkId);
    if (activeMobileLink) activeMobileLink.classList.add("active");

    // Update UI text (deferred)
    setTimeout(updateUIText, 0);

    // Clear transient status messages
    if (!statusArea?.classList.contains("text-red-500")) {
      setStatus("");
    }

    // Scroll to top
    if (viewName !== "chart_modal_active") {
      window.scrollTo(0, 0);
    }
  }

  // --- STATUS/LOADING/ERROR HANDLING ---
  /** Updates the status message area. */
  function setStatus(message, type = "info", duration = 0) {
    /* ... (implementation as before) ... */
  }
  /** Displays the loading spinner and message. */
  function showLoading(message = "Loading...") {
    /* ... (implementation as before) ... */
  }
  /** Hides the loading spinner and clears non-error status messages. */
  function hideLoading() {
    /* ... (implementation as before) ... */
  }

  // --- LOCALSTORAGE FLAG ---
  /** Saves a flag indicating data has been loaded. */
  function saveDataToLocalStorage() {
    /* ... (implementation as before) ... */
  }
  /** Checks if the data loaded flag exists. */
  function loadDataFromLocalStorage() {
    /* ... (implementation as before) ... */
  }

  // --- DATA TIMESTAMP ---
  /** Displays the 'Last-Modified' timestamp of the data file. */
  function displayLastUpdatedTimestamp() {
    /* ... (implementation as before) ... */
  }

  // --- STATIC CSV LOADING & PARSING ---
  /** Fetches, parses, and processes the main data CSV file. */
  async function loadStaticCsvData() {
    /* ... (implementation as before) ... */
  }

  // --- SCORE SYSTEM DATA LOADING ---
  /** Fetches and parses the scoring rules CSV file. */
  async function loadScoreRulesData() {
    /* ... (implementation as before) ... */
  }

  // --- RESET & UPDATE UI ---
  /** Resets application state and clears UI elements. */
  function resetStateAndUI() {
    /* ... (implementation as before) ... */
  }
  /** Updates visibility of header download buttons. */
  function updateHeaderButtonsVisibility() {
    /* ... (implementation as before, using mobileDownloadContainer) ... */
  }
  /** Resets dashboard specific UI elements. */
  function resetDashboardUI() {
    /* ... (implementation as before) ... */
  }

  // --- AGGREGATE STATS & DASHBOARD RENDERING ---
  /** Calculates overall statistics. */
  function calculateAggregateStats() {
    /* ... (implementation as before) ... */
  }
  /** Updates the statistics display bar. */
  function updateStatsBar() {
    /* ... (implementation as before) ... */
  }
  /** Renders all components of the main dashboard view. */
  function renderDashboard() {
    /* ... (implementation as before) ... */
  }

  // --- RANKING TABLE & CONTROLS ---
  /** Renders the main player ranking table. */
  function renderRankingTable(data) {
    /* ... (implementation as before) ... */
  }
  /** Handles input changes in the filter field. */
  function handleFilter(event) {
    /* ... (implementation as before) ... */
  }
  /** Handles clicks on the main ranking table header for sorting. */
  function handleSortClick(event) {
    /* ... (implementation as before) ... */
  }
  /** Sorts a data array in place and optionally updates state. */
  function sortData(
    column,
    direction,
    updateState = true,
    dataToSort = displayData
  ) {
    /* ... (implementation as before) ... */
  }
  /** Updates the sort indicator icons in a table header. */
  function updateSortIcons(
    activeColumn,
    activeDirection,
    tableHeaderSelector = "#ranking-section thead th[data-column]"
  ) {
    /* ... (implementation as before) ... */
  }

  // --- DETAILED TABLE VIEW ---
  /** Renders the full data table. */
  function renderDetailedTable() {
    /* ... (implementation as before) ... */
  }
  /** Handles clicks on the detailed table header for sorting. */
  function handleDetailedTableSortClick(event) {
    /* ... (implementation as before) ... */
  }

  // --- SCORE SYSTEM TABLE VIEW ---
  /** Renders the scoring rules table. */
  function renderScoreRulesTable() {
    /* ... (implementation as before) ... */
  }
  /** Handles clicks on the score rules table header for sorting. */
  function handleScoreRulesTableSortClick(event) {
    /* ... (implementation as before) ... */
  }

  // --- PLAYER DETAIL VIEW ---
  /** Handles clicks on table rows to show player detail. */
  function handleTableRowClick(event) {
    /* ... (implementation as before) ... */
  }
  /** Renders the player detail section. */
  function renderPlayerDetail(player, rank) {
    /* ... (implementation as before) ... */
  }

  // --- CATEGORY ANALYSIS VIEW ---
  /** Populates the category selection dropdown. */
  function populateCategoryDropdown(headers) {
    /* ... (implementation as before) ... */
  }
  /** Handles changes in the category selection dropdown. */
  function handleCategorySelect(event) {
    /* ... (implementation as before) ... */
  }
  /** Renders the table for the selected category analysis. */
  function renderCategoryAnalysis(category) {
    /* ... (implementation as before) ... */
  }

  // --- CHARTS VIEW ---
  /** Renders the dedicated charts overview section. */
  function renderChartsView() {
    /* ... (implementation as before) ... */
  }

  // --- DASHBOARD WIDGETS RENDERING ---
  /** Renders the 'Top 5 by Chest Count' table. */
  function renderTopChestsTable() {
    /* ... (implementation as before) ... */
  }

  // --- CHARTING ---
  /** Gets the computed value of a CSS variable. */
  function getCssVariableValue(variableName) {
    /* ... (implementation as before) ... */
  }
  /** Generates base configuration options for ApexCharts. */
  function getChartBaseOptions() {
    /* ... (implementation as before) ... */
  }
  /** Renders the 'Top Sources by Score' donut chart. */
  function renderTopSourcesChart(containerId = "top-sources-chart-container") {
    /* ... (implementation as before) ... */
  }
  /** Renders the 'Score Distribution' bar chart. */
  function renderScoreDistributionChart(
    containerId = "score-distribution-chart-container"
  ) {
    /* ... (implementation as before) ... */
  }
  /** Renders the 'Score vs Chests' scatter plot. */
  function renderScoreVsChestsChart(
    containerId = "score-vs-chests-chart-container"
  ) {
    /* ... (implementation as before) ... */
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
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container #${containerId} not found`);
      return;
    }

    // Ensure previous instance is destroyed safely
    chartInstances[instanceKey]
      ?.destroy()
      .catch((e) =>
        console.warn(`Error destroying previous chart in #${containerId}:`, e)
      );
    chartInstances[instanceKey] = null;

    container.innerHTML = '<div class="spinner mx-auto my-8"></div>'; // Show spinner

    if (!allPlayersData || allPlayersData.length === 0) {
      container.innerHTML = `<p class="text-slate-500 text-sm text-center py-8">${getText(
        "table.noData"
      )}</p>`;
      return;
    }

    try {
      // Wrap data processing in try-catch
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
        topCategoriesData.map(([key]) => key.replace(/_/g, " ")) || []; // For Y-axis categories
      const chartSeries = topCategoriesData.map(([, count]) => count) || []; // For X-axis data

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
        series: [{ name: getText("dashboard.statPlayers"), data: chartSeries }],
        xaxis: {
          ...baseOptions.xaxis,
          categories: undefined,
          title: {
            text: getText("dashboard.statPlayers"),
            style: { fontSize: "10px", color: baseOptions.chart.foreColor },
          },
          labels: {
            ...baseOptions.xaxis.labels,
            rotate: 0,
            formatter: (val) =>
              val !== undefined
                ? NUMERIC_FORMATTER.format(Math.round(val))
                : "",
          },
        },
        yaxis: {
          ...baseOptions.yaxis,
          categories: chartLabels, // *** Provide categories for Y-axis ***
          labels: {
            ...baseOptions.yaxis.labels,
            align: "left",
            style: { fontSize: "11px" },
            formatter: undefined,
          }, // Let ApexCharts use categories
        },
        plotOptions: {
          bar: { horizontal: true, borderRadius: 2, barHeight: "60%" },
        },
        tooltip: {
          ...baseOptions.tooltip,
          x: {
            formatter: (val) =>
              `${NUMERIC_FORMATTER.format(val)} ${getText(
                "dashboard.statPlayers"
              ).toLowerCase()}`,
          },
          y: {
            formatter: undefined,
            title: {
              formatter: (seriesName, { seriesIndex, dataPointIndex, w }) =>
                `${getText("charts.sourceLabel")}: ${
                  chartLabels[dataPointIndex] || ""
                }`,
            },
          }, // Use chartLabels array directly
        },
        grid: { ...baseOptions.grid, yaxis: { lines: { show: false } } },
      };

      chartInstances[instanceKey] = new ApexCharts(container, options);
      chartInstances[instanceKey]
        .render()
        .then(() => {
          container.querySelector(".spinner")?.remove();
          console.log(
            `Finished renderFrequentSourcesChart in #${containerId}.`
          );
        })
        .catch((renderError) => {
          console.error(
            `Failed to render FrequentSourcesChart in #${containerId} (render stage):`,
            renderError
          );
          container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
            "status.chartError"
          )}</p>`;
          chartInstances[instanceKey] = null;
        });
    } catch (e) {
      // Catch errors during setup/data processing
      console.error(
        `Error setting up frequent sources chart in #${containerId}:`,
        e
      );
      container.innerHTML = `<p class="text-red-500 text-sm text-center py-8">${getText(
        "status.chartError"
      )}</p>`;
      chartInstances[instanceKey] = null;
    }
  }
  /** Renders the player performance radar chart. */
  function renderPlayerChart(player, containerId = "player-chart-container") {
    /* ... (implementation as before) ... */
  }
  /** Renders the bar chart for category analysis. */
  function renderCategoryChart(
    data,
    category,
    containerId = "category-chart-container"
  ) {
    /* ... (implementation as before) ... */
  }

  // --- Chart Modal Logic ---
  /** Handles clicks on chart expand buttons using event delegation. */
  function handleExpandChartClick(event) {
    /* ... (implementation as before) ... */
  }
  /** Closes the chart modal and destroys its chart instance. */
  function handleModalClose() {
    /* ... (implementation as before) ... */
  }

  // --- DOWNLOAD FUNCTIONS ---
  /** Generates and triggers a download for the full processed data CSV. */
  function downloadFullDataCSV() {
    /* ... (implementation as before) ... */
  }
  /** Generates and triggers a download for a single player's data in JSON format. */
  function downloadPlayerDataJSON(playerData) {
    /* ... (implementation as before) ... */
  }
  /** Creates a blob and triggers a browser download. */
  function triggerDownload(content, filename, contentType) {
    /* ... (implementation as before) ... */
  }

  // --- i18n Text Content Definition ---
  // const TEXT_CONTENT = { ... }; // Defined above state variables
}); // End DOMContentLoaded listener

// --- Full i18n Object ---
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
      loadingData: "Lade Daten von {0}...",
      parsing: "Verarbeite CSV...",
      processing: "Verarbeite Daten...",
      saving: "Speichere Daten...",
      loadingRules: "Lade Punktesystem von {0}...",
      success: "Erfolgreich {0} Spieler verarbeitet.",
      successRules: "Punktesystem geladen.",
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
    },
    modal: { close: "Schließen" },
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
  },
};
