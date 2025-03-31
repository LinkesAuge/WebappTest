/**
 * Data Analysis Unit Tests
 * 
 * Tests for data processing, aggregation, sorting, and filtering functions.
 */

// Import mocked versions of the app functions
import { 
  processPlayerData, 
  calculateAggregateStats,
  sortPlayerData,
  filterPlayerData
} from '../../helpers/mock-app';

describe('Data Analysis', () => {
  let rawPlayerData;
  let processedData;
  let stats;

  beforeAll(() => {
    // Sample raw player data for testing
    rawPlayerData = [
      {
        id: 'player-1',
        name: 'MaxMustermann',
        score: '2500',
        chests: '42',
        premium: 'true',
        lastActive: '2023-03-15T14:30:00Z'
      },
      {
        id: 'player-2',
        name: 'ElinaEvergreen',
        score: '3200',
        chests: '38',
        premium: 'false',
        lastActive: '2023-03-14T09:45:00Z'
      },
      {
        id: 'player-3',
        name: 'ChefCharlie',
        score: '1800',
        chests: '27',
        premium: 'false',
        lastActive: '2023-03-10T11:20:00Z'
      },
      {
        id: 'player-4',
        name: 'DonnaDelicious',
        score: '4100',
        chests: '65',
        premium: 'true',
        lastActive: '2023-03-16T16:10:00Z'
      },
      {
        id: 'player-5',
        name: 'BakerBob',
        score: '950',
        chests: '15',
        premium: 'false',
        lastActive: '2023-03-05T08:30:00Z'
      }
    ];

    // Process the data as it would be in the main application
    processedData = processPlayerData(rawPlayerData);
  });

  describe('Data Processing', () => {
    test('should process raw player data into the correct format', () => {
      expect(processedData).toHaveLength(5);
      
      // Check first player
      expect(processedData[0]).toEqual(expect.objectContaining({
        id: 'player-1',
        playerName: 'MaxMustermann',
        totalScore: 2500,
        chestCount: 42,
        premium: true
      }));
      
      // Check data types
      expect(typeof processedData[0].totalScore).toBe('number');
      expect(typeof processedData[0].chestCount).toBe('number');
      expect(typeof processedData[0].premium).toBe('boolean');
    });

    test('should handle optional fields correctly', () => {
      // Create data with missing fields
      const incompleteData = [
        { name: 'PartialPlayer' } // Missing many fields
      ];
      
      const processed = processPlayerData(incompleteData);
      
      // Should still work with defaults
      expect(processed[0]).toEqual(expect.objectContaining({
        playerName: 'PartialPlayer',
        totalScore: 0,
        chestCount: 0,
        premium: false
      }));
    });

    test('should handle premium status correctly', () => {
      // Check premium players
      const premiumPlayers = processedData.filter(player => player.premium);
      expect(premiumPlayers).toHaveLength(2);
      expect(premiumPlayers[0].id).toBe('player-1');
      expect(premiumPlayers[1].id).toBe('player-4');
      
      // Check non-premium players
      const nonPremiumPlayers = processedData.filter(player => !player.premium);
      expect(nonPremiumPlayers).toHaveLength(3);
    });
  });

  describe('Aggregate Statistics', () => {
    beforeAll(() => {
      stats = calculateAggregateStats(processedData);
    });
    
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
      const sorted = sortPlayerData(processedData, 'totalScore', 'desc');
      
      expect(sorted[0].playerName).toBe('DonnaDelicious');
      expect(sorted[1].playerName).toBe('ElinaEvergreen');
      expect(sorted[2].playerName).toBe('MaxMustermann');
      expect(sorted[3].playerName).toBe('ChefCharlie');
      expect(sorted[4].playerName).toBe('BakerBob');
    });
    
    test('should sort data by playerName in ascending order', () => {
      const sorted = sortPlayerData(processedData, 'playerName', 'asc');
      
      expect(sorted[0].playerName).toBe('BakerBob');
      expect(sorted[1].playerName).toBe('ChefCharlie');
      expect(sorted[2].playerName).toBe('DonnaDelicious');
      expect(sorted[3].playerName).toBe('ElinaEvergreen');
      expect(sorted[4].playerName).toBe('MaxMustermann');
    });
    
    test('should handle invalid column names', () => {
      // When given an invalid column name, it should return unsorted data
      const sorted = sortPlayerData(processedData, 'invalidColumn');
      
      // The data should remain in the original order
      expect(sorted).toHaveLength(5);
      expect(sorted[0].id).toBe('player-1');
      expect(sorted[4].id).toBe('player-5');
    });
  });

  describe('Data Filtering', () => {
    test('should filter players by name', () => {
      const filtered = filterPlayerData(processedData, 'Chef');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].playerName).toBe('ChefCharlie');
    });
    
    test('should be case insensitive when filtering', () => {
      // Filter with lowercase
      const filtered1 = filterPlayerData(processedData, 'baker');
      expect(filtered1).toHaveLength(1);
      expect(filtered1[0].playerName).toBe('BakerBob');
      
      // Filter with uppercase
      const filtered2 = filterPlayerData(processedData, 'BAKER');
      expect(filtered2).toHaveLength(1);
      expect(filtered2[0].playerName).toBe('BakerBob');
    });
    
    test('should handle partial matches', () => {
      // Find players with 'e' in their name
      const filtered = filterPlayerData(processedData, 'e');
      
      // Should match ChefCharlie, ElinaEvergreen, BakerBob
      expect(filtered).toHaveLength(3);
    });
    
    test('should return empty array when no matches found', () => {
      const filtered = filterPlayerData(processedData, 'NonExistentName');
      
      expect(filtered).toHaveLength(0);
      expect(Array.isArray(filtered)).toBe(true);
    });
  });
}); 