import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route } from 'react-router-dom';
import axios from 'axios';
import AwesomeReadme from './AwesomeReadme';

vi.mock('axios');

const renderWithRoute = (user = 'sindresorhus', repo = 'awesome-nodejs') => {
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
    renderWithRoute();
    expect(screen.getByText(/Waiting for content loading/)).toBeInTheDocument();
  });

  it('displays README content after fetch', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('api.awesomelists.top')) {
        return Promise.resolve({ data: '<p>Node.js resources</p>' });
      }
      if (url.includes('api.github.com')) {
        return Promise.resolve({
          data: { stargazers_count: 1234, pushed_at: '2024-01-01T00:00:00Z' },
          headers: { 'last-modified': 'Mon, 01 Jan 2024 00:00:00 GMT' },
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText('Node.js resources')).toBeInTheDocument();
    });
  });

  it('shows error on API failure (403)', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('api.awesomelists.top')) {
        return Promise.reject({ response: { status: 403 } });
      }
      if (url.includes('api.github.com')) {
        return Promise.reject({ response: { status: 403 } });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText(/Github API rate limit exceeds/)).toBeInTheDocument();
    });
  });

  it('fixes relative image URLs in README', async () => {
    const htmlWithRelativeImg = '<p><img src="images/logo.png" alt="logo"></p>';
    axios.get.mockImplementation((url) => {
      if (url.includes('api.awesomelists.top')) {
        return Promise.resolve({ data: htmlWithRelativeImg });
      }
      if (url.includes('api.github.com')) {
        return Promise.resolve({
          data: { stargazers_count: 0, pushed_at: null },
          headers: { 'last-modified': null },
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    renderWithRoute();

    await waitFor(() => {
      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img.getAttribute('src')).toContain('raw.githubusercontent.com');
      expect(img.getAttribute('src')).toContain('images/logo.png');
    });
  });
});
