/**
 * Jest configuration file
 */

export default {
  // Test environment
  testEnvironment: 'jsdom',
  
  // File extensions to process
  moduleFileExtensions: ['js', 'jsx'],
  
  // Transform files
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    'app/**/*.js',
    '!app/index.js',
    '!**/node_modules/**'
  ],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Module name mapper for imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1'
  },
  
  // Verbose output
  verbose: true
}; 