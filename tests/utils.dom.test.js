/**
 * Tests for DOM-related utility functions
 */

import {
  setStatus,
  showLoading,
  hideLoading,
  updateSortIcons,
  getCssVariableValue
} from '../app/utils.js';

// Mock DOM elements
beforeEach(() => {
  document.body.innerHTML = `
    <div id="status-area">
      <span id="status-message"></span>
    </div>
    <div id="loading-spinner" class="hidden"></div>
    <table>
      <thead>
        <tr>
          <th data-column="name">
            Name <span class="sort-icon"></span>
          </th>
          <th data-column="score">
            Score <span class="sort-icon"></span>
          </th>
        </tr>
      </thead>
    </table>
  `;
});

describe('setStatus', () => {
  test('sets status message', () => {
    setStatus('Test message');
    expect(document.getElementById('status-message').textContent).toBe('Test message');
  });

  test('applies correct color class for error', () => {
    setStatus('Error message', 'error');
    expect(document.getElementById('status-area').classList.contains('text-red-500')).toBe(true);
  });

  test('applies correct color class for success', () => {
    setStatus('Success message', 'success');
    expect(document.getElementById('status-area').classList.contains('text-green-500')).toBe(true);
  });

  test('clears message after duration', (done) => {
    setStatus('Test message', 'info', 100);
    setTimeout(() => {
      expect(document.getElementById('status-message').textContent).toBe('');
      done();
    }, 150);
  });
});

describe('showLoading/hideLoading', () => {
  test('shows loading spinner', () => {
    showLoading();
    expect(document.getElementById('loading-spinner').classList.contains('hidden')).toBe(false);
  });

  test('shows loading message', () => {
    showLoading('Custom loading message');
    expect(document.getElementById('status-message').textContent).toBe('Custom loading message');
  });

  test('hides loading spinner', () => {
    showLoading();
    hideLoading();
    expect(document.getElementById('loading-spinner').classList.contains('hidden')).toBe(true);
  });
});

describe('updateSortIcons', () => {
  test('updates sort icon for active column ascending', () => {
    updateSortIcons('name', 'asc', 'th');
    const nameIcon = document.querySelector('[data-column="name"] .sort-icon');
    expect(nameIcon.textContent).toBe('▲');
    expect(nameIcon.classList.contains('text-primary')).toBe(true);
  });

  test('updates sort icon for active column descending', () => {
    updateSortIcons('score', 'desc', 'th');
    const scoreIcon = document.querySelector('[data-column="score"] .sort-icon');
    expect(scoreIcon.textContent).toBe('▼');
    expect(scoreIcon.classList.contains('text-primary')).toBe(true);
  });

  test('clears sort icons for inactive columns', () => {
    updateSortIcons('name', 'asc', 'th');
    const scoreIcon = document.querySelector('[data-column="score"] .sort-icon');
    expect(scoreIcon.textContent).toBe('');
    expect(scoreIcon.classList.contains('text-primary')).toBe(false);
  });
});

describe('getCssVariableValue', () => {
  beforeEach(() => {
    document.body.style.setProperty('--test-color', '#ff0000');
  });

  test('gets CSS variable value', () => {
    expect(getCssVariableValue('test-color')).toBe('#ff0000');
  });

  test('returns fallback for missing variable', () => {
    expect(getCssVariableValue('missing-color', '#ffffff')).toBe('#ffffff');
  });
}); 