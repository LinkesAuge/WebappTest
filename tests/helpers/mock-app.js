/**
 * Mock versions of app functions for testing
 * 
 * This module provides mock implementations of key application functions
 * that can be imported in test files.
 */

// Mock for initializeApp function
export const initializeApp = jest.fn();

// Mock for renderDashboard function
export const renderDashboard = jest.fn();

// Mock for setupEventListeners function
export const setupEventListeners = jest.fn();

// Mock for player data processing
export const processPlayerData = jest.fn(rawData => {
  // Simple implementation that returns converted data
  return rawData.map(player => ({
    id: player.id || `player-${Math.floor(Math.random() * 1000)}`,
    playerName: player.playerName || player.name,
    totalScore: parseInt(player.totalScore || player.score || 0, 10),
    chestCount: parseInt(player.chestCount || player.chests || 0, 10),
    premium: player.premium === 'true' || player.premium === true,
    lastActive: player.lastActive || new Date().toISOString(),
    rank: 0, // Will be calculated during sorting
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
}; 