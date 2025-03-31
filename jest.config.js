/**
 * Jest configuration for ChefScore Analytics Dashboard
 */

module.exports = {
  // Set the test environment to jsdom (browser-like environment)
  testEnvironment: 'jsdom',
  
  // Enable ES modules
  transform: {
    // Process JS files with babel-jest
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Setup files run before each test
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.js'],
  
  // Module file extensions for importing
  moduleFileExtensions: ['js', 'json'],
  
  // Module name mapper for CSS/SCSS imports
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/helpers/mocks.js',
  },
  
  // Directories where Jest should look for tests
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  
  // Display individual test results with the test suite hierarchy
  verbose: true,
  
  // Collect coverage information
  collectCoverageFrom: [
    'js/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
}; 