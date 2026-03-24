import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AwesomeSearch from './AwesomeSearch.jsx';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

import axios from 'axios';

const mockSubjects = {
  'Front-End': [
    { name: 'React', repo: 'sindresorhus/awesome-react', cate: 'Front-End' },
    { name: 'Vue.js', repo: 'vuejs/awesome-vue', cate: 'Front-End' },
    { name: 'Angular', repo: 'PatrickJS/awesome-angular', cate: 'Front-End' },
  ],
  'Back-End': [
    { name: 'Node.js', repo: 'sindresorhus/awesome-nodejs', cate: 'Back-End' },
    { name: 'Django', repo: 'wsvincent/awesome-django', cate: 'Back-End' },
    { name: 'Rails', repo: 'gramantin/awesome-rails', cate: 'Back-End' },
  ],
};

const defaultProps = {
  onThemeChange: vi.fn(),
  isDark: false,
  theme: 'normal-theme',
};

describe('AwesomeSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading data', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders search input', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search AwesomeLists!')).toBeInTheDocument();
    });
  });

  it('renders menu after data loads', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByText('Front-End').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Back-End').length).toBeGreaterThan(0);
    });
  });

  it('renders theme toggle button', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /switch to dark mode/i }).length).toBeGreaterThan(0);
    });
  });

  it('renders burger menu button', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument();
    });
  });

  it('does not show search results when only one character is typed', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );

    // Wait for data to load
    const input = await screen.findByPlaceholderText('Search AwesomeLists!');

    // Type a single character
    fireEvent.change(input, { target: { value: 'R' } });

    // No search result links should be visible
    expect(screen.queryAllByTestId('search-result-link')).toHaveLength(0);
  });

  it('shows matching results when query closely matches a list name', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText('Search AwesomeLists!');

    fireEvent.change(input, { target: { value: 'React' } });

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /React/i })).toBeInTheDocument();
    });
  });

  it('does not show results for a query with no close matches', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );

    const input = await screen.findByPlaceholderText('Search AwesomeLists!');

    fireEvent.change(input, { target: { value: 'zzz' } });

    // No search result links should appear at all
    expect(screen.queryAllByTestId('search-result-link')).toHaveLength(0);
  });
});
