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
          <AwesomeReadme setMdHandler={vi.fn()} {...props} />
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
    expect(screen.getByText(/waiting for content loading/i)).toBeInTheDocument();
  });

  it('renders View On Github link', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    const link = screen.getByText('GitHub');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('https://github.com/sindresorhus/awesome-nodejs');
  });

  it('renders Content (TOC) button', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    expect(screen.getByText('Contents')).toBeInTheDocument();
  });

  it('displays repo name', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderReadme();
    expect(screen.getByText('awesome-nodejs')).toBeInTheDocument();
  });
});
