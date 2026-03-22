import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(document.querySelector('.hack')).toBeInTheDocument();
  });

  it('applies light theme by default', () => {
    render(<App />);
    const root = document.querySelector('.hack');
    expect(root.className).toBe('hack');
    expect(root.className).not.toContain('solarized-dark');
  });

  it('applies dark theme when localStorage __isDark is true', () => {
    localStorage.setItem('__isDark', 'true');
    render(<App />);
    const root = document.querySelector('.hack');
    expect(root.className).toContain('solarized-dark');
  });
});
