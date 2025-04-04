/**
 * Tests for utility functions
 */

import {
  filterData,
  validateData,
  calculatePercentage,
  normalizeValue,
  getNestedValue,
  generateId,
  sortData,
  formatNumber
} from '../app/utils.js';

describe('filterData', () => {
  const testData = [
    { name: 'John', score: 100 },
    { name: 'Jane', score: 200 },
    { name: 'Bob', score: 150 }
  ];

  test('filters data based on search term', () => {
    const result = filterData(testData, 'jo', ['name']);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('John');
  });

  test('returns all data when search term is empty', () => {
    const result = filterData(testData, '', ['name']);
    expect(result).toEqual(testData);
  });

  test('handles case insensitive search', () => {
    const result = filterData(testData, 'JANE', ['name']);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Jane');
  });
});

describe('validateData', () => {
  test('validates object with required fields', () => {
    const data = { name: 'John', age: 30 };
    expect(validateData(data, ['name', 'age'])).toBe(true);
  });

  test('returns false when required field is missing', () => {
    const data = { name: 'John' };
    expect(validateData(data, ['name', 'age'])).toBe(false);
  });

  test('returns false for null/undefined values', () => {
    const data = { name: null, age: undefined };
    expect(validateData(data, ['name', 'age'])).toBe(false);
  });
});

describe('calculatePercentage', () => {
  test('calculates correct percentage', () => {
    expect(calculatePercentage(50, 200)).toBe('25.0%');
  });

  test('handles zero total', () => {
    expect(calculatePercentage(50, 0)).toBe('0%');
  });

  test('respects decimal places', () => {
    expect(calculatePercentage(33, 100, 2)).toBe('33.00%');
  });
});

describe('normalizeValue', () => {
  test('normalizes value in range', () => {
    expect(normalizeValue(50, 0, 100)).toBe(0.5);
  });

  test('handles equal min/max', () => {
    expect(normalizeValue(50, 50, 50)).toBe(0);
  });

  test('handles value at min/max', () => {
    expect(normalizeValue(0, 0, 100)).toBe(0);
    expect(normalizeValue(100, 0, 100)).toBe(1);
  });
});

describe('getNestedValue', () => {
  const obj = {
    user: {
      profile: {
        name: 'John'
      }
    }
  };

  test('gets nested value', () => {
    expect(getNestedValue(obj, 'user.profile.name')).toBe('John');
  });

  test('returns default for invalid path', () => {
    expect(getNestedValue(obj, 'user.invalid.path', 'default')).toBe('default');
  });

  test('handles null object', () => {
    expect(getNestedValue(null, 'any.path', 'default')).toBe('default');
  });
});

describe('generateId', () => {
  test('generates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  test('generates string IDs', () => {
    expect(typeof generateId()).toBe('string');
  });
});

describe('sortData', () => {
  const testData = [
    { PLAYER: 'John', TOTAL_SCORE: 100 },
    { PLAYER: 'Jane', TOTAL_SCORE: 200 },
    { PLAYER: 'Bob', TOTAL_SCORE: 150 }
  ];

  test('sorts by player name ascending', () => {
    const sorted = sortData('PLAYER', 'asc', false, [...testData]);
    expect(sorted[0].PLAYER).toBe('Bob');
    expect(sorted[2].PLAYER).toBe('John');
  });

  test('sorts by score descending', () => {
    const sorted = sortData('TOTAL_SCORE', 'desc', false, [...testData]);
    expect(sorted[0].TOTAL_SCORE).toBe(200);
    expect(sorted[2].TOTAL_SCORE).toBe(100);
  });

  test('handles missing values', () => {
    const data = [
      { PLAYER: 'John', TOTAL_SCORE: 100 },
      { PLAYER: 'Jane' },
      { PLAYER: 'Bob', TOTAL_SCORE: 150 }
    ];
    const sorted = sortData('TOTAL_SCORE', 'desc', false, [...data]);
    expect(sorted[0].TOTAL_SCORE).toBe(150);
    expect(sorted[1].TOTAL_SCORE).toBe(100);
  });
});

describe('formatNumber', () => {
  test('formats number with thousands separator using German format', () => {
    expect(formatNumber(1000)).toBe('1.000');
  });

  test('formats decimal number with exact decimal places', () => {
    expect(formatNumber(1000.567, 1)).toBe('1.000,6');
    expect(formatNumber(1000.567, 2)).toBe('1.000,57');
  });

  test('rounds to integer by default', () => {
    expect(formatNumber(1000.5)).toBe('1.001');
  });

  test('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
}); 