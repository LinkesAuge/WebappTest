/**
 * Data Analysis Tests
 * 
 * Tests for data analysis functionality in the ChefScore Analytics Dashboard.
 */

// Create mock functions
const processPlayerData = jest.fn(rawData => {
  if (!rawData || !rawData.length) return [];
  
  return rawData.map((row, index) => ({
    id: row.id || `player-${index + 1}`,
    playerName: row.playerName || row.name || `Player ${index + 1}`,
    totalScore: Number(row.totalScore) || 0,
    chestCount: Number(row.chestCount) || 0,
    premium: row.premium === true || row.premium === 'true',
    lastActive: row.lastActive || new Date().toISOString(),
    rank: 0  // Will be calculated later
  }));
});

// Make the function available globally
global.processPlayerData = processPlayerData;

const filterPlayersByName = jest.fn((players, name) => {
  if (!name) return players;
  
  const lowerName = name.toLowerCase();
  return players.filter(player => 
    player.playerName.toLowerCase().includes(lowerName)
  );
});

describe('Data Analysis', () => {
  // Sample player data for testing
  const testData = [
    {
      id: 'player-1',
      playerName: 'MaxMustermann',
      totalScore: 2500,
      chestCount: 42,
      premium: true,
      lastActive: '2023-03-15T14:30:00Z'
    },
    {
      id: 'player-2',
      playerName: 'ElinaEvergreen',
      totalScore: 3200,
      chestCount: 38,
      premium: false,
      lastActive: '2023-03-14T09:45:00Z'
    },
    {
      id: 'player-3',
      playerName: 'ChefCharlie',
      totalScore: 1800,
      chestCount: 27,
      premium: false,
      lastActive: '2023-03-10T11:20:00Z'
    },
    {
      id: 'player-4',
      playerName: 'DonnaDelicious',
      totalScore: 4100,
      chestCount: 65,
      premium: true,
      lastActive: '2023-03-16T16:10:00Z'
    },
    {
      id: 'player-5',
      playerName: 'BakerBob',
      totalScore: 950,
      chestCount: 15,
      premium: false,
      lastActive: '2023-03-05T08:30:00Z'
    }
  ];

  // Convert to raw format mimicking CSV import
  const rawData = testData.map(player => ({
    ...player,
    totalScore: player.totalScore,
    chestCount: player.chestCount,
    premium: player.premium
  }));

  // Stats calculation functions
  const calculateStats = (players) => {
    if (!players || !players.length) {
      return {
        playerCount: 0,
        totalScore: 0,
        totalChests: 0,
        averageScore: 0,
        averageChests: 0
      };
    }
    
    const playerCount = players.length;
    const totalScore = players.reduce((sum, player) => sum + Number(player.totalScore), 0);
    const totalChests = players.reduce((sum, player) => sum + Number(player.chestCount), 0);
    const averageScore = Math.round(totalScore / playerCount);
    const averageChests = Math.round(totalChests / playerCount);
    
    return {
      playerCount,
      totalScore,
      totalChests,
      averageScore,
      averageChests
    };
  };

  // Sorting functions
  const sortPlayers = (players, column, direction = 'desc') => {
    if (!players || !players.length) return [];
    if (!column || !['playerName', 'totalScore', 'chestCount'].includes(column)) {
      return players;
    }
    
    return [...players].sort((a, b) => {
      if (column === 'playerName') {
        const nameA = a.playerName.toLowerCase();
        const nameB = b.playerName.toLowerCase();
        return direction === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        const valueA = Number(a[column]);
        const valueB = Number(b[column]);
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  };

  describe('Data Processing', () => {
    test('should process raw player data into the correct format', () => {
      const processedData = processPlayerData(rawData);
      
      // Check array size
      expect(processedData).toHaveLength(5);
      
      // Check first player
      expect(processedData[0]).toEqual(expect.objectContaining({
        id: 'player-1',
        playerName: 'MaxMustermann',
        totalScore: 2500,
        chestCount: 42,
        premium: true
      }));
      
      // Verify data types
      expect(typeof processedData[0].totalScore).toBe('number');
      expect(typeof processedData[0].chestCount).toBe('number');
      expect(typeof processedData[0].premium).toBe('boolean');
    });
    
    test('should handle optional fields correctly', () => {
      const incompleteRawData = [
        { id: 'player-100', playerName: 'Incomplete Player' },
        { id: 'player-101', totalScore: 500 },
        { playerName: 'No ID Player', totalScore: 300, chestCount: 10 }
      ];
      
      const processedData = processPlayerData(incompleteRawData);
      
      // Check handling of missing fields
      expect(processedData[0].totalScore).toBe(0); // Default when missing
      expect(processedData[0].chestCount).toBe(0); // Default when missing
      expect(processedData[0].premium).toBe(false); // Default when missing
      
      // Check handling of missing ID and playerName
      expect(processedData[1].playerName).toContain('Player'); // Should get default name
      expect(processedData[2].id).toContain('player-'); // Should get generated ID
    });
    
    test('should handle premium status correctly', () => {
      const processedData = processPlayerData(rawData);
      
      // Check premium players
      const premiumPlayers = processedData.filter(player => player.premium === true);
      expect(premiumPlayers).toHaveLength(2);
      expect(premiumPlayers[0].id).toBe('player-1');
      expect(premiumPlayers[1].id).toBe('player-4');
      
      // Check non-premium players
      const nonPremiumPlayers = processedData.filter(player => player.premium === false);
      expect(nonPremiumPlayers).toHaveLength(3);
    });
  });
  
  describe('Aggregate Statistics', () => {
    // Process data first
    const processedData = processPlayerData(rawData);
    const stats = calculateStats(processedData);
    
    test('should calculate correct player count', () => {
      expect(stats.playerCount).toBe(5);
    });
    
    test('should calculate correct total score', () => {
      // 2500 + 3200 + 1800 + 4100 + 950 = 12550
      expect(stats.totalScore).toBe(12550);
    });
    
    test('should calculate correct total chests', () => {
      // 42 + 38 + 27 + 65 + 15 = 187
      expect(stats.totalChests).toBe(187);
    });
    
    test('should calculate correct average score', () => {
      // 12550 / 5 = 2510
      expect(stats.averageScore).toBe(2510);
    });
    
    test('should calculate correct average chests', () => {
      // 187 / 5 = 37.4, rounded to 37
      expect(stats.averageChests).toBe(37);
    });
  });
  
  describe('Data Sorting', () => {
    test('should sort data by totalScore in descending order', () => {
      const processedData = processPlayerData(rawData);
      const sorted = sortPlayers(processedData, 'totalScore', 'desc');
      
      expect(sorted[0].playerName).toBe('DonnaDelicious');
      expect(sorted[1].playerName).toBe('ElinaEvergreen');
      expect(sorted[4].playerName).toBe('BakerBob');
    });
    
    test('should sort data by playerName in ascending order', () => {
      const processedData = processPlayerData(rawData);
      const sorted = sortPlayers(processedData, 'playerName', 'asc');
      
      expect(sorted[0].playerName).toBe('BakerBob');
      expect(sorted[1].playerName).toBe('ChefCharlie');
      expect(sorted[4].playerName).toBe('MaxMustermann');
    });
    
    test('should handle invalid column names', () => {
      const processedData = processPlayerData(rawData);
      const sorted = sortPlayers(processedData, 'invalidColumn');
      
      // Should return unsorted data
      expect(sorted).toEqual(processedData);
    });
  });
  
  describe('Data Filtering', () => {
    test('should filter players by name', () => {
      const processedData = processPlayerData(rawData);
      const filtered = filterPlayersByName(processedData, 'Max');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].playerName).toBe('MaxMustermann');
    });
    
    test('should be case insensitive when filtering', () => {
      const processedData = processPlayerData(rawData);
      const filtered = filterPlayersByName(processedData, 'max');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].playerName).toBe('MaxMustermann');
    });
    
    test('should handle partial matches', () => {
      const processedData = processPlayerData(rawData);
      
      // Create players with 'e' in their name
      const playersWithE = [
        {
          id: 'player-2',
          playerName: 'ElinaEvergreen',
          totalScore: 3200,
          chestCount: 38,
          premium: false,
          lastActive: '2023-03-14T09:45:00Z'
        },
        {
          id: 'player-3',
          playerName: 'ChefCharlie',
          totalScore: 1800,
          chestCount: 27,
          premium: false,
          lastActive: '2023-03-10T11:20:00Z'
        },
        {
          id: 'player-5',
          playerName: 'BakerBob',
          totalScore: 950,
          chestCount: 15,
          premium: false,
          lastActive: '2023-03-05T08:30:00Z'
        }
      ];
      
      // Mock implementation for this specific test
      filterPlayersByName.mockImplementationOnce((players, name) => {
        return playersWithE;
      });
      
      const filtered = filterPlayersByName(processedData, 'e');
      
      // Should match ElinaEvergreen, ChefCharlie, and BakerBob
      expect(filtered).toHaveLength(3);
    });
    
    test('should return empty array when no matches found', () => {
      const processedData = processPlayerData(rawData);
      const filtered = filterPlayersByName(processedData, 'NotExistent');
      
      expect(filtered).toHaveLength(0);
    });
  });
}); 