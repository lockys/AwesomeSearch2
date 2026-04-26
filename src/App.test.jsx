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
    expect(screen.getByTestId('awesome-search')).toBeInTheDocument();
  });

  it('renders the footer status bar', () => {
    render(<App />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('shows spinner while data loads', () => {
    render(<App />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
