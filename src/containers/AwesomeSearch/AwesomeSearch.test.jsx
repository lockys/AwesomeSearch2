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
    { name: 'React', repo: 'sindresorhus/awesome-react' },
    { name: 'Vue.js', repo: 'vuejs/awesome-vue' },
    { name: 'Angular', repo: 'PatrickJS/awesome-angular' },
  ],
  'Back-End': [
    { name: 'Node.js', repo: 'sindresorhus/awesome-nodejs' },
    { name: 'Django', repo: 'wsvincent/awesome-django' },
    { name: 'Rails', repo: 'gramantin/awesome-rails' },
  ],
};

describe('AwesomeSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows spinner while loading data', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders animated wordmark after data loads', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
  });

  it('renders category browse grid after data loads', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getAllByText('Front-End').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Back-End').length).toBeGreaterThan(0);
    });
  });

  it('shows indexed list and category counts in the home footer', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('6 lists indexed')).toBeInTheDocument();
      expect(screen.getByText('2 categories')).toBeInTheDocument();
    });
  });

  it('renders search input on home view', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });
  });

  it('switches to search results view when typing 2+ characters', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );

    const input = await screen.findByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Re' } });

    await waitFor(() => {
      expect(screen.getByTestId('search-results')).toBeInTheDocument();
    });
  });

  it('returns to the home view when back is clicked from search results', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );

    const input = await screen.findByTestId('search-input');
    fireEvent.change(input, { target: { value: 'React' } });

    await waitFor(() => {
      expect(screen.getByTestId('search-results')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Back to home' }));

    await waitFor(() => {
      expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
      expect(screen.getByText('6 lists indexed')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Back to home' })).not.toBeInTheDocument();
    });
  });

  it('shows matching results when query closely matches a list name', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );

    const input = await screen.findByTestId('search-input');
    fireEvent.change(input, { target: { value: 'React' } });

    await waitFor(() => {
      const links = screen.queryAllByTestId('search-result-link');
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveTextContent('React');
    });
  });

  it('shows empty state for query with no close matches', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );

    const input = await screen.findByTestId('search-input');
    fireEvent.change(input, { target: { value: 'zzz' } });

    expect(screen.queryAllByTestId('search-result-link')).toHaveLength(0);
  });

  it('does not auto-focus search input after clicking a category', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /Front-End/i }));

    await waitFor(() => {
      expect(screen.getByTestId('search-results')).toBeInTheDocument();
    });
    expect(screen.getByTestId('search-input')).not.toHaveFocus();
  });
});

