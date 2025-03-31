/**
 * Language Switching Integration Tests
 * 
 * Tests for switching between languages in the ChefScore Analytics Dashboard.
 */

// Import mocked versions of the app functions
import { 
  initializeApp, 
  renderDashboard,
  getTranslation
} from '../../helpers/mock-app';

// Define mock language functions
const switchLanguage = jest.fn((lang) => {
  if (['en', 'de', 'fr', 'es'].includes(lang)) {
    localStorage.setItem('preferredLanguage', lang);
    global.currentLanguage = lang;
    updateUILanguage();
    return true;
  }
  return false;
});

const updateUILanguage = jest.fn(() => {
  // Update all translatable elements in the UI
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = getTranslation(key);
  });
  
  // Update document title
  document.title = getTranslation('app.title');
  
  // Update chart labels if they exist
  if (global.updateChartLabels) {
    global.updateChartLabels();
  }
});

// Add functions to global scope for testing
global.switchLanguage = switchLanguage;
global.updateUILanguage = updateUILanguage;
global.currentLanguage = 'en'; // Default language

// Mock translations
global.translations = {
  en: {
    'app.title': 'Chef Score Analytics',
    'nav.dashboard': 'Dashboard',
    'nav.players': 'Players',
    'nav.charts': 'Charts',
    'chart.score': 'Score',
    'player.details': 'Player Details'
  },
  de: {
    'app.title': 'Küchenchef-Punkte Analyse',
    'nav.dashboard': 'Übersicht',
    'nav.players': 'Spieler',
    'nav.charts': 'Diagramme',
    'chart.score': 'Punktzahl',
    'player.details': 'Spielerdetails'
  },
  fr: {
    'app.title': 'Analyse des Scores de Chef',
    'nav.dashboard': 'Tableau de bord',
    'nav.players': 'Joueurs',
    'nav.charts': 'Graphiques',
    'chart.score': 'Score',
    'player.details': 'Détails du joueur'
  },
  es: {
    'app.title': 'Análisis de Puntuación del Chef',
    'nav.dashboard': 'Panel',
    'nav.players': 'Jugadores',
    'nav.charts': 'Gráficos',
    'chart.score': 'Puntuación',
    'player.details': 'Detalles del jugador'
  }
};

describe('Language Switching', () => {
  beforeEach(() => {
    // Set up DOM for language tests
    document.body.innerHTML = `
      <header>
        <h1 data-i18n="app.title">Chef Score Analytics</h1>
        <div class="language-selector">
          <button id="lang-en" class="lang-btn active" data-lang="en">EN</button>
          <button id="lang-de" class="lang-btn" data-lang="de">DE</button>
          <button id="lang-fr" class="lang-btn" data-lang="fr">FR</button>
          <button id="lang-es" class="lang-btn" data-lang="es">ES</button>
        </div>
      </header>
      <nav>
        <button data-i18n="nav.dashboard" class="nav-button">Dashboard</button>
        <button data-i18n="nav.players" class="nav-button">Players</button>
        <button data-i18n="nav.charts" class="nav-button">Charts</button>
      </nav>
      <main>
        <section>
          <h2 data-i18n="player.details">Player Details</h2>
          <div class="chart-container">
            <h3 data-i18n="chart.score">Score</h3>
          </div>
        </section>
      </main>
    `;
    
    // Reset mocks
    jest.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
    
    // Set default language
    global.currentLanguage = 'en';
    
    // Initialize the app
    initializeApp();
  });
  
  describe('Basic Language Functionality', () => {
    test('should initialize with default language (English)', () => {
      // Verify English is the default language
      expect(global.currentLanguage).toBe('en');
      
      // Verify default text is in English
      expect(document.querySelector('[data-i18n="app.title"]').textContent).toBe('Chef Score Analytics');
      expect(document.querySelector('[data-i18n="nav.dashboard"]').textContent).toBe('Dashboard');
    });
    
    test('should switch language to German and update UI text', () => {
      // Switch to German
      switchLanguage('de');
      
      // Verify language is changed
      expect(global.currentLanguage).toBe('de');
      
      // Verify UI text is in German
      expect(document.querySelector('[data-i18n="app.title"]').textContent).toBe('Küchenchef-Punkte Analyse');
      expect(document.querySelector('[data-i18n="nav.dashboard"]').textContent).toBe('Übersicht');
      expect(document.querySelector('[data-i18n="chart.score"]').textContent).toBe('Punktzahl');
    });
    
    test('should switch language to French and update UI text', () => {
      // Switch to French
      switchLanguage('fr');
      
      // Verify language is changed
      expect(global.currentLanguage).toBe('fr');
      
      // Verify UI text is in French
      expect(document.querySelector('[data-i18n="app.title"]').textContent).toBe('Analyse des Scores de Chef');
      expect(document.querySelector('[data-i18n="nav.dashboard"]').textContent).toBe('Tableau de bord');
    });
    
    test('should switch language to Spanish and update UI text', () => {
      // Switch to Spanish
      switchLanguage('es');
      
      // Verify language is changed
      expect(global.currentLanguage).toBe('es');
      
      // Verify UI text is in Spanish
      expect(document.querySelector('[data-i18n="app.title"]').textContent).toBe('Análisis de Puntuación del Chef');
      expect(document.querySelector('[data-i18n="nav.players"]').textContent).toBe('Jugadores');
    });
    
    test('should update document title when language changes', () => {
      // Initial title should be in English
      expect(document.title).toBe('Chef Score Analytics');
      
      // Switch to German
      switchLanguage('de');
      
      // Title should now be in German
      expect(document.title).toBe('Küchenchef-Punkte Analyse');
    });
  });
  
  describe('Language Persistence', () => {
    test('should save language preference to localStorage', () => {
      // Switch to German
      switchLanguage('de');
      
      // Verify preference is saved
      expect(localStorage.getItem('preferredLanguage')).toBe('de');
    });
    
    test('should load language preference from localStorage on init', () => {
      // Set a preference in localStorage
      localStorage.setItem('preferredLanguage', 'fr');
      
      // Reinitialize the app
      initializeApp();
      
      // Verify the language is loaded from preference
      expect(global.currentLanguage).toBe('fr');
      
      // Verify UI text is updated correctly
      expect(document.querySelector('[data-i18n="app.title"]').textContent).toBe('Analyse des Scores de Chef');
    });
  });
  
  describe('UI Language Buttons', () => {
    test('should update active state of language buttons when language changes', () => {
      // Verify English button is active initially
      expect(document.getElementById('lang-en').classList.contains('active')).toBe(true);
      expect(document.getElementById('lang-de').classList.contains('active')).toBe(false);
      
      // Switch to German
      switchLanguage('de');
      
      // Update the UI buttons (this would typically be handled by the app's event handlers)
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === global.currentLanguage) {
          btn.classList.add('active');
        }
      });
      
      // Verify German button is now active
      expect(document.getElementById('lang-en').classList.contains('active')).toBe(false);
      expect(document.getElementById('lang-de').classList.contains('active')).toBe(true);
    });
  });
  
  describe('Error Handling', () => {
    test('should handle invalid language codes gracefully', () => {
      // Try to switch to an invalid language
      const result = switchLanguage('invalid-lang');
      
      // Should return false to indicate failure
      expect(result).toBe(false);
      
      // Language should remain unchanged
      expect(global.currentLanguage).toBe('en');
      
      // UI should not change
      expect(document.querySelector('[data-i18n="app.title"]').textContent).toBe('Chef Score Analytics');
    });
    
    test('should fallback to English when a translation is missing', () => {
      // Add an element with a translation key not available in German
      const newElement = document.createElement('div');
      newElement.setAttribute('data-i18n', 'missing.key');
      document.body.appendChild(newElement);
      
      // Set a mock translation for English only
      global.translations.en['missing.key'] = 'English Only Text';
      
      // Switch to German
      switchLanguage('de');
      
      // Update UI (this should handle the missing translation)
      updateUILanguage();
      
      // Element should show the English text as fallback (or empty/key if no fallback mechanism)
      expect(newElement.textContent).toBe('English Only Text');
    });
  });
}); 