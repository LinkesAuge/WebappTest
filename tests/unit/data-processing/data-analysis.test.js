/**
 * Data Analysis Tests
 * 
 * Tests for data analysis functionality in the ChefScore Analytics Dashboard.
 */

// Sample player data for testing
const testData = [
  {
    id: 'player-1',
    PLAYER: 'MaxMustermann',
    SCORE: 2500,
    CHESTS: 42,
    PREMIUM: 'true'
  },
  {
    id: 'player-2',
    PLAYER: 'ElinaEvergreen',
    SCORE: 3200,
    CHESTS: 38,
    PREMIUM: 'false'
  },
  {
    id: 'player-3',
    PLAYER: 'ChefCharlie',
    SCORE: 1800,
    CHESTS: 27,
    PREMIUM: 'false'
  },
  {
    id: 'player-4',
    PLAYER: 'DonnaDelicious',
    SCORE: 4100,
    CHESTS: 65,
    PREMIUM: 'true'
  },
  {
    id: 'player-5',
    PLAYER: 'BakerBob',
    SCORE: 950,
    CHESTS: 15,
    PREMIUM: 'false'
  }
];

// Import the functions from the consolidated module
import { filterPlayersByName, sortPlayerData } from '../../../js/dataProcessing.js';

describe('Data Analysis', () => {
  describe('Data Sorting', () => {
    test('should sort data by SCORE in descending order', () => {
      const sorted = sortPlayerData(testData, 'SCORE', 'desc');
      
      expect(sorted[0].PLAYER).toBe('DonnaDelicious');
      expect(sorted[1].PLAYER).toBe('ElinaEvergreen');
      expect(sorted[4].PLAYER).toBe('BakerBob');
    });
    
    test('should sort data by PLAYER in ascending order', () => {
      const sorted = sortPlayerData(testData, 'PLAYER', 'asc');
      
      expect(sorted[0].PLAYER).toBe('BakerBob');
      expect(sorted[1].PLAYER).toBe('ChefCharlie');
      expect(sorted[4].PLAYER).toBe('MaxMustermann');
    });
    
    test('should handle invalid column names', () => {
      const sorted = sortPlayerData(testData, 'invalidColumn');
      
      // Should use default sort by SCORE
      expect(sorted[0].SCORE).toBeGreaterThanOrEqual(sorted[1].SCORE);
    });
  });
  
  describe('Data Filtering', () => {
    test('should filter players by name', () => {
      const filtered = filterPlayersByName(testData, 'chef');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].PLAYER).toBe('ChefCharlie');
    });
    
    test('should be case insensitive when filtering', () => {
      const filtered = filterPlayersByName(testData, 'BAKER');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].PLAYER).toBe('BakerBob');
    });
    
    test('should handle partial matches', () => {
      const filtered = filterPlayersByName(testData, 'er');
      
      expect(filtered).toHaveLength(3); // BakerBob, ElinaEvergreen, MaxMustermann
    });
    
    test('should return empty array when no matches found', () => {
      const filtered = filterPlayersByName(testData, 'xyz');
      
      expect(filtered).toHaveLength(0);
    });
  });
}); 