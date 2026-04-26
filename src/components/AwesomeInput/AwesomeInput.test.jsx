import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AwesomeInput from './AwesomeInput.jsx';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AwesomeInput (SearchView)', () => {
  const defaultProps = {
    query: '',
    setQuery: vi.fn(),
    results: [],
    onOpen: vi.fn(),
    onClear: vi.fn(),
  };

  it('renders search input', () => {
    renderWithRouter(<AwesomeInput {...defaultProps} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('calls setQuery when typing', () => {
    renderWithRouter(<AwesomeInput {...defaultProps} />);
    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'react' } });
    expect(defaultProps.setQuery).toHaveBeenCalledWith('react');
  });

  it('shows empty state when query has no results', () => {
    renderWithRouter(
      <AwesomeInput {...defaultProps} query="zzz" results={[]} />
    );
    expect(screen.getByText(/No matches for/)).toBeInTheDocument();
  });

  it('renders search result items when results are provided', () => {
    const results = [
      { item: { name: 'React', repo: 'sindresorhus/awesome-react', cate: 'Front-End' }, score: 0.05 },
      { item: { name: 'Node.js', repo: 'sindresorhus/awesome-nodejs', cate: 'Back-End' }, score: 0.1 },
    ];
    renderWithRouter(
      <AwesomeInput {...defaultProps} query="react" results={results} />
    );
    const links = screen.getAllByTestId('search-result-link');
    expect(links.length).toBe(2);
    expect(links[0]).toHaveTextContent('React');
    expect(links[1]).toHaveTextContent('Node.js');
  });

  it('calls onOpen when a result row is clicked', () => {
    const results = [
      { item: { name: 'React', repo: 'sindresorhus/awesome-react', cate: 'Front-End' }, score: 0.05 },
    ];
    renderWithRouter(
      <AwesomeInput {...defaultProps} query="react" results={results} />
    );
    fireEvent.click(screen.getByTestId('search-result-item'));
    expect(defaultProps.onOpen).toHaveBeenCalledWith('sindresorhus/awesome-react');
  });

  it('does not auto-focus input when autoFocus is false', () => {
    renderWithRouter(<AwesomeInput {...defaultProps} autoFocus={false} />);
    expect(screen.getByTestId('search-input')).not.toHaveFocus();
  });
});
