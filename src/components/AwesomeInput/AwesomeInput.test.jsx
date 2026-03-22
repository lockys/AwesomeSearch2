import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AwesomeInput from './AwesomeInput.jsx';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AwesomeInput', () => {
  const defaultProps = {
    searchOnchange: vi.fn(),
    value: '',
    searchResult: [],
    searchInputOnFocus: vi.fn(),
    showResult: false,
    homeOnClick: vi.fn(),
  };

  it('renders search input', () => {
    renderWithRouter(<AwesomeInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search AwesomeList!')).toBeInTheDocument();
  });

  it('calls searchOnchange when typing', () => {
    renderWithRouter(<AwesomeInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search AwesomeList!');
    fireEvent.change(input, { target: { value: 'react' } });
    expect(defaultProps.searchOnchange).toHaveBeenCalled();
  });

  it('calls searchInputOnFocus on focus', () => {
    renderWithRouter(<AwesomeInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('Search AwesomeList!');
    fireEvent.focus(input);
    expect(defaultProps.searchInputOnFocus).toHaveBeenCalled();
  });

  it('shows placeholder when showResult is true but no results', () => {
    renderWithRouter(<AwesomeInput {...defaultProps} showResult={true} />);
    expect(screen.getByText('Type something to search')).toBeInTheDocument();
  });

  it('renders search results when provided', () => {
    const searchResult = [
      { item: { name: 'React', repo: 'sindresorhus/awesome-react', cate: 'Front-End' } },
      { item: { name: 'Node.js', repo: 'sindresorhus/awesome-nodejs', cate: 'Back-End' } },
    ];
    renderWithRouter(<AwesomeInput {...defaultProps} showResult={true} searchResult={searchResult} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });
});
