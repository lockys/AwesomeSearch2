import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import AwesomeSearch from './AwesomeSearch';

vi.mock('axios');

const mockSubjects = {
  'Node.js': [
    { name: 'awesome-nodejs', repo: 'sindresorhus/awesome-nodejs', cate: 'Node.js' },
    { name: 'awesome-npm', repo: 'sindresorhus/awesome-npm', cate: 'Node.js' },
  ],
  'Python': [
    { name: 'awesome-python', repo: 'vinta/awesome-python', cate: 'Python' },
  ],
};

const defaultProps = {
  onThemeChange: vi.fn(),
  isDark: false,
  theme: 'normal-theme',
};

const renderWithRouter = (props = {}) => {
  return render(
    <MemoryRouter>
      <AwesomeSearch {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe('AwesomeSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('shows spinner while loading data', () => {
    axios.get.mockReturnValue(new Promise(() => {}));
    renderWithRouter();
    expect(document.querySelector('.loading')).toBeInTheDocument();
  });

  it('renders list menu after data loads', async () => {
    axios.get.mockResolvedValueOnce({ data: mockSubjects });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument();
      expect(screen.getByText('Python')).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    axios.get.mockResolvedValueOnce({ data: mockSubjects });
    renderWithRouter();

    const input = screen.getByPlaceholderText('Try To Search Node.js');
    expect(input).toBeInTheDocument();
  });

  it('filters search results when typing', async () => {
    axios.get.mockResolvedValueOnce({ data: mockSubjects });
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Try To Search Node.js');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'python' } });

    await waitFor(() => {
      expect(screen.getByText('awesome-python')).toBeInTheDocument();
    });
  });

  it('shows error message on fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    renderWithRouter();

    await waitFor(() => {
      expect(document.querySelector('.loading')).toBeInTheDocument();
    });
  });
});
