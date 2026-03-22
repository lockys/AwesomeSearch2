import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AwesomeInput from './AwesomeInput';

const defaultProps = {
  searchOnchange: vi.fn(),
  value: '',
  searchResult: [],
  searchInputOnFocus: vi.fn(),
  showResult: false,
  homeOnClick: vi.fn(),
};

const renderInput = (props = {}) => {
  return render(
    <MemoryRouter>
      <AwesomeInput {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe('AwesomeInput', () => {
  it('renders search input', () => {
    renderInput();
    expect(screen.getByPlaceholderText('Try To Search Node.js')).toBeInTheDocument();
  });

  it('shows search results when showResult is true', () => {
    const searchResult = [
      { item: { name: 'awesome-react', repo: 'enaqx/awesome-react', cate: 'Frontend' } },
    ];
    renderInput({ showResult: true, searchResult });
    expect(screen.getByText('awesome-react')).toBeInTheDocument();
  });

  it('hides search results when showResult is false', () => {
    const searchResult = [
      { item: { name: 'awesome-react', repo: 'enaqx/awesome-react', cate: 'Frontend' } },
    ];
    renderInput({ showResult: false, searchResult });
    expect(screen.queryByText('awesome-react')).not.toBeInTheDocument();
  });

  it('calls searchOnchange when typing', () => {
    const searchOnchange = vi.fn();
    renderInput({ searchOnchange });
    const input = screen.getByPlaceholderText('Try To Search Node.js');
    fireEvent.change(input, { target: { value: 'react' } });
    expect(searchOnchange).toHaveBeenCalled();
  });

  it('shows placeholder text when results are empty and showResult is true', () => {
    renderInput({ showResult: true, searchResult: [] });
    expect(screen.getByText('Please input something :)')).toBeInTheDocument();
  });
});
