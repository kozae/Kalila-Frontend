import { render } from '@testing-library/react';

import Account from './index';

describe('Account', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Account />);
    expect(baseElement).toBeTruthy();
  });
});
