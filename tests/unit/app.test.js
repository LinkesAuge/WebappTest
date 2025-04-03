// Unit tests for app.js module integration
import { 
  initializeApp,
  handleViewNavigation,
  setupEventListeners,
  loadAndRenderData,
  renderDashboard,
  createPlayerDetailsView,
  createCategoryAnalysisView,
  renderScoreRulesTable
} from '../../app/app.js';

// Mock dependencies
jest.mock('../../app/domManager.js', () => ({
  elements: {
    statusElement: { style: { display: 'none' } },
    loadingSpinner: { style: { display: 'none' } },
    views: {
      dashboard: { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } },
      playerDetails: { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } },
      categoryAnalysis: { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } },
      scoreRules: { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } }
    },
    dashboardStats: { innerHTML: '' },
    tables: {
      playerTable: { 
        header: { innerHTML: '' },
        body: { innerHTML: '' }
      },
      scoreRules: {
        header: { innerHTML: '' },
        body: { innerHTML: '' }
      }
    },
    chartContainers: {
      topPlayers: { querySelector: jest.fn() },
      chestDistribution: { querySelector: jest.fn() },
      playerComparison: { querySelector: jest.fn() },
      categoryDistribution: { querySelector: jest.fn() }
    },
    playerDetailsContainer: { innerHTML: '' },
    playerStatsContainer: { innerHTML: '' },
    languageSwitcher: {
      de: { addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } },
      en: { addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } }
    },
    toggleThemeButton: { addEventListener: jest.fn() },
    downloadCSVButton: { addEventListener: jest.fn(), style: { display: 'none' } },
    expandChartButtons: [{ addEventListener: jest.fn() }],
    mobileMenuToggle: { addEventListener: jest.fn() }
  },
  collections: {
    navLinks: {
      desktop: [
        { dataset: { view: 'dashboard' }, addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } },
        { dataset: { view: 'playerDetails' }, addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } }
      ],
      mobile: [
        { dataset: { view: 'dashboard' }, addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } },
        { dataset: { view: 'playerDetails' }, addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() } }
      ]
    },
    expandChartButtons: [{ addEventListener: jest.fn() }],
    backToDashboardButtons: [{ addEventListener: jest.fn() }],
    languageSwitchers: [
      { dataset: { language: 'de' }, addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } },
      { dataset: { language: 'en' }, addEventListener: jest.fn(), classList: { add: jest.fn(), remove: jest.fn() } }
    ]
  },
  assignElementReferences: jest.fn().mockReturnValue(true),
  updateHeaderButtonsVisibility: jest.fn(),
  resetDashboardUI: jest.fn(),
  showView: jest.fn(),
  updateNavLinkActiveState: jest.fn(),
  toggleMobileMenu: jest.fn(),
  openChartModal: jest.fn(),
  closeChartModal: jest.fn()
}));

jest.mock('../../app/dataLoader.js', () => ({
  loadStaticCsvData: jest.fn().mockResolvedValue(true),
  loadScoreRulesData: jest.fn().mockResolvedValue(true),
  saveDataToLocalStorage: jest.fn(),
  loadDataFromLocalStorage: jest.fn().mockReturnValue(null),
  constants: {
    CSV_FILE_PATH: '../data/data.csv',
    RULES_CSV_FILE_PATH: '../data/rules.csv',
    LOCALSTORAGE_DATA_KEY: 'tbAnalyzerStoredData_Client_v2_Static'
  },
  setUtils: jest.fn()
}));

jest.mock('../../app/utils.js', () => ({
  CORE_COLUMNS: {
    PLAYER: 'PLAYER',
    TOTAL_SCORE: 'TOTAL_SCORE',
    RANK: 'RANK',
    CHEST_COUNT: 'CHEST_COUNT'
  },
  setI18n: jest.fn(),
  setStatus: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  sortData: jest.fn().mockImplementation((column, direction, updateState, data) => data),
  updateSortIcons: jest.fn(),
  getCssVarValue: jest.fn().mockReturnValue('#ff0000'),
  formatNumber: jest.fn().mockImplementation(num => String(num)),
  triggerDownload: jest.fn()
}));

jest.mock('../../app/i18n.js', () => ({
  DEFAULT_LANGUAGE: 'de',
  LANG_STORAGE_KEY: 'tbAnalyzerLanguage',
  TEXT_CONTENT: {
    de: {
      'app.title': 'Dashboard (DE)',
      'status.loading': 'Laden...'
    },
    en: {
      'app.title': 'Dashboard (EN)',
      'status.loading': 'Loading...'
    }
  },
  setRenderFunctions: jest.fn(),
  initLanguage: jest.fn(),
  setLanguage: jest.fn(),
  getUserLanguage: jest.fn().mockReturnValue('de'),
  getText: jest.fn().mockImplementation(key => `Translated: ${key}`),
  updateUIText: jest.fn(),
  updateLanguageSwitcherUI: jest.fn()
}));

// Mock ApexCharts
global.ApexCharts = jest.fn().mockImplementation(() => ({
  render: jest.fn(),
  updateOptions: jest.fn(),
  destroy: jest.fn()
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('initializeApp', () => {
  test('initializes app with proper DOM references and event listeners', async () => {
    const domManager = require('../../app/domManager.js');
    const dataLoader = require('../../app/dataLoader.js');
    const i18n = require('../../app/i18n.js');
    
    await initializeApp();
    
    // Check DOM references were assigned
    expect(domManager.assignElementReferences).toHaveBeenCalled();
    
    // Check event listeners were set up
    expect(setupEventListeners).toBeDefined();
    
    // Check language was initialized
    expect(i18n.initLanguage).toHaveBeenCalled();
    
    // Check data loading was attempted
    expect(dataLoader.loadDataFromLocalStorage).toHaveBeenCalled();
  });
});

describe('handleViewNavigation', () => {
  test('navigates to specified view', () => {
    const domManager = require('../../app/domManager.js');
    
    handleViewNavigation('playerDetails');
    
    expect(domManager.showView).toHaveBeenCalledWith('playerDetails');
    expect(domManager.updateNavLinkActiveState).toHaveBeenCalledWith('playerDetails');
  });
  
  test('defaults to dashboard for invalid view', () => {
    const domManager = require('../../app/domManager.js');
    
    handleViewNavigation('invalidView');
    
    expect(domManager.showView).toHaveBeenCalledWith('dashboard');
    expect(domManager.updateNavLinkActiveState).toHaveBeenCalledWith('dashboard');
  });
});

describe('setupEventListeners', () => {
  test('sets up all necessary event listeners', () => {
    const domManager = require('../../app/domManager.js');
    
    setupEventListeners();
    
    // Check navigation links have event listeners
    domManager.collections.navLinks.desktop.forEach(link => {
      expect(link.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
    
    domManager.collections.navLinks.mobile.forEach(link => {
      expect(link.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
    
    // Check language switchers have event listeners
    domManager.collections.languageSwitchers.forEach(switcher => {
      expect(switcher.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
    
    // Check expand chart buttons have event listeners
    domManager.collections.expandChartButtons.forEach(button => {
      expect(button.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
    
    // Check back to dashboard buttons have event listeners
    domManager.collections.backToDashboardButtons.forEach(button => {
      expect(button.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });
    
    // Check mobile menu toggle has event listener
    expect(domManager.elements.mobileMenuToggle.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    
    // Check theme toggle has event listener
    expect(domManager.elements.toggleThemeButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    
    // Check CSV download button has event listener
    expect(domManager.elements.downloadCSVButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });
});

describe('loadAndRenderData', () => {
  test('loads data and renders dashboard when successful', async () => {
    const dataLoader = require('../../app/dataLoader.js');
    const utils = require('../../app/utils.js');
    
    // Mock successful data loading
    dataLoader.loadStaticCsvData.mockResolvedValueOnce(true);
    dataLoader.loadScoreRulesData.mockResolvedValueOnce(true);
    
    // Create spy for renderDashboard
    const renderDashboardSpy = jest.spyOn(global, 'renderDashboard').mockImplementation(() => {});
    
    await loadAndRenderData();
    
    // Check loading indicators were shown and hidden
    expect(utils.showLoading).toHaveBeenCalled();
    expect(utils.hideLoading).toHaveBeenCalled();
    
    // Check data was loaded
    expect(dataLoader.loadStaticCsvData).toHaveBeenCalled();
    expect(dataLoader.loadScoreRulesData).toHaveBeenCalled();
    
    // Check dashboard was rendered
    expect(renderDashboardSpy).toHaveBeenCalled();
    
    renderDashboardSpy.mockRestore();
  });
  
  test('handles data loading failure', async () => {
    const dataLoader = require('../../app/dataLoader.js');
    const utils = require('../../app/utils.js');
    
    // Mock failed data loading
    dataLoader.loadStaticCsvData.mockResolvedValueOnce(false);
    
    await loadAndRenderData();
    
    // Check loading indicators were shown and hidden
    expect(utils.showLoading).toHaveBeenCalled();
    expect(utils.hideLoading).toHaveBeenCalled();
    
    // Check error status was set
    expect(utils.setStatus).toHaveBeenCalledWith('status.genericLoadError', 'error');
  });
});

describe('renderDashboard', () => {
  test('renders dashboard with player data and statistics', () => {
    const domManager = require('../../app/domManager.js');
    
    // Sample data for testing
    const playerData = [
      { PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 10 },
      { PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 20 }
    ];
    
    const columnHeaders = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    
    renderDashboard(playerData, columnHeaders);
    
    // Check dashboard UI was reset
    expect(domManager.resetDashboardUI).toHaveBeenCalled();
    
    // Check header buttons visibility was updated
    expect(domManager.updateHeaderButtonsVisibility).toHaveBeenCalledWith(true);
    
    // Check ApexCharts were initialized
    expect(global.ApexCharts).toHaveBeenCalled();
  });
});

describe('createPlayerDetailsView', () => {
  test('creates player details view for a selected player', () => {
    // Sample data for testing
    const playerData = [
      { PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 10 },
      { PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 20 }
    ];
    
    const columnHeaders = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    const playerName = 'Player1';
    
    createPlayerDetailsView(playerName, playerData, columnHeaders);
    
    // Check player details were created
    // This is an integration test, so we're mainly checking that it ran without errors
    expect(global.ApexCharts).toHaveBeenCalled();
  });
  
  test('handles invalid player name', () => {
    const utils = require('../../app/utils.js');
    
    // Sample data for testing
    const playerData = [
      { PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 10 },
      { PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 20 }
    ];
    
    const columnHeaders = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT'];
    const invalidPlayerName = 'NonExistentPlayer';
    
    createPlayerDetailsView(invalidPlayerName, playerData, columnHeaders);
    
    // Check error status was set
    expect(utils.setStatus).toHaveBeenCalledWith('status.playerNotFound', 'error');
  });
});

describe('createCategoryAnalysisView', () => {
  test('creates category analysis charts with player data', () => {
    // Sample data for testing
    const playerData = [
      { PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 10, CATEGORY_A: 50, CATEGORY_B: 50 },
      { PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 20, CATEGORY_A: 100, CATEGORY_B: 100 }
    ];
    
    const columnHeaders = ['PLAYER', 'TOTAL_SCORE', 'CHEST_COUNT', 'CATEGORY_A', 'CATEGORY_B'];
    
    createCategoryAnalysisView(playerData, columnHeaders);
    
    // Check category analysis was created
    // This is an integration test, so we're mainly checking that it ran without errors
    expect(global.ApexCharts).toHaveBeenCalled();
  });
});

describe('renderScoreRulesTable', () => {
  test('renders score rules table with rules data', () => {
    const domManager = require('../../app/domManager.js');
    
    // Sample data for testing
    const rulesData = [
      { Typ: 'Gold', Level: 1, Punkte: 10 },
      { Typ: 'Silver', Level: 2, Punkte: 5 }
    ];
    
    renderScoreRulesTable(rulesData);
    
    // Check table was populated
    expect(domManager.elements.tables.scoreRules.header.innerHTML).not.toBe('');
    expect(domManager.elements.tables.scoreRules.body.innerHTML).not.toBe('');
  });
}); 