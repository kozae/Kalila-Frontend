import { render } from '@testing-library/react';

import Administration from './index';

describe('Administration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Administration />);
    expect(baseElement).toBeTruthy();
  });
});
