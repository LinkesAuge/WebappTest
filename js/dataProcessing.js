/**
 * dataProcessing.js
 * Contains functions for processing and analyzing player data
 */

import { allPlayersData, displayData, scoreRules } from './state.js';
import { CORE_COLUMNS } from './config.js';
import { elements, showError, clearElement } from './dom.js';
import { getText } from './i18n.js';
import { formatNumber } from './utils.js';

/**
 * Processes player data to calculate totals and derived values
 */
export function processPlayerData() {
  try {
    if (!allPlayersData || allPlayersData.length === 0) {
      console.warn('No player data to process');
      return;
    }
    
    console.log('Processing player data...');
    
    // Make sure we have a clean slate for display data
    displayData.length = 0;
    
    // Calculate derived values for each player
    allPlayersData.forEach(player => {
      const processedPlayer = calculatePlayerStats(player);
      displayData.push(processedPlayer);
    });
    
    // Sort players by total score descending
    sortPlayersByScore(displayData);
    
    // Add rank to each player
    addRankingToPlayers(displayData);
    
    console.log('Player data processing complete');
  } catch (error) {
    console.error('Error processing player data:', error);
    showError('Error processing player data');
  }
}

/**
 * Calculates statistics for a player
 * @param {Object} player - The player data
 * @returns {Object} The player data with calculated stats
 */
export function calculatePlayerStats(player) {
  try {
    // Create a new object to avoid modifying the original
    const processedPlayer = { ...player };
    
    // Ensure TOTAL_SCORE and CHEST_COUNT exist
    if (!processedPlayer.TOTAL_SCORE) {
      processedPlayer.TOTAL_SCORE = 0;
    }
    
    if (!processedPlayer.CHEST_COUNT) {
      processedPlayer.CHEST_COUNT = 0;
    }
    
    // Calculate chest score breakdown if we have score rules
    if (scoreRules && scoreRules.length > 0) {
      processedPlayer.scoreBreakdown = calculateScoreBreakdown(processedPlayer);
    }
    
    // Calculate score per chest ratio
    if (processedPlayer.CHEST_COUNT > 0) {
      processedPlayer.scorePerChest = processedPlayer.TOTAL_SCORE / processedPlayer.CHEST_COUNT;
    } else {
      processedPlayer.scorePerChest = 0;
    }
    
    return processedPlayer;
  } catch (error) {
    console.error('Error calculating player stats:', error);
    return player;
  }
}

/**
 * Calculates score breakdown for a player based on chest types
 * @param {Object} player - The player data
 * @returns {Object} Score breakdown by chest type
 */
export function calculateScoreBreakdown(player) {
  try {
    const breakdown = {};
    
    // Skip core columns that aren't chest types
    Object.keys(player).forEach(key => {
      if (!CORE_COLUMNS.includes(key) && typeof player[key] === 'number' && player[key] > 0) {
        breakdown[key] = {
          count: player[key],
          score: calculateScoreForChestType(key, player[key])
        };
      }
    });
    
    return breakdown;
  } catch (error) {
    console.error('Error calculating score breakdown:', error);
    return {};
  }
}

/**
 * Calculates the score for a specific chest type
 * @param {string} chestType - The type of chest
 * @param {number} count - The number of chests
 * @returns {number} The calculated score
 */
export function calculateScoreForChestType(chestType, count) {
  try {
    if (!scoreRules || !chestType || count <= 0) {
      return 0;
    }
    
    // Parse chest type to extract type and level
    const match = chestType.match(/(.+?)_(\d+|KEIN)/i);
    
    if (!match) {
      console.warn(`Could not parse chest type: ${chestType}`);
      return 0;
    }
    
    const type = match[1];
    const level = match[2] === 'KEIN' ? 0 : parseInt(match[2], 10);
    
    // Find matching rule
    const rule = scoreRules.find(r => {
      return r.Typ.toLowerCase() === type.toLowerCase() && r.Stufe === level;
    });
    
    if (!rule) {
      console.warn(`No rule found for chest type ${chestType}`);
      return 0;
    }
    
    return rule.Punkte * count;
  } catch (error) {
    console.error('Error calculating score for chest type:', error);
    return 0;
  }
}

/**
 * Sorts players by total score in descending order
 * @param {Object[]} players - Array of player data objects
 */
export function sortPlayersByScore(players) {
  try {
    if (!players || !Array.isArray(players)) {
      return;
    }
    
    players.sort((a, b) => b.TOTAL_SCORE - a.TOTAL_SCORE);
  } catch (error) {
    console.error('Error sorting players by score:', error);
  }
}

/**
 * Adds ranking to players based on their sorted position
 * @param {Object[]} players - Array of player data objects (should be sorted)
 */
export function addRankingToPlayers(players) {
  try {
    if (!players || !Array.isArray(players)) {
      return;
    }
    
    let currentRank = 1;
    let previousScore = null;
    
    players.forEach((player, index) => {
      // If score is the same as the previous player, assign the same rank
      if (index > 0 && player.TOTAL_SCORE === previousScore) {
        player.rank = players[index - 1].rank;
      } else {
        player.rank = currentRank;
      }
      
      previousScore = player.TOTAL_SCORE;
      currentRank++;
    });
  } catch (error) {
    console.error('Error adding ranking to players:', error);
  }
}

/**
 * Calculates overall statistics for all players
 * @returns {Object} Overall statistics
 */
export function calculateOverallStats() {
  try {
    if (!displayData || displayData.length === 0) {
      return {
        playerCount: 0,
        totalScore: 0,
        totalChests: 0,
        averageScore: 0,
        averageChests: 0
      };
    }
    
    const playerCount = displayData.length;
    let totalScore = 0;
    let totalChests = 0;
    
    displayData.forEach(player => {
      totalScore += player.TOTAL_SCORE || 0;
      totalChests += player.CHEST_COUNT || 0;
    });
    
    const averageScore = playerCount > 0 ? totalScore / playerCount : 0;
    const averageChests = playerCount > 0 ? totalChests / playerCount : 0;
    
    return {
      playerCount,
      totalScore,
      totalChests,
      averageScore,
      averageChests
    };
  } catch (error) {
    console.error('Error calculating overall stats:', error);
    return {
      playerCount: 0,
      totalScore: 0,
      totalChests: 0,
      averageScore: 0,
      averageChests: 0
    };
  }
}

/**
 * Gets the top players by a specific metric
 * @param {string} metric - The metric to sort by (e.g., 'TOTAL_SCORE', 'CHEST_COUNT')
 * @param {number} limit - The number of top players to return
 * @returns {Object[]} Array of top players
 */
export function getTopPlayers(metric = 'TOTAL_SCORE', limit = 5) {
  try {
    if (!displayData || displayData.length === 0) {
      return [];
    }
    
    // Clone the array to avoid modifying the original
    const sortedPlayers = [...displayData];
    
    // Sort by the specified metric
    sortedPlayers.sort((a, b) => {
      return (b[metric] || 0) - (a[metric] || 0);
    });
    
    // Return the top N players
    return sortedPlayers.slice(0, limit);
  } catch (error) {
    console.error(`Error getting top players by ${metric}:`, error);
    return [];
  }
}

/**
 * Gets all unique chest types from player data
 * @returns {string[]} Array of unique chest types
 */
export function getAllChestTypes() {
  try {
    if (!displayData || displayData.length === 0) {
      return [];
    }
    
    const chestTypes = new Set();
    
    displayData.forEach(player => {
      Object.keys(player).forEach(key => {
        if (!CORE_COLUMNS.includes(key) && typeof player[key] === 'number' && player[key] > 0) {
          chestTypes.add(key);
        }
      });
    });
    
    return Array.from(chestTypes).sort();
  } catch (error) {
    console.error('Error getting all chest types:', error);
    return [];
  }
}

/**
 * Renders player details in the player details panel
 * @param {string} playerName - The name of the player to show details for
 */
export function renderPlayerDetails(playerName) {
  try {
    if (!elements.playerDetailsContainer) {
      console.warn('Player details container not found');
      return;
    }
    
    const player = displayData.find(p => p.PLAYER === playerName);
    if (!player) {
      console.warn(`Player not found: ${playerName}`);
      showError(getText('status.noPlayerData'));
      return;
    }
    
    // Set player details
    elements.playerDetailsName.textContent = player.PLAYER;
    elements.playerDetailsRank.textContent = player.rank;
    elements.playerDetailsTotalScore.textContent = formatNumber(player.TOTAL_SCORE);
    elements.playerDetailsTotalChests.textContent = formatNumber(player.CHEST_COUNT);
    
    // Clear previous breakdown
    clearElement(elements.playerDetailsBreakdownContainer);
    
    // Render score breakdown
    if (player.scoreBreakdown && Object.keys(player.scoreBreakdown).length > 0) {
      renderScoreBreakdown(player.scoreBreakdown, elements.playerDetailsBreakdownContainer);
    } else {
      elements.playerDetailsBreakdownContainer.innerHTML = 
        `<p class="no-data">${getText('playerDetail.noBreakdown')}</p>`;
    }
    
    // Show the player details container
    elements.playerDetailsContainer.classList.remove('hidden');
  } catch (error) {
    console.error('Error rendering player details:', error);
  }
}

/**
 * Renders the score breakdown for a player
 * @param {Object} breakdown - The score breakdown data
 * @param {HTMLElement} container - The container to render in
 */
function renderScoreBreakdown(breakdown, container) {
  try {
    if (!breakdown || !container) {
      return;
    }
    
    const table = document.createElement('table');
    table.classList.add('breakdown-table');
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Chest Type', 'Count', 'Score'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    Object.entries(breakdown).forEach(([chestType, data]) => {
      const row = document.createElement('tr');
      
      // Chest type column
      const typeCell = document.createElement('td');
      typeCell.textContent = formatChestTypeForDisplay(chestType);
      row.appendChild(typeCell);
      
      // Count column
      const countCell = document.createElement('td');
      countCell.textContent = formatNumber(data.count);
      row.appendChild(countCell);
      
      // Score column
      const scoreCell = document.createElement('td');
      scoreCell.textContent = formatNumber(data.score);
      row.appendChild(scoreCell);
      
      tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    container.appendChild(table);
  } catch (error) {
    console.error('Error rendering score breakdown:', error);
  }
}

/**
 * Formats a chest type string for display
 * @param {string} chestType - The raw chest type from data
 * @returns {string} Formatted chest type for display
 */
function formatChestTypeForDisplay(chestType) {
  try {
    if (!chestType) return '';
    
    // Replace underscores with spaces
    let formatted = chestType.replace(/_/g, ' ');
    
    // Capitalize first letter of each word
    formatted = formatted.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    
    // Replace "Kein" with "Level 0"
    formatted = formatted.replace(/ Kein$/i, ' Level 0');
    
    return formatted;
  } catch (error) {
    console.error('Error formatting chest type:', error);
    return chestType;
  }
}

// Export default object with all data processing functions
export default {
  processPlayerData,
  calculatePlayerStats,
  calculateScoreBreakdown,
  calculateScoreForChestType,
  sortPlayersByScore,
  addRankingToPlayers,
  calculateOverallStats,
  getTopPlayers,
  getAllChestTypes,
  renderPlayerDetails
}; 