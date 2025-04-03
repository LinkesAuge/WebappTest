/**
 * Integration test for the application
 * 
 * This test checks if all modules work together correctly
 */

import { initializeApp, handleViewNavigation } from '../../app/app.js';
import * as dataLoader from '../../app/dataLoader.js';
import * as domManager from '../../app/domManager.js';
import * as i18n from '../../app/i18n.js';
import * as utils from '../../app/utils.js';

// Create a proper DOM for testing
document.body.innerHTML = `
  <div id="status-message"></div>
  <div id="loading-spinner"></div>
  
  <header>
    <div id="logo"></div>
    <button id="toggle-theme"></button>
    <button id="download-csv"></button>
    <div id="language-switcher">
      <button data-language="de"></button>
      <button data-language="en"></button>
    </div>
    <nav id="desktop-nav">
      <a href="#dashboard" data-view="dashboard">Dashboard</a>
      <a href="#player-details" data-view="playerDetails">Player Details</a>
      <a href="#category-analysis" data-view="categoryAnalysis">Category Analysis</a>
      <a href="#score-rules" data-view="scoreRules">Score Rules</a>
    </nav>
    <button id="mobile-menu-toggle"></button>
  </header>
  
  <main>
    <section id="dashboard-view" class="view"></section>
    <section id="player-details-view" class="view"></section>
    <section id="category-analysis-view" class="view"></section>
    <section id="score-rules-view" class="view"></section>
  </main>
`;

// Mock chart rendering
global.ApexCharts = jest.fn().mockImplementation(() => ({
  render: jest.fn(),
  updateOptions: jest.fn(),
  destroy: jest.fn()
}));

// Spy on key functions
const loadDataSpy = jest.spyOn(dataLoader, 'loadStaticCsvData').mockResolvedValue(true);
const loadRulesSpy = jest.spyOn(dataLoader, 'loadScoreRulesData').mockResolvedValue(true);
const assignElementsSpy = jest.spyOn(domManager, 'assignElementReferences').mockReturnValue(true);
const showViewSpy = jest.spyOn(domManager, 'showView');
const updateNavSpy = jest.spyOn(domManager, 'updateNavLinkActiveState');
const initLanguageSpy = jest.spyOn(i18n, 'initLanguage');
const showLoadingSpy = jest.spyOn(utils, 'showLoading');
const hideLoadingSpy = jest.spyOn(utils, 'hideLoading');

describe('Application Integration', () => {
  // Clear mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('initializes application with all modules correctly', async () => {
    await initializeApp();
    
    // Check that DOM elements were assigned
    expect(assignElementsSpy).toHaveBeenCalled();
    
    // Check that language was initialized
    expect(initLanguageSpy).toHaveBeenCalled();
    
    // Check that data loading was attempted
    expect(loadDataSpy).toHaveBeenCalled();
    
    // Check loading indicators were used
    expect(showLoadingSpy).toHaveBeenCalled();
    expect(hideLoadingSpy).toHaveBeenCalled();
  });
  
  test('navigation between views works correctly', () => {
    // Navigate to player details
    handleViewNavigation('playerDetails');
    
    // Check that correct view is shown
    expect(showViewSpy).toHaveBeenCalledWith('playerDetails');
    expect(updateNavSpy).toHaveBeenCalledWith('playerDetails');
    
    // Navigate to category analysis
    handleViewNavigation('categoryAnalysis');
    
    // Check that correct view is shown
    expect(showViewSpy).toHaveBeenCalledWith('categoryAnalysis');
    expect(updateNavSpy).toHaveBeenCalledWith('categoryAnalysis');
    
    // Navigate to invalid view should default to dashboard
    handleViewNavigation('invalidView');
    
    // Check that dashboard view is shown
    expect(showViewSpy).toHaveBeenCalledWith('dashboard');
    expect(updateNavSpy).toHaveBeenCalledWith('dashboard');
  });
  
  test('score rules view triggers data loading if needed', async () => {
    // Reset the spy to track new calls
    loadRulesSpy.mockReset();
    
    // Navigate to score rules view
    handleViewNavigation('scoreRules');
    
    // Check that score rules data loading was attempted
    expect(loadRulesSpy).toHaveBeenCalled();
  });
}); 