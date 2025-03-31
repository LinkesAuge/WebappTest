/**
 * CSV Parsing Tests
 * 
 * Tests for CSV parsing functionality in the ChefScore Analytics Dashboard.
 */

// Import mock app functions
import * as mockApp from '../../helpers/mock-app';

// Get direct reference to the function
const parseCsvData = mockApp.parseCsvData;

describe('CSV Parsing', () => {
  // Sample valid CSV data for testing
  const validCsvData = `playerName,totalScore,chestCount,premium,lastActive
Chef Alex,980,45,true,2023-01-15
Chef Bailey,820,32,false,2023-01-14
Chef Charlie,1240,53,true,2023-01-13`;

  // Sample malformed CSV data for testing
  const malformedCsvData = `playerName,totalScore,chestCount,premium
Chef Alex,980,45,true,2023-01-15
Chef Bailey,missing,32`;

  // CSV without headers
  const csvWithoutHeaders = `Chef Alex,980,45,true,2023-01-15
Chef Bailey,820,32,false,2023-01-14`;

  describe('Basic Parsing', () => {
    test('should parse valid CSV data correctly', () => {
      const result = parseCsvData(validCsvData);
      
      // Check structure
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.errors).toBeDefined();
      
      // Check data size
      expect(result.data.length).toBe(3);
      
      // Check first row
      const firstRow = result.data[0];
      expect(firstRow.playerName).toBe('Chef Alex');
      expect(firstRow.totalScore).toBe(980);
      expect(firstRow.chestCount).toBe(45);
    });
    
    test('should extract correct headers from CSV', () => {
      const result = parseCsvData(validCsvData);
      
      // Check headers
      expect(result.meta.fields).toContain('playerName');
      expect(result.meta.fields).toContain('totalScore');
      expect(result.meta.fields).toContain('chestCount');
      expect(result.meta.fields).toContain('premium');
      expect(result.meta.fields).toContain('lastActive');
    });
    
    test('should handle number conversions correctly', () => {
      const result = parseCsvData(validCsvData);
      
      // Check number parsing
      const secondRow = result.data[1];
      expect(typeof secondRow.totalScore).toBe('number');
      expect(secondRow.totalScore).toBe(820);
      expect(typeof secondRow.chestCount).toBe('number');
      expect(secondRow.chestCount).toBe(32);
    });
    
    test('should handle boolean values correctly', () => {
      const result = parseCsvData(validCsvData);
      
      // Check boolean parsing
      const premiumPlayer = result.data[0]; // Chef Alex (premium)
      const standardPlayer = result.data[1]; // Chef Bailey (standard)
      
      expect(typeof premiumPlayer.premium).toBe('boolean');
      expect(premiumPlayer.premium).toBe(true);
      expect(typeof standardPlayer.premium).toBe('boolean');
      expect(standardPlayer.premium).toBe(false);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle malformed CSV data gracefully', () => {
      expect(() => {
        const result = parseCsvData(malformedCsvData);
        
        // Even with malformed data, we should get some kind of result
        expect(result).toBeDefined();
        expect(result.data).toBeDefined();
        
        // Errors should be reported
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBeGreaterThan(0);
      }).not.toThrow();
    });
    
    test('should handle empty CSV data', () => {
      expect(() => {
        const result = parseCsvData('');
        
        // The result should indicate an empty dataset
        expect(result).toBeDefined();
        expect(result.data.length).toBe(0);
        
        // An error might be returned
        expect(result.errors).toBeDefined();
      }).not.toThrow();
    });
    
    test('should handle CSV data with missing headers', () => {
      expect(() => {
        const result = parseCsvData(csvWithoutHeaders);
        
        // The result should be defined, but might contain errors
        expect(result).toBeDefined();
        expect(result.errors).toBeDefined();
      }).not.toThrow();
    });
  });
}); 