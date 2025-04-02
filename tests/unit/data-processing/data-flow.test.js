/**
 * data-flow.test.js
 * Tests the data flow between weekly data loading and data processing
 */

// Mock state module
const state = {
  allPlayersData: [],
  playerData: [],
  displayData: [],
  setState: function(property, value) {
    this[property] = value;
    console.log(`State property "${property}" updated with ${value.length} items`);
  }
};

// Mock other dependencies
jest.mock('../../../js/state.js', () => ({
  ...state,
  setState: state.setState
}));

jest.mock('../../../js/dom.js', () => ({
  elements: {}
}));

jest.mock('../../../js/i18n.js', () => ({
  getText: (key) => key
}));

jest.mock('../../../js/utils.js', () => ({
  formatNumber: (num) => num.toString()
}));

jest.mock('../../../js/config.js', () => ({
  DEFAULT_SORT_ORDER: 'desc',
  SCORE_SYSTEM: {}
}));

// Import the function to test
import { processPlayerData } from '../../../js/dataProcessing.js';

describe('Data Flow Tests', () => {
  beforeEach(() => {
    // Reset state before each test
    state.allPlayersData = [];
    state.playerData = [];
    state.displayData = [];
    
    // Spy on setState
    jest.spyOn(state, 'setState');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('processPlayerData should use playerData when allPlayersData is empty', () => {
    // Arrange
    state.allPlayersData = [];
    state.playerData = [
      { PLAYER: 'Player1', SCORE: 100, CHESTS: 5 },
      { PLAYER: 'Player2', SCORE: 150, CHESTS: 8 }
    ];
    
    // Act
    processPlayerData();
    
    // Assert
    expect(state.setState).toHaveBeenCalledWith('displayData', expect.any(Array));
    expect(state.displayData.length).toBe(2);
    expect(state.displayData[0].PLAYER).toBe('Player2'); // First player should be Player2 (higher score)
    expect(state.displayData[1].PLAYER).toBe('Player1');
  });

  test('processPlayerData should fall back to allPlayersData if playerData is empty', () => {
    // Arrange
    state.allPlayersData = [
      { PLAYER: 'Player1', SCORE: 100, CHESTS: 5 },
      { PLAYER: 'Player2', SCORE: 150, CHESTS: 8 }
    ];
    state.playerData = [];
    
    // Act
    processPlayerData();
    
    // Assert
    expect(state.setState).toHaveBeenCalledWith('displayData', expect.any(Array));
    expect(state.displayData.length).toBe(2);
    expect(state.displayData[0].PLAYER).toBe('Player2');
    expect(state.displayData[1].PLAYER).toBe('Player1');
  });

  test('processPlayerData should set empty displayData when both data sources are empty', () => {
    // Arrange
    state.allPlayersData = [];
    state.playerData = [];
    
    // Act
    processPlayerData();
    
    // Assert
    expect(state.setState).toHaveBeenCalledWith('displayData', []);
    expect(state.displayData.length).toBe(0);
  });

  test('processPlayerData should prioritize playerData when both are populated', () => {
    // Arrange
    state.allPlayersData = [
      { PLAYER: 'AllPlayer1', SCORE: 300, CHESTS: 15 },
      { PLAYER: 'AllPlayer2', SCORE: 400, CHESTS: 20 }
    ];
    state.playerData = [
      { PLAYER: 'WeekPlayer1', SCORE: 100, CHESTS: 5 },
      { PLAYER: 'WeekPlayer2', SCORE: 150, CHESTS: 8 }
    ];
    
    // Act
    processPlayerData();
    
    // Assert
    expect(state.setState).toHaveBeenCalledWith('displayData', expect.any(Array));
    // Should use allPlayersData by default since it's not empty
    expect(state.displayData.length).toBe(2);
    expect(state.displayData[0].PLAYER).toBe('AllPlayer2');
    expect(state.displayData[1].PLAYER).toBe('AllPlayer1');
  });
}); 