import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import AwesomeInput from './AwesomeInput';

test('shows placeholder text when there are no results', () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <AwesomeInput
        searchOnchange={() => {}}
        value=""
        searchResult={[]}
        showResult={true}
        searchInputOnFocus={() => {}}
        homeOnClick={() => {}}
      />
    </Router>
  );

  expect(screen.getByText(/Please input something/i)).toBeInTheDocument();
});
