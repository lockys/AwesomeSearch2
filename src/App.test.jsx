import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App.jsx';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => new Promise(() => {})),
  },
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(document.querySelector('.hack')).toBeTruthy();
  });

  it('applies light theme by default', () => {
    render(<App />);
    const hackDiv = document.querySelector('.hack');
    expect(hackDiv.className).toBe('hack');
  });

  it('applies dark theme when localStorage has isDark true', () => {
    localStorage.setItem('__isDark', 'true');
    render(<App />);
    const hackDiv = document.querySelector('.hack');
    expect(hackDiv.className).toContain('solarized-dark');
  });
});
