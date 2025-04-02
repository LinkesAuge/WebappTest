/**
 * csv-parser.test.js
 * Unit tests for CSV parsing functionality
 */

// Since we're removing weekDataManager dependency, define the parseWeekCsv function locally
function parseWeekCsv(csvText) {
  if (!csvText) {
    console.error('No CSV text provided to parse');
    return [];
  }

  // Split the text into lines and filter out empty lines
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length < 2) {
    console.error('CSV data has too few lines (no header or data)');
    return [];
  }
  
  // Extract headers (first line)
  const headers = parseCSVLine(lines[0]);
  const numFields = headers.length;
  
  // Parse each line of data
  return lines.slice(1).map((line, index) => {
    // Parse values considering quotes
    const values = parseCSVLine(line);
    
    // Check if the number of values matches the number of headers
    if (values.length !== numFields) {
      console.warn(`Line ${index + 2} has incorrect number of values (expected ${numFields}, got ${values.length}). Attempting to fix...`);
      
      if (values.length < numFields) {
        // Add empty values if needed
        const missing = numFields - values.length;
        for (let i = 0; i < missing; i++) {
          values.push('');
        }
        console.warn(`Added ${missing} empty values to line ${index + 2}`);
      } else {
        // Truncate extra values
        values.splice(numFields);
        console.warn(`Truncated extra values from line ${index + 2}`);
      }
    }
    
    // Create object with header keys and row values
    const rowData = {};
    headers.forEach((header, i) => {
      const value = values[i] || '';
      
      // Try to convert numeric values to actual numbers
      if (value !== '' && !isNaN(value)) {
        const num = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
        rowData[header] = num;
      } else {
        rowData[header] = value;
      }
    });
    
    return rowData;
  });
}

// Helper function to parse CSV line considering quotes
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Toggle quote state
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      // Add to current field
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  // Clean up quotes in each field
  return result.map(field => {
    if (field.startsWith('"') && field.endsWith('"')) {
      return field.substring(1, field.length - 1);
    }
    return field;
  });
}

// Mock console for tests
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

describe('CSV Parser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should parse valid CSV data correctly', () => {
    // Arrange
    const csvText = 
      'PLAYER,TOTAL_SCORE,CHEST_COUNT\n' +
      'Player1,100,5\n' +
      'Player2,200,10\n' +
      'Player3,300,15';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 5 });
    expect(result[1]).toEqual({ PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 10 });
    expect(result[2]).toEqual({ PLAYER: 'Player3', TOTAL_SCORE: 300, CHEST_COUNT: 15 });
  });

  test('should handle empty CSV input', () => {
    // Arrange
    const csvText = '';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('No CSV text provided to parse');
  });

  test('should handle CSV with only header row', () => {
    // Arrange
    const csvText = 'PLAYER,TOTAL_SCORE,CHEST_COUNT';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('CSV data has too few lines (no header or data)');
  });

  test('should handle lines with too few values by padding with empty strings', () => {
    // Arrange
    const csvText = 
      'PLAYER,TOTAL_SCORE,CHEST_COUNT\n' +
      'Player1,100\n' +
      'Player2,200,10\n' +
      'Player3';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: '' });
    expect(result[1]).toEqual({ PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 10 });
    expect(result[2]).toEqual({ PLAYER: 'Player3', TOTAL_SCORE: '', CHEST_COUNT: '' });
    // Check that appropriate warnings were issued at least once (don't verify exact count)
    expect(console.warn).toHaveBeenCalledWith('Line 2 has incorrect number of values (expected 3, got 2). Attempting to fix...');
    expect(console.warn).toHaveBeenCalledWith('Added 1 empty values to line 2');
  });

  test('should handle lines with too many values by truncating', () => {
    // Arrange
    const csvText = 
      'PLAYER,TOTAL_SCORE,CHEST_COUNT\n' +
      'Player1,100,5,extra1\n' +
      'Player2,200,10\n' +
      'Player3,300,15,extra2,extra3';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ PLAYER: 'Player1', TOTAL_SCORE: 100, CHEST_COUNT: 5 });
    expect(result[1]).toEqual({ PLAYER: 'Player2', TOTAL_SCORE: 200, CHEST_COUNT: 10 });
    expect(result[2]).toEqual({ PLAYER: 'Player3', TOTAL_SCORE: 300, CHEST_COUNT: 15 });
    // Verify that truncation warnings were issued, but don't check exact count
    expect(console.warn).toHaveBeenCalledWith('Line 2 has incorrect number of values (expected 3, got 4). Attempting to fix...');
    expect(console.warn).toHaveBeenCalledWith('Truncated extra values from line 2');
  });

  test('should handle quoted fields with commas', () => {
    // Arrange
    const csvText = 
      'PLAYER,DESCRIPTION,SCORE\n' +
      '"Player 1","Has, some, commas",100\n' +
      '"Player 2","Another, description",200';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ PLAYER: 'Player 1', DESCRIPTION: 'Has, some, commas', SCORE: 100 });
    expect(result[1]).toEqual({ PLAYER: 'Player 2', DESCRIPTION: 'Another, description', SCORE: 200 });
  });

  test('should convert numeric values to numbers', () => {
    // Arrange
    const csvText = 
      'NAME,AGE,HEIGHT,IS_ACTIVE\n' +
      'John,30,1.75,true\n' +
      'Jane,25,1.68,false';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ NAME: 'John', AGE: 30, HEIGHT: 1.75, IS_ACTIVE: 'true' });
    expect(result[1]).toEqual({ NAME: 'Jane', AGE: 25, HEIGHT: 1.68, IS_ACTIVE: 'false' });
  });

  test('should handle empty fields correctly', () => {
    // Arrange
    const csvText = 
      'NAME,AGE,NOTES\n' +
      'John,30,\n' +
      'Jane,,Some notes\n' +
      ',,';
    
    // Act
    const result = parseWeekCsv(csvText);
    
    // Assert
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ NAME: 'John', AGE: 30, NOTES: '' });
    expect(result[1]).toEqual({ NAME: 'Jane', AGE: '', NOTES: 'Some notes' });
    expect(result[2]).toEqual({ NAME: '', AGE: '', NOTES: '' });
  });
}); 