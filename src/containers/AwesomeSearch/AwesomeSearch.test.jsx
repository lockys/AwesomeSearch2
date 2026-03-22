import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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
  ],
  'Back-End': [
    { name: 'Node.js', repo: 'sindresorhus/awesome-nodejs', cate: 'Back-End' },
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
    expect(document.querySelector('.loading')).toBeTruthy();
  });

  it('renders search input', async () => {
    axios.get.mockResolvedValue({ data: mockSubjects });
    render(
      <MemoryRouter>
        <AwesomeSearch {...defaultProps} />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search AwesomeList!')).toBeInTheDocument();
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
      expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
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
});
