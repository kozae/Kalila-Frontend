import { render } from '@testing-library/react';

import Pages from './index';

describe('Pages', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Pages />);
    expect(baseElement).toBeTruthy();
  });
});
