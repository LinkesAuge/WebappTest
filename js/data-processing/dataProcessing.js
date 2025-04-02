/**
 * dataProcessing.js
 *
 * Description: Core data processing functionality for player data
 * Usage:
 *     import { processPlayerData, calculateScores, filterPlayers, sortPlayerData } from './js/data-processing/dataProcessing.js';
 */

import * as state from '../state.js';
import * as utils from '../utils.js';
import { showError } from '../dom.js';

/**
 * Process raw player data into the format needed for the application
 * @param {Array} [rawData] - Raw player data (uses state.playerData if not provided)
 * @returns {Array} Processed player data
 */
export function processPlayerData(rawData) {
  try {
    // Use provided data or get it from state
    let dataToProcess = rawData;
    
    if (!dataToProcess) {
      // If playerData exists and is not empty, use it
      if (state.playerData && state.playerData.length > 0) {
        dataToProcess = state.playerData;
      } 
      // Otherwise fall back to allPlayersData
      else if (state.allPlayersData && state.allPlayersData.length > 0) {
        dataToProcess = state.allPlayersData;
      } else {
        dataToProcess = [];
      }
    }
    
    if (!dataToProcess || !Array.isArray(dataToProcess) || dataToProcess.length === 0) {
      console.warn('No player data to process');
      state.setState('displayData', []);
      return [];
    }
    
    // Create a copy to avoid mutating the original data
    const processedData = dataToProcess.map((player, index) => {
      // If data is already in standard format, don't process further
      if (dataHasStandardFormat(player)) {
        return { ...player };
      }
      
      // Otherwise standardize the player data
      return standardizePlayerData(player, index);
    });
    
    // Sort data by score in descending order
    const sortedData = sortPlayerData(processedData);
    
    // Update display data in state
    state.setState('displayData', sortedData);
    
    // Calculate aggregate statistics
    calculateAggregateStatistics(sortedData);
    
    return sortedData;
  } catch (error) {
    showError(`Error processing player data: ${error.message}`, true);
    console.error('Error processing player data:', error);
    state.setState('displayData', []);
    return [];
  }
}

/**
 * Calculate scores for all players
 * @param {Array} playerData - Processed player data
 * @returns {Array} Player data with scores
 */
export function calculateScores(playerData) {
  if (!Array.isArray(playerData) || playerData.length === 0) {
    showError('No player data available for score calculation', true);
    return [];
  }

  try {
    const scoredPlayers = playerData.map(player => {
      // Create a copy to avoid mutating the original
      const scoredPlayer = { ...player };
      
      // Calculate score if not already present
      if (typeof scoredPlayer.score !== 'number') {
        scoredPlayer.score = calculatePlayerScore(scoredPlayer);
      }
      
      return scoredPlayer;
    });
    
    // Sort players by score (highest first)
    const sortedPlayers = scoredPlayers.sort((a, b) => b.score - a.score);
    
    // Add rank property
    const rankedPlayers = sortedPlayers.map((player, index) => {
      return { ...player, rank: index + 1 };
    });
    
    // Store in state
    state.setState('rankedPlayerData', rankedPlayers);
    
    return rankedPlayers;
  } catch (error) {
    showError(`Error calculating scores: ${error.message}`, true);
    console.error('Error in calculateScores:', error);
    return playerData; // Return original data on error
  }
}

/**
 * Check if data is already in our standard format
 * @param {Object} player - Player data object
 * @returns {boolean} True if data is already standardized
 * @private
 */
function dataHasStandardFormat(player) {
  // Check if this is our standardized format (has playerName, totalScore, etc.)
  return player && (
    player.playerName !== undefined || 
    player.totalScore !== undefined ||
    player.chestCount !== undefined
  );
}

/**
 * Standardize player data to ensure consistent format
 * @param {Object} player - Raw player data
 * @param {number} index - Player index
 * @returns {Object} Standardized player data
 * @private
 */
function standardizePlayerData(player, index) {
  // Create a new object with default values
  const standardPlayer = {
    id: player.id || `player-${index}`,
    playerName: player.PLAYER || player.playerName || `Player ${index}`,
    totalScore: parseFloat(player.SCORE || player.TOTAL_SCORE || player.totalScore || 0),
    chestCount: parseInt(player.CHESTS || player.CHEST_COUNT || player.chestCount || 0, 10),
    premium: player.PREMIUM === 'true' || player.premium === true || false,
    rank: 0, // Will be set during sorting
    skills: {},
    categories: {}
  };
  
  // Keep original properties to ensure compatibility with tests
  Object.keys(player).forEach(key => {
    if (!standardPlayer.hasOwnProperty(key)) {
      standardPlayer[key] = player[key];
    }
  });
  
  // Process any skill data if available
  if (player.SKILLS || player.skills) {
    const skillsData = player.SKILLS || player.skills || {};
    
    if (typeof skillsData === 'object') {
      standardPlayer.skills = skillsData;
    } else if (typeof skillsData === 'string') {
      try {
        // Attempt to parse JSON string
        standardPlayer.skills = JSON.parse(skillsData);
      } catch (e) {
        console.warn(`Could not parse skills data for ${standardPlayer.playerName}`);
        standardPlayer.skills = {};
      }
    }
  }
  
  // Process any category data if available
  if (player.CATEGORIES || player.categories) {
    const categoriesData = player.CATEGORIES || player.categories || {};
    
    if (typeof categoriesData === 'object') {
      standardPlayer.categories = categoriesData;
    } else if (typeof categoriesData === 'string') {
      try {
        // Attempt to parse JSON string
        standardPlayer.categories = JSON.parse(categoriesData);
      } catch (e) {
        console.warn(`Could not parse categories data for ${standardPlayer.playerName}`);
        standardPlayer.categories = {};
      }
    }
  }
  
  return standardPlayer;
}

/**
 * Calculate score for a single player
 * @param {Object} player - Player data object
 * @returns {number} Calculated score
 * @private
 */
function calculatePlayerScore(player) {
  // Get score rules from state or use default
  const scoreRules = state.getState ? state.getState('scoreRules') : 
                    (state.scoreRules || [
                      { category: 'default', points: 1, name: 'Default Points' }
                    ]);
  
  try {
    let totalScore = 0;
    
    // Basic scoring logic - add or update as needed
    if (typeof player.goals === 'number') {
      totalScore += player.goals * 2; // 2 points per goal
    }
    
    if (typeof player.assists === 'number') {
      totalScore += player.assists; // 1 point per assist
    }
    
    if (typeof player.saves === 'number') {
      totalScore += player.saves * 0.5; // 0.5 points per save
    }
    
    // Apply any special rules or bonuses from scoreRules
    if (Array.isArray(scoreRules)) {
      scoreRules.forEach(rule => {
        // Check if player has the corresponding stat and apply multiplier
        if (rule.category && typeof player[rule.category] === 'number') {
          totalScore += player[rule.category] * rule.points;
        }
      });
    }
    
    return Math.round(totalScore * 10) / 10; // Round to 1 decimal place
  } catch (error) {
    console.error('Error calculating player score:', error);
    return 0; // Default score on error
  }
}

/**
 * Get player's full name
 * @param {Object} player - Player data object
 * @returns {string} Full name
 * @private
 */
function getFullName(player) {
  // Handle various name field formats
  if (player.fullName) {
    return player.fullName;
  }
  
  if (player.firstName && player.lastName) {
    return `${player.firstName} ${player.lastName}`;
  }
  
  if (player.name) {
    return player.name;
  }
  
  // Try common field names for first and last name
  const first = player.first_name || player.fname || player.first || '';
  const last = player.last_name || player.lname || player.last || '';
  
  if (first || last) {
    return `${first} ${last}`.trim();
  }
  
  return 'Unknown Player';
}

/**
 * Filter players by specified criteria
 * @param {Array} players - Player data array
 * @param {Object} filters - Filter criteria object
 * @returns {Array} Filtered player array
 */
export function filterPlayers(players, filters) {
  if (!Array.isArray(players) || players.length === 0) {
    return [];
  }
  
  if (!filters || Object.keys(filters).length === 0) {
    return players; // No filters applied
  }
  
  try {
    return players.filter(player => {
      // Check each filter criteria
      return Object.entries(filters).every(([key, value]) => {
        // Skip undefined filters
        if (value === undefined || value === null) {
          return true;
        }
        
        // Handle different filter types
        if (typeof value === 'string') {
          // String partial match (case insensitive)
          const playerValue = String(player[key] || '').toLowerCase();
          return playerValue.includes(value.toLowerCase());
        } else if (typeof value === 'number') {
          // Exact number match
          return player[key] === value;
        } else if (Array.isArray(value)) {
          // Value is in array
          return value.includes(player[key]);
        } else if (typeof value === 'object') {
          // Range object with min/max
          const { min, max } = value;
          const playerValue = player[key];
          
          if (min !== undefined && max !== undefined) {
            return playerValue >= min && playerValue <= max;
          } else if (min !== undefined) {
            return playerValue >= min;
          } else if (max !== undefined) {
            return playerValue <= max;
          }
          
          return true;
        } else if (typeof value === 'boolean') {
          // Boolean match
          return !!player[key] === value;
        }
        
        return true;
      });
    });
  } catch (error) {
    console.error('Error filtering players:', error);
    return players; // Return original data on error
  }
}

/**
 * Filter players by name
 * @param {Array} players - Player data array
 * @param {string} filterTerm - Term to filter by
 * @returns {Array} Filtered player data
 */
export function filterPlayersByName(players, filterTerm) {
  if (!filterTerm) {
    return players;
  }
  
  const lowerFilterTerm = filterTerm.toLowerCase();
  
  return players.filter(player => {
    const playerName = (player.playerName || player.PLAYER || '').toLowerCase();
    return playerName.includes(lowerFilterTerm);
  });
}

/**
 * Sort players by specified field and direction
 * @param {Array} players - Player data array
 * @param {string} field - The field to sort by (defaults to 'score')
 * @param {boolean} [ascending=false] - Sort direction
 * @returns {Array} Sorted player array
 */
export function sortPlayers(players, field = 'score', ascending = false) {
  if (!Array.isArray(players) || players.length === 0) {
    return [];
  }
  
  try {
    // Create a copy of the array to avoid modifying the original
    return [...players].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return ascending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Handle numeric values (convert strings to numbers if needed)
      if (typeof aValue === 'string' && !isNaN(aValue)) {
        aValue = parseFloat(aValue);
      }
      
      if (typeof bValue === 'string' && !isNaN(bValue)) {
        bValue = parseFloat(bValue);
      }
      
      // For numbers (including converted strings)
      return ascending
        ? aValue - bValue
        : bValue - aValue;
    });
  } catch (error) {
    console.error(`Error sorting players by ${field}:`, error);
    return players; // Return unsorted on error
  }
}

/**
 * Sort player data by specified column and direction
 * @param {Array} players - Player data array
 * @param {string} column - Column to sort by (defaults to SCORE or totalScore)
 * @param {string} direction - Sort direction ('asc' or 'desc')
 * @returns {Array} Sorted player data
 */
export function sortPlayerData(players, column, direction = 'desc') {
  if (!players || !Array.isArray(players)) {
    return [];
  }
  
  // Determine appropriate sort column based on data format
  if (!column) {
    // If first player has SCORE, use that, otherwise use totalScore
    column = players[0] && players[0].SCORE !== undefined ? 'SCORE' : 'totalScore';
  }
  
  const validColumns = ['PLAYER', 'playerName', 'SCORE', 'totalScore', 'CHESTS', 'chestCount', 'rank'];
  const sortColumn = validColumns.includes(column) ? column : (players[0] && players[0].SCORE !== undefined ? 'SCORE' : 'totalScore');
  const sortDir = direction === 'asc' ? 1 : -1;
  
  // Create a copy of the array to avoid modifying the original
  const sortedPlayers = [...players].sort((a, b) => {
    // Handle potentially different property names
    let aValue, bValue;
    
    // For name sorting
    if (sortColumn === 'PLAYER' || sortColumn === 'playerName') {
      aValue = (a.PLAYER || a.playerName || '').toLowerCase();
      bValue = (b.PLAYER || b.playerName || '').toLowerCase();
      return aValue.localeCompare(bValue) * sortDir;
    }
    
    // For score sorting
    if (sortColumn === 'SCORE' || sortColumn === 'totalScore') {
      aValue = parseFloat(a.SCORE || a.totalScore || 0);
      bValue = parseFloat(b.SCORE || b.totalScore || 0);
    }
    
    // For chest sorting
    if (sortColumn === 'CHESTS' || sortColumn === 'chestCount') {
      aValue = parseInt(a.CHESTS || a.chestCount || 0, 10);
      bValue = parseInt(b.CHESTS || b.chestCount || 0, 10);
    }
    
    // For rank sorting
    if (sortColumn === 'rank') {
      aValue = a.rank || 0;
      bValue = b.rank || 0;
    }
    
    // Handle numeric comparison for other fields
    return (aValue - bValue) * sortDir;
  });
  
  // Update rank if we're using standardized data
  if (sortedPlayers[0] && (sortedPlayers[0].totalScore !== undefined)) {
    sortedPlayers.forEach((player, index) => {
      player.rank = index + 1;
    });
  }
  
  return sortedPlayers;
}

/**
 * Calculate aggregate statistics from player data
 * @param {Array} players - Player data array
 */
function calculateAggregateStatistics(players) {
  if (!players || !Array.isArray(players) || players.length === 0) {
    return;
  }
  
  // Player count
  const playerCount = players.length;
  state.setState('playerCount', playerCount);
  
  // Total score - handle both data formats
  const totalScore = players.reduce((sum, player) => {
    const score = player.SCORE !== undefined ? player.SCORE : player.totalScore || 0;
    return sum + parseFloat(score);
  }, 0);
  state.setState('totalScore', totalScore);
  
  // Total chests - handle both data formats
  const totalChests = players.reduce((sum, player) => {
    const chests = player.CHESTS !== undefined ? player.CHESTS : player.chestCount || 0;
    return sum + parseInt(chests, 10);
  }, 0);
  state.setState('totalChests', totalChests);
  
  // Average score
  const avgScore = playerCount > 0 ? totalScore / playerCount : 0;
  state.setState('averageScore', avgScore);
  
  // Premium player count
  const premiumCount = players.filter(player => 
    player.PREMIUM === 'true' || player.premium === true
  ).length;
  state.setState('premiumPlayerCount', premiumCount);
}

/**
 * Get player by ID
 * @param {string} playerId - Player ID to find
 * @returns {Object|null} Player object or null if not found
 */
export function getPlayerById(playerId) {
  if (!playerId) return null;
  
  const players = state.displayData || [];
  return players.find(player => player.id === playerId || 
    player.playerName === playerId) || null;
}

/**
 * Get top players by score
 * @param {number} [limit=5] - Number of players to return
 * @returns {Array} Top players array
 */
export function getTopPlayersByScore(limit = 5) {
  const players = state.displayData || [];
  if (!players.length) return [];
  
  // Sort by score and return top 'limit' players
  return sortPlayerData(players, players[0].SCORE !== undefined ? 'SCORE' : 'totalScore', 'desc')
    .slice(0, limit);
}

/**
 * Get top players by chest count
 * @param {number} [limit=5] - Number of players to return
 * @returns {Array} Top players array
 */
export function getTopPlayersByChests(limit = 5) {
  const players = state.displayData || [];
  if (!players.length) return [];
  
  // Sort by chests and return top 'limit' players
  return sortPlayerData(players, players[0].CHESTS !== undefined ? 'CHESTS' : 'chestCount', 'desc')
    .slice(0, limit);
}

/**
 * Calculate score distribution for charts
 * @param {number} [buckets=5] - Number of distribution buckets
 * @returns {Object} Score distribution data
 */
export function calculateScoreDistribution(buckets = 5) {
  const players = state.displayData || [];
  if (!players.length) return { labels: [], data: [] };
  
  // Get min and max scores
  const scores = players.map(p => parseFloat(p.SCORE || p.totalScore || 0));
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  
  // Calculate bucket size
  const range = maxScore - minScore;
  const bucketSize = range / buckets;
  
  // Initialize buckets
  const distribution = Array(buckets).fill(0);
  const labels = [];
  
  // Create labels
  for (let i = 0; i < buckets; i++) {
    const start = minScore + (i * bucketSize);
    const end = start + bucketSize;
    labels.push(`${Math.round(start)}-${Math.round(end)}`);
  }
  
  // Count scores in each bucket
  scores.forEach(score => {
    if (score === maxScore) {
      // Edge case: max score goes in the last bucket
      distribution[buckets - 1]++;
    } else {
      const bucketIndex = Math.floor((score - minScore) / bucketSize);
      distribution[bucketIndex]++;
    }
  });
  
  return {
    labels,
    data: distribution
  };
} 