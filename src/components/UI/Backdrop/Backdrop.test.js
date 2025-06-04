import { render } from '@testing-library/react';
import Backdrop from './Backdrop';

test('does not render when show is false', () => {
  const { container } = render(<Backdrop show={false} closeSearchModal={() => {}} />);
  expect(container.firstChild).toBeNull();
});

test('renders backdrop when show is true', () => {
  const { container } = render(
    <Backdrop show={true} closeSearchModal={() => {}} />
  );
  expect(container.firstChild).not.toBeNull();
});
