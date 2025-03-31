/**
 * Mock versions of app functions for testing
 * 
 * This module provides mock implementations of key application functions
 * that can be imported in test files.
 */

// Mock for initializeApp function
export const initializeApp = jest.fn(() => {
  // Load mock data
  if (localStorage.getItem('preferredLanguage')) {
    global.currentLanguage = localStorage.getItem('preferredLanguage');
  } else {
    global.currentLanguage = 'en';
  }
  
  // Initialize app state
  return true;
});

// Mock for renderDashboard function
export const renderDashboard = jest.fn(() => {
  // Mock render dashboard functionality
  return true;
});

// Mock for setupEventListeners function
export const setupEventListeners = jest.fn();

// Mock for player data processing
export const processPlayerData = jest.fn((rawData) => {
  if (!rawData || !rawData.length) return [];
  
  return rawData.map((row, index) => ({
    id: row.id || `player-${index + 1}`,
    playerName: row.playerName || row.name || `Player ${index + 1}`,
    totalScore: row.totalScore || row.score || 0,
    chestCount: row.chestCount || row.chests || 0,
    premium: row.premium || row.isPremium || false,
    lastActive: row.lastActive || new Date().toISOString(),
    rank: 0  // Will be calculated later
  }));
});

// Mock for aggregate statistics calculation
export const calculateAggregateStats = jest.fn(data => {
  const playerCount = data.length;
  const totalScore = data.reduce((sum, player) => sum + player.totalScore, 0);
  const totalChests = data.reduce((sum, player) => sum + player.chestCount, 0);
  
  return {
    playerCount,
    totalScore,
    totalChests,
    averageScore: playerCount ? Math.round(totalScore / playerCount) : 0,
    averageChests: playerCount ? Math.round(totalChests / playerCount) : 0,
  };
});

// Mock for sorting data
export const sortPlayerData = jest.fn((data, column, direction = 'desc') => {
  const sortDir = direction === 'asc' ? 1 : -1;
  
  return [...data].sort((a, b) => {
    if (column === 'playerName') {
      return sortDir * a.playerName.localeCompare(b.playerName);
    } else if (column === 'totalScore') {
      return sortDir * (a.totalScore - b.totalScore);
    } else if (column === 'chestCount') {
      return sortDir * (a.chestCount - b.chestCount);
    }
    return 0;
  });
});

// Mock for filtering data
export const filterPlayerData = jest.fn((data, filterText) => {
  if (!filterText) return data;
  
  const lowercaseFilter = filterText.toLowerCase();
  return data.filter(player => 
    player.playerName.toLowerCase().includes(lowercaseFilter)
  );
});

// Mock for i18n functions
export const getLanguagePreference = jest.fn(() => 'de');
export const setLanguage = jest.fn();
export const getText = jest.fn((key, replacements) => {
  // Simple mock implementation that returns the key
  let text = key;
  if (replacements) {
    for (const [placeholder, value] of Object.entries(replacements)) {
      text = text.replace(`{${placeholder}}`, value);
    }
  }
  return text;
});
export const updateUIText = jest.fn();

// Get translation for a key
export const getTranslation = jest.fn((key) => {
  if (!key) return '';
  
  // Get current language
  const language = global.currentLanguage || 'en';
  
  // Get translations for current language
  const translations = global.translations || {};
  const languageTranslations = translations[language] || {};
  
  // Get translation or fallback to English or key
  return languageTranslations[key] || 
         (translations.en && translations.en[key]) || 
         key;
});

// Export them all together for convenience
export default {
  initializeApp,
  renderDashboard,
  setupEventListeners,
  processPlayerData,
  calculateAggregateStats,
  sortPlayerData,
  filterPlayerData,
  getLanguagePreference,
  setLanguage,
  getText,
  updateUIText,
  getTranslation,
}; 