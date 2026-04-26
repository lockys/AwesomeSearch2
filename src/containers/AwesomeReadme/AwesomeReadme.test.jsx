import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { vi } from 'vitest';
import AwesomeReadme from './AwesomeReadme.jsx';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from 'axios';

const renderReadme = (user = 'sindresorhus', repo = 'awesome-nodejs') => {
  return render(
    <MemoryRouter initialEntries={[`/${user}/${repo}`]}>
      <Route
        path="/:user/:repo"
        render={(props) => (
          <AwesomeReadme {...props} onBack={vi.fn()} />
        )}
      />
    </MemoryRouter>
  );
};

describe('AwesomeReadme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows loading state initially', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    expect(screen.getByTestId('readme-skeleton')).toBeInTheDocument();
  });

  it('renders View on GitHub link', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    const link = screen.getByTestId('view-on-github');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('https://github.com/sindresorhus/awesome-nodejs');
  });

  it('renders TOC outline sidebar', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    expect(screen.getByText('Outline')).toBeInTheDocument();
  });

  it('displays repo name', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    expect(screen.getByText('awesome-nodejs')).toBeInTheDocument();
  });

  it('shows scroll progress label at the bottom area', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    expect(screen.getByTestId('readme-scroll-progress')).toHaveTextContent('Scrolled: 0%');
  });
});
