/**
 * Jest Configuration
 * 
 * This file configures Jest for the ChefScore Analytics Dashboard tests.
 */

module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  
  // Setup files to run before each test file
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.js'],
  
  // Mock files for styles and static assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/helpers/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$': '<rootDir>/tests/helpers/fileMock.js'
  },
  
  // Don't transform node_modules except for certain packages
  transformIgnorePatterns: [
    '/node_modules/(?!(canvas)/)'
  ],
  
  // Global variables for tests
  globals: {
    IS_TEST_ENV: true
  },
  
  // Files to include in coverage reports
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  },
  
  // Mock functions and modules
  // This is particularly important for the Chart.js canvas context
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  
  // Mock specific modules
  moduleNameMapper: {
    '^canvas$': '<rootDir>/tests/helpers/canvasMock.js'
  }
}; 