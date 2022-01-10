import { render } from '@testing-library/react';

import Editions from './index';

describe('Editions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Editions />);
    expect(baseElement).toBeTruthy();
  });
});
