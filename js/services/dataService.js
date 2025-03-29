/**
 * dataService.js
 * 
 * Service for handling data operations in the TB Chest Analyzer.
 * Manages data loading, processing, and analysis.
 */

/**
 * Class representing the data service that handles all data operations
 */
export class DataService {
  /**
   * Create a data service
   * @param {Object} stateManager - State manager instance
   * @param {Object} errorHandler - Error handler instance
   */
  constructor(stateManager, errorHandler) {
    this._stateManager = stateManager;
    this._errorHandler = errorHandler;
    this._dataLoaded = false;
  }
  
  /**
   * Load data from CSV files
   * @param {string} dataUrl - URL of the main data CSV file
   * @param {string} rulesUrl - URL of the rules CSV file
   * @returns {Promise<boolean>} Success status
   */
  async loadData(dataUrl = 'data.csv', rulesUrl = 'rules.csv') {
    try {
      this._stateManager.setState('isLoading', true);
      
      // Load main data
      const dataResponse = await fetch(dataUrl);
      if (!dataResponse.ok) {
        throw new Error(`Failed to load data: ${dataResponse.status} ${dataResponse.statusText}`);
      }
      
      const dataText = await dataResponse.text();
      const parsedData = this._parseCSV(dataText);
      
      // Load rules data
      const rulesResponse = await fetch(rulesUrl);
      if (!rulesResponse.ok) {
        throw new Error(`Failed to load rules: ${rulesResponse.status} ${rulesResponse.statusText}`);
      }
      
      const rulesText = await rulesResponse.text();
      const parsedRules = this._parseCSV(rulesText);
      
      // Process the data
      const processedData = this._processData(parsedData, parsedRules);
      
      // Update state with raw and processed data
      this._stateManager.batchUpdate({
        'rawData': parsedData,
        'processedData': processedData,
        'players': this._extractPlayers(processedData),
        'isLoading': false
      });
      
      this._dataLoaded = true;
      return true;
    } catch (error) {
      this._errorHandler.handleError(error, 'data-loading');
      this._stateManager.setState('isLoading', false);
      return false;
    }
  }
  
  /**
   * Get player details
   * @param {string} playerId - Player ID
   * @returns {Object|null} Player details or null if not found
   */
  getPlayerDetails(playerId) {
    try {
      const processedData = this._stateManager.getState('processedData');
      if (!processedData) {
        throw new Error('Data not loaded');
      }
      
      const playerData = processedData.find(item => item.id === playerId);
      if (!playerData) {
        throw new Error(`Player not found: ${playerId}`);
      }
      
      return playerData;
    } catch (error) {
      this._errorHandler.handleError(error, 'player-details');
      return null;
    }
  }
  
  /**
   * Get players filtered by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered player list
   */
  getFilteredPlayers(filters = {}) {
    try {
      const players = this._stateManager.getState('players');
      if (!players) {
        return [];
      }
      
      return players.filter(player => {
        // Apply server filter
        if (filters.selectedServer && player.server !== filters.selectedServer) {
          return false;
        }
        
        // Apply alliance filter
        if (filters.selectedAlliance && player.alliance !== filters.selectedAlliance) {
          return false;
        }
        
        // Apply search filter
        if (filters.playerSearch && 
            !player.name.toLowerCase().includes(filters.playerSearch.toLowerCase())) {
          return false;
        }
        
        return true;
      });
    } catch (error) {
      this._errorHandler.handleError(error, 'player-filtering');
      return [];
    }
  }
  
  /**
   * Get the list of all servers
   * @returns {Array<string>} List of server names
   */
  getServers() {
    try {
      const players = this._stateManager.getState('players');
      if (!players) {
        return [];
      }
      
      // Extract unique server names
      const servers = [...new Set(players.map(player => player.server))];
      return servers.sort();
    } catch (error) {
      this._errorHandler.handleError(error, 'server-list');
      return [];
    }
  }
  
  /**
   * Get the list of all alliances
   * @returns {Array<string>} List of alliance names
   */
  getAlliances() {
    try {
      const players = this._stateManager.getState('players');
      if (!players) {
        return [];
      }
      
      // Extract unique alliance names
      const alliances = [...new Set(players.map(player => player.alliance))]
        .filter(alliance => alliance); // Remove null/undefined
      
      return alliances.sort();
    } catch (error) {
      this._errorHandler.handleError(error, 'alliance-list');
      return [];
    }
  }
  
  /**
   * Calculate rankings based on criteria
   * @param {string} criteria - Ranking criteria ('score', 'chests', etc.)
   * @param {Array} players - List of players to rank (defaults to all)
   * @returns {Array} Ranked player list
   */
  calculateRankings(criteria = 'score', players = null) {
    try {
      const playerList = players || this._stateManager.getState('players');
      if (!playerList) {
        return [];
      }
      
      // Sort players based on criteria
      const sortedPlayers = [...playerList].sort((a, b) => {
        if (criteria === 'ratio') {
          // Special case for ratio calculation
          const ratioA = a.chests > 0 ? a.score / a.chests : 0;
          const ratioB = b.chests > 0 ? b.score / b.chests : 0;
          return ratioB - ratioA;
        }
        
        return b[criteria] - a[criteria];
      });
      
      // Add rank property
      return sortedPlayers.map((player, index) => ({
        ...player,
        rank: index + 1
      }));
    } catch (error) {
      this._errorHandler.handleError(error, 'ranking-calculation');
      return [];
    }
  }
  
  /**
   * Get analytics data for charts and visualizations
   * @param {string} type - Type of analytics to generate
   * @param {Object} options - Options for the analytics
   * @returns {Object} Analytics data object
   */
  getAnalyticsData(type, options = {}) {
    try {
      const processedData = this._stateManager.getState('processedData');
      if (!processedData) {
        throw new Error('Data not loaded');
      }
      
      switch (type) {
        case 'playerDistribution':
          return this._getPlayerDistribution(processedData, options);
        case 'chestComparison':
          return this._getChestComparison(processedData, options);
        case 'alliancePerformance':
          return this._getAlliancePerformance(processedData, options);
        case 'serverActivity':
          return this._getServerActivity(processedData, options);
        case 'topPlayers':
          return this._getTopPlayers(processedData, options);
        default:
          throw new Error(`Unknown analytics type: ${type}`);
      }
    } catch (error) {
      this._errorHandler.handleError(error, 'analytics-generation');
      return null;
    }
  }
  
  /**
   * Export data to CSV
   * @param {Array} data - Data to export
   * @param {Array} fields - Fields to include
   * @returns {string} CSV string
   */
  exportToCSV(data, fields) {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('No data to export');
      }
      
      // Use provided fields or extract from first data item
      const headers = fields || Object.keys(data[0]);
      
      // Create CSV header row
      let csv = headers.join(',') + '\n';
      
      // Add data rows
      for (const item of data) {
        const row = headers.map(field => {
          const value = item[field];
          // Handle strings with commas by quoting
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        });
        csv += row.join(',') + '\n';
      }
      
      return csv;
    } catch (error) {
      this._errorHandler.handleError(error, 'data-export');
      return '';
    }
  }
  
  /**
   * Check if data is loaded
   * @returns {boolean} True if data is loaded
   */
  isDataLoaded() {
    return this._dataLoaded;
  }
  
  /**
   * Parse CSV data
   * @param {string} csvText - CSV text content
   * @returns {Array} Parsed data objects
   * @private
   */
  _parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle commas in quoted strings
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      // Create object with headers as keys
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        // Convert numeric values
        const value = values[j] ? values[j].trim() : '';
        if (!isNaN(value) && value !== '') {
          obj[headers[j]] = parseFloat(value);
        } else {
          obj[headers[j]] = value;
        }
      }
      
      data.push(obj);
    }
    
    return data;
  }
  
  /**
   * Process raw data with rules
   * @param {Array} data - Raw data
   * @param {Array} rules - Rules data
   * @returns {Array} Processed data
   * @private
   */
  _processData(data, rules) {
    // Apply rules to raw data
    return data.map(item => {
      const processedItem = { ...item };
      
      // Calculate score based on rules
      let score = 0;
      for (const rule of rules) {
        if (rule.type && item[rule.type]) {
          score += item[rule.type] * rule.multiplier;
        }
      }
      
      processedItem.score = Math.round(score);
      
      // Calculate ratio
      if (processedItem.chests && processedItem.chests > 0) {
        processedItem.ratio = processedItem.score / processedItem.chests;
      } else {
        processedItem.ratio = 0;
      }
      
      return processedItem;
    });
  }
  
  /**
   * Extract player list from processed data
   * @param {Array} processedData - Processed data
   * @returns {Array} Player list
   * @private
   */
  _extractPlayers(processedData) {
    // Map to store unique players by ID
    const playerMap = new Map();
    
    for (const item of processedData) {
      if (!playerMap.has(item.id)) {
        playerMap.set(item.id, {
          id: item.id,
          name: item.name,
          alliance: item.alliance,
          server: item.server,
          score: item.score,
          chests: item.chests,
          ratio: item.ratio
        });
      }
    }
    
    // Convert map to array
    return Array.from(playerMap.values());
  }
  
  /**
   * Generate player distribution analytics
   * @param {Array} data - Processed data
   * @param {Object} options - Options
   * @returns {Object} Player distribution data
   * @private
   */
  _getPlayerDistribution(data, options) {
    // Group players by server or alliance
    const groupBy = options.groupBy || 'server';
    const groups = {};
    
    for (const item of data) {
      const groupKey = item[groupBy];
      if (!groupKey) continue;
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: groupKey,
          count: 0,
          totalScore: 0,
          totalChests: 0
        };
      }
      
      groups[groupKey].count++;
      groups[groupKey].totalScore += item.score;
      groups[groupKey].totalChests += item.chests;
    }
    
    // Convert to array and sort
    const sortedGroups = Object.values(groups).sort((a, b) => b.count - a.count);
    
    return {
      labels: sortedGroups.map(g => g.name),
      datasets: [
        {
          label: 'Player Count',
          data: sortedGroups.map(g => g.count)
        },
        {
          label: 'Average Score',
          data: sortedGroups.map(g => g.totalScore / g.count)
        }
      ]
    };
  }
  
  /**
   * Generate chest comparison analytics
   * @param {Array} data - Processed data
   * @param {Object} options - Options
   * @returns {Object} Chest comparison data
   * @private
   */
  _getChestComparison(data, options) {
    // Filter top players by chest count
    const topCount = options.topCount || 10;
    const topPlayers = [...data]
      .sort((a, b) => b.chests - a.chests)
      .slice(0, topCount);
    
    return {
      labels: topPlayers.map(p => p.name),
      datasets: [
        {
          label: 'Chests',
          data: topPlayers.map(p => p.chests)
        },
        {
          label: 'Score',
          data: topPlayers.map(p => p.score)
        },
        {
          label: 'Ratio',
          data: topPlayers.map(p => p.ratio.toFixed(2))
        }
      ]
    };
  }
  
  /**
   * Generate alliance performance analytics
   * @param {Array} data - Processed data
   * @param {Object} options - Options
   * @returns {Object} Alliance performance data
   * @private
   */
  _getAlliancePerformance(data, options) {
    // Group by alliance
    const alliances = {};
    
    for (const item of data) {
      if (!item.alliance) continue;
      
      if (!alliances[item.alliance]) {
        alliances[item.alliance] = {
          name: item.alliance,
          players: new Set(),
          totalScore: 0,
          totalChests: 0
        };
      }
      
      alliances[item.alliance].players.add(item.id);
      alliances[item.alliance].totalScore += item.score;
      alliances[item.alliance].totalChests += item.chests;
    }
    
    // Calculate averages and convert to array
    const allianceArray = Object.values(alliances).map(alliance => ({
      name: alliance.name,
      playerCount: alliance.players.size,
      totalScore: alliance.totalScore,
      totalChests: alliance.totalChests,
      averageScore: alliance.totalScore / alliance.players.size,
      averageChests: alliance.totalChests / alliance.players.size,
      ratio: alliance.totalScore / (alliance.totalChests || 1)
    }));
    
    // Sort by average score
    const sortedAlliances = allianceArray.sort((a, b) => b.averageScore - a.averageScore);
    
    // Take top alliances
    const topCount = options.topCount || 10;
    const topAlliances = sortedAlliances.slice(0, topCount);
    
    return {
      labels: topAlliances.map(a => a.name),
      datasets: [
        {
          label: 'Average Score',
          data: topAlliances.map(a => a.averageScore.toFixed(0))
        },
        {
          label: 'Player Count',
          data: topAlliances.map(a => a.playerCount)
        },
        {
          label: 'Ratio',
          data: topAlliances.map(a => a.ratio.toFixed(2))
        }
      ]
    };
  }
  
  /**
   * Generate server activity analytics
   * @param {Array} data - Processed data
   * @param {Object} options - Options
   * @returns {Object} Server activity data
   * @private
   */
  _getServerActivity(data, options) {
    // Group by server
    const servers = {};
    
    for (const item of data) {
      if (!item.server) continue;
      
      if (!servers[item.server]) {
        servers[item.server] = {
          name: item.server,
          players: new Set(),
          totalScore: 0,
          totalChests: 0,
          alliances: new Set()
        };
      }
      
      servers[item.server].players.add(item.id);
      if (item.alliance) {
        servers[item.server].alliances.add(item.alliance);
      }
      servers[item.server].totalScore += item.score;
      servers[item.server].totalChests += item.chests;
    }
    
    // Calculate metrics and convert to array
    const serverArray = Object.values(servers).map(server => ({
      name: server.name,
      playerCount: server.players.size,
      allianceCount: server.alliances.size,
      totalScore: server.totalScore,
      totalChests: server.totalChests,
      averageScore: server.totalScore / server.players.size,
      averageChests: server.totalChests / server.players.size,
      activity: server.totalChests / server.players.size // Activity defined as chests per player
    }));
    
    // Sort by activity
    const sortedServers = serverArray.sort((a, b) => b.activity - a.activity);
    
    return {
      labels: sortedServers.map(s => s.name),
      datasets: [
        {
          label: 'Activity',
          data: sortedServers.map(s => s.activity.toFixed(2))
        },
        {
          label: 'Player Count',
          data: sortedServers.map(s => s.playerCount)
        },
        {
          label: 'Alliance Count',
          data: sortedServers.map(s => s.allianceCount)
        }
      ]
    };
  }
  
  /**
   * Generate top players analytics
   * @param {Array} data - Processed data
   * @param {Object} options - Options
   * @returns {Object} Top players data
   * @private
   */
  _getTopPlayers(data, options) {
    const metric = options.metric || 'score';
    const topCount = options.topCount || 10;
    
    // Sort by the specified metric
    const sortedPlayers = [...data].sort((a, b) => b[metric] - a[metric]);
    
    // Take top players
    const topPlayers = sortedPlayers.slice(0, topCount);
    
    return {
      labels: topPlayers.map(p => p.name),
      datasets: [
        {
          label: metric.charAt(0).toUpperCase() + metric.slice(1),
          data: topPlayers.map(p => p[metric])
        }
      ]
    };
  }
} 